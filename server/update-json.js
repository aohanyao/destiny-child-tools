import fs from 'fs'
import path from 'path'
import childs from '../docs/data/childs.json'
import mods from '../docs/data/mods.json'
import getModderKey from '../src/lib/get-modder-key'

const modders = mods.reduce((acc, mod) => {
  const modderId = getModderKey(mod)
  acc[modderId] = acc[modderId] || {
    id: modderId,
    name: mod.modder,
    mods: 0,
    nsfw: 0,
    sfw: 0,
    swaps: 0
  }
  return acc
}, {})

mods.forEach(({modder, nsfw, swap}) => {
  modder = modders[getModderKey(modder)]
  modder.mods++
  if(nsfw) modder.nsfw++
  else modder.sfw++
  if(swap) modder.swaps++
})

Object.keys(childs).forEach(id => {
  const childMods = mods.filter(({child}) => child == id)
  childs[id].numMods = childMods.length
  childs[id].numModsNSFW = childMods.filter(({nsfw}) => nsfw).length
  childMods.forEach(mod => {
    if(!childs[id].lastModAdded || mod.added > childs[id].lastModAdded) {
      childs[id].lastModAdded = mod.added
    }
  })
})

fs.writeFileSync(path.join(__dirname, '../docs/data/childs.json'), JSON.stringify(childs, null, 2))
fs.writeFileSync(path.join(__dirname, '../docs/data/modders.json'), JSON.stringify(Object.values(modders), null, 2))