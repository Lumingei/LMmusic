import { playerStore } from "../../store/index" 
Component({
  properties: {
    index: {
      type: Number,
      default: 0
    },
    itemInfo: {
      type: Object,
      default: {}
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
        url: '/packagePlayer/pages/music-player/index?id=' + id,
      })
      playerStore.dispatch("playMusicWithIdAction", { id })
    }
  }
})
