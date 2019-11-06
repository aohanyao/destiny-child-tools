import fs from 'fs'
import path from 'path'
import childs from '../docs/data/childs.json'

console.log('Importing characters ...')
fs.readdirSync(path.resolve(__dirname, '../import/character')).forEach(file => {
  const parts = file.match(/([a-z]+\d{3})_(\d\d)\.pck$/)
  if(parts) {
    const id = parts[1],
          variant = parts[2],
          child = childs[id]
    if(!child) {
      childs[id] =  {
        id,
        name: '?',
        variants: {}
      }
    }
    if(!childs[id].variants[variant]) {
      childs[id].variants[variant] = {
        title: '',
        positions: {home: {x: -15, y: -75, scale: 0.75}}
      }
    }
  }
})

fs.writeFileSync(path.resolve(__dirname, '../docs/data/childs.json'), JSON.stringify(childs))
