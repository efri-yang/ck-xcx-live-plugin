let login_runing = false;
let login_collect = [];
let login_request_count=0;
//load提示加载
let Loading = {
  count: 0,
  start: function () {
    wx.showLoading({
      title:"加载中..."
    });
  },
  end: function () {
    wx.hideLoading();
  },
  show: function () {
    if (this.count === 0) {
      this.start();
    };
    this.count++;
  },
  hide: function () {
    if (this.count <= 0) return;
    this.count--;
    if (this.count <= 0) {
      this.end();
    }
  }
}

function HttpRequest(isShowLoading, url, sessionChoose, params, method, callBack, reject) {
  let token = wx.getStorageSync("ckPluginToken");
  let envConfig = wx.getStorageSync('ckPluginEnvConfig');
  //判断token是否存在
  // 存在就继续执行
  if (!!token) {
    if (isShowLoading == true) {
      Loading.show();
    }
    let header ={
      'content-type': sessionChoose == 1 ? 'application/json' : 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    }
    params = Object.prototype.toString.call(params) == "[object Object]" ? params : {};
    params.fromApp ='xcxlive';
    wx.request({
      url: envConfig.apiUrl + url,
      data: params,
      dataType: "json",
      header: header,
      method: method,
      success: function (res) {
        //token 存在 还返回1002，这个时候就要强制
        if (res.data.statusCode == 200) {
          callBack(res.data.data);
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          });
        }
      },
      fail: function (res) {
        console.warn("HttpRequst当中wx.request fail 执行了：调用失败", res)
      },
      complete: function (res) {
        console.log(`${url} 发送的数据是：`, params, '返回的数据是:', res.data.data);
        if (isShowLoading) {
          Loading.hide();
        }
      }
    })
  } else {
    //第一个执行的时候  后面的都需要挂起来
    HttpRequest(isShowLoading, url, sessionChoose, params, method, callBack, reject)
  }
}

function get(url, datas = {}, isShowLoading = true) {
  return new Promise(function (resolve, reject) {
    HttpRequest(isShowLoading, url, 1, datas, 'GET', resolve, reject)
  })
}

function post(url, datas = {}, isShowLoading = true) {
  return new Promise(function (resolve, reject) {
    HttpRequest(isShowLoading, url, 1, datas, 'POST', resolve, reject)
  })
}


export {
  HttpRequest,
  get,
  post
}