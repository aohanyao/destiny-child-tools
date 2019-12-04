import React from 'react'
import {connect} from 'react-redux'
import {View, Dimensions} from 'react-native'
import {Title, Text, Portal, Modal, ProgressBar} from 'react-native-paper'
import KeepAwake from 'react-native-keep-awake'

const Loading = ({loading}) => {
  const [i, total, title, message] = loading || []
  return loading 
    ? (
      <Portal>
        <Modal visible={true} dismissable={false}>
          <View style={{
            backgroundColor: 'black',
            margin: 20,
            padding: 20
          }}>
            <KeepAwake />
            <Title>{title}</Title>
            <ProgressBar style={{marginTop: 20, marginBottom: 20}} progress={i/total} />
            <Text>{message}</Text>
          </View>
        </Modal>
      </Portal>
    )
    : <></>
}

export default connect(
  state => ({
    loading: state.get('data').get('loading')
  })
)(Loading)