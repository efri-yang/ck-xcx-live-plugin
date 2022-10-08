let overlay = require('overlay');
Component({
  behaviors: [overlay],
  externalClasses: ['class-name'],
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: true,
      observer: function (newVal) {
        this._isAniming = true;
        let animArray = this._getAnimArray(this.data.position, newVal);
        if (newVal) {
          this.triggerEvent("open");
          this.pushStack(this);
          this.setData({
            dynamicZIndex: this.getZindex()
          }, () => {
            this.animate('.popup-mask',[
              {opacity:0},
              {opacity:1}
            ], this.data.duration);
            this.animate('.popup', animArray, this.data.duration);
          })
          setTimeout(() => {
            this.triggerEvent("opened");
            this._isAniming = false;
          }, this.data.duration)
        }else{
          this.triggerEvent("close");
          this.popStack(this);
          this._isAniming = false;
        }
      }
    },
    zIndex: {
      type: Number,
      optionalTypes: [String],
      value: 0
    },
    title: {
      type: String,
      value: '提示'
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true
    },
    isShowOverlay: {
      type: Boolean,
      value: true
    },
    isShowCancel: {
      type: Boolean,
      value: false
    },
    isShowConfirm:{
      type: Boolean,
      value: false
    },
    cancelText:{
      type: String,
      value: '取消'
    },
   
    confirmText:{
      type:String,
      value:'确定'
    },
    overlayStyle: {
      type: String,
      value: ""
    },
    duration: {
      type: Number,
      value: 350
    },
    position: {
      type: String,
      value: "center", //top,bottom,left,right,
    }
  },
  observers: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dynamicZIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({
        isShow: false
      })
    },
    onCancel(){
      this.setData({
        isShow: false
      });
      this.triggerEvent("cancel");
    },
    onConfirm(){
      this.triggerEvent("confirm");
    },
    overlayClick() {
      if (this.data.closeOnClickOverlay || !this._isAniming) {
        this.onClose();
      }
    },
    _getAnimArray(type, isShow) {
      let arr: object[] = [];
      switch (type) {
        case 'center':
          if (isShow) {
            arr = [
              { opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' },
              { opacity: 1, transform: 'scale3d(1, 1, 1)' },
              { opacity: 1, transform: 'scale3d(1, 1, 1)' }
            ]
          } else {
            arr = [
              { opacity: 1 },
              { opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' },
              { opacity: 0 }
            ]
          }
          break;
        case 'bottom':
          if (isShow) {
            arr = [
              { opacity: 0,transform: 'translate3d(0, 100%, 0)' },
              { opacity: 1,transform: 'translate3d(0, 0, 0)' },
            ]
          } else {
            arr = [
              { transform: 'translate3d(0, 0, 0)' },
              { transform: 'translate3d(0, 100%, 0)' }
            ]
          }
          break;
      }
      return arr;
    }
  }
})
