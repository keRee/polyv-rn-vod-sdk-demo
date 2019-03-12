import React, { Component } from "react";
import { NativeModules } from 'react-native';

const videoDownload = NativeModules.PolyvRNVodDownloadModule

const PolyvVideoDownload = {

/**
 * 
 * @param {string} vid 视频vid 
 * @param {int} pos 码率索引
 * @param {string} title 下载标题
 * @param {string} videoJson videojson串
 * @param {fun} callback 下载回掉 success fail
 * @returns 0:下载任务添加成功，1：下载任务已经在队列
 */
  async startDownload(vid,pos,title,videoJson,callback) {

    var result ;
    try {
        await videoDownload.startDownload(vid,pos,title,videoJson,callback)
        result = 0
    } catch (error) {
        result = error.code
    }
    return {code:result}

  },

  /**
   * 暂停下载
   * @param {string} vid 视频vid
   */
    pauseDownload(vid){

    },

    pauseAllDownloadTask(){

    },

    /**
     * 恢复下载
     * @param {string} vid 视频vid 
     */
    resumeDownload(vid){

    },

    /**
     * 下载所有队列里的视频
     */
    downloadAllTask(){

    },

    /**
     * 删除视频
     * Android 是根据位置删除  ios 是根据vid 删除
     * @param {string} pos 列表中item位置 
     */
    delVideo(pos){

    },
     /**
     * 删除视频
     * Android 是根据位置删除  ios 是根据vid 删除
     * @param {string} vid 视频vid状态
     */
    delVideo(vid){

    },

    clearDownloadVideo(){

    },

    /**
     * 
     * @param {bool} hasDownloaded 是否已经下载完成
     */
    async getDownloadVideoList(hasDownloaded){

        try {
            var {downloadList} = await videoDownload.getDownloadVideoList(hasDownloaded)
        } catch (error) {
            console.error(e);
        }

        
        return {downloadList}
    }

    

};
module.exports = PolyvVideoDownload;
