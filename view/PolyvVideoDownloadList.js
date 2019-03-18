import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  DeviceEventEmitter,
  Alert,
  TouchableHighlight,
  Text
} from "react-native";
import { PolyvVideoDownloadItem } from "./PolyvVideoDownloadItem";
import PolyvVideoDownload from "../page/PolyvVodDownloadModule";
import PropTypes from "prop-types";
import SwipeableFlat from "../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableFlatList";

const { width, height } = Dimensions.get("window");
let lastDwonloadVideo = {}; //上一个下载的视频，保存用于在其他视频下载时切换该视频状态

export class PolyvVideoDownloadList extends Component {
  static propTypes = {
    isDownloadedPage: PropTypes.bool, //item的数据
    downloadCallback: PropTypes.func, //下载更新回掉
    ...View.propTypes // 包含默认的View的属性
  };

  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      downloadingInfoString: "", //正在下载的视频信息串 用于对比 是否重复解析
      downloadingInfo: {}, //正在下载的视频
      videoMap: []
    };
  }

  componentWillMount() {
    this.registerReceiver();
  }

  componentWillUnmount() {
    console.log("download list componentWillUnmount");
    DeviceEventEmitter.removeAllListeners();
    this.refsCollection = {};
  }

  update(datas) {
    console.log("update datas:" + datas.dataMaps.length);
    this.setState({ videoMap: datas.dataMaps });
    this.setState({ datas: datas.data });
  }

  //注册下载进度回掉监听
  registerReceiver() {
    console.log("registerReceiver:" + this.props.isDownloadedPage);
    if (this.props.isDownloadedPage) {
      return;
    }
    //开始回掉
    DeviceEventEmitter.addListener("startDownload", msg => {
      console.log("startDownload" + msg);
      // this.setState({ downloadingInfo: msg.downloadInfo });
    });

    //进度更新回掉
    DeviceEventEmitter.addListener("updateProgress", msg => {
      console.log("updateProgress" + msg);
      var dataMaps = this.state.videoMap;
      if (dataMaps.length == 0) {
        return;
      }

      //这里保存下载对象，onstart 不保存 因为可能从中间进入列表 如果保存过  对比一次 是否需要再次更新
      if (msg.downloadInfo !== this.state.downloadingInfoString) {
        console.log("updateProgress  parase data");
        this.setState({ downloadingInfoString: msg.downloadInfo });
        var downloadingInfo = JSON.parse(msg.downloadInfo);
        this.setState({ downloadingInfo: downloadingInfo });

        //更新上一个下载视频的状态为暂停
        if (lastDwonloadVideo instanceof Component) {
          lastDwonloadVideo.stopDownload();
        }
      }
      var key =
        this.state.downloadingInfo.vid + this.state.downloadingInfo.bitrate;
      var updateVideo = dataMaps.get(key);

      if (updateVideo) {
        updateVideo.percent = msg.current;
        updateVideo.total = msg.total;
        this.refsCollection[key].setState({
          data: updateVideo,
          videoStatus: 0
        });
      }

      lastDwonloadVideo = this.refsCollection[key];
    });

    //下载完成回掉
    DeviceEventEmitter.addListener("downloadSuccess", msg => {
      console.log("downloadSuccess:" + msg);
      var key =
        this.state.downloadingInfo.vid + this.state.downloadingInfo.bitrate;
      var successDownload = this.refsCollection[key].state.data;
      //将下载完成得数据回掉给父组件，更新到下载完成列表
      this.props.downloadCallback(successDownload);

      //更新
      this.refsCollection[key].setState({ videoStatus: 2 });
      //筛选掉下载完成得数据并更新当前下载列表
      const result = this.state.datas.filter(item => {
        return item.vid + item.bitrate !== key;
      });

      var dataMaps = this.state.videoMap;
      dataMaps.delete(key);
      this.setState({ datas: result });
    });
  }

  refsCollection = {};

  //侧滑菜单渲染
  getQuickActions = () => {
    return (
      <View style={styles.quickAContent}>
        <TouchableHighlight onPress={() => alert("确认删除？")}>
          <View style={styles.quick}>
            <Text style={styles.delete}>删除</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  _onPressItem(item) {
    var itemKey = item.vid + item.bitrate;
    Alert.alert(
      "删除该视频",
      "",
      [
        {
          text: "确定",
          onPress: () => {
            //筛选掉下载完成得数据并更新当前下载列表
            const result = this.state.datas.filter(item => {
              return item.vid + item.bitrate !== itemKey;
            });
            var dataMaps = this.state.videoMap;
            dataMaps.delete(itemKey);
            this.setState({ datas: result });

            var delItem = item;
            PolyvVideoDownload.delVideo(delItem.vid, delItem.bitrate);
          }
        },
        { text: "取消" }
      ],
      {
        cancelable: true,
        onDismiss: () => {
          ToastAndroid.show("点击了外面", ToastAndroid.SHORT);
        }
      }
    );
  }

  renderItemData({ item, index }) {
    //标记key 用于item 标记
    var id = item.vid + item.bitrate;
    return (
      <PolyvVideoDownloadItem
        ref={instance => {
          this.refsCollection[id] = instance;
        }}
        {...this.props}
        style={styles.modalBox}
        isDownloadedPage={this.props.isDownloadedPage}
        downloadInfo={item}
        onPressItem={this._onPressItem.bind(this)}
      />
    );
  }

  render() {
    console.log(" list status " + this.props.isDownloadedPage);
    return (
      <View style={styles.container}>
        <FlatList
          ref={"downloadHistoryList"}
          style={styles.list}
          data={this.state.datas}
          renderItem={this.renderItemData.bind(this)}
          //2创建侧滑菜单
          renderQuickActions={() => this.getQuickActions()} //创建侧滑菜单
          maxSwipeDistance={80} //可展开（滑动）的距离
          bounceFirstRowOnMount={false} //进去的时候不展示侧滑效果
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  modalBox: {
    width: width,
    height: 50
  },
  list: {
    width: width
  },
  delete: {
    color: "#d8fffa",
    marginRight: 30
  },
  //侧滑菜单的样式
  quickAContent: {
    margin: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  quick: {
    backgroundColor: "red",
    alignItems: "flex-end", //水平靠右
    justifyContent: "center", //上下居中
    width: 80,
    height: 70
  },
  delete: {
    color: "#d8fffa",
    marginRight: 30
  }
});
