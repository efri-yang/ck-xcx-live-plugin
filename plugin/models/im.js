import TIM from 'tim-wx-sdk';
class IM {
  constructor(options){
    console.log("IM-constructor")
    this.isIMLogin = false; //IM是否已经登录
    this.isIMJoinGroup = false; //是否加入群
    this.imCustomMessageStack = []; //自定义消息队列栈（未初始化就进行自定定义消息发送）
    this.imRetryCount = 0; //操作次数统计
    this.isIMReady = false; //SDK是否ready
    this.options =options;
    this.tim = TIM.create({
      SDKAppID: 1400318135
    });
    // 取消监听
    this.tim.off(TIM.EVENT.SDK_READY, this._onIMReady)
    this.tim.off(TIM.EVENT.MESSAGE_RECEIVED, this._onIMMessageReceived)
    this.tim.off(TIM.EVENT.SDK_NOT_READY, this._onIMNotReady)
    this.tim.off(TIM.EVENT.KICKED_OUT, this._onIMKickedOut)
    this.tim.off(TIM.EVENT.ERROR, this._onIMError)

    // 监听事件
    this.tim.on(TIM.EVENT.SDK_READY, this._onIMReady, this)
    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this._onIMMessageReceived, this)
    this.tim.on(TIM.EVENT.SDK_NOT_READY, this._onIMNotReady, this)
    this.tim.on(TIM.EVENT.KICKED_OUT, this._onIMKickedOut, this)
    this.tim.on(TIM.EVENT.ERROR, this._onIMError, this);
  }
  //IM-登录
  loginIM(params) {
    return this.tim.login({
      userID: params.userID,
      userSig: params.userSig,
    }).then((imResponse) => {
      this.isIMLogin = true;
      this.imRetryCount = 0;
      //重新登录（SDK不会走ready状态了）
      if (imResponse.data.repeatLogin === true) {
        console.log("_loginIM-已经登录")
        this.isIMReady = true;
        this._joinGroup({
          groupID: this.options.groupID
        })
      }
    }).catch(imError => {
      if ((imError.code == "ECONNABORTED" || imError.code == "ETIMEDOUT") && this.imRetryCount < 3) {
        this.imRetryCount++;
        this.loginIM(params);
      } else {
        this.imRetryCount = 0;
        wx.showToast({
          title: 'IM登录失败',
        });
        log.error({
          errorType: "IM",
          errorIntro: "IM登录失败",
          errorMsg: imError,
          imConfig: this._imConfig
        })
      }
    })
  }
  //IM-登出（即时通信 IM，通常在切换帐号的时候调用，清除登录态以及内存中的所有数据。）
  logoutIM() {
    // 取消监听
    this.tim.off(TIM.EVENT.SDK_READY, this._onIMReady)
    this.tim.off(TIM.EVENT.MESSAGE_RECEIVED, this._onIMMessageReceived)
    this.tim.off(TIM.EVENT.SDK_NOT_READY, this._onIMNotReady)
    this.tim.off(TIM.EVENT.KICKED_OUT, this._onIMKickedOut)
    this.tim.off(TIM.EVENT.ERROR, this._onIMError)
    this.tim.logout();
    this.tim = null;
    console.log("_logoutIM");
  }
  //IM-ready
  _onIMReady(event) {
    // console.log('IM的SDK已经READY,配置是_imConfig:', event, this._imConfig);
    this._isIMReady = true;
    this._joinGroup({
      groupID: this.options.groupID
    })
  }
  //IM-接受消息
  _onIMMessageReceived(event) {
    // console.log('IM.MESSAGE_RECEIVED', event)
    const messageData = event.data;
    for (let i = 0; i < messageData.length; i++) {
      const message = messageData[i];
      if ((message.type === TIM.TYPES.MSG_CUSTOM && message.to == this._imConfig.groupID) || (message.type === TIM.TYPES.CONV_C2C && message.to == this._imConfig.userID)) {
        let dataContent = JSON.parse(message.payload.data);
        console.log('接受消息',dataContent);
        if (this._imConfig.receivedCallBack) {
          //如果回调处理方法需要自定的情况(默认用_handlerIMMessage)
          this._imConfig.receivedCallBack.call(dataContent)
        } else {
          this._handlerIMMessage(dataContent);
        }
      }
    }
  }
  //IM-SDK为准备完成
  _onIMNotReady() {
    this.isIMReady = false;
  }
  //IM-onIMKickedOut 被剔除
  _onIMKickedOut(event) {
    switch (event.data.type) {
      case TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
        //多实例被踢(IM控制台已经配置了允许多端登录，web端最多10个)
        wx.showModal({
          title: '提示',
          content: '您已经在其它地方登陆了，请重新进入聊天室！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        });
        log.error({
          errorType: "IM被踢",
          errorIntro: "多实例被踢",
          imConfig: this._imConfig
        })
        break;
      case TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
        //签名过期被踢
        wx.showModal({
          title: '提示',
          content: '"您的签名已过期，请重新进入聊天室！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        });
        //日志上报
        log.error({
          errorType: "IM被踢",
          errorIntro: "签名过期被踢",
          imConfig: this._imConfig
        })
        break;
      default:
    }
  }
  //IM-onIMKickedOut报错
  _onIMError() {}
  //IM-加入群聊（群是由后端建立了）
  _joinGroup(params) {
    return new Promise((resolve, reject) => {
      const promise = this.tim.joinGroup({
        groupID: params.groupID + '',
        type: TIM.TYPES.GRP_AVCHATROOM //（直播群）类型的群组
      })
      promise.then((imResponse) => {
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
            break
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            // console.log('IM加群成功_joinGroup success', imResponse);
            this.isIMJoinGroup = true;
            this.imRetryCount = 0;
            if (this.imCustomMessageStack.length) {
              //存在队列，执行
              this.imCustomMessageStack.forEach((item,index) => {
                this._createCustomMessage(item.data, item.userID, item.successCB, item.errorCB);
                if (index == this.imCustomMessageStack.length - 1) {
                  this.imCustomMessageStack = [];
                }
              })
            }
            resolve();
            break
          default:
            log.error({
              errorType: "IM",
              errorIntro: "IM加群-imResponse.data.status",
              errorMsg: imResponse.data.status,
              imConfig: this._imConfig
            })
            break
        }
      }).catch((imError) => {
        if (this.imRetryCount < 3) {
          this.imRetryCount++;
          this._joinGroup(params);
        }else{
          console.warn('IM加群失败joinGroup error', imError) // 申请加群失败的相关信息
          wx.showToast({
            title: '您入群失败，请重新加入！',
            icon: "none"
          })
          log.error({
            errorType: "IM",
            errorIntro: "IM加群失败-_joinGroup",
            errorMsg: imError,
            imConfig: this._imConfig
          })
          reject();
        }
      })
    })
  }
  //IM-退群（群是由后端建立了）
  _quitGroup(params) {
    if (!this.tim) {
      return
    }
    const promise = this.tim.quitGroup(params.groupID + '')
    promise.then((imResponse) => {
      console.log('退群成功_quitGroup success', imResponse)
    }).catch((imError) => {
      console.warn('退群失败 quitGroup error', imError)
    });
    return promise
  }
  //发送自定义消息
  sendCustomMessage(data, userID) {
    if (!this.isIMJoinGroup) {
      //未加群成功
      return new Promise((resolve,reject) => {
        this.imCustomMessageStack.push({
          data: data,
          userID: userID,
          successCB: resolve,
          errorCB:reject
        });
      });
    } else {
      //加群成功
      return new Promise((resolve, reject) => {
        this._createCustomMessage(data, userID, resolve, reject)
      })
    }
  }
  _createCustomMessage(data, userID, resolve, reject) {
    console.log("_createCustomMessage", userID)
    let message = this.tim.createCustomMessage({
      to: userID || this._imConfig.groupID,
      conversationType: !userID ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
      priority: TIM.TYPES.MSG_PRIORITY_HIGH,
      payload: {
        data: JSON.stringify(data),
        description: '',
        extension: ''
      }
    });
    let promise = this.tim.sendMessage(message);
    promise.then(function (res) {
      console.log("自定义发消息---成功！", data, res)
      resolve();
    }).catch(res => {
      console.log("自定义发消息---失败！", data, res)
      if (res.code == 2100 || res.code == 2999) {
        this.isIMJoinGroup = false;
        console.log("还未加群");
        this._joinGroup({
          groupID:this._imConfig.groupID
        }).then(() => {
          this._createCustomMessage(data, userID, resolve, reject);
        }).catch(()=>{
          wx.showToast({
            title: '网络开小差了，退出重进！',
            icon: "none",
            duration: 3000
          });
          log.error({
            errorType: "IM",
            errorIntro: "自定义消息发送失败",
            sendData: data,
            errorMsg: res,
            imConfig: this._imConfig
          })
        })
      }else{
        wx.showToast({
          title: '您的消息发送失败！',
          icon: "none",
          duration: 3000
        });
        log.error({
          errorType: "IM",
          errorIntro: "自定义消息发送失败",
          sendData: data,
          errorMsg: res,
          imConfig: this._imConfig
        })
        console.log("自定义发消息---失败！", res, data, this._imConfig)
      }
    })
  }
}

export default new IM();