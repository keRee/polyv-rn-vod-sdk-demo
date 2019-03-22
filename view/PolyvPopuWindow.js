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
import PolyvVideoDownload from "../page/PolyvVodDownloadModule";
/**
 * 弹出层
 */
const { width, height } = Dimensions.get("window");

export default class PolyvPopuWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      show: false,
      videoJson: {},
      datas: [],
      vid: "",
      title: ""
    };
  }

  in() {
    Animated.timing(this.state.offset, {
      easing: Easing.linear,
      duration: 300,
      toValue: 1
    }).start();
  }

  out() {
    Animated.timing(this.state.offset, {
      easing: Easing.linear,
      duration: 300,
      toValue: 0
    }).start();

    setTimeout(() => this.setState({ show: false }), 300);
  }

  show(bitrates, videoInfo) {
    var bitRates = JSON.parse(bitrates)
    console.log('bitrrates :'+bitRates.length)
    this.setState(
      {
        show: true,
        datas: bitRates,
        vid: videoInfo.vid,
        title: videoInfo.title
      },
      this.in()
    );
  }

  hide() {
    this.out();
  }

  defaultHide() {
    this.props.hide();
    this.out();
  }

  chooseDefPlay(index) {
    console.log(`will to download ${index}`);
    this.defaultHide();
    // var videoString = JSON.stringify(this.state.videoJson);
    PolyvVideoDownload.startDownload(
      this.state.vid,
      index,
      this.state.title
    );
  }

  renderItemData({ item, index }) {
    return (
      <Text
        style={styles.content}
        onPress={() => {
          this.chooseDefPlay(index);
        }}
      >
        {item}
      </Text>
    );
  }
  render() {
    let { transparentIsClick, modalBoxBg, modalBoxHeight } = this.props;
    if (this.state.show) {
      return (
        <View style={[styles.container, { height }]}>
          <TouchableOpacity
            style={{ height: height - modalBoxHeight }}
            onPress={transparentIsClick && this.defaultHide.bind(this)}
          >
            {/* <View style={{ height: screen.height - screen.height * 0.076 }}></View> */}
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.modalBox,
              {
                height: height,
                top: 0,
                backgroundColor: modalBoxBg,
                transform: [
                  {
                    translateY: this.state.offset.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, height - modalBoxHeight]
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.title}>请选择分辨率</Text>
            <FlatList
              style={styles.list}
              data={this.state.datas}
              renderItem={this.renderItemData.bind(this)}
              keyExtractor={(item, index) => {return item}}
            />
          </Animated.View>
        </View>
      );
    }
    return <View />;
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  content: {
    margin: 15,
    textAlign: "center",
    display: "flex",
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    position: "absolute",
    width: width
  },
  list: {}
});

PolyvPopuWindow.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: "#fff", // 背景色
  hide: function() {}, // 关闭时的回调函数
  transparentIsClick: true // 透明区域是否可以点击
};
