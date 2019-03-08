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

const { width, height } = Dimensions.get("window");
import { PolyvVideoOnlineItem } from "./PolyvVideoOnlineItem";

export default class PolyvVideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: []
    };
  }

  update(datas) {
    console.log(" update list view")
    this.setState({ datas: datas });
  }

  renderItem({ item }) {
    console.log('renderItem')
    return <PolyvVideoOnlineItem style={styles.modalBox} videoInfo={item} />
  }

  render() {
    console.log('render')
    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          data={this.state.datas}
          renderItem={this.renderItem}
        />
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
