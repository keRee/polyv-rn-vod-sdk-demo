//
//  PolyvVodDownloadRnModule.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvRNVodDownloadModule.h"
#import <PLVVodSDK/PLVVodSDK.h>
#import "PLVDownloadCompleteInfoModel.h"


@implementation PolyvRNVodDownloadModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"EventReminder"];
}

#pragma mark -- RCT_EXPORT_METHOD
RCT_EXPORT_METHOD(getBitrateNumbers:(NSString *)vid
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  if (vid.length == 0) {
    return;
  }
  NSLog(@"getBitrateNumbers() - %@", vid);
  
  // 无网络情况下，优先检测本地视频文件
  PLVVodLocalVideo *local = [PLVVodLocalVideo localVideoWithVid:vid dir:[PLVVodDownloadManager sharedManager].downloadDir];
  if (local && local.path){
    NSString *definitionDesc = [PolyvRNVodDownloadModule formatDefinition:local.qualityCount];
    NSDictionary *dic = @{ @"bitrates": definitionDesc };
    resolve(dic);
  } else {
    // 有网情况下，也可以调用此接口，只要存在本地视频，都会优先播放本地视频
    [PLVVodVideo requestVideoWithVid:vid completion:^(PLVVodVideo *video, NSError *error) {
      if (!video.available) {
        return;
      }
      NSString *definitionDesc = [PolyvRNVodDownloadModule formatDefinition:video.qualityCount];
      NSDictionary *dic = @{ @"bitrates": definitionDesc };
      resolve(dic);
    }];
  }
}

RCT_EXPORT_METHOD(startDownload:(NSString *)vid
                  pos:(int)pos
                  title:(NSString *)title
//                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
//                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  NSLog(@"startDownload() - %@ 、 %d 、 %@", vid, pos, title);
  
  [PLVVodVideo requestVideoPriorityCacheWithVid:vid completion:^(PLVVodVideo *video, NSError *error) {
    PLVVodQuality quality = [PolyvRNVodDownloadModule getQualityByPos:pos];
    PLVVodDownloadManager *downloadManager = [PLVVodDownloadManager sharedManager];
    PLVVodDownloadInfo *info = [downloadManager downloadVideo:video quality:quality];
    if (info) {
      NSLog(@"%@ - %zd 已加入下载队列", info.video.vid, info.quality);
      [self addDownloadInfoListener:info];
    } else { // 视频已存在，无法重新下载
      // todo
      
    }
  }];
}

RCT_EXPORT_METHOD(getDownloadVideoList:(BOOL)hasDownloaded
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  
  NSMutableArray *downloadInfoArray = [[NSMutableArray alloc] init];
  
  if (hasDownloaded) { // 已下载列表
    // 从本地文件目录中读取已缓存视频列表
    NSArray<PLVVodLocalVideo *> *localArray = [[PLVVodDownloadManager sharedManager] localVideos];

    // 从数据库中读取已缓存视频详细信息
    // TODO:也可以从开发者自定义数据库中读取数据,方便扩展
    NSArray<PLVVodDownloadInfo *> *dbInfos = [[PLVVodDownloadManager sharedManager] requestDownloadCompleteList];
    NSMutableDictionary *dbCachedDics = [[NSMutableDictionary alloc] init];
    [dbInfos enumerateObjectsUsingBlock:^(PLVVodDownloadInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      [dbCachedDics setObject:obj forKey:obj.vid];
    }];

    // 组装数据
    // 以本地目录数据为准，因为数据库存在损坏的情形，会丢失数据，造成用户已缓存视频无法读取
    [localArray enumerateObjectsUsingBlock:^(PLVVodLocalVideo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      NSMutableDictionary *downloadInfoDic = [[NSMutableDictionary alloc] init];
      downloadInfoDic[@"vid"] = obj.vid;
      downloadInfoDic[@"duration"] = @(obj.duration);
      downloadInfoDic[@"bitrate"] =  @(obj.quality);
      downloadInfoDic[@"title"] = obj.title;
      [downloadInfoArray addObject:downloadInfoDic];
    }];
    
  } else { // 下载中列表
    PLVVodDownloadManager *downloadManager = [PLVVodDownloadManager sharedManager];
    [downloadManager requstDownloadProcessingListWithCompletion:^(NSArray<PLVVodDownloadInfo *> *downloadInfos) {
      for (PLVVodDownloadInfo *info in downloadInfos) {
        NSDictionary *dic = [PolyvRNVodDownloadModule formatDownloadInfoToDictionary:info];
        [downloadInfoArray addObject:dic];
        
        [self addDownloadInfoListener:info];
      }
    }];
  }
  
  NSString *downloadInfoArrayDesc;
  if (downloadInfoArray.count == 0) {
    downloadInfoArrayDesc = @"[]";
  } else {
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:downloadInfoArray options:kNilOptions error:&error];
    downloadInfoArrayDesc = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  }
  NSLog(@"downloadInfoArrayDesc = %@", downloadInfoArrayDesc);
  NSDictionary *dic = @{ @"downloadList": downloadInfoArrayDesc };
  resolve(dic);
}

