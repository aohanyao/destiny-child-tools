import fs from 'fs'
import path from 'path'
import childs from '../docs/data/childs.json'
import {execSync} from 'child_process'

const assetsPath = path.resolve(__dirname, '../docs/live2d/assets/')

function run(cmd) {
  console.log(cmd)
  return execSync(cmd, {stdio: 'inherit'})
}


fs.readdirSync(assetsPath).forEach(file => {
  const matches = file.match(/^(m|c|sc)\d{3}_\d{2}/),
        pckFile = matches && `${matches[0]}.pck`,
        apkPath = pckFile && path.resolve(assetsPath, file, `${matches[0]}.pck`),
        savePath = path.resolve(assetsPath, '../')

  if(apkPath && (!fs.existsSync(apkPath) || fs.statSync(apkPath).size < 1000)) {
    console.log(apkPath.replace('/home/jerome/repos/destiny-child-tools', ''), fs.existsSync(apkPath) ? fs.statSync(apkPath).size : 'nope')
    run(`ls -la ./docs/live2d/assets/${file}/`);
    const filesToSave = ['texture_00.psd']
    filesToSave.forEach(fileToSave => {
      const pathToSave = path.resolve(assetsPath, file, fileToSave)
      if(fs.existsSync(pathToSave)) {
        console.log('saving', file, pathToSave)
        fs.renameSync(pathToSave, path.resolve(savePath, fileToSave))
      }
    });
    // process.exit(1)
    ['preview-424242.png', pckFile, 'asset.json', '.pck.newCompressedUnencrypted'].forEach(fileToUnlink => {
      const pathToUnlink = path.resolve(assetsPath, file, fileToUnlink)
      console.log(pathToUnlink)
      if(fs.existsSync(pathToUnlink)) {
        console.log('unlinking', file, fileToUnlink)
        fs.unlinkSync(pathToUnlink)
      }
    })
    run(`./pckmanager/PCK.exe /U /C ./docs/live2d/assets/${file}/`)
    run(`mv ./docs/live2d/assets/${file}/.pck.newCompressedUnencrypted ${apkPath}`)
    filesToSave.forEach(fileToSave => {
      const pathToSave = path.resolve(assetsPath, file, fileToSave),
            pathToRestore = path.resolve(savePath, fileToSave)
      if(fs.existsSync(pathToRestore)) {
        console.log('restoring', pathToRestore)
        fs.renameSync(pathToRestore, pathToSave)
      }
    });
  }
})


// console.log('Importing characters ...')
// fs.readdirSync(path.resolve(__dirname, '../import/character')).forEach(file => {
//   const parts = file.match(/([a-z]+\d{3})_(\d\d)\.pck$/)
//   if(parts) {
//     const id = parts[1],
//           variant = parts[2],
//           child = childs[id]
//     if(!child) {
//       childs[id] =  {
//         id,
//         name: '?',
//         variants: {}
//       }
//     }
//     if(!childs[id].variants[variant]) {
//       childs[id].variants[variant] = {
//         title: '',
//         positions: {home: {x: -15, y: -75, scale: 0.75}}
//       }
//     }
//     console.log(`\nExtracing Live2d data for ${file} ${childs[id].name}`)
//     run('./pckmanager/PCK.exe /L ./import/character/' + file)
//     run(`rm -rf ./docs/live2d/assets/${id}_${variant}`)
//     run(`mv -f ./import/character/${id}_${variant} ./docs/live2d/assets/${id}_${variant}`)
//     run('./pckmanager/PCK.exe /R /U /C ./import/character/' + file)
//     run(`rm -rf ./import/character/${id}_${variant}`)
//     run(`mv -f ./import/character/${file}.newCompressedUnencrypted ./docs/live2d/assets/${id}_${variant}/${file}`)
//     run('rm ./import/character/' + file)
//   }
// })

// fs.writeFileSync(path.resolve(__dirname, '../docs/data/childs.json'), JSON.stringify(childs))
