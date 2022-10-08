Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['class-nodata'],
  options: {
    multipleSlots: true
  },
  properties: {
    status: {
      type: String,
      value: ''
    },
    isUseNoDataSlot: {
      type: Boolean,
      value: false
    },
    endTipText: {
      type: String,
      value: ''
    },
    noDataText: {
      type: String,
      value: '空空如也，这里什么也没有'
    }
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

  }
})
