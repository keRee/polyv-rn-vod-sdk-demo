import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import PolyvOnlineVideoListPage from '../page/PolyvOnlineVideoListPage';
import PolyvVodPlayerPage from '../page/PolyvVodPlayerPage';
import PolyvDwonloadListPage from '../page/PolyvDwonloadListPage';

const AppNavigator = createStackNavigator(
  {
    OnlineList: PolyvOnlineVideoListPage,
    VideoPlayer: PolyvVodPlayerPage ,
    downloadList:PolyvDwonloadListPage
  },
  {
    initialRouteName: "OnlineList",
  }
);
const PolyvNavigation = createAppContainer(AppNavigator);



module.exports = PolyvNavigation;
