import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import PolyvOnlineVideoList from '../page/PolyvOnlineVideoListPage';
import PolyvVodPlayerPage from '../page/PolyvVodPlayerPage';

const AppNavigator = createStackNavigator(
  {
    OnlineList: PolyvOnlineVideoList,
    VideoPlayer: PolyvVodPlayerPage 
  },
  {
    initialRouteName: "OnlineList"
  }
);
const PolyvNavigation = createAppContainer(AppNavigator);

module.exports = PolyvNavigation;
