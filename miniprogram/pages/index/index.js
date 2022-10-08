var plugin = requirePlugin("live-room");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow1:false,
    isShow2:false
  },

  show1(){
    this.setData({
      isShow1:true
    })
  },
  show2(){
    this.setData({
      isShow2:true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // wx.setStorage({
    //   key: 'test',
    //   data: "666"
    // })
    // wx.setStorage({
    //   key: 'ckPluginToken',
    //   data: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2twYXBpLWNzLmNranIwMDEuY29tL2FwaS9hcHBsZXRMaXZlVmlkZW8vc2hvdy8xNzY5MSIsImlhdCI6MTY2NDUxOTI1NywiZXhwIjoxNjY3MTExMjU3LCJuYmYiOjE2NjQ1MTkyNTcsImp0aSI6IkVmRjNrd2xCV2VkWk5vYloiLCJzdWIiOm51bGwsInJmdCI6MTY2NTE5MjIzNiwidWlkIjoiMTQzMTE5OTU3ODc4MDg4OTA4OSIsImN2IjoxMDAsImMiOiJsajdsIiwidXR5IjoyLCJhaWQiOiIxNDMxMTk5NTc4NzgwODg5MDg5IiwiY2lkIjoiMTQyMDYyNzE1NTU2NTQ1MzMxMyIsInUiOiJsNGs5d3d6aiIsImEiOjEsInAiOm51bGwsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEiLCJzeXMiOiJxeW54IiwiYXVpIjoxMDAwMCwiYiI6ImxlY3R1cmVyIiwiYXBwSWQiOiIxNDIwNjI3MTU1NTY1NDUzMzEzIiwibG9naW5Vc2VyVHlwZSI6Mn0.vSEdw-80-TSMGH7zMt-CFrPBoDhgQK7MrrnG75n-0NI",
    //   success: () => {
    //     console.log("ckPluginToken",wx.getStorageSync('ckPluginToken'),wx.getStorageSync('test'))
    //     wx.redirectTo({
    //       url: `plugin://live-room/live-room?liveId=${options.liveId}&socialRoomId=${options.socialRoomId}`,
    //     })
    //   }
    // })

   
    // plugin.setStorage("ckPluginToken","eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2twYXBpLWNzLmNranIwMDEuY29tL2FwaS9hcHBsZXRMaXZlVmlkZW8vc2hvdy8xNzY5MSIsImlhdCI6MTY2NDUyMTI1NCwiZXhwIjoxNjY3MTEzMjU0LCJuYmYiOjE2NjQ1MjEyNTQsImp0aSI6ImRNczdaZ093R0FwODNCRDAiLCJzdWIiOm51bGwsImMiOiJsajdsIiwidSI6Imw0azl3d3pqIiwiYSI6MSwicCI6bnVsbCwicmZ0IjoxNjY1MTkyMjM2LCJ1aWQiOiIxNDMxMTk5NTc4NzgwODg5MDg5IiwiY3YiOjEwMCwidXR5IjoyLCJhaWQiOiIxNDMxMTk5NTc4NzgwODg5MDg5IiwiY2lkIjoiMTQyMDYyNzE1NTU2NTQ1MzMxMyIsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEiLCJzeXMiOiJxeW54IiwiYXVpIjoxMDAwMCwiYiI6ImxlY3R1cmVyIiwiYXBwSWQiOiIxNDIwNjI3MTU1NTY1NDUzMzEzIiwibG9naW5Vc2VyVHlwZSI6Mn0.7iTCVo6gAM_LaDSYP8FqzeIS0ImdWWX7pAGs5HPWIgM").then(()=>{
    //   wx.redirectTo({
    //     url: `plugin://live-room/live-room?liveId=${options.liveId}&socialRoomId=${options.socialRoomId}`,
    //   })
    // })
  },

  open(){
    console.log("open")
  },
  opened(){
    console.log("opend")
  },
  close(){
    console.log("close")
  },
  closed(){
    console.log("closed")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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