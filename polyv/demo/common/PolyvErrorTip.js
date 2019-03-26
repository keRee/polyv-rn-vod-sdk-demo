//错误代码
const PolyvResultCode = {
  SUCCESS: 0,
  VID_ERROR: -1, //vid错误
  BITRATE_INDEX_ERROR: -2, //码率错误
  getErrorDes(errorCode) {
    var errorDes = "";
    switch (errorCode) {
      case this.VID_ERROR:
        errorDes = "vid is error";
        break;
      case this.BITRATE_INDEX_ERROR:
        errorDes = "bitrate is error";
        break;
    }

    return errorDes;
  }
};

module.exports = PolyvResultCode;
