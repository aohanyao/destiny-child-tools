import React from 'react'
import Image from 'react-native-scalable-image'
import {connect} from 'react-redux'
import {View, Dimensions} from 'react-native'
import {Text, Card, IconButton, Button} from 'react-native-paper'
import {setView} from './actions/view.js'
import stringifyMod from './lib/stringify-mod.js'
import getModFromKey from './lib/get-mod-from-key'
import {installMod} from './actions/mods.js'
import {addModToList, removeModFromList} from './actions/mod-lists'
import theme from './theme'

const ModCard = ({mod, pck, setView, installMod, addModToList, favorites, removeModFromList, activeModList, lists}) => {
  if(!(typeof mod).match(/object|string/)) {
    return (
      <Card style={{
        marginBottom: 20,
        padding: 20
      }}>
        <Text>Bad Mod</Text>
      </Card>
    )
  }
  if(typeof mod == 'string') mod = getModFromKey(mod)
  if(!pck) pck = mod.get ? mod.get('child') + '_' + mod.get('variant') : 'unknown'
  const key = mod ? stringifyMod(mod) : pck,
        inFavorites = favorites.indexOf(key) > -1,
        inActiveModList = activeModList && lists[activeModList].indexOf(key) > -1
  return (
    <Card style={{
      marginBottom: 20,
    }}>
      {mod.get 
        ? <>
          <Card.Title 
            title={mod ? mod.get('name') : pck + ' original'}
            onPress={() => setView('Live2D', key)} 
            right={() => 
              <View style={{flexDirection: 'row', flexWrap:'wrap', alignContent: 'center'}}>
                {activeModList 
                  ? <IconButton 
                      icon={inActiveModList ? 'playlist-minus' : 'playlist-plus'} 
                      onPress={() => {
                        if(inActiveModList) removeModFromList(mod || pck, activeModList)
                        else addModToList(mod || pck, activeModList)
                      }} />
                  : <IconButton icon={inFavorites ? 'heart' : 'heart-outline'} onPress={() => {
                    if(inFavorites) removeModFromList(mod || pck, 'Favorites')
                    else addModToList(mod || pck, 'Favorites')
                  }} />
                }
                <IconButton icon="download" onPress={() => installMod(mod || pck)} />
              </View>
            } />
          <Card.Content>
            <View style={{flexDirection: 'row', flexWrap:'wrap', alignContent: 'center'}}>
              {mod && 
                <View style={{marginRight: 20}}>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Image
                      onPress={() => 'Child' && setView('Variant', pck)}
                      height={100}
                      widtht={100}
                      style={{marginBottom: 10}}
                      source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${pck}/preview-424242.png`}} />
                    <Button 
                      onPress={() => 'Child' && setView('Variant', pck)}
                      color={theme.colors.secondary}
                      style={{marginTop: -10}}>
                      {pck.match(/^\w{1,2}\d{3}_\d\d/)[0]}
                    </Button>
                    <IconButton icon="subdirectory-arrow-right" style={{marginTop: -5}} />
                    <Button 
                      onPress={() => 'Child' && setView('Variant', mod.get('swap'))}
                      color={theme.colors.secondary}
                      style={{marginTop: -15}}>
                      {mod.get('swap')}
                    </Button>
                    <Text style={{marginTop: -10}}></Text>
                    <Text></Text>
                    <Text>by</Text>
                    <Text>{mod && mod.get('modder')}</Text>
                    <Text></Text>
                    <Text>added</Text>
                    <Text>{(new Date(mod.get('added')).toLocaleDateString())}</Text>
                  </View>
                </View>
              }
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  onPress={() => setView('Live2D', key)}
                  height={300}
                  width={Dimensions.get('window').width - 160}
                  source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${key}/preview-424242.png`}} />
              </View>
            </View>
          </Card.Content>
        </>
        : <Card.Content style={{padding: 20}}>
          <Text>Error loading mod</Text>
        </Card.Content>
      }
    </Card>
  )
}

export default connect(
  state => ({
    favorites: state.get('data').get('modLists') && state.get('data').get('modLists').Favorites || [],
    lists: state.get('data').get('modLists'),
    activeModList: state.get('data').get('activeModList')
  }),
  {setView, installMod, addModToList, removeModFromList}
)(ModCard)