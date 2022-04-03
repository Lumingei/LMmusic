import { playerStore } from "../../store/index"
Component({
  properties: {
    itemInfo: {
      type: Object
    }
  },

  data: {

  },

  methods: {
    handleItemClick(event) {
      const id = event.currentTarget.dataset.id
      // 告知外面歌曲被点击
      this.triggerEvent("click")
      // 跳到播放页
      wx.navigateTo({
        url: '/pages/music-player/index?id=' + id,
      })

      //网络请求数据
      playerStore.dispatch("playMusicWithIdAction", { id })
    }
  }
})
