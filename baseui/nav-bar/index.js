Component({
  options: {
    multipleSlots: true
  },
  properties: {
    centerTitle: {
      type: "",
      value: "默认标题"
    }
  },


  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    navBarHeight: getApp().globalData.navBarHeight
  },

  //组件生命周期
  lifetimes: {

  },

  methods: {
    handleLeftClick() {
      this.triggerEvent('click')
    }
  }
})
