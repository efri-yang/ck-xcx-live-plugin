let overlay = require('overlay');
Component({
  behaviors:[overlay],
  externalClasses: ['class-name'],
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:{
      type:Boolean,
      value:true,
      observer:function(newVal,oldVal){
        if(newVal){
          this.animate('.popup', [
            { opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)'},
            { opacity: 1, transform: 'scale3d(1, 1, 1)'}
            ], 5000, function () {
              this.clearAnimation('#container', { opacity: true, rotate: true }, function () {
                console.log("清除了#container上的 opacity 和rotate属性")
              })
          }.bind(this))
        }else{

        }
        // if(newVal){
        //   this.triggerEvent("open");
        //   this.pushStack(this);
        //   let transitionName="";
        //   if(this.data.position=='bottom'){
        //     transitionName="slideInUp";
        //   }else {
        //     transitionName="zoomIn"
        //   }
        //   this.setData({
        //     transitionName:transitionName,
        //     isShowPopup:newVal,
        //     dynamicZIndex:this.getZindex()
        //   });
        // }else{
        //   let transitionName="";
        //   if(this.data.position=='bottom'){
        //     transitionName="slideOutDown";
        //   }else {
        //     transitionName="zoomOut"
        //   }
        //   this.triggerEvent("close");
        //   this.popStack(this);
        //   this.setData({
        //     transitionName:transitionName
        //   });
        // }
      }
    },
    zIndex:{
      type:Number,
      optionalTypes: [String],
      value:0
    },
    closeOnClickOverlay:{
      type:Boolean,
      value:true
    },
    isShowOverlay:{
      type:Boolean,
      value:true
    },
    overlayStyle:{
      type:String,
      value:""
    },
    position:{
      type:String,
      value:"center", //top,bottom,left,right,
      observer:function(val){
        let transitionName ="zoomIn";
        switch(val){
          case 'center':
            transitionName= "zoomIn";
            break;
          case 'bottom':
            transitionName = "slideInUp"; 
        }
        this.setData({
          transitionName:transitionName
        })
      }
    }
  },
  observers:{
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowPopup:false,
    dynamicZIndex:0,
    transitionName:"zoomIn"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      this.setData({
        isShow:false
      })
    },
    onAnimationEnd(){
      console.log("onAnimationEnd",this)
      if(this.data.isShow){
        this.triggerEvent("opened")
      }else{
        this.setData({
          isShowPopup:false
        })
        this.triggerEvent("closed")
      }
    },
    overlayClick(){
      if(this.data.closeOnClickOverlay){
        this.onClose();
      }
    }
  }
})
