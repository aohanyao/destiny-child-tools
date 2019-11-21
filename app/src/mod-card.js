import React from 'react'
import Image from 'react-native-scalable-image'
import {connect} from 'react-redux'
import {View, Dimensions} from 'react-native'
import {Text, Card, IconButton} from 'react-native-paper'
import {setView} from './actions/view.js'
import stringifyMod from './lib/stringify-mod.js'
import installMod from './lib/install-mod.js'

const ModCard = ({mod, pck, setView}) => {
  if(!pck) pck = mod.get('child') + '_' + mod.get('variant')
  const key = mod ? stringifyMod(mod) : pck
  return (
    <Card style={{
      marginBottom: 20,
    }}>
      <Card.Title 
        title={mod ? mod.get('name') : pck + ' original'}
        onPress={() => setView('Live2D', key)} 
        right={() => 
          <View style={{flexDirection: 'row', flexWrap:'wrap', alignContent: 'center'}}>
            {/* TODO: Add favorite/list icon */}
            <IconButton icon="download" onPress={() => installMod(mod || pck)} />
          </View>
        } />
      <Card.Content>
        <View style={{flexDirection: 'row', flexWrap:'wrap', alignContent: 'center'}}>
          {mod && <View style={{marginRight: 20}}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                  onPress={() => setView('Live2D', pck)}
                  height={100}
                  widtht={100}
                  style={{marginBottom: 10}}
                  source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${pck}/preview-424242.png`}} />
                <Text>{pck}</Text>
                <IconButton icon="subdirectory-arrow-right" />
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
    </Card>
  )
}

export default connect(
  state => ({
  }),
  {setView}
)(ModCard)