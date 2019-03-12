import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import PolyvOnlineVideoList from '../page/PolyvOnlineVideoListPage';
import PolyvVodPlayerPage from '../page/PolyvVodPlayerPage';
import PolyvDwonloadListPage from '../page/PolyvDwonloadListPage';

const AppNavigator = createStackNavigator(
  {
    OnlineList: PolyvOnlineVideoList,
    VideoPlayer: PolyvVodPlayerPage ,
    downloadList:PolyvDwonloadListPage
  },
  {
    initialRouteName: "OnlineList",
  }
);
const PolyvNavigation = createAppContainer(AppNavigator);



module.exports = PolyvNavigation;
