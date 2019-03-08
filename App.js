/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import PolyvNavigation from './common/PolyvNavigation'



type Props = {};
export default class App extends Component<Props> {
  static navigationOptions = {
    tabBarLabel: '在线列表',
  };
  render() {
    return (
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>Welcome to React Native!</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>
      // </View>
      <PolyvNavigation></PolyvNavigation>
    );
  }
}
