import React, {useState} from 'react'
import {connect} from 'react-redux'
import {ScrollView, View, Alert} from 'react-native'
import {Text, Button, IconButton, TextInput} from 'react-native-paper'
import ModCard from '../mod-card'
import {installList, deleteModList, renameModList, setActiveModList, saveList} from '../actions/mod-lists'
import BreadCrumbs from './shared/breadcrumbs'
import ActiveModList from './active-mod-list'

const uneditable = ['Installed', 'Favorites']

const ModList = ({list = [], lists, id, installList, deleteModList, activeModList, renameModList, setActiveModList, saveList}) => {
  const [editListName, setEditListName] = useState(),
        inEditMode = typeof editListName != 'undefined'
  return (
    <>
      <ActiveModList />
      <ScrollView style={{
        padding: 20, 
        display: 'flex', 
        marginBottom: 58 + (activeModList ? 100 : 0)
      }}>
        <View style={{flexDirection: 'row', flexWrap:'wrap', justifyContent: 'space-between'}}>
          <BreadCrumbs>
            <BreadCrumbs.Crumb view="ModLists">
              Mod Lists
            </BreadCrumbs.Crumb>
            <BreadCrumbs.Crumb>{id}</BreadCrumbs.Crumb>
          </BreadCrumbs>
          {uneditable.indexOf(id) == -1 &&
            <View style={{flexDirection: 'row', flexWrap:'wrap'}}>
              {inEditMode
                ? <IconButton 
                  icon="cancel" 
                  onPress={() => setEditListName()} />
                : <IconButton 
                  icon="pencil" 
                  onPress={() => setEditListName(id)} />
              }
              <IconButton 
                icon="delete" 
                onPress={() => {
                  Alert.alert(
                    'Delete this list?',
                    'Are you sure you want to delete this list? This cannot be undine!s',
                    [
                      {text: 'Cancel', style: 'cancel'},
                      {text: 'Delete', onPress: () => deleteModList(id)}
                    ]
                  )
                }} />
            </View>
          }
        </View>
        {inEditMode && 
          <View style={{marginBottom: 20}}>
            <TextInput
              label='List Name'
              value={editListName}
              style={{marginBottom: 10}}
              onChangeText={setEditListName} />
            <Button 
              mode="contained"
              disabled={id == editListName}
              onPress={() => {
                if(Object.keys(lists).map(l => l.toLowerCase()).indexOf(editListName.toLowerCase()) > -1) {
                  Alert.alert(
                    'Error: List already exists', 'There is already a list with the name "' + 
                    editListName + '". Please choose another name.'
                  )
                }
                else {
                  renameModList(id, editListName)
                  setEditListName()
                }
              }}>
              Save Changes
            </Button>
          </View>
        }
        <Button
          mode="contained"
          style={{marginBottom: 20}}
          icon="content-save"
          onPress={() => saveList(id)}>
          Save Mod List
        </Button>
        {uneditable.indexOf(id) == -1 && (
          id == activeModList
            ? <View style={{marginTop: 20, marginBottom: 20}}>
                <Text>This list is currently active. Add mods while browsing.</Text>
            </View>
            : <Button
              mode="contained"
              style={{marginBottom: 20}}
              icon="playlist-edit"
              onPress={() => setActiveModList(id)}>
              Set as active list
            </Button>
        )}
        {list.length > 0  
          ? <Button
            style={{marginBottom: 20}}
              icon="cloud-download"
              mode="contained"
            onPress={() => {
              Alert.alert(
                'Install List?',
                'Do you want to install all ' + list.length + 
                ' mods in this list? This may take a while.',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'Install', onPress: () => installList(id)}
                ]
              )
            }}>
            {id == 'Installed' ? 'Re-' : ''}Install Mod List
          </Button>
          : <Text style={{marginTop: 20, marginBottom: 20}}>This mod list is currently empty.</Text>
        }
        {list.map(modKey => <ModCard mod={modKey} key={modKey} />)}
        <Text></Text>
        <Text></Text>
        <Text></Text>
      </ScrollView>
    </>
  )
}

export default connect(
  state => {
    const id = state.get('view').get('id'),
          lists = state.get('data').get('modLists')
    return {
      id,
      lists,
      list: lists[id],
      activeModList: state.get('data').get('activeModList')
    }
  },
  {installList, deleteModList, renameModList, setActiveModList, saveList}
)(ModList)