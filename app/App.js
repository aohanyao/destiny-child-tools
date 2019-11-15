/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState}  from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  PermissionsAndroid
} from 'react-native'
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'
import ScaledImage from './scaled-image'

const stringify = mod =>
  mod.child + '_' +
  mod.variant + '-' +
  mod.modder.toLowerCase().replace(/\s/g, '_') + '-' +
  mod.name.toLowerCase().replace(/\s/g, '_')

const getStoragePermission = () => new Promise((resolve) => {
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
const globalPath = '/sdcard/Android/data/com.linegames.dcglobal/files/asset/'

const installMod = path => {
  getStoragePermission().then(() => {
    RNFS.readDir(globalPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        // alert(JSON.stringify(result, null, 2))
        RNFetchBlob
          .config({
            path: globalPath + 'character/c227_02.pck'
          })
          .fetch('GET', path)
        // RNFetchBlob.fetch('GET', 'http://www.example.com/images/img1.png')
          .then((res) => {
            let status = res.info().status;
            
            if(status == 200) alert('Mod installed.\n\nRestart Destiny Child if it\'s running.')
            else {
              alert('There may have been a problem downloading. Got status code ' + status)
            }
          })
          // Something went wrong:
          .catch((errorMessage, statusCode) => {
            alert(errorMessage)
            // error handling
          })
    })
  })
}
// installMod('https://lokicoder.github.io/destiny-child-tools/live2d/assets/c227_02-loki-swimsuit2_based_on_eljoseto/c227_02.pck')

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const App: () => React$Node = () => {
  const [childs, setData] = useState(),
        [mods, setMods] = useState()
  if(!childs) {
    
    fetch('https://lokicoder.github.io/destiny-child-tools/data/childs.json')
      .then((response) => response.json())
      .then((childs) => {
        setData(childs)
      })
      .catch((error) => {
        alert(error)
      })
  }
  if(!mods) {
    fetch('https://lokicoder.github.io/destiny-child-tools/data/mods.json')
      .then((response) => response.json())
      .then((mods) => {
        setMods(mods)
      })
      .catch((error) => {
        alert(error)
      })
  }
  const id = 'c001'
  return (
    <View style={{flex: 1, backgroundColor: '#424242'}}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        
        {/* <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
          }}>
            {childs && Object.keys(childs[id].variants).map(vId => (
              <ScaledImage
                key={`${id}_${vId}`}
                height={Dimensions.get('window').height * .9}
                uri={`https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}_${vId}/preview-424242.png`}
              />
            ))}
            {mods && mods.reduce((acc, mod) => { 
              if(mod.child == id) acc.push(mod)
              return acc
            }, []).map(mod => (
              <ScaledImage
                key={`${stringify(mod)}}}`}
                height={Dimensions.get('window').height * .9}
                uri={`https://lokicoder.github.io/destiny-child-tools/live2d/assets/${stringify(mod)}/preview-424242.png`}
              />
            ))}
          </View> */}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
})

export default App
