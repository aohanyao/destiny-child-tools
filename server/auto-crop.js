import fs from 'fs'
import path from 'path'
import jimp from 'jimp'

const screenshotsDir = path.resolve(__dirname, '../cypress/screenshots/previews.spec.js/'),
      assetsDir = path.resolve(__dirname, '../docs/live2d/assets/')

fs.mkdirSync(screenshotsDir, {recursive: true, force: true})

const missingPreviews = fs.readdirSync(assetsDir).filter(file =>
  !fs.existsSync(path.join(assetsDir, file, 'preview-424242.png'))
)
fs.writeFileSync(path.join(__dirname, '../missing-previews.json'), JSON.stringify(missingPreviews, null, 2))

function crop(key, color) {
  console.log('cropping', key, color)
  return new Promise(resolve => {
    const croppedPath = path.join(assetsDir, key, `preview-${color}.png`)
    console.log('cropping', key)
    jimp.read(path.join(screenshotsDir, `${key}-${color}.png`))
      .then(image => {
        image.autocrop()
        image.autocrop({cropOnlyFrames: false, cropSymmetric: false})
        image.write(croppedPath)
        console.log('cropped', key, ' ', color)
        resolve()
      })
  })
}

const matchExp = /([a-z]{1,2}\d{3}_\d{2}.*)-([^-]+)\.png/,
      files = fs.readdirSync(screenshotsDir)
        .filter(file => !file.match('(failed)') && file.match(matchExp))

let i = 0
const processFile = index => {
  if(!files[index]) return
  const [_, key, color] = files[index].match(matchExp)
  i++
  if(!fs.existsSync(path.join(assetsDir, key, `preview-${color}.png`))) {
    crop(key, color).then(() => processFile(i))
  }
  else processFile(i)
}
processFile(0)

// files.forEach(function(file) {
//   const matches = !file.match('(failed)') && file.match(/([a-z]{1,2}\d{3}_\d{2}.*)-([^-]+)\.png/)
//   if(matches) {
//     const [_, key, color] = matches
//     crop(key, color)        
//   }
// })
