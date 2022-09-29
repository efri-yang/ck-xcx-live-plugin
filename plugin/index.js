module.exports = {
  /**
   * @description:设置环境
   * @val {number} 1-测试  2-formal 3-正式 
   * @return {*}
   */
  setEnvConfig(val) {
    let ckPluginEnvConfig = {}
    switch (val * 1) {
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
    this.setStorage("ckPluginEnvConfig",ckPluginEnvConfig);
  },
  setStorage(key, data) {
    return new Promise((resolve) => {
      let storage = this.getStorage(key);
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
  },
  getStorage(key) {
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
}