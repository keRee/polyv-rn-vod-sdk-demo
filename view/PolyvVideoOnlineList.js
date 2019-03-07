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

const { width, height } = Dimensions.get("window");
import { PolyvVideoOnlineItem } from './PolyvVideoOnlineItem';

  export class PolyvVideoOnlineList extends Component{

    constructor(props){
        super(props)
        this.state = {
            datas:[]
        }
    }

    update(datas){
        this.setState({datas:datas})
    }

    render(){
        return <View style={styles.container}>
            <FlatList data={this.state.datas} 
            renderItem={({item}) =>{
                <PolyvVideoOnlineItem videoInfo={item}></PolyvVideoOnlineItem>
            }}>
            </FlatList>
        </View>
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
  });