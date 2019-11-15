import fs from 'fs'
import path from 'path'
import childs from '../docs/data/childs.json'
import mods from '../docs/data/mods.json'

Object.keys(childs).forEach(id => {
  const childMods = mods.filter(({child}) => child == id)
  childs[id].numMods = childMods.length
  childs[id].numModsNSFW = childMods.filter(({nsfw}) => nsfw)
})

fs.writeFileSync(path.join(__dirname, '../docs/data/childs.json'), JSON.stringify(childs, null, 2))