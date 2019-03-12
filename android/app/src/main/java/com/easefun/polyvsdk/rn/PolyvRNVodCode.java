package com.easefun.polyvsdk.rn;

/**
 * @author df
 * @create 2019/1/26
 * @Describe 与RN通信返回code
 */
public class PolyvRNVodCode {
    /**
     * code，返回码定义：
     *      0  成功
     *      -1 vodKey为空
     *      -2 decodeKey为空
     *      -3 decodeIv为空
     *      -4 ViewId为空
     *      -5 解析数据错误
     *      -6 没有正在下载的视频
     */
    public final static int success = 0;
    public final static int noVodKey = -1;
    public final static int noDecodeKey = -2;
    public final static int noDecodeIv = -3;
    public final static int noViewId = -4;
    public final static int parseDataError = -5;
    public final static int noDownloadedVideo = -6;

    public static String getDesc(int code) {
        switch (code) {
            case PolyvRNVodCode.success:
                return "成功";
            case PolyvRNVodCode.noVodKey:
                return "VodKey为空";
            case PolyvRNVodCode.noDecodeKey:
                return "DecodeKey为空";
            case PolyvRNVodCode.noDecodeIv:
                return "DecodeIv为空";
            case PolyvRNVodCode.noViewId:
                return "ViewId为空";
            case PolyvRNVodCode.parseDataError:
                return "解析视频数据出错";
                case PolyvRNVodCode.noDownloadedVideo:
                return "获取下载视频为空";
            default:
                return "";
        }
    }
}
