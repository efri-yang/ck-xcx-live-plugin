export default {
  data: {
    liveRoom:{
     
    },
    userInfo: {
      username:"yyh",
      age:24
    } //更改我会刷新所有页面,不需要再组件和页面声明data依赖
  },
  globalData: ['userInfo'],
  //默认 false，为 true 会无脑更新所有实例
  //updateAll: true
}