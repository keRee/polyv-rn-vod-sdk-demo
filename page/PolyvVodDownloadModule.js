import React, { Component } from "react";
import { NativeModules, Alert } from 'react-native';

const videoDownload = NativeModules.PolyvRNVodDownloadModule

const PolyvVideoDownload = {

    /**
     * 
     * @param {string} vid 视频id 
     */
    async getBitrateNumbers(vid){
        var result ;
        try {
            var {bitrates} = await videoDownload.getBitrateNumbers(vid)
            return {code:0,bitrates}
        } catch (error) {
            result = error.code
        }
        return {code:result}
    },
/**
 * 
 * @param {string} vid 视频vid 
 * @param {int} pos 码率索引
 * @param {string} title 下载标题
 * @param {string} videoJson videojson串 rn已经下载好了
 * @param {fun} callback 下载回掉 success fail
 * @returns 0:下载任务添加成功，1：下载任务已经在队列
 */
  async startDownload(vid,pos,title) {
    if(!vid){
        Alert.alert('vid is invalid')
        return
    }
    if(pos <0){
        Alert.alert('bitrate is error')
        return
    }
    var result ;
    try {
        await videoDownload.startDownload(vid,pos,title)
        result = 0
    } catch (error) {
        result = error.code
    }
    return {code:result}

  },

  /**
   * 暂停下载
   * @param {string} vid 视频vid
   * @param {string} bitrate 码率
   */
    pauseDownload(vid,bitrate){
        videoDownload.pauseDownload(vid,bitrate)
    },

    pauseAllDownloadTask(){
        videoDownload.pauseAllDownloadTask()
    },

    /**
     * 恢复下载
     * @param {string} vid 视频vid 
     * * @param {string} bitrate 码率
     */
    resumeDownload(vid,bitrate){
        videoDownload.resumeDownload(vid,bitrate)
    },

    /**
     * 下载所有队列里的视频
     */
    downloadAllTask(){
        videoDownload.downloadAllTask()
    },

    /**
     * 删除视频
     * Android 是根据位置删除  ios 是根据vid 删除
     * @param {string} vid 视频id 
     * @param {number} bitrate 视频码率 
     */
    delVideo(vid,bitrate){
        videoDownload.delVideo(vid,bitrate)
    },

    /**
     * 清楚所有下载得视频
     */
    delAllDownloadTask(){
        videoDownload.delAllDownloadTask()
    },

    /**
     * 获取下载列表
     * @param {bool} hasDownloaded 是否已经下载完成
     */
    async getDownloadVideoList(hasDownloaded){
        try {
            var {downloadList} = await videoDownload.getDownloadVideoList(hasDownloaded)
            var dataMaps = new Map()
            var dataJs = JSON.parse(downloadList)
            if(!hasDownloaded){//正在下载中的创建map映射
                dataJs.forEach(element => {
                    var key = element.vid+element.bitrate;
                    dataMaps.set(key,element)
                });
            }
            return {code:0,data:dataJs,dataMaps:dataMaps}
        } catch (e) {
            var code = e.code;
            var message = e.message;
            return { code, message }
        }

        
        
    },

     /**
     * 获取所有下载数据  下载完成与下载中 等待 暂停
     */
    async getAllDownloadVideoList(){
        try {
            var {downloadList} = await videoDownload.getAllDownloadVideoList(hasDownloaded)
            var dataJs = JSON.parse(downloadList)
            return {code:0,data:dataJs}
        } catch (e) {
            var code = e.code;
            var message = e.message;
            return { code, message }
        }
        
    },

    /**
     * 
     * @param {stirng} vid 视频id
     * @param {string} bitrate 码率选项 
     * return 返回下载状态 下载中 下载暂停 下载等待
     * 
     * -1：状态获取失败
     */
    async getDownloadStatus(vid,bitrate){
        try {
            var {downloadStatus} = await videoDownload.getDownloadStatus(vid,bitrate)
            return {code:downloadStatus}
        } catch (error) {
            return {code:-1}
        }
        
    },

    /**
     * 视频是否已经添加到下载队列里
     * @param {string} vid 
     */
    async videoHasAdded(vid){
        if(!vid){
            Alert.alert('vid is invalid')
            return
        }
        try {
            var {videoHasAdded} = await videoDownload.hasAddDownload(vid)
            return {hasAdded:videoHasAdded}
        } catch (error) {
            return {code:-1}
        }
    }

};
module.exports = PolyvVideoDownload;
