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
  Image
} from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");
let timeImg = require('./img/')

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

  startPlay(){
      var vid = this.state.data.vid
      gotoPlayerView(vid);
  }
  render() {
    <View style={styles.container}>
      <Image style={styles.img} source={{ uri: this.state.data.first_image }} />
      <View>
        <Text style={styles.title}>{this.state.data.title}</Text>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomHorizonContianer}>
            <Image style={styles.bottom_time_img} source={timeImg} />
            <Text style={styles.bottom_time_txt}>
              {this.state.data.duration}
            </Text>
          </View>
          <View style={styles.bottomHorizonContianer} >
          <Text style={styles.bottom_download_txt}>下载</Text>
          <Text style={styles.bottom_play_txt}  onPress={()=>{
              this.startPlay();
          }}>播放</Text>
          </View>
        </View>
      </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
    top: 0,
    zIndex: 9,
    display: "flex",
    flexDirection: "row"
  },
  title: {
    margin: 15,
    display: "flex",
    color: "red",
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomContainer: {
    position: "relative",
    bottom: 0,
    margin: 15,
    display: "flex",
    flexDirection: "row"
  },
  bottomHorizonContianer: {
    display: "flex",
    flexDirection: "column"
  },
  bottom_time_img: {
    resizeMode: "cover",
    with: 20,
    height: 20
  },
  bottom_time_txt: {
    marginLeft: 15,
    fontSize: "12",
    color: "green"
  },
  bottom_download_txt: {
    textAlign: "center",
    width: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    height: 50,
    backgroundColor: "#63B8FF",
    margin: 12,
    padding: 10
  },
  bottom_play_txt: {
    textAlign: "center",
    width: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    height: 30,
    backgroundColor: "#63B8FF",
    margin: 10,
    padding: 10
  },
  img: {
    resizeMode: "cover",
    with: 100,
    height: 70
  }
});