RCT_EXPORT_METHOD(getDownloadStatus:(NSString *)vid
                  bitrate:(int)bitrate
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  PLVVodDownloadInfo *info = [[PLVVodDownloadManager sharedManager] requestDownloadInfoWithVid:vid];
  int status = -1;
  switch (info.state) {
    case PLVVodDownloadStatePreparing:
    case PLVVodDownloadStateReady:
    {
      status = 2;
    }break;
    case PLVVodDownloadStateStopped:
    case PLVVodDownloadStateStopping:{
      status = 1;
    }break;
    case PLVVodDownloadStatePreparingStart:
    case PLVVodDownloadStateRunning:{
      status = 0;
    }break;
    default:{
      status = 1;
    }break;
  }
      
  NSDictionary *dic = @{ @"downloadStatus": @(status) };
  resolve(dic);
}

RCT_EXPORT_METHOD(pauseDownload:(NSString *)vid
                  )
{
  [[PLVVodDownloadManager sharedManager] stopDownloadWithVid:vid];
  
}

RCT_EXPORT_METHOD(resumeDownload:(NSString *)vid
                  )
{
  [[PLVVodDownloadManager sharedManager] startDownloadWithVid:vid];
  
}

RCT_EXPORT_METHOD(pauseAllDownloadTask
                  )
{
  [[PLVVodDownloadManager sharedManager] stopDownload];
  
}

RCT_EXPORT_METHOD(downloadAllTask
                  )
{
  [[PLVVodDownloadManager sharedManager] startDownload];
  
}

RCT_EXPORT_METHOD(delVideo:(NSString *)vid
                  )
{
  NSError *error;
  [[PLVVodDownloadManager sharedManager] removeDownloadWithVid:vid error:&error];
  
}

RCT_EXPORT_METHOD(clearDownloadVideo
                  )
{
  [[PLVVodDownloadManager sharedManager] removeAllDownloadWithComplete:^(void *result) {
    
  }];
}

#pragma mark -- add listener
- (void)addDownloadInfoListener:(PLVVodDownloadInfo *)info
{
  // 下载状态改变回调
//  info.stateDidChangeBlock = ^(PLVVodDownloadInfo *info) {
//    dispatch_async(dispatch_get_main_queue(), ^{
//
//      switch (info.state) {
//        case PLVVodDownloadStatePreparing:
//        case PLVVodDownloadStateReady:
//        case PLVVodDownloadStateStopped:
//        case PLVVodDownloadStateStopping:{
//          [self sentEvnetWithKey:@"pauseDownloadEvent" info:info];
//        }break;
//        case PLVVodDownloadStatePreparingStart:
//        case PLVVodDownloadStateRunning:{
//          [self sentEvnetWithKey:@"startDownloadEvent" info:info];
//        }break;
//        case PLVVodDownloadStateSuccess:{
//          [self sentEvnetWithKey:@"downloadSuccessEvent" info:info];
//        }break;
//        case PLVVodDownloadStateFailed:{
//          [self sentEvnetWithKey:@"downloadFailedEvent" info:info];
//        }break;
//      }
//    });
//  };

  // 下载进度回调
//  info.progressDidChangeBlock = ^(PLVVodDownloadInfo *info) {
//    //NSLog(@"vid: %@, progress: %f", info.vid, info.progress);
//    float receivedSize = info.progress * info.filesize;
//    if (receivedSize >= info.filesize){
//      receivedSize = info.filesize;
//    }
//    NSDictionary *dic = @{ @"current": @(receivedSize), @"total": @(info.filesize) };
//    NSString *value = [PolyvRNVodDownloadModule formatDictionaryToString:dic];
//    [self sentEvnetWithKey:@"updateProgressEvent" value:value];
//  };

//  // 下载速率回调
//  info.bytesPerSecondsDidChangeBlock = ^(PLVVodDownloadInfo *info) {
//    NSDictionary *dic = @{ @"bytesPerSeconds": @(info.bytesPerSeconds) };
//    NSString *value = [PolyvRNVodDownloadModule formatObjectToString:dic];
//    [self sentEvnetWithKey:@"bytesPerSecondsEvent" value:value];
//  };

}

#pragma mark -- private method
+ (NSString *)formatDefinition:(int)count {
  switch (count) {
    case 1:
      return @"[\"流畅\"]";
    case 2:
      return @"[\"流畅\",\"高清\"]";
    case 3:
      return @"[\"流畅\",\"高清\",\"超清\"]";
    default:
      return @"[\"流畅\"]";
  }
}

+ (PLVVodQuality)getQualityByPos:(int)pos {
  int p = pos + 1;
  switch (p) {
    case 1:
      return PLVVodQualityStandard;
    case 2:
      return PLVVodQualityHigh;
    case 3:
      return PLVVodQualityUltra;
    default:
      return PLVVodQualityStandard;
  }
}

+ (NSDictionary *)formatDownloadInfoToDictionary:(PLVVodDownloadInfo *)info {
  NSDictionary *dic = @{
                        @"vid" : info.vid,
                        @"duration" : @(info.duration),
                        @"bitrate" : @(info.quality),
                        @"title" : info.title,
                        };
  return dic;
}

+ (NSString *)formatDictionaryToString:(NSDictionary *)dic {
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:0 error:0];
  NSString *dataStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  return dataStr;
}

- (void)sentEvnetWithKey:(NSString *)key value:(NSString *)value {
  [self sendEventWithName:@"EventReminder" body:@{ key: value }];
}

- (void)sentEvnetWithKey:(NSString *)key info:(PLVVodDownloadInfo *)info {
  NSDictionary *dic = [PolyvRNVodDownloadModule formatDownloadInfoToDictionary:info];
  NSString *value = [PolyvRNVodDownloadModule formatDictionaryToString:dic];
  [self sentEvnetWithKey:key value:value];
}

@end
