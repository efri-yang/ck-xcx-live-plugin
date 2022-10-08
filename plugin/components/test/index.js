import create from '../../utils/create'
create({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:{
      type:Boolean,
      value:false
    },
    // age:{
    //   type: Number,
    //   value:0
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeData(){
      this.store.data.userInfo.age=Math.random();
      this.update()
    }
  }
})
