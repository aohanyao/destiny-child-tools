import React from 'react'
import {connect} from 'react-redux'
import {Picker, View} from 'react-native'
import {IconButton} from 'react-native-paper'
import {setChildView} from '../../actions/child-view.js'

const ModTypePicker = ({order, sort, setChildView, onChange}) => (
  <View style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-end', flexGrow: 1}}>
    <Picker
      selectedValue={sort}
      style={{color: 'white', minWidth: 165}}
      onValueChange={value => {
        setChildView('sort', value)
        if(value.match(/(added)/)) setChildView('order', 'desc')
        else setChildView('order', 'asc')
        if(onChange) onChange()
      }}>
      <Picker.Item label="Variant, Author" value="variant" />
      <Picker.Item label="Date added" value="added" />
    </Picker>
    <IconButton
      icon={`sort-${order == 'desc' ? 'de' : 'a'}scending`} 
      style={{marginLeft: -10}}
      onPress={() => {
        setChildView('order', order == 'desc' ? 'asc' : 'desc')
        if(onChange) onChange()
      }} />
  </View>
)

export default connect(
  state => ({
    type: state.get('childView').get('type'),
    sort: state.get('childView').get('sort'),
    order: state.get('childView').get('order')
  }),
  {setChildView}
)(ModTypePicker)
