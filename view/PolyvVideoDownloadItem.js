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
import PropTypes from "prop-types";
const { width, height } = Dimensions.get("window");
//播放器下载的四种状态:下载(0)，暂停(1),播放(2)，
const videoPlaySrc=['./img/polyv_time.png','./img/polyv_time.png']

export class PolyvVideoDownloadItem extends Component{
    static propTypes={
        downloadInfo:PropTypes.object,
        isDownloadedPage:PropTypes.bool,//是否下载完成页面
    }
    constructor(props){
        super(props)
        this.state = {
            data:{},
            videoStatus:0,//视频的状态：下载中，暂停，下载完成
            speed:0//下载速度
        }
    }

    render(){
        var videoInfo = this.props.data;
        let progressLayout = this.props.isDownloadedPage ? <View style={styles.bottomHorizonContianer}>
            <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
            <Text style={styles.bottom_download_txt}>{this.state.speed}KB</Text>
      </View>:null,

        return (
          <View style={styles.container}>
                <View style={styles.imgContainer}>
                    <Image style={styles.img} source={{ uri: videoInfo.first_image }} />
                    <Image style={styles.videoPlayImg} source={videoPlaySrc[this.state.videoStatus]}
                    onPress={() =>{
                        if(this.props.isDownloadedPage){//已经下载

                        }else{
                            this.setState({videoStatus:1^videoStatus})
                        }
                    }}
                    ></Image>
                </View>
            
            <View>
              <Text style={styles.title}>{videoInfo.title}</Text>
              <View style={styles.bottomContainer}>
                <View style={styles.bottomHorizonContianer}>
                
                  <Text style={styles.bottom_download_status_txt}>{videoInfo.duration}</Text>
                  <Text style={styles.bottom_download_status_txt}>{videoInfo.duration}</Text>
                </View>
                {progressLayout}
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
      imgContainer:{
        width: 100,
        height: 70,
        position:'relative'
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
      bottom_download_status_txt: {
        lineHeight:10,
        marginLeft: 5,
        fontSize: 10,
        color: "green",
        borderColor: "green",
        backgroundColor: "#fff",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
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
      },
        videoPlayImg: {
            height:20,
            width:20,
            resizeMode: "cover",
            margin: "auto",
            position: 'absolute',
        }
    });
    