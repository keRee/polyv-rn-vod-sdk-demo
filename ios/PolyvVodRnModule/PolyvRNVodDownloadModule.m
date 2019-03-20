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
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  NSLog(@"startDownload() - %@ 、 %d 、 %@", vid, pos, title);
  
  [PLVVodVideo requestVideoPriorityCacheWithVid:vid completion:^(PLVVodVideo *video, NSError *error) {
    PLVVodQuality quality = [PolyvRNVodDownloadModule getQualityByPos:pos];
    PLVVodDownloadManager *downloadManager = [PLVVodDownloadManager sharedManager];
    PLVVodDownloadInfo *info = [downloadManager downloadVideo:video quality:quality];
    if (info) {
      NSLog(@"%@ - %zd 已加入下载队列", info.video.vid, info.quality);
      info.progressDidChangeBlock = ^(PLVVodDownloadInfo *info) {
        NSLog(@"%@: %@", info.vid, @(info.progress));
        
      };
      info.bytesPerSecondsDidChangeBlock = ^(PLVVodDownloadInfo *info) {
        
      };
      info.stateDidChangeBlock = ^(PLVVodDownloadInfo *info) {
        
      };
    }
  }];
}

RCT_EXPORT_METHOD(getDownloadVideoList:(BOOL)hasDownloaded
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  if (hasDownloaded) {
    // 从本地文件目录中读取已缓存视频列表
    NSArray<PLVVodLocalVideo *> *localArray = [[PLVVodDownloadManager sharedManager] localVideos];
    
    // 从数据库中读取已缓存视频详细信息
    // TODO:也可以从开发者自定义数据库中读取数据,方便扩展
    NSArray<PLVVodDownloadInfo *> *dbInfos = [[PLVVodDownloadManager sharedManager] requestDownloadCompleteList];
    NSMutableDictionary *dbCachedDics = [[NSMutableDictionary alloc] init];
    [dbInfos enumerateObjectsUsingBlock:^(PLVVodDownloadInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      [dbCachedDics setObject:obj forKey:obj.vid];
    }];
    
    __block NSMutableArray<PLVDownloadCompleteInfoModel *> *downloadInfos;
    // 组装数据
    // 以本地目录数据为准，因为数据库存在损坏的情形，会丢失数据，造成用户已缓存视频无法读取
    [localArray enumerateObjectsUsingBlock:^(PLVVodLocalVideo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      
      PLVDownloadCompleteInfoModel *model = [[PLVDownloadCompleteInfoModel alloc] init];
      model.localVideo = obj;
      model.downloadInfo = dbCachedDics[obj.vid];
      [self.downloadInfos addObject:model];
    }];
  } else {
    PLVVodDownloadManager *downloadManager = [PLVVodDownloadManager sharedManager];
    [downloadManager requstDownloadProcessingListWithCompletion:^(NSArray<PLVVodDownloadInfo *> *downloadInfos) {
      dispatch_async(dispatch_get_main_queue(), ^{
        
      });
    }];
  }
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
  info.stateDidChangeBlock = ^(PLVVodDownloadInfo *info) {
    dispatch_async(dispatch_get_main_queue(), ^{
      
      cell.videoStateLable.text = NSStringFromPLVVodDownloadState(info.state);
      cell.downloadStateImgView.image = [UIImage imageNamed:[self downloadStateImgFromState:info.state]];
      
      switch (info.state) {
        case PLVVodDownloadStatePreparing:
        case PLVVodDownloadStateReady:
        case PLVVodDownloadStateStopped:
        case PLVVodDownloadStateStopping:{

          
        }break;
        case PLVVodDownloadStatePreparingStart:
        case PLVVodDownloadStateRunning:{
          
        }break;
        case PLVVodDownloadStateSuccess:{
          
//          if (info.state == PLVVodDownloadStateSuccess){
//            // 下载成功，从列表中删除
//            [weakSelf handleDownloadSuccess:info];
//          }
          
        }break;
        case PLVVodDownloadStateFailed:{

        }break;
      }
    });
  };
  
  // 下载进度回调
  info.progressDidChangeBlock = ^(PLVVodDownloadInfo *info) {
    //NSLog(@"vid: %@, progress: %f", info.vid, info.progress);
    PLVDownloadProcessingCell *cell = weakSelf.downloadItemCellDic[info.vid];
    float receivedSize = info.progress * info.filesize;
    if (receivedSize >= info.filesize){
      receivedSize = info.filesize;
    }
    NSString *downloadProgressStr = [NSString stringWithFormat:@"%@/ %@", [self.class formatFilesize:receivedSize],[self.class formatFilesize:info.filesize]];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      cell.videoSizeLabel.text = downloadProgressStr;
    });
  };
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

@end
