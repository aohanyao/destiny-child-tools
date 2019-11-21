import React, {useState, useRef} from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Picker,
  Dimensions
} from 'react-native'
import Image from 'react-native-scalable-image'
import {setView, setViewChilds} from '../actions/view.js'
import {
  Card,
  DataTable,
  Text,
  TextInput,
  IconButton,
  Title
} from 'react-native-paper'
import defaultVariant from '../lib/default-variant.js'

const Childs = ({childs, setView, page, setViewChilds, filter = '', order, sort, category}) => {
  childs = childs.toList()
    .filter(child => (child.get('id') + child.get('name')).toLowerCase().match(filter.toLowerCase()))
  const numPerPage = 10,
        [sortOpen, setFilterOpen] = useState(false),
        numberOfPages = Math.ceil(childs.count() / numPerPage),
        scrollViewRef = useRef(null),
        onPageChange = page => {
          scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false})
          setViewChilds('page', page)
        }
  switch(sort) {
    case 'id':
      childs = childs.sortBy(child => child.get('id'));
      break;
    case 'name':
      childs = childs.sortBy(child => child.get('name') != '?' ? child.get('name') : 'z');
      break;
    case 'numModsSFW':
      childs = childs.sortBy(child => {
        const numSfw = child.get('numMods') - child.get('numModsNSFW')
        return numSfw || (order != 'desc' ? Infinity : -1 * Infinity)
      })
      break;
    default:
      childs = childs.sortBy(child => child.get(sort) || (order != 'desc' ? Infinity : -1 * Infinity))
  }
  if(category) {
    switch(category) {
      case 'childs':
        childs = childs.filter(child => child.get('id').match(/^c\d\d\d/))
        break
      case 'monsters':
        childs = childs.filter(child => child.get('id').match(/^m\d\d\d/))
        break
      case 'spa':
        childs = childs.filter(child => child.get('id').match(/^sc\d\d\d/))
        break
    }

  }
  if(order == 'desc') childs = childs.reverse()
  return (
    <>
      <ScrollView ref={scrollViewRef} style={{background: '#424242', display: 'flex'}} keyboardShouldPersistTaps="handled">
        <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 10}}>
          <TextInput
            label="Filter by name or ID"
            mode="flat"
            value={filter}
            selectionColor="white"
            onChangeText={text => {
              setViewChilds('filter', text)
              setViewChilds('page', 0)
            }}
          />
          {Boolean(filter) && 
            <View style={{position: 'absolute', right: 30, top: 30}}>
              <IconButton
                icon="close"
                color="gray"
                onPress={() => {
                  setViewChilds('filter', '')
                  setViewChilds('page', 0)
                }}
              />
            </View>
          }
          <View style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-end', flexGrow: 1}}>
            <Picker
                selectedValue={category}
                style={{color: 'white', minWidth: 130}}
                onValueChange={value => setViewChilds('category', value)}>
              <Picker.Item label="All" value={null} />
              <Picker.Item label="Child" value="childs" />
              <Picker.Item label="Monster" value="monsters" />
              <Picker.Item label="Spa" value="spa" />
            </Picker>
            <Picker
              selectedValue={sort}
              style={{color: 'white', minWidth: 150}}
              onValueChange={value => {
                setViewChilds('sort', value)
                if(value.match(/(lastModAdded|numMods)/)) setViewChilds('order', 'desc')
                else setViewChilds('order', 'asc')
              }}>
              <Picker.Item label="ID" value="id" />
              <Picker.Item label="Name" value="name" />
              <Picker.Item label="Total Mods" value="numMods" />
              <Picker.Item label="NSFW Mods" value="numModsNSFW" />
              <Picker.Item label="SFW Mods" value="numModsSFW" />
              <Picker.Item label="Latest Mod" value="lastModAdded" />
            </Picker>
            <IconButton
              icon={`sort-${order == 'desc' ? 'de' : 'a'}scending`} 
              onPress={() => setViewChilds('order', order == 'desc' ? 'asc' : 'desc')} />
          </View>
        </View>
        {numberOfPages > 1 && 
          <DataTable.Pagination {...{
            label: `Page ${page + 1} pf ${numberOfPages}`,
            page,
            numberOfPages,
            onPageChange
          }} />
        }
        <View style={{flexDirection:'row', flexWrap:'wrap', marginLeft: 20, marginRight: 20}}>
          {childs
            .slice(page * numPerPage, page * numPerPage + numPerPage)
            .toArray().map((child, i) => {
              const id = child.get('id'),
                    key = child.get('id') + '_' + defaultVariant(child)
              return (
                <Card key={id} onPress={() => setView('Child', id)} style={{
                  marginRight: 20, 
                  marginBottom: 20,
                  minWidth: Dimensions.get('window').width - 40
                }}>
                  <Card.Content style={{flexDirection:'row', flexWrap:'wrap'}}>
                    <View style={{width: 140}}>
                      <Image
                        width={120}
                        source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${key}/preview-424242.png`}} />
                    </View>
                    <View>
                      <Title>{child.get('name')} ({child.get('id')})</Title>
                      <Text>Original Variants: {child.get('variants').count()}</Text>
                      <Text></Text>
                      <Text>Total Mods: {child.get('numMods')}</Text>
                      <Text>SFW Mods: {child.get('numMods') - child.get('numModsNSFW')}</Text>
                      <Text>NSFW Mods: {child.get('numModsNSFW')}</Text>
                      <Text></Text>
                      {child.get('lastModAdded') && 
                        <>
                          <Text>Latest Mod:</Text>
                          <Text>{(new Date(child.get('lastModAdded'))).toLocaleDateString(null)}</Text>
                        </>
                      }
                    </View>
                  </Card.Content>
                </Card>
              )
          })}
        </View>
        {numberOfPages > 1 && 
          <DataTable.Pagination {...{
            label: `Page ${page + 1} pf ${numberOfPages}`,
            page,
            numberOfPages,
            onPageChange
          }} />
        }
      </ScrollView>
    </>
  )
}

export default connect(
  state => ({
    childs: state.get('data').get('childs'),
    page: state.get('view').get('childs').get('page'),
    filter: state.get('view').get('childs').get('filter'),
    order: state.get('view').get('childs').get('order'),
    sort: state.get('view').get('childs').get('sort'),
    category: state.get('view').get('childs').get('category')
  }),
  {setView, setViewChilds}
)(Childs)