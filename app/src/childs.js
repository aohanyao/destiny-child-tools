import React, {useState, useRef} from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View
} from 'react-native'
import Image from 'react-native-scalable-image'
import {setView, setViewChildsPage} from './actions/view.js'
import {
  Card,
  DataTable,
  Text,
  Title
} from 'react-native-paper'
import defaultVariant from './lib/default-variant.js'

const Childs = ({childs, setView, page, setViewChildsPage}) => {
  const [numPerPage, setNumPerPage] = useState(10),
        numberOfPages = Math.ceil(childs.count() / numPerPage),
        scrollViewRef = useRef(null),
        onPageChange = page => {
          scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false})
          setViewChildsPage(page)
        }
  return (
    <>
      <ScrollView ref={scrollViewRef} style={{background: '#424242', display: 'flex'}}>
        <DataTable.Pagination {...{
          label: `Page ${page + 1} pf ${numberOfPages}`,
          page,
          numberOfPages,
          onPageChange
        }} />
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {childs.toList().sortBy(child => child.get('id'))
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
        <DataTable.Pagination {...{
          label: `Page ${page + 1} pf ${numberOfPages}`,
          page,
          numberOfPages,
          onPageChange
        }} />
      </ScrollView>
    </>
  )
}

export default connect(
  state => ({
    childs: state.get('data').get('childs'),
    page: state.get('view').get('childs').get('page')
  }),
  {setView, setViewChildsPage}
)(Childs)