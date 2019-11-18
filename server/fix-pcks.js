import fs from 'fs'
import path from 'path'
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