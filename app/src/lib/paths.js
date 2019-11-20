import RNFetchBlob from 'rn-fetch-blob'

export const globalPath = 'Android/data/com.linegames.dcglobal/'
export const krPath = 'Android/data/com.NextFloor.DestinyChild/'
export const globalAssetPath = globalPath + 'files/asset/'
export const krAssetPath = krPath + 'files/asset/'


export const storagePaths = [
  RNFetchBlob.fs.dirs.SDCardDir,
  '/storage/emulated/0', 
  '/storage/emulated/1',
  '/sdcard',
]
export const clientPaths = {
  Global: '/Android/data/com.linegames.dcglobal/',
  KR: '/Android/data/com.NextFloor.DestinyChild/'
}