package com.easefun.polyvsdk.rn;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.easefun.polyvsdk.PolyvBitRate;
import com.easefun.polyvsdk.PolyvDownloader;
import com.easefun.polyvsdk.PolyvDownloaderErrorReason;
import com.easefun.polyvsdk.PolyvDownloaderManager;
import com.easefun.polyvsdk.PolyvSDKUtil;
import com.easefun.polyvsdk.Video;
import com.easefun.polyvsdk.bean.PolyvDownloadInfo;
import com.easefun.polyvsdk.database.PolyvDownloadSQLiteHelper;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderProgressListener;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderStartListener;
import com.easefun.polyvsdk.log.PolyvCommonLog;
import com.easefun.polyvsdk.util.PolyvErrorMessageUtils;
import com.easefun.polyvsdk.vo.PolyvVideoJSONVO;
import com.easefun.polyvsdk.vo.PolyvVideoVO;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.hpplay.common.utils.GsonUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.jar.Attributes;

/**
 * @author df
 * @create 2019/3/11
 * @Describe
 */
public class PolyvRNVodDownloadModule extends ReactContextBaseJavaModule {
    private static final String TAG = "PolyvRNVodDownloadModule";
    private PolyvDownloadSQLiteHelper downloadSQLiteHelper;
    private LinkedList<PolyvDownloadInfo> lists;
    private PolyvVideoVO video;

