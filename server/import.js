import fs, {existsSync} from 'fs'
import path from 'path'
import childs from '../docs/data/childs.json'
import {execSync} from 'child_process'

function run(cmd) {
  return execSync(cmd, {stdio: 'inherit'})
}

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
    if(!existsSync(`./docs/live2d/assets/${id}_${variant}`)) {
      console.log(`\nExtracing Live2d data for ${file} ${childs[id].name}`)
      run('./pckmanager/PCK.exe /L ./import/character/' + file)
      run(`rm -rf ./docs/live2d/assets/${id}_${variant}`)
      run(`mv -f ./import/character/${id}_${variant} ./docs/live2d/assets/${id}_${variant}`)
      run('./pckmanager/PCK.exe /R /U /C ./import/character/' + file)
      run(`rm -rf ./import/character/${id}_${variant}`)
      run(`mv -f ./import/character/${file}.newCompressedUnencrypted ./docs/live2d/assets/${id}_${variant}/${file}`)
    }
    run('rm ./import/character/' + file)
  }
})

fs.writeFileSync(path.resolve(__dirname, '../docs/data/childs.json'), JSON.stringify(childs))
