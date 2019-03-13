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
import { PolyvVideoDownloadItem } from "./PolyvVideoDownloadItem";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export class PolyvVideoDownloadList extends Component {
  static propTypes = {
    isDownloadedPage: PropTypes.bool, //item的数据
    ...View.propTypes // 包含默认的View的属性
  };

  constructor(props) {
    super(props);
    this.state = {
      datas: []
    };
  }

  update(datas) {
    console.log("PolyvVideoDownloadList update length:" + datas.length);
    this.setState({ datas: datas });
  }

  renderItemData({ item, index }) {
    return (
      <PolyvVideoDownloadItem
        {...this.props}
        style={styles.modalBox}
        isDownloadedPage={this.props.isDownloadedPage}
        downloadInfo={item}
      />
    );
  }

  render() {
    console.log(" list status " + this.props.isDownloadedPage);
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.datas}
          renderItem={this.renderItemData.bind(this)}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    zIndex: 9
  },
  modalBox: {
    backgroundColor: "red",
    width: width,
    height: 50
  },
  list: {
    width: width
  }
});
