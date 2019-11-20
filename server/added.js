import fs from 'fs'
import path from 'path'
import mods from '../docs/data/mods.json'
import stringifyMod from '../src/lib/stringify-mod.js'

mods.forEach(mod => {
  if(!mod.added) {
    mod.added = fs.statSync(path.join(__dirname, `../docs/live2d/assets/${stringifyMod(mod)}/${mod.child}_${mod.variant}.pck`)).ctimeMs
  }
})
fs.writeFileSync(path.join(__dirname, '../docs/data/mods.json'), JSON.stringify(mods, null, 2))