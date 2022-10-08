// pages/live-room/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoTotalTime: 0,
    videoCurrentTime:0,
    videoProgressPercent:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this._videoCtx = null;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this._videoCtx = wx.createVideoContext("J_video", this)
    console.log(this._videoCtx)
  },

  fullScreen() {
    console.log("fullscreen")
    this._videoCtx.requestFullScreen({
      direction: 90
    })
  },

  bindloadedmetadata(e) {
    console.log(e);
    this.setData({
      videoTotalTime: (e.detail.duration / 60).toFixed(2)
    })
  },
  bindprogress(e) {
    console.log(e);
  },
  bindtimeupdate(e) {
    // console.log(e);
    this.setData({
      videoCurrentTime: this._transformVideoTime(Math.floor(e.detail.currentTime)),
      videoProgressPercent:e.detail.currentTime/ this.data.videoTotalTime
    })
  },

  _transformVideoTime(time) {

    const SECOND = 1;
    const MINUTE = 1 * 60 * SECOND;
    const HOURS = 1 * 60 * MINUTE;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let resStr = '';
    hour = Math.floor(time / HOURS);
    minute = Math.floor((time - hour * HOURS) / MINUTE);
    second = Math.floor(time - hour * HOURS - minute * MINUTE);
    minute = minute > 9 ? minute : ('0' + minute);
    second = second > 9 ? second : ('0' + second);
    resStr = minute + ':' + second;
    if (hour) {
      resStr = hour + ':' + resStr;
    }

    return resStr;
  },


  exitFullScreen() {
    this._videoCtx.exitFullScreen();
  },
  pause() {
    this._videoCtx.pause();
  },
  play() {
    this._videoCtx.play()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})