import React, { Component }  from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  DeviceEventEmitter,
  ToastAndroid
} from "react-native";
import { PolyvVideoDownloadItem } from "./PolyvVideoDownloadItem";
import PropTypes from "prop-types";
const { width, height } = Dimensions.get("window");
let lastDwonloadVideo = {}//上一个下载的视频，保存用于在其他视频下载时切换该视频状态

export class PolyvVideoDownloadList extends Component {
  static propTypes = {
    isDownloadedPage: PropTypes.bool, //item的数据
    ...View.propTypes // 包含默认的View的属性
  };

  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      downloadingInfoString:'',//正在下载的视频信息串 用于对比 是否重复解析
      downloadingInfo:{},//正在下载的视频
      videoMap:[],
      
    };
  }

  componentWillMount(){
    this.registerReceiver()
  }

  componentWillUnmount(){
    console.log('download list componentWillUnmount')
    DeviceEventEmitter.removeAllListeners()
  }

  update(datas) {
    console.log('update datas:'+ datas.dataMaps.length)
    this.setState({videoMap:datas.dataMaps})
    this.setState({ datas: datas.data });
  }

  
  //注册下载进度回掉监听
  registerReceiver() {
    console.log('registerReceiver:'+this.props.isDownloadedPage)
    if(this.props.isDownloadedPage){
      return
    }
    //开始回掉 
    DeviceEventEmitter.addListener('startDownload', (msg) =>{
      console.log('startDownload'+msg);
      this.setState({downloadingInfo:msg.downloadInfo})
    });

    //进度更新回掉
    DeviceEventEmitter.addListener('updateProgress', (msg) =>{
      console.log('updateProgress'+msg);
      var dataMaps = this.state.videoMap
      if(dataMaps.length == 0){
        return
      }
      //更新上一个下载视频的状态为暂停
      if(lastDwonloadVideo instanceof Component){
        lastDwonloadVideo.stopDownload()
      }

      if(msg.downloadInfo !== this.state.downloadingInfoString){
        console.log('updateProgress  parase data');
        this.setState({downloadingInfo:msg.downloadInfo})
        var downloadingInfo = JSON.parse(msg.downloadInfo)
        this.setState({downloadingInfo:downloadingInfo})
      }
      var key = this.state.downloadingInfo.vid+this.state.downloadingInfo.bitrate
      var updateVideo = dataMaps.get(key)
      updateVideo.percent = msg.current
      updateVideo.total = msg.total

      lastDwonloadVideo=this.refsCollection[key]
      this.refsCollection[key].setState({data:updateVideo,videoStatus:0})
    });

    //下载完成回掉
    DeviceEventEmitter.addListener('downloadSuccess',(msg) =>{
      console.log('downloadSuccess:'+msg);
      
    });
  }

  refsCollection = {};

  renderItemData({ item, index }) {
    //标记key 用于item 标记
    var id = item.vid+item.bitrate
    return (
      <PolyvVideoDownloadItem
      ref={(instance)=>{
        this.refsCollection[id] = instance
      }}
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
          ref={'downloadHistoryList'}
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
