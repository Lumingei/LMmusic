import { rankingStore } from '../../store/index'
import { getSongListDetail } from'../../service/api_music'

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

  onUnload() {
    if(this.data.rankingName)
      rankingStore.offState(this.data.rankingName, this.getRankingDataHandler)
  },

  getRankingDataHandler(res) {
    this.setData({songInfo: res})
  }

})