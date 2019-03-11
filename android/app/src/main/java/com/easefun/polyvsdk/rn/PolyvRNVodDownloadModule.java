package com.easefun.polyvsdk.rn;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.util.Log;
import android.widget.Toast;

import com.easefun.polyvsdk.PolyvBitRate;
import com.easefun.polyvsdk.PolyvDownloader;
import com.easefun.polyvsdk.PolyvDownloaderManager;
import com.easefun.polyvsdk.Video;
import com.easefun.polyvsdk.adapter.PolyvOnlineListViewAdapter;
import com.easefun.polyvsdk.bean.PolyvDownloadInfo;
import com.easefun.polyvsdk.database.PolyvDownloadSQLiteHelper;
import com.easefun.polyvsdk.log.PolyvCommonLog;
import com.easefun.polyvsdk.vo.PolyvVideoJSONVO;
import com.easefun.polyvsdk.vo.PolyvVideoVO;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hpplay.common.utils.GsonUtil;

/**
 * @author df
 * @create 2019/3/11
 * @Describe
 */
public class PolyvRNVodDownloadModule extends ReactContextBaseJavaModule {
    private static final String TAG = "PolyvRNVodDownloadModule";
    private  PolyvDownloadSQLiteHelper downloadSQLiteHelper;
    public PolyvRNVodDownloadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.downloadSQLiteHelper = PolyvDownloadSQLiteHelper.getInstance(reactContext);
    }

    @Override
    public String getName() {
        return "PolyvRNVodDownloadModule";
    }

    @ReactMethod
    public void startDownload(final String vid, final int pos, final String title,String videoJson,Callback callback, Promise promise) {
        PolyvCommonLog.d(TAG, "id:" + vid + " pos :" + pos + "title :" + title + "  js :" + videoJson);
        PolyvVideoVO videoJSONVO = GsonUtil.fromJson(videoJson, PolyvVideoVO.class);
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
}
