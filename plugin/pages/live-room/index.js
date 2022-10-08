// plugin/pages/live-room/index.js
import IM from '../../utils/im';
import utils from '../../utils/util';
import create from '../../utils/create';
import store from '../../store';
const CHAT_PAGE_SIZE = 30; //聊天列表每次请求的条数
const SHOW_MSG_LIMIT = 500; //列表保留数据
create(store, {

  /**
   * 页面的初始数据
   */
  data: {
   isShow:true,
    // userInfo:{},
    liveId: "",
    socialRoomId: "",
    chatList:[],
    chatListMoreStatus:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      liveId: options.liveId,
      socialRoomId: options.socialRoomId
    })
    utils.setEnvConfig(1);
    Promise.all([utils.post(`social/socialRoom/${options.socialRoomId}`), utils.get(`liveFlow/getHLSPlayURL/${options.liveId}`)]).then(values => {
      this.data.socialInfo = values[0];
      this.data.liveInfo = values[1];
      this._initData();
      this.setData({
        socialInfo: values[0],
        liveInfo: values[1],
      },()=>{
        this._init();
      });
    })
  },

  changeData() {
    this.store.data.userInfo.age = Math.random();
    this.update();
  },

  //初始化静态数据
  _initData() {
    this._historySort = "desc";
  },
  // 初始化
  _init() {
    let socialInfo = this.data.socialInfo;
    let liveInfo = this.data.liveInfo;
    //初始化IM
    IM.login({
      userID: socialInfo.jgInit.userId,
      userSig: socialInfo.jgInit.signature,
      groupID: socialInfo.jgChatRoomId,
      userRole: socialInfo.role,
      errors: {
        liveId: this.liveId
      }
    });
    this.getChatHistoryList();
  },
  //讨论区滚动到底部
  onChatScrollToLower(){

  },
  //讨论区滚动到顶部
  onChatScrollToUpper(){

  },
  //获取聊天列表
  getChatHistoryList() {
    return utils.get(`social/getHistoryMsg/${this.data.socialRoomId}?sort=${this._historySort}&limit=${CHAT_PAGE_SIZE}&page=1&time=${new Date().getTime()}`).then((res) => {
      let historyChatList = res.msg.data.filter(this._filterAndTransformChat);
      let chatList = [];
      if (this._historySort == 'desc') {
         //降序（上一页）
         if (res.msg.data.length) {

         }else{

         }
      }
    })
  },
  //过滤item选项
  _filterAndTransformChat(item) {
    console.log("this.liveInfo",this.liveInfo)
    let flag = true;
    let tagObj = this._getTags(item.userRole, item.subRole, item.tag);
    let role = this._getRoles(item.userRole, item.subRole);
    let transformRole = role.isGuest || role.isNormal ? 1 : 2;
    item.tagArr = tagObj.arr;
    item = this.getDynamicName(item);
    item.dynamicName = this.liveInfo.isHideUserName ? this.hiddenUserName(item.dynamicName, transformRole) : item.dynamicName; //发送者名称
    if (item.msgType == 22 || item.msgType == 73) {
      //打赏现金和实物
      if (this.socialInfo.showReward == 0) {
        //关闭
        flag = false;
      } else if (this.socialInfo.showReward == 2) {
        if (this.roles.isTeacher || this.roles.isAdmin) {
          flag = true;
        } else if (item.jiguangUserName != this.socialInfo.jiguangUserName) {
          flag = false;
        }
      }
    } else if (item.msgType == 74 || item.msgType == 75) {
      //已经购买的消息、正在购买的消息（后台开关控制是否显示）
      if (this.socialInfo.showBuyGoods == 0) {
        //对所有人不可见
        flag = false;
      } else if (this.socialInfo.showBuyGoods == 2) {
        //对讲师、管理员和购买者可见
        if (this.roles.isTeacher || this.roles.isAdmin) {
          flag = true;
        } else if (item.jiguangUserName != this.socialInfo.jiguangUserName) {
          flag = false;
        }
      }
    } else if (item.msgType == 1) {
      //发送文字
      item.content = this._sensitiveWordFilter(item.content);
    } else if (item.msgType == 3) {
      //独立直播间没有语音ppt直播 所以不记录是否播放的红点，所有的语音一发送就是已读状态
      item.voiceStatus = 1;
    }
    return flag;
  },
  /**
   * 将任意名称转成除第一个字符以外全部替换成* 比如老鹰抓小鸡=>老**
   * @param {昵称} name 
   * @returns 
   */
  hiddenUserName(name = '',role = 1){
    if(role != 1){
      return name;
    }
    let str = name.replace(/^(.{3})(.+)/,'$1***');
    return str;
  },
  _getTags: function (userRole, subRole, tagStr) {
    //讲师和嘉宾显示的是标签的内容 管理员显示的是管字
    let arr = [];
    let tag = ''; //管理员显示的是管
    if (userRole == 6) {
      //(讲师||嘉宾）&& 管理员
      // arr.push({ userRole: 4, text: '管', className: 'role-admin' });
      if (subRole == 1) {
        //嘉宾+管理员
        arr.push({
          userRole: 2,
          text: tagStr || '管理员/嘉宾',
          className: 'role-guest'
        });
      } else {
        //讲师+管理员
        arr.push({
          userRole: 2,
          text: tagStr || '讲师',
          className: 'role-teacher'
        });
      }
      tag = tagStr;
    } else if (userRole == 4) {
      //管理员
      arr.push({
        userRole: 4,
        text: '管',
        className: 'role-admin'
      });
      tag = '管';
    } else if (userRole == 2) {
      //讲师 || 嘉宾
      if (subRole == 1) {
        arr.push({
          userRole: 2,
          text: tagStr || '嘉宾',
          className: 'role-guest'
        });
      } else {
        arr.push({
          userRole: 2,
          text: tagStr || '讲师',
          className: 'role-teacher'
        });
      }
      tag = tagStr;
    } else {
      tag = tagStr;
    }
    return {
      tag: tag,
      arr: arr
    };
  },
  /**
   * @description:获取dynamicName（依赖注入）
   * @param {Array} teacherAndAdminKey  讲师和管理员的jiguangUserName集合
   */
  getDynamicName(data, roles = this.roles, isShowRealName = this.liveInfo.isShowRealName) {
    if (Object.prototype.toString.call(data) == '[object Object]') {
      if (roles.isAdmin || roles.isTeacher) {
        if (isShowRealName) {
          data.dynamicName = data.userRealName || data.realName || data.userName;
        } else {
          data.dynamicName = data.realName || data.userName;
        }
      } else {
        data.dynamicName = data.realName || data.userName;
      }
    }
    return data;
  },
  //获取角色
  _getRoles(role, subRole) {
    let res = {
      isTeacher: false,
      isAdmin: false,
      isGuest: false,
      isNormal: false
    };
    if (role == 2) {
      if (subRole == 1) {
        res.isGuest = true;
      } else {
        res.isTeacher = true;
      }
    } else if (role == 4) {
      res.isAdmin = true;
    } else if (role == 6) {
      res.isAdmin = true;
      if (subRole == 1) {
        res.isGuest = true;
      } else {
        res.isTeacher = true;
      }
    } else {
      res.isNormal = true;
    }
    // console.log("_getRoles", res);
    return res;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})