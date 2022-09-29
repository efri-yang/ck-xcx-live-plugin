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
  let token = wx.getStorageSync("token");
  //判断token是否存在
  // 存在就继续执行
  if (!!token) {
    if (isShowLoading == true) {
      Loading.show();
    }
    let paramSession = sessionChoose == 1 ? {
      'content-type': 'application/x-www-form-urlencoded'
    } : {
      'content-type': 'application/json'
    };
    var params = Object.prototype.toString.call(params) == "[object Object]" ? params : {};
    wx.request({
      url: Config.api.baseUrl,
      data: params,
      dataType: "json",
      header: paramSession,
      method: method,
      success: function (res) {
        //token 存在 还返回1002，这个时候就要强制
        if (res.data.code == 1002) {
          if(login_request_count <= 5){
            asyncLogin(true).then((res) => {
              console.log("asyncLogin().then-success")
              HttpRequest(isShowLoading, url, sessionChoose, params, method, callBack, reject)
              login_request_count++ ;
            })
          } else{
            wx.showModal({
              title: '提示',
              content: '多次授权失败',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } 
              }
            });
            login_request_count = 0;
          }
        } else {
          if (res.data.code == 1000) {
            callBack(res.data);
          } else {
            reject(res.data);
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            });
          }
        }
      },
      fail: function (res) {
        console.warn("HttpRequst当中wx.request fail 执行了：调用失败", res)
      },
      complete: function (res) {
        console.log('发送的数据是：', params, '返回的数据是:', res.data.data);
        if (isShowLoading) {
          Loading.hide();
        }
      }
    })
  } else {
    //不存在(或者) 重走登录流程
    //第一个执行的时候  后面的都需要挂起来
    asyncLogin().then((res) => {
      console.log("asyncLogin().then-", wx.getStorageSync("token"))
      HttpRequest(isShowLoading, url, sessionChoose, params, method, callBack, reject)
    })
  }
}

function asyncLogin(flag) {
  return new Promise((reslove, reject) => {
    if (login_runing) {
      //已经在执行了
      login_collect.push(reslove);
    } else {
      login_runing = true;
      work(reslove, reject, flag)
    }
  })
}


function _resloveRun() {
  login_collect.forEach((reslove) => {
    reslove();
  });
  login_runing = false;
  login_collect = [];
}


function work(reslove, reject, flag) {
  wx.checkSession({
    success: function () {
      //同步获取token
      let token = wx.getStorageSync("token");
      console.log("checkSession是否过期，token:" + token)
      //为了安全验证 判断token是否有本地存储
      if (!token || (!!token && flag)) {
        wxLogin(reslove);
      } else {
        //重新走登录流程
        reslove(token);
        _resloveRun();
      }
    },
    fail: function () {
      //重新走登录流程
      wxLogin(reslove);
    }
  })
}

function wxLogin(reslove) {
  wx.login({
    success(res) {
      console.log("执行了wx.login-code:" + res.code)
      if (res.code) {
        wx.request({
          url: Config.api.baseUrl,
          data: {
            opact: Config.api.wxRegLogin,
            version: Config.api.version,
            code: res.code
          },
          dataType: "json",
          header: {
            'content-type': 'application/json'
          },
          method: "POST",
          success: function (res) {
            console.log("wx.login-token:" + res.header['Set-Cookie'])
            if (res.data.code == 1000) {
              try {
                wx.setStorageSync('token', res.header['Set-Cookie']);
                reslove();
                _resloveRun();
              } catch (e) {
                console.log("token本地存储错误")
              }
            }
          },
          fail: function (res) {
            console.warn("wxLogin当中wx.request fail 执行了：调用失败")
          }
        })
      } else {
        console.warn('登录失败！' + res.errMsg)
      }
    },
    fail: function () {
      console.warn("调用wx.login接口失败！")
    }
  })
}


function get(url, datas = {}, isShowLoading = true) {
  return new Promise(function (resolve, reject) {
    HttpRequest(isShowLoading, url, 2, datas, 'GET', resolve, reject)
  })
}

function post(url, datas = {}, isShowLoading = true) {
  return new Promise(function (resolve, reject) {
    HttpRequest(isShowLoading, url, 1, datas, 'POST', resolve, reject)
  })
}


export {
  HttpRequest,
  asyncLogin,
  get,
  post
}