import React from 'react'
import {connect} from 'react-redux'
import {ScrollView, View} from 'react-native'
import {Card, Button, Text, Subheading} from 'react-native-paper'
import Image from 'react-native-scalable-image'
import {setView} from '../actions/view'
import BreadCrumbs from './shared/breadcrumbs'

const Variant = ({id, child, setView, modelInfo, installedClients}) => {
  const variant = child.get('variants').get(id.match(/^[^_]+_(.+)$/)[1])
  return (
    <ScrollView style={{padding: 20}}>
      <BreadCrumbs>
        <BreadCrumbs.Crumb view="Childs">
          Childs
        </BreadCrumbs.Crumb>
        <BreadCrumbs.Crumb view="Child" id={child.get('id')}>
          {child.get('name')}
        </BreadCrumbs.Crumb>
        <BreadCrumbs.Crumb>{id}</BreadCrumbs.Crumb>
      </BreadCrumbs>
      <Card style={{marginBottom: 20}}>
        <Card.Title title={`${id} ${variant.get('title') || ''} ${child.get('name')}`} />
        <Card.Content>
          <Image
            onPress={() => setView('Live2D', id)}
            height={250}
            widtht={250}
            style={{marginBottom: 10}}
            source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}/preview-424242.png`}} />
        </Card.Content>
      </Card>
      {installedClients.map(client => (
        <Card style={{marginBottom: 20}} key={client}>
          <Card.Title title={`Current ${client} model_info.json`} />
          <Card.Content>
            <Text>{JSON.stringify(modelInfo.get(client)[id], null, 2)}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  )
}

export default connect(
  state => {
    const id = state.get('view').get('id')
    return {
      id,
      child: state.get('data').get('childs').get(id.match(/^([^_]+)/)[1]),
      modelInfo: state.get('data').get('modelInfo'),
      installedClients: state.get('data').get('installedClients')
    }
  },
  {setView}
)(Variant)