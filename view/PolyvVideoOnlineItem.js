import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  FlatList,
  Text,
  Image,
  StackNavigator,
} from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");
let timeImg = require("./img/polyv_time.png");

export class PolyvVideoOnlineItem extends Component {
  static propTypes = {
    videoInfo: PropTypes.object, //item的数据
    ...View.propTypes // 包含默认的View的属性
  };
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  startPlay() {
    var vid = this.props.videoInfo.vid;
    
    gotoPlayerView(vid);
  }
  render() {
    var videoInfo = this.props.videoInfo;
    return (
      <View style={styles.container}>
        <Image style={styles.img} source={{ uri: videoInfo.first_image }} />
        <View>
          <Text style={styles.title}>{videoInfo.title}</Text>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomHorizonContianer}>
              <Image style={styles.bottom_time_img} source={timeImg} />
              <Text style={styles.bottom_time_txt}>{videoInfo.duration}</Text>
            </View>
            <View style={styles.bottomHorizonContianer}>
              <Text style={styles.bottom_download_txt}>下载</Text>
              <Text
                style={styles.bottom_play_txt}
                onPress={() => {
                  this.startPlay();
                }}
              >
                播放
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    margin:10,
    display:'flex',
    flexDirection:'row'
  },
  title: {
    marginBottom: 5,
    marginLeft: 5,
    display: "flex",
    color: "red",
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomContainer: {
    position: "relative",
    bottom: 0,
    margin: 10,
    display: "flex",
    flexDirection: 'column'
  },
  bottomHorizonContianer: {
    display: "flex",
    flexDirection: "row",
  },
  bottom_time_img: {
    resizeMode: "cover",
    width: 10,
    height: 10
  },
  bottom_time_txt: {
    lineHeight:10,
    marginLeft: 5,
    fontSize: 10,
    color: "green"
  },
  bottom_download_txt: {
    textAlign: "center",
    width: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    height: 20,
    backgroundColor: "#63B8FF",
    margin: 5,
  },
  bottom_play_txt: {
    textAlign: "center",
    width: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    height: 20,
    backgroundColor: "#63B8FF",
    margin: 5,
  },
  img: {
    resizeMode: "cover",
    width: 100,
    height: 70
  }
});
