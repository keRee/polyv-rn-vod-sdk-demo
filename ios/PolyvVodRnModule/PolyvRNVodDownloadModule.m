//
//  PolyvVodDownloadRnModule.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvRNVodDownloadModule.h"

@implementation PolyvRNVodDownloadModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getBitrateNumbers:(NSString *)vid
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
    
}



@end
