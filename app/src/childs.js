import React, {useState, useRef} from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View
} from 'react-native'
import Image from 'react-native-scalable-image'
import {setView, setViewChilds} from './actions/view.js'
import {
  Card,
  DataTable,
  Text,
  TextInput,
  IconButton,
  Title
} from 'react-native-paper'
import defaultVariant from './lib/default-variant.js'

const Childs = ({childs, setView, page, setViewChilds, filter = ''}) => {
  const [numPerPage, setNumPerPage] = useState(10),
        filteredChilds = childs.toList()
          .filter(child => (child.get('id') + child.get('name')).toLowerCase().match(filter.toLowerCase())),
        numberOfPages = Math.ceil(filteredChilds.count() / numPerPage),
        scrollViewRef = useRef(null),
        onPageChange = page => {
          scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false})
          setViewChilds('page', page)
        }
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
        </View>
        {numberOfPages > 1 && 
          <DataTable.Pagination {...{
            label: `Page ${page + 1} pf ${numberOfPages}`,
            page,
            numberOfPages,
            onPageChange
          }} />
        }
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {filteredChilds
            .sortBy(child => child.get('id'))
            .slice(page * numPerPage, page * numPerPage + numPerPage)
            .toArray().map((child, i) => {
              const id = child.get('id'),
                    key = child.get('id') + '_' + defaultVariant(child)
              return (
                <Card key={id} onPress={() => setView('Child', id)} style={{
                  marginRight: 20, 
                  marginBottom: 20,
                  minWidth: 400
                }}>
                  <Card.Content style={{flexDirection:'row', flexWrap:'wrap'}}>
                    <View style={{width: 140}}>
                      <Image
                        // height={200}
                        width={120}
                        // width={Dimensions.get('window').width * .6}
                        source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${key}/preview-424242.png`}} />
                    </View>
                    <View>
                      <Title>{child.get('name')} ({child.get('id')})</Title>
                      <Text>Mods: {child.get('numMods')}</Text>
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
    filter: state.get('view').get('childs').get('filter')
  }),
  {setView, setViewChilds}
)(Childs)