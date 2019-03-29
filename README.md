## RN 点播集成文档

### 概述

PolyvRNVodDemo 支持 Android + iOS， 是专为 ReactNative 技术开发者定制的点播集成 Demo，具备功能丰富且易用的接口，提供了视频点播播放、视频下载等一系列功能。

#### 支持设备

Android 4.1.0 (API 16) 以上 或 iOS 9.0 以上

#### 接入条件

- 了解 ReactNative 技术
- 搭建好运行 React Native 的相关环境
- 已拥有使用 React Native 技术开发的项目并准备在该项目中接入点播功能
- 拥有 polyv 官网的直播账号且已开通直播权限。


### 快速开始

#### 模块列表

用户需要集成的各个功能模块文件在路径 polyv - sdk 下，主要功能模块如下表所示：

| 文件名    | 描述   |
| -------- | ------ |
| PolyvVodConfigRnModule |  初始化模块    |
| PolyvVodPlayerModule |  播放器模块    |
| PolyvVodDownloadModule  |  视频下载模块   |

#### 安装依赖

执行如下命令下载 react 相关依赖

```js
npm install
```

#### 项目配置

1. 对应的 native 端的注册入口标签名为 ‘PolyvVodRnDemo’，对应到 app.json 文件里的配置

```java
{
"name": "PolyvVodRnDemo",
"displayName": "PolyvVodRnDemo"
}
```

2. 依赖配置文件 package.json

```javascript
"dependencies": {
   "react": "16.6.3",
	"react-native": "^0.58.6",
	
	//polyv/demo里需要的依赖（如不需要可删除）
    "axios": "^0.18.0",
    "bower": "^1.8.8",
    "jest-haste-map": "^24.5.0",
    "loadash": "^1.0.0",
    "native-base": "^2.12.1",
    "react-art": "^16.8.4",
    "react-dom": "^16.8.4",
    "react-native-gesture-handler": "^1.1.0",
    "react-native-web": "^0.10.1",
    "react-navigation": "^3.3.2"
  },
  "devDependencies": {
    "babel-core": "^7.0.0-bridge.0",
    "babel-jest": "24.3.1",
    "jest": "24.3.1",
    "metro-react-native-babel-preset": "0.53.0",
    "react-test-renderer": "16.6.3"
  },
```

#### 使用方法
##### 初始化

初始化的方法要放在界面渲染前初始化， 一般在 componentWillMount 调用该方法进行初始化

```javascript

//该模块提供了初始化的方法init，该方法是一个异步有返回结果的函数
/**
 * code，返回码定义：
 *      0  成功
 *      -1 vodKey为空
 *      -2 decodeKey为空
 *      -3 decodeIv为空
 *      -4 ViewId为空
 */
 
//使用方式
/**
 * <Polyv Live init/>
 */
console.log("Polyv rn vod init")
PolyvVodConfigRnModule.init(this.state.vodKey, this.state.decodeKey, this.state.decodeIv, this.state.viewerId, this.state.nickName)
      .then(ret => {
        if (ret.code != 0) { // 初始化失败
          var str = "初始化失败  errCode=" + ret.code + "  errMsg=" + ret.message
          console.log(str)
          alert(str)
        } else { // 初始化成功
          console.log("初始化成功")
        }
      })
```

##### 视频播放

```java

//使用方式
<PolyvVodPlayer
          ref='playerA'
          style={styles.video}
          vid={"e97dbe3e64cb3adef1a27a42fe49228e_e"}//视频播放vid
          isAutoStart={true}//是否自动播放
        />
```

##### 视频下载

视频下载模块组件 PolyvVodDownloadModule.js 提供了如下接口：

| 函数名            | 参数        | 功能说明         | 是否有返回值 |
| :---------------- | ----------- | ---------------- | ------------ |
| getBitrateNumbers | vid：视频id | 获取视频码率列表 | 是           |
| startDownload     | vid：视频id<br>bitrate：码率索引<br>title：下载标题 | 开始下载视频 | 是 |
| pauseDownload | vid：视频id<br/>bitrate：码率索引 | 暂停下载 | 否 |
| pauseAllDownload | 无 | 暂停所有下载视频 | 否 |
| resumeDownload | vid：视频id<br/>bitrate：码率索引 | 恢复下载视频 | 否 |
| startAllDownload | 无 | 开始下载所有视频，未下载视频全部放入等待队列 | 否 |
| deleteDownload | vid：视频id<br/>bitrate：码率索引 | 删除视频 | 否 |
| deleteAllDownload | 无 | 删除所有未下载的视频 | 否 |
| getDownloadVideoList | hasDownloaded：是否获取已下载视频 | 获取下载列表 | 是 |

