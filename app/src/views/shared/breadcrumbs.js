import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {Button, Text} from 'react-native-paper'
import theme from '../../theme'
import {setView} from '../../actions/view'

const BreadCrumbs = ({children}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap:'wrap', alignContent: 'center', marginBottom: 10}}>
      {React.Children.map(children, (child, i) => {
        return <>
          {child}
          {i < children.length - 1 &&
            <Text style={{marginTop: 8, marginLeft: -5, marginRight: -5}}>&gt; </Text>
          }
        </>
      })}
    </View>
  )
}

const Crumb = ({children, view, id, setView}) => {
  return (
    <Button 
      color={theme.colors[view ? 'secondary' : 'text']} 
      style={{padding: 0}}
      onPress={view ? () => setView(view, id) : null}>
      {children}
    </Button>
  )
}

BreadCrumbs.Crumb = connect(null, {setView})(Crumb)

export default BreadCrumbs