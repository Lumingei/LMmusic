import { rankingStore, playerStore } from '../../../store/index'
import { getSongListDetail } from'../../../service/api_music'

Page({
  data: {
    rankingName: "",
    songInfo: {},
    type: ""
  },

  onLoad(options) {
    const type = options.type
    this.setData({type})
    if (type === 'list') {
      const id = options.id
      getSongListDetail(id).then(res => {
        this.setData({songInfo: res.playlist})
      })
      
    } else if (type === 'rank') {
      const rankingName = options.rankingName
      this.setData({rankingName})
  
      rankingStore.onState(rankingName, this.getRankingDataHandler)
      }
  },
  //获取播放列表和索引
  handleItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playList", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)

  },

  onUnload() {
    if(this.data.rankingName)
      rankingStore.offState(this.data.rankingName, this.getRankingDataHandler)
  },

  getRankingDataHandler(res) {
    this.setData({songInfo: res})
  }

})