下载数据 downloadInfo 结构说明

| 参数     | 类型   | 说明            |
| -------- | ------ | --------------- |
| vid      | string | 视频id          |
| duration | string | 视频时长        |
| filesize | number | 文件大小        |
| bitrate  | number | 码率索引        |
| title    | string | 文件标题        |
| progress | number | 下载进度（0~1） |

下载视频的进度更新需要添加监听器，一般装载组件的时候添加监听器，卸载的时候移除。下载视频的回调是通过 DeviceEventEmitter 的方式实现对 native 的监听

对应的回掉 event 事件列表，该事件列表对应 native 层相应的通知事件

| event                | 返回值结构                                                | 说明           |
| -------------------- | --------------------------------------------------------- | -------------- |
| startDownloadEvent   | {downloadInfo：{对应上述的downloadInfo结构}}              | 开始下载的回掉 |
| updateProgressEvent  | {downloadInfo：{对应上述的downloadInfo结构},progress:0.2} | 下载更新回掉   |
| downloadSuccessEvent | {bitrate:1,vid:'123'}                                     | 下载完成回掉   |
| downloadFailedEvent  | {bitrate:1,vid:'123'}                                     | 下载失败回掉   |
| downloadSpeedEvent   | {bitrate:1,vid:'123',downloadSpeed:123.5}                 | 下载速度回掉   |

RN 端实现监听的代码演示：

```javascript
componentWillMount() {
this.registerReceiver();
}

componentWillUnmount() {
console.log("download list componentWillUnmount");
DeviceEventEmitter.removeAllListeners();
}

//注册下载进度回调监听
registerReceiver() {
console.log("registerReceiver:" + this.props.isDownloadedPage);
if (this.props.isDownloadedPage) {
return;
}
//下载开始回调
DeviceEventEmitter.addListener("startDownloadEvent", msg => {
console.log("startDownload" + msg);
// this.setState({ downloadingInfo: msg.downloadInfo });
});

//下载失败回调
DeviceEventEmitter.addListener("downloadFailedEvent", msg => {
console.log("downloadFailedEvent" + JSON.stringify(msg));
});

//下载速度回调
DeviceEventEmitter.addListener("downloadSpeedEvent", msg => {

});
//进度更新回调
DeviceEventEmitter.addListener("updateProgressEvent", msg => {

});

//下载完成回调
DeviceEventEmitter.addListener("downloadSuccessEvent", msg => {

});
}
```

####  Android 端集成

Android 端工程由两部分构成，一部分是定制的 rn 模块，也是工程的主模块（app），另外是 polyv sdk 模块，主要是 polyv 相关组件的代码文件。这样用户可以比较方便的更换依赖模块进行定制。

app 主工程主要的 java 文件有：
- PolyvRNVodPluginManager：rn 插件开发的管理类，用来注册相关的 rn 定制组件。
- PolyvRNVodConfigModule：初始化组件模块，用来初始化 android 端需要的一些全局用户信息，例如 iv，secreate，userid。
- PolyvVodPlayer：播放器的 rn 组件，封装了播放器功能。
- PolyvRNVodPlayer：播放器及其皮肤的自定义控件，用于 rn 组件进行整合及使用。
- PolyvRNVodDownloadModule：视频下载组件。


#####  代码集成

1. 拷贝 polyvsdk 模块到主工程下（以模块 module 的方式存在升级用户如没有修改过该文件 请覆盖）
2. 拷贝 rn 文件夹下的文件到集成项目里

#####  配置依赖

1. setting 文件的配置依赖

```java
rootProject.name = 'PolyvVodRnDemo'
include ':react-native-gesture-handler'
project(':react-native-gesture-handler').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-gesture-handler/android')

include ':app', 
//依赖模块配置
':polyvsdk'
```

2. 主模块（app）下的build.gradle修改

```java
implementation project(':react-native-gesture-handler')
compile project(path: ':polyvsdk')
```


####   iOS 端集成

1. 拷贝相关的 Native 代码

拷贝 demo 项目的 ios/PolyvVodRnModule 文件夹到自身项目的 ios 目录下；

2. 集成 CocoaPods 管理第三方库

拷贝 demo 项目的 ios/Podfile 文件到自身项目的 ios 目录下；

打开 Podfile 文件，把其中 ‘PolyvVodRnDemo’ 改为 ‘自身项目名’；

在 ios 目录中打开命令行，执行 pod install 命令；
