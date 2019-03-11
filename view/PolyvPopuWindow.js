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
/**
 * 弹出层
 */
const { width, height } = Dimensions.get("window");
const defs = [{content:'超清'},{content:'高清'},{content:'标清'}]

export default class PolyvPopuWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      show: false,
      datas:[],
      vid:''
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

  show(datas) {
    
    this.setState(
      {
        show: true,
        datas:datas.hls,
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

  chooseDefPlay(url){
    console.log(`will to play ${url}`)
    PolyvVideoDownload.start()
  }

  renderItemData({item,index}){
    return  <Text style={styles.title}
              onPress={()=>{
                this.chooseDefPlay(item)
              }}>{defs[index].content}</Text>
  }
  render() {
    let { transparentIsClick, modalBoxBg, modalBoxHeight } = this.props;
    if (this.state.show) {
      return (
        <View 
        style={[styles.container, { height: height }]}>
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
              renderItem={this.renderItemData}
             
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
    margin:15,
    textAlign: 'center',
    display:'flex',
    color: "red",
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    position: "absolute",
    width: width
  },
  list:{
  }
})

PolyvPopuWindow.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: "#fff", // 背景色
  hide: function() {}, // 关闭时的回调函数
  transparentIsClick: true, // 透明区域是否可以点击
  
}
