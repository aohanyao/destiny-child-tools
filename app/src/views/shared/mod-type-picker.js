import React from 'react'
import {connect} from 'react-redux'
import {Picker} from 'react-native'
import {setChildView} from '../../actions/child-view.js'

const ModTypePicker = ({type, setChildView, onChange}) => (
  <Picker
    selectedValue={type}
    style={{color: 'white', minWidth: 170}}
    onValueChange={value => {
      setChildView('type', value)
      if(onChange) onChange()
    }}>
    <Picker.Item label="Mods &amp; Swaps" value="all" />
    <Picker.Item label="Mods Only" value="mods" />
    <Picker.Item label="Swaps Only" value="swaps" />
  </Picker>
)

export default connect(
  state => ({
    type: state.get('childView').get('type'),
  }),
  {setChildView}
)(ModTypePicker)
