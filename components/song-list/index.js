// components/song-list/song-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      default: "默认标题"
    },
    songList: {
      type: Array,
      default: []
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
    handleListItemClick(event) {
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/packageDetail/pages/detail-songs/index?id=${item.id}&type=list`
      })
    }
  }
})
