package com.easefun.polyvsdk.rn;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.util.Log;
import android.widget.Toast;

import com.easefun.polyvsdk.PolyvBitRate;
import com.easefun.polyvsdk.PolyvDownloader;
import com.easefun.polyvsdk.PolyvDownloaderManager;
import com.easefun.polyvsdk.PolyvSDKClient;
import com.easefun.polyvsdk.Video;
import com.easefun.polyvsdk.adapter.PolyvOnlineListViewAdapter;
import com.easefun.polyvsdk.bean.PolyvDownloadInfo;
import com.easefun.polyvsdk.database.PolyvDownloadSQLiteHelper;
import com.easefun.polyvsdk.log.PolyvCommonLog;
import com.easefun.polyvsdk.vo.PolyvVideoJSONVO;
import com.easefun.polyvsdk.vo.PolyvVideoVO;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.hpplay.common.utils.GsonUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * @author df
 * @create 2019/3/11
 * @Describe
 */
public class PolyvRNVodDownloadModule extends ReactContextBaseJavaModule {
    private static final String TAG = "PolyvRNVodDownloadModule";
    private PolyvDownloadSQLiteHelper downloadSQLiteHelper;

    public PolyvRNVodDownloadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.downloadSQLiteHelper = PolyvDownloadSQLiteHelper.getInstance(reactContext);
    }

    @Override
    public String getName() {
        return "PolyvRNVodDownloadModule";
    }

    @ReactMethod
    public void startDownload(final String vid, final int pos, final String title, String videoJson, Callback callback) {
        PolyvCommonLog.d(TAG, "id:" + vid + " pos :" + pos + "title :" + title + "  js :" + videoJson);
        PolyvVideoVO videoJSONVO = null;
        try {
            videoJSONVO = PolyvVideoVO.fromJSONObject(vid, new JSONObject(videoJson));
        } catch (JSONException e) {
            e.printStackTrace();
        }
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
            PolyvDownloader polyvDownloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
            polyvDownloader.setPolyvDownloadProressListener(new PolyvOnlineListViewAdapter.MyDownloadListener(getCurrentActivity(), downloadInfo));
            polyvDownloader.start(getCurrentActivity());
        } else {
            (getCurrentActivity()).runOnUiThread(new Runnable() {

                @Override
                public void run() {
                    Toast.makeText(getCurrentActivity(), "下载任务已经增加到队列", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    //获取下载列表
    @ReactMethod
    public void getDownloadVideoList(boolean hasDownloaded, Promise promise) {
        List<PolyvDownloadInfo> downloadInfos = new ArrayList<>();
        downloadInfos.addAll(getTask(downloadSQLiteHelper.getAll(), hasDownloaded));
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

    private List<PolyvDownloadInfo> getTask(List<PolyvDownloadInfo> downloadInfos, boolean isFinished) {
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
        }
        return infos;
    }
}
