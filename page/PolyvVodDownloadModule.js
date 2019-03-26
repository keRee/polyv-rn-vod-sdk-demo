import React, { Component } from "react";
import { NativeModules, Alert } from "react-native";
import PolyvResultCode from "../polyvcommon/PolyvErrorTip";

const videoDownload = NativeModules.PolyvRNVodDownloadModule;

/**
 * code，返回码定义：
 *      0  成功
 *      -1 vid为空
 *      -2 码率索引不对
 */
const PolyvVideoDownload = {
  _getErrorCode(vid, bitrate) {
    if (!vid) {
      return PolyvResultCode.VID_ERROR;
    }
    if (bitrate < 0) {
      return PolyvResultCode.BITRATE_INDEX_ERROR;
    }

    return PolyvResultCode.SUCCESS;
  },

  /**
   *
   * @param {string} vid 视频id
   */
  async getBitrateNumbers(vid) {
    var result = this._getErrorCode(vid);
    if (result != PolyvResultCode.SUCCESS) {
      return { code: result };
    }
    try {
      var { bitrates } = await videoDownload.getBitrateNumbers(vid);
      return { code: PolyvResultCode.SUCCESS, bitrates };
    } catch (error) {
      result = error.code;
    }
    return { code: result };
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
  async startDownload(vid, pos, title) {
    var result = this._getErrorCode(vid, pos);
    if (result != PolyvResultCode.SUCCESS) {
      return { code: result };
    }
    try {
      await videoDownload.startDownload(vid, pos, title);
      result = PolyvResultCode.SUCCESS;
    } catch (error) {
      result = error.code;
    }
    return { code: result };
  },

  /**
   * 暂停下载
   * @param {string} vid 视频vid
   * @param {string} bitrate 码率
   */
  pauseDownload(vid, bitrate) {
    var result = this._getErrorCode(vid, bitrate);
    if (result != PolyvResultCode.SUCCESS) {
      return result;
    }
    videoDownload.pauseDownload(vid, bitrate);
    return result
  },

  pauseAllDownload() {
    videoDownload.pauseAllDownload();
  },

  /**
   * 恢复下载
   * @param {string} vid 视频vid
   * * @param {string} bitrate 码率
   */
  resumeDownload(vid, bitrate) {
    var result = this._getErrorCode(vid, bitrate);
    if (result != PolyvResultCode.SUCCESS) {
      return result;
    }
    videoDownload.resumeDownload(vid, bitrate);
    return result;
  },

  /**
   * 下载所有队列里的视频
   */
  startAllDownload() {
    videoDownload.startAllDownload();
  },

  /**
   * 删除视频
   * Android 是根据位置删除  ios 是根据vid 删除
   * @param {string} vid 视频id
   * @param {number} bitrate 视频码率
   */
  delVideo(vid, bitrate) {
    var result = this._getErrorCode(vid, bitrate);
    if (result != PolyvResultCode.SUCCESS) {
      return result;
    }
    videoDownload.delVideo(vid, bitrate);
    return result;
  },

  /**
   * 清楚所有下载得视频
   */
  delAllDownload() {
    videoDownload.delAllDownload();
  },

  /**
   * 获取下载列表
   * @param {bool} hasDownloaded 是否已经下载完成
   */
  async getDownloadVideoList(hasDownloaded) {
    try {
      var { downloadList } = await videoDownload.getDownloadVideoList(
        hasDownloaded
      );
      var dataMaps = new Map();
      var dataJs = JSON.parse(downloadList);
      if (!hasDownloaded) {
        //正在下载中的创建map映射
        dataJs.forEach(element => {
          var key = element.vid + element.bitrate;
          dataMaps.set(key, element);
        });
      }
      return { code: 0, data: dataJs, dataMaps: dataMaps };
    } catch (e) {
      var code = e.code;
      var message = e.message;
      return { code, message };
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
  async getDownloadStatus(vid, bitrate) {
    try {
      var { downloadStatus } = await videoDownload.getDownloadStatus(
        vid,
        bitrate
      );
      return { code: downloadStatus };
    } catch (error) {
      return { code: -1 };
    }
  },

 
};
module.exports = PolyvVideoDownload;
