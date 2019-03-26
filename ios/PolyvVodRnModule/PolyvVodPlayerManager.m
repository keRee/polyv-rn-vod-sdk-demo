//
//  PolyvVodPlayerViewManager.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/2/15.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvVodPlayerManager.h"
#import "PolyvVodPlayerWrapperView.h"
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>

@interface PolyvVodPlayerManager()

@property (nonatomic, weak) NSDictionary<NSNumber *,UIView *> *viewRegistry;

@end

@implementation PolyvVodPlayerManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(play_parameters, NSDictionary)

- (UIView *)view
{
  PolyvVodPlayerWrapperView *wrapper = [[PolyvVodPlayerWrapperView alloc] init];
  [wrapper setup];
  return wrapper;
}

RCT_EXPORT_METHOD(
                  updateVid:(nonnull NSNumber *)reactTag
                  vid:(NSString *)vid
                  )
{
  NSLog(@"updateVid vid=%@", vid);
  RCTUIManager *uiManager = _bridge.uiManager;
  if (self.viewRegistry) {
    UIView *view = self.viewRegistry[reactTag];
    if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
      PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
      [wrapper updateVid:vid];
    }
  } else {
    dispatch_async(uiManager.methodQueue, ^{
      [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        self.viewRegistry = viewRegistry;
        UIView *view = viewRegistry[reactTag];
        if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
          PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
          [wrapper updateVid:vid];
        }
      }];
    });
  }
  
}

RCT_EXPORT_METHOD(
                  startOrPause:(nonnull NSNumber *)reactTag
                  )
{
  NSLog(@"startOrPause");
  if (self.viewRegistry) {
    UIView *view = self.viewRegistry[reactTag];
    if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
      PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
      [wrapper startOrPause];
    }
  } else {
    RCTUIManager *uiManager = _bridge.uiManager;
    dispatch_async(uiManager.methodQueue, ^{
      [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        self.viewRegistry = viewRegistry;
        UIView *view = viewRegistry[reactTag];
        if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
          PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
          [wrapper startOrPause];
        }
      }];
    });
  }
  
}

RCT_EXPORT_METHOD(
                  play:(nonnull NSNumber *)reactTag
                  )
{
  NSLog(@"play");
  if (self.viewRegistry) {
    UIView *view = self.viewRegistry[reactTag];
    if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
      PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
      [wrapper start];
    }
  } else {
    RCTUIManager *uiManager = _bridge.uiManager;
    dispatch_async(uiManager.methodQueue, ^{
      [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        self.viewRegistry = viewRegistry;
        UIView *view = viewRegistry[reactTag];
        if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
          PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
          [wrapper start];
        }
      }];
    });
  }
}

RCT_EXPORT_METHOD(
                  pause:(nonnull NSNumber *)reactTag
                  )
{
  NSLog(@"pause");
  if (self.viewRegistry) {
    UIView *view = self.viewRegistry[reactTag];
    if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
      PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
      [wrapper pause];
    }
  } else {
    RCTUIManager *uiManager = _bridge.uiManager;
    dispatch_async(uiManager.methodQueue, ^{
      [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        self.viewRegistry = viewRegistry;
        UIView *view = viewRegistry[reactTag];
        if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
          PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
          [wrapper pause];
        }
      }];
    });
  }
}

RCT_EXPORT_METHOD(
                  release:(nonnull NSNumber *)reactTag
                  )
{
  NSLog(@"pause");
  if (self.viewRegistry) {
    UIView *view = self.viewRegistry[reactTag];
    if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
      PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
      [wrapper destroyPlayer];
    }
  } else {
    RCTUIManager *uiManager = _bridge.uiManager;
    dispatch_async(uiManager.methodQueue, ^{
      [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        self.viewRegistry = viewRegistry;
        UIView *view = viewRegistry[reactTag];
        if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
          PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
          [wrapper destroyPlayer];
        }
      }];
    });
  }
}

@end
