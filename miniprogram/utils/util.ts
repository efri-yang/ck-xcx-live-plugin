/*日期格式化*/
import {HttpRequest,
  get,
  post} from "./httpRequest";
function dtFormat(timestamp: number, format: string, obj = { isResObj: false }): (string | object) {
  const SECOND = 1 * 1000;
  const MINUTE = 1 * 60 * SECOND;
  const HOURS = 1 * 60 * MINUTE;
  const DAY = 1 * 24 * HOURS;
  let dateType = 'dd|d|hh|h|mm|m|ss|s';
  let formatArr = (format || '').match(new RegExp(dateType + '|.', 'g')) || [];
  let dateTimeObj = {
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  };
  let dateTimeStr = '';
  let day: number, hour: number, minute: number, second: number;
  if (/dd|d/.test(format)) {
    //存在天
    day = timestamp > DAY ? Math.floor(timestamp / DAY) : 0;
    hour = (timestamp - day * DAY) >= HOURS ? Math.floor((timestamp - day * DAY) / HOURS) : 0;
    minute = (timestamp - day * DAY - hour * HOURS) >= MINUTE ? Math.floor((timestamp - day * DAY - hours *
      HOURS) / MINUTE) : 0;
    second = Math.round((timestamp - day * DAY - hour * HOURS - minute * MINUTE) / 1000);
  } else if (/hh|h/.test(format)) {
    hour = timestamp >= HOURS ? Math.floor(timestamp / HOURS) : 0;
    minute = (timestamp - hour * HOURS) >= MINUTE ? Math.floor((timestamp - hour * HOURS) / MINUTE) : 0;
    second = Math.round((timestamp - hour * HOURS - minute * MINUTE) / 1000);
  } else if (/mm|m/.test(format)) {
    minute = timestamp >= MINUTE ? Math.floor(timestamp / MINUTE) : 0;
    second = Math.round((timestamp - minute * MINUTE) / 1000);
  } else if (/ss|s/.test(format)) {
    second = Math.round(timestamp / 1000);
  }
  formatArr.forEach((item) => {
    if (new RegExp(dateType).test(item)) {
      if (/dd|d/.test(item)) { //天
        dateTimeStr += item.length == 2 ? (day < 10 ? '0' + day : day) : day;
        dateTimeObj.day = day
      } else if (/hh|h/.test(item)) { //时
        dateTimeStr += item.length == 2 ? (hour < 10 ? '0' + hour : hour) : hour;
        dateTimeObj.hour = hour
      } else if (/mm|m/.test(item)) { //分
        dateTimeStr += item.length == 2 ? (minute < 10 ? '0' + minute : minute) : minute;
        dateTimeObj.minute = minute;
      } else if (/ss|s/.test(item)) { //秒
        dateTimeStr += item.length == 2 ? (second < 10 ? '0' + second : second) : second;
        dateTimeObj.second = second;
      }
    } else {
      dateTimeStr += item
    }
  })
  console.log(dateTimeStr);
  return obj.isResObj ? dateTimeObj : dateTimeStr;
}

//本地存储-设置
function setStorage(key: string, data: any) {
  return new Promise((resolve) => {
    let storage = getStorage(key);
    if (storage && Object.prototype.toString.call(data) === '[object Object]') {
      for (var k in data) {
        storage[k] = data[k]
      }
    } else {
      storage = data;
    }
    wx.setStorage({
      key: key,
      data: storage,
      success: () => {
        resolve(storage);
      }
    })
  })
}
//本地存储-删除
function removeStorage(key: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      wx.removeStorageSync(key)
      resolve();
    } catch (e) {
      reject();
    }
  })
}
//本地存储-获取
function getStorage(key: string) {
  let storage;
  try {
    const value = wx.getStorageSync(key)
    if (value) {
      storage = value;
    }
    return storage;
  } catch (e) {
    console.warn("getStorage-fail:" + key);
  }
}

/**
 * @description:设置环境
 * @val {number} 1-测试  2-formal 3-正式 
 * @return {*}
 */
function setEnvConfig(val: number) {
  let ckPluginEnvConfig = {
    sdkAppId: 0,
    apiUrl: ""
  }
  switch (val) {
    case 1:
      ckPluginEnvConfig.sdkAppId = 1400339505;
      ckPluginEnvConfig.apiUrl = 'https://kpapi-cs.ckjr001.com/api/';
      break;
    case 2:
      ckPluginEnvConfig.sdkAppId = 1400488765;
      ckPluginEnvConfig.apiUrl = 'https://formalapi.ckjr001.com/api/';
      break;
    case 3:
      ckPluginEnvConfig.sdkAppId = 1400488765;
      ckPluginEnvConfig.apiUrl = 'https://kpapiop.ckjr001.com/api/';
      break
    default:
      ckPluginEnvConfig.sdkAppId = 1400488765;
      ckPluginEnvConfig.apiUrl = 'https://kpapiop.ckjr001.com/api/';
  }
  wx.setStorageSync('ckPluginEnvConfig', ckPluginEnvConfig);
}

export default {
  dtFormat,
  setStorage,
  removeStorage,
  getStorage,
  setEnvConfig,
  HttpRequest,
  get,
  post
}
