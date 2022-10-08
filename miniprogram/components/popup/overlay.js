let overlayStock = [];
let overlayZIndex = 1000;
module.exports = Behavior({
  properties: {
    
  },
  data: {
   overlay:true
  },
  attached: function () {

  },
  methods: {
    pushStack(val) {
      let keyId = val.__wxWebviewId__ + "_" + val.__wxExparserNodeId__;
      let index = overlayStock.findIndex(item => item.keyId == keyId);
      let item ={};
      if (index == -1) {
        if(val.data.zIndex){
          item={
            keyId:keyId,
            zIndex:val.data.zIndex
          }
        }else{
          overlayZIndex+=2;
          item={
            keyId:keyId,
            zIndex:overlayZIndex
          }
        }
        console.log(val.data)
      }else{
        overlayZIndex+=2;
        overlayStock=overlayStock.filter(item=>item.keyId !=keyId);
        item={
          keyId:keyId,
          zIndex:overlayZIndex
        }
      }
      overlayStock.push(item);
      console.log(overlayStock);
    },
    popStack(val){
      let keyId = val.__wxWebviewId__ + "_" + val.__wxExparserNodeId__;
      overlayStock=overlayStock.filter(item=>item.keyId !=keyId);
      console.log(overlayStock);
    },
    getZindex(){
      return overlayZIndex
    }
  }
})