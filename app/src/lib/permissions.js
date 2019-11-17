import {PermissionsAndroid} from 'react-native'

export const getStoragePermission = () => new Promise((resolve) => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(result => {
    if(result == PermissionsAndroid.RESULTS.GRANTED) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(result => {
        if(result == PermissionsAndroid.RESULTS.GRANTED) {
          resolve()
        }
        else {
          alert('This app needs to be able to write to your external storage to be able to install Destiny Child mods.')
        }
      })
    }
    else {
      alert('This app needs to be able to read your external storage to know what version of Destiny Child you have installed.')
    }
  })
})
