import React, { Component } from "react"

import PolyvOnlineVideoList from '../view/PolyvVideoOnlineList'
import {View} from 'react-native';
import PolyvVodConfigRnModule from "./page/PolyvVodConfigRnModule";
import { setAxios } from "./common/PolyvNet";

const { width, height } = Dimensions.get("window");
export  class PolyvOnlineVideoList extends Component{
    
  componentWillMount() {
    console.log("componentWillMount");
    /**
     * <Polyv Live init/>
     */
    console.log("Polyv vod init");
    setAxios();

    PolyvVodConfigRnModule.init(
      this.state.vodKey,
      this.state.decodeKey,
      this.state.decodeIv,
      this.state.viewerId,
      this.state.nickName
    ).then(ret => {
      if (ret.code != 0) {
        // 初始化失败
        var str = "初始化失败  errCode=" + ret.code + "  errMsg=" + ret.message;
        console.log(str);
        alert(str);
      } else {
        // 初始化成功
        console.log("初始化成功");
      }
    });
  }

    render(){
        <View style={styles.container}>
            <PolyvOnlineVideoList></PolyvOnlineVideoList>
        </View>
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
  
  });