import {DefaultTheme} from 'react-native-paper';

export default {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // accent: 'yellow',
    text: 'white',
    onBackground: 'white',
    placeholder: '#aaa',
    background: '#424242',
    surface: '#424242'
  },
}