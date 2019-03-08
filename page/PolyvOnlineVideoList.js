import React, { Component } from "react";

import {
  View,
  Dimensions,
  Text,
  TextInput,
  StyleSheet,
  StackNavigator
} from "react-native";
import PolyvVodPlayer from "./page/PolyvVodPlayer";
import PolyvPopuWindow from "./view/PolyvPopuWindow";
import PolyvUserConfig from '../common/PolyvUserConfig'

const { width, height } = Dimensions.get("window");
type Props = {};

export class PolyvOnlineVideoList extends Component<Props> {
  static navigationOptions = {
    title: "VideoPlayer"
  };
  constructor(props) {
    super(props);
    this.state = {
      // 初始化所需的数据
      vodKey:PolyvUserConfig.User.vodKey,
      decodeKey: PolyvUserConfig.User.decodeKey,
      decodeIv: PolyvUserConfig.User.decodeIv,
      viewerId: PolyvUserConfig.User.viewerId,
      nickName: PolyvUserConfig.User.nickName,
      vid: props.vid,

      // 输入框默认vid
      inputVid: "e97dbe3e649c56a1e58535bd8c5d3924_e",
    };
  }

  render() {
    return (
      <View>
        <PolyvVodPlayer
          ref="playerA"
          style={styles.video}
          vid={this.state.vid}
          isAutoStart={true}
        />
        <TextInput
          style={styles.input}
          placeholder={"请输入更新vid"}
          onChangeText={text => {
            this.setState({ vid: text });
          }}
        >
          {this.state.inputVid}
        </TextInput>
        <View style={styles.horizon}>
          <Text style={styles.text} onPress={this.updateVid.bind(this)}>
            updateVid
          </Text>
          <Text style={styles.text} onPress={this.startOrPause.bind(this)}>
            start or pause
          </Text>
          <Text
            style={styles.text}
            onPress={this.showDownloadOptions.bind(this)}
          >
            download
          </Text>
          {/* <ProgressBarAndroid /> */}
        </View>

        <PolyvPopuWindow ref={ref => (this.popUp = ref)} />
        {/* <PolyvVodPlayer
        ref='playerB'
        style={styles.video}
        vid={"e97dbe3e64c247499b55f213a4470052_e"}
        isAutoStart={true}
      /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
    top: 0,
    zIndex: 9
  }
});