    public PolyvRNVodDownloadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.downloadSQLiteHelper = PolyvDownloadSQLiteHelper.getInstance(reactContext);

    }

    @Override
    public String getName() {
        return "PolyvRNVodDownloadModule";
    }

    @ReactMethod
    public void getBitrateNumbers(String vid, final Promise promise){
        Video.loadVideo(vid, new Video.OnVideoLoaded() {
            public void onloaded(final Video v) {
                if (v == null) {
                    Toast.makeText(getCurrentActivity(), "获取下载信息失败，请重试", Toast.LENGTH_SHORT).show();
                    return;
                }

                video = v;
                // 码率数
                String[] items = PolyvBitRate.getBitRateNameArray(v.getDfNum());
                String bitrates = GsonUtil.toJson(Arrays.asList(items));

                WritableMap map = Arguments.createMap();
                map.putString("bitrates",bitrates );

                promise.resolve(map);
            }
        });
    }
    @ReactMethod
    public void startDownload(final String vid, final int pos, final String title, Callback callback) {
        PolyvCommonLog.d(TAG, "id:" + vid + " pos :" + pos + "title :" + title + "  js :" );
        PolyvVideoVO videoJSONVO = video;

        if (videoJSONVO == null) {
            Toast.makeText(getCurrentActivity(), "获取下载信息失败，请重试", Toast.LENGTH_SHORT).show();
            return;
        }

        int bitrate = pos + 1;

        final PolyvDownloadInfo downloadInfo = new PolyvDownloadInfo(vid, videoJSONVO.getDuration(),
                videoJSONVO.getFileSizeMatchVideoType(bitrate), bitrate, title);
        Log.i("videoAdapter", downloadInfo.toString());
        if (downloadSQLiteHelper != null && !downloadSQLiteHelper.isAdd(downloadInfo)) {
            downloadSQLiteHelper.insert(downloadInfo);
            start(vid, bitrate, downloadInfo);
        } else {
            (getCurrentActivity()).runOnUiThread(new Runnable() {

                @Override
                public void run() {
                    Toast.makeText(getCurrentActivity(), "下载任务已经增加到队列", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private void start(String vid, int bitrate, final PolyvDownloadInfo downloadInfo) {
        PolyvDownloader polyvDownloader = addDownloadListener(vid, bitrate, downloadInfo, null);
        polyvDownloader.start(getCurrentActivity());
    }

    private PolyvDownloader addDownloadListener(String vid, int bitrate, final PolyvDownloadInfo downloadInfo, final Callback callback) {
        PolyvDownloader polyvDownloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        polyvDownloader.setPolyvDownloadProressListener(new IPolyvDownloaderProgressListener(){

            private long total;
            String data = GsonUtil.toJson(downloadInfo);
            @Override
            public void onDownload(long current, long total) {
                this.total = total;
                WritableMap map = Arguments.createMap();
                map.putDouble("current",current);
                map.putDouble("total",total);
                map.putString("downloadInfo",data);
                sendEvent(getReactApplicationContext(),"updateProgress",map);
                downloadSQLiteHelper.update(downloadInfo, current, total);
            }

            @Override
            public void onDownloadSuccess() {
                WritableMap map = Arguments.createMap();
                map.putDouble("total",total);
                downloadSQLiteHelper.update(downloadInfo, total, total);
                sendEvent(getReactApplicationContext(),"downloadSuccess",map);
            }

            @Override
            public void onDownloadFail(@NonNull PolyvDownloaderErrorReason errorReason) {
                String errorMsg = PolyvErrorMessageUtils.getDownloaderErrorMessage(errorReason.getType());
                Toast.makeText(getCurrentActivity(), errorMsg, Toast.LENGTH_LONG).show();
            }


        });
        polyvDownloader.setPolyvDownloadStartListener(new IPolyvDownloaderStartListener() {
            @Override
            public void onStart() {
                String data = GsonUtil.toJson(downloadInfo);
                WritableMap map = Arguments.createMap();
                map.putString("downloadInfo",data);
                sendEvent(getReactApplicationContext(),"startDownload",map);
            }
        });
        return polyvDownloader;
    }

    //获取下载列表
    @ReactMethod
    public void getDownloadVideoList(boolean hasDownloaded,Promise promise) {
        List<PolyvDownloadInfo> downloadInfos = new ArrayList<>();
        lists = downloadSQLiteHelper.getAll();
        downloadInfos.addAll(getTask(lists, hasDownloaded,null));
        if(downloadInfos.isEmpty()){
            String errorCode = "" + PolyvRNVodCode.noDownloadedVideo;
            String errorDesc = PolyvRNVodCode.getDesc(PolyvRNVodCode.noDownloadedVideo);
            Throwable throwable = new Throwable(errorDesc);
            Log.e(TAG, "errorCode=" + errorCode + "  errorDesc=" + errorDesc);
            promise.reject(errorCode,errorDesc,throwable);
            return;
        }
        WritableMap map = Arguments.createMap();
        map.putString("downloadList",GsonUtil.toJson(downloadInfos));

        promise.resolve(map);
    }

    private List<PolyvDownloadInfo> getTask(List<PolyvDownloadInfo> downloadInfos, boolean isFinished, Callback callback) {
        if (downloadInfos == null) {
            return null;
        }
        List<PolyvDownloadInfo> infos = new ArrayList<>();
        for (PolyvDownloadInfo downloadInfo : downloadInfos) {
            long percent = downloadInfo.getPercent();
            long total = downloadInfo.getTotal();
            // 已下载的百分比
            int progress = 0;
            if (total != 0) {
                progress = (int) (percent * 100 / total);
            }
            if (progress == 100) {
                if (isFinished) {
                    infos.add(downloadInfo);
                }
            } else if (!isFinished) {
                infos.add(downloadInfo);
            }
            addDownloadListener(downloadInfo.getVid(), downloadInfo.getBitrate(), downloadInfo,callback);

        }
        return infos;
    }

    @ReactMethod
    public void pauseDownload(String vid,int bitrate){
        PolyvDownloader polyvDownloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        polyvDownloader.stop();
    }

    @ReactMethod
    public void resumeDownload(String vid,int bitrate){
        PolyvDownloader polyvDownloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        polyvDownloader.start(getCurrentActivity());
    }

    @ReactMethod
    public void pauseAllDownloadTask(){
        pauseAll();
    }

    @ReactMethod
    public void downloadAllTask(){
        downloadAll();
    }

    @ReactMethod
    public void delVideo(String vid,int bitrate){
       deleteTask(vid,bitrate);
    }

    @ReactMethod
    public void clearDownloadVideo(int pos){
        deleteAllTask();
    }

    /**
     * 下载全部任务
     */
    public void downloadAll() {
        // 已完成的任务key集合
        List<String> finishKey = new ArrayList<>();
        List<PolyvDownloadInfo> downloadInfos = downloadSQLiteHelper.getAll();
        for (int i = 0; i < downloadInfos.size(); i++) {
            PolyvDownloadInfo downloadInfo = downloadInfos.get(i);
            long percent = downloadInfo.getPercent();
            long total = downloadInfo.getTotal();
            int progress = 0;
            if (total != 0)
                progress = (int) (percent * 100 / total);
            if (progress == 100)
                finishKey.add(PolyvDownloaderManager.getKey(downloadInfo.getVid(), downloadInfo.getBitrate()));
        }
        PolyvDownloaderManager.startUnfinished(finishKey, getCurrentActivity());
    }

    /**
     * 暂停全部任务
     */
    public void pauseAll() {
        PolyvDownloaderManager.stopAll();
    }

    /**
     * 删除当前列表的所有任务
     */
    public void deleteAllTask() {
        for (int i = 0; i < lists.size(); i++) {
            PolyvDownloadInfo downloadInfo = lists.get(i);
            //移除任务
            PolyvDownloader downloader = PolyvDownloaderManager.clearPolyvDownload(downloadInfo.getVid(), downloadInfo.getBitrate());
            //删除文件
            downloader.deleteVideo();
            //移除数据库的下载信息
            downloadSQLiteHelper.delete(downloadInfo);
        }
    }

    /**
     * 删除任务
     */
    public void deleteTask(String vid,int bitrate ) {
        //移除任务
        PolyvDownloader downloader = PolyvDownloaderManager.clearPolyvDownload(vid,bitrate);
        //删除文件
        downloader.deleteVideo();
        //移除数据库的下载信息
        PolyvDownloadInfo polyvDownloadInfo = new PolyvDownloadInfo(vid,"",0,bitrate,"");
        downloadSQLiteHelper.delete(polyvDownloadInfo);
    }
    public static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}