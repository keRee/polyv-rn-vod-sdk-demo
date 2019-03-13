import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Image,TouchableOpacity } from "react-native";
import PolyvdownloadModule from "../page/PolyvVodDownloadModule";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import { PolyvVideoDownloadList } from "../view/PolyvVideoDownloadList";

const { width, height } = Dimensions.get("window");
let img = require("../view/img/polyv_btn_back.png");
const dataSource = [
  {
    tabName: "已下载",
    tabPage: "hasDownloaded"
    // selectedIcon: require("../view/img/polyv_time.png"),
    // icon: require("../view/img/polyv_time.png")
  },
  {
    tabName: "下载中",
    tabPage: "downloading"
    // selectedIcon: require("../view/img/polyv_time.png"),
    // icon: require("../view/img/polyv_time.png")
  }
];

//已下载列表
class PolyvDownloadedListPage extends Component {
  static navigationOptions = {
    tabBarLabel: "已下载"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    PolyvdownloadModule.getDownloadVideoList(true)
      .then(ret => {
        if(ret.code == 0){
            console.log("downloading :" + ret.data);
            var datas = JSON.parse(ret.data);
            this.refs.downloadedList.update(datas);
        }else{
          console.log("download error:" + ret.message);
        }
      })
      .catch(e => {
        console.log("download error:" + e);
      });
  }
  render() {
    return (
      <PolyvVideoDownloadList style={styles.container}  ref={"downloadedList"} isDownloadedPage={true} />
    );
  }
}

//下载中列表
class PolyvDownloadingListPage extends Component {
  static navigationOptions = {
    tabBarLabel: "下载中"
  };
  getOnlineList() {
    PolyvdownloadModule.getDownloadVideoList(false)
      .then(ret => {
          if(ret.code == 0){
              console.log("downloading :" + ret.data);
              var datas = JSON.parse(ret.data);
              this.refs.downloadingList.update(datas);
          }else{
            console.log("download error:" + ret.message);
          }
      })
      .catch(e => {
        console.log("download error:" + e);
      });
  }

  componentDidMount(){
    setTimeout(() => {
      this.getOnlineList()
    }, 50);
  }
  render() {
    return (
      <PolyvVideoDownloadList
        style={styles.container}
        ref={"downloadingList"}
        isDownloadedPage={false}
      />
    );
  }
}

export default class PolyvDwonloadListPage extends Component {
  static navigationOptions = {
    tabBarVisible: false, // 隐藏底部导航栏
    header: null //隐藏顶部导航栏
  };
  constructor(props) {
    super(props);
    this.state = {
      datas: []
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <AppContainer />

        <TouchableOpacity style={styles.tabBackContainer}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image style={styles.tabBack} source={img} />
        </TouchableOpacity>
      </View>
    );
  }
}

const AppContainer = createAppContainer(
  createMaterialTopTabNavigator(
    {
      downloaded: { screen: PolyvDownloadedListPage },
      downloading: { screen: PolyvDownloadingListPage }
    },
    {
      initialRouteName: "downloaded",
      tabBarOptions: {
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        indicatorStyle: {
          width: 50,
          borderRadius: 5,
          marginLeft: width / (2 * 2) - 25,
          position: "absolute",
          backgroundColor: "#2196F3"
        },
        labelStyle: {},
        tabStyle: {},
        style: {
          backgroundColor: "white"
        }
      }
    }
  )
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    width: width,
    flex: 1,
    backgroundColor: "gray"
  },
  tabBackContainer: {
    position: "absolute",
    margin: 10,
    width: 30,
    height: 30
  },
  tabBack: {
    width: 30,
    height: 30
  }
});
