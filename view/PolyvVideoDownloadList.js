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
import { PolyvVideoDownloadItem } from "./PolyvVideoDownloadItem";

const { width, height } = Dimensions.get("window");

export class PolyvVideoDownloadList extends Component{

    constructor(props){
        super(props)
        this.state = {
            datas:[]
        }
    }

    render(){
        return <View>
            <FlatList
            data={this.state.datas}
            renderItem={({item,pos}) =>{
                <PolyvVideoDownloadItem 
                isDownloadedPage = {false}
                downloadInfo={item}></PolyvVideoDownloadItem>
            }}
            ></FlatList>

        </View>
    }
}