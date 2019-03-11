import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  FlatList,
  Text
} from "react-native";
import PropTypes from 'prop-types';
import OptionsView from "../view/PolyvPopuWindow";
import { PolyvVideoOnlineItem } from "./PolyvVideoOnlineItem";
import PolyvHttpManager from '../common/PolyvHttpManager'

const { width, height } = Dimensions.get("window");
let navigation,that//导航栏引用

export default class PolyvVideoList extends Component {
  static propTypes = {
    navigation:PropTypes.object
}


  constructor(props) {
    super(props);
    this.state = {
      datas: [],
    };
    that = this
  }

  update(datas) {
    console.log(" update list view")
    this.setState({ datas: datas });
  }


  renderItem({ item }) {

    
    return <PolyvVideoOnlineItem
      downloadCallback={(video) =>{
        console.log('receive callback')
        that.showDownloadOptions(video,item)
      }}
      navigation={navigation}
      style={styles.modalBox}
      videoInfo={item} />
  }

  
  showDownloadOptions(video,item) {
    console.log("showDownloadOptions");
    var videoObject = JSON.parse(video)
    this.popUp.show(videoObject,item);
  }


  render() {
    navigation = this.props.navigation
    return (
      <View style={styles.container}>
        <FlatList style={styles.list} 
          data={this.state.datas}
          renderItem={this.renderItem}
        />
        <OptionsView ref={ref => (this.popUp = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height:height,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    zIndex: 9
  },
  title: {
    margin: 15,
    textAlign: "center",
    display: "flex",
    color: "red",
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    backgroundColor:'white',
    width: width,
    height:50
  },
  list: {
    width: width,
  }
});
