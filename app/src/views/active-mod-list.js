import React from 'react'
import {connect} from 'react-redux'
import {View, Dimensions} from 'react-native'
import {Button, IconButton} from 'react-native-paper'
import {setActiveModList} from '../actions/mod-lists'
import theme from '../theme'
import {setView} from '../actions/view'

const ActiveModList = ({listName, lists, setActiveModList, setView}) => {
  return listName 
    ? (
      <View style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
        position: 'absolute',
        backgroundColor: theme.colors.primary,
        bottom: Dimensions.get('screen').height - Dimensions.get('window').height,
        padding: 20,
        width: Dimensions.get('window').width,
        zIndex: 2,
        flexDirection: 'row', 
        flexWrap:'wrap', 
        alignContent: 'center',
        justifyContent: 'space-between'
      }}>
        <Button
          color="white"
          onPress={() => setView('ModList', listName)}>
          {listName} ({lists[listName].length})
        </Button>
        <IconButton 
          icon="close"
          onPress={() => setActiveModList()} />
      </View>
    )
    : <></>
}

export default connect(
  state => ({
    listName: state.get('data').get('activeModList'),
    lists: state.get('data').get('modLists')
  }),
  {setActiveModList ,setView}
)(ActiveModList)