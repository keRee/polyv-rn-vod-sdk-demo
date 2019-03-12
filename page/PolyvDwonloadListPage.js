import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PolyvdownloadModule from "../page/PolyvVodDownloadModule";
import TabNavigator from "react-native-tab-navigator";
const { width, height } = Dimensions.get("window");
const dataSource = [
  { tabName: "已下载", tabPage: "hasDownloaded" ,selectedIcon:require('../view/img/polyv_time.png'),icon:require('../view/img/polyv_time.png')},
  { tabName: "下载中", tabPage: "downloading" ,selectedIcon:require('../view/img/polyv_time.png'),icon:require('../view/img/polyv_time.png')}
];
export default class PolyvDwonloadListPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "下载视频"
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      datas: []
    };
  }
  componentWillMount() {
    PolyvdownloadModule.getDownloadVideoList(false)
      .then(ret => {
        console.log("download :" + ret.downloadList);
        this.setState({ datas: ret.downloadList });
      })
      .catch(e => {
        console.log("download error:" + e);
      });
  }
  render() {
    let tabViews = dataSource.map((item, i) => {
      return (
        <TabNavigator.Item
        tabBarPosition={'top'}
          title={item.tabName}
          selected={this.state.selectedTab === item.tabPage}
          titleStyle={{ color: "black" }}
          selectedTitleStyle={{ color: "#7A16BD" }}
          renderSelectedIcon={() => (
            <Image style={styles.tabIcon} source={item.selectedIcon} />
          )}
          tabStyle={{ alignSelf: "center" }}
          onPress={() => {
            this.setState({ selectedTab: item.tabPage });
          }}
          key={i}
        >
          {/* <item.component  navigation={this.props.navigation}/> */}
        </TabNavigator.Item>
      );
    });
    return (
      <View style={styles.container}>
        <TabNavigator  hidesTabTouch={true} style={styles.container}>{tabViews}</TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    height: height + 50,
    backgroundColor: "gray"
  },
  tabIcon:{
    width:23,
    height:23,
  }
});
