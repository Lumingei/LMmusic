import { getBanners,getSongList } from '../../service/api_music'
import { queryRect } from '../../utils/query_rect'
import { throttle } from '../../utils/throttle'

import { rankingStore, rankingMap } from '../../store/index'

const throttleQueryRect = throttle(queryRect, 1000)

Page({

  data: {
    banners: [],
    swiperHeight: 0,
    recommend: [],
    hotList: [],
    recommendList: [],
    recommendSongs: [],
    rankings: {0: {}, 1: {}, 2: {}, 3: {}}
  },
  onLoad(options) {
    this.getPageData()

    rankingStore.dispatch("getRankingDataAction")

    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return
      const recommend = res.tracks.slice(0, 6)
      this.setData({recommend})
    })

    rankingStore.onState("newRanking", this.rankingHandle(0))
    rankingStore.onState("hotRanking", this.rankingHandle(1))
    rankingStore.onState("originRanking", this.rankingHandle(2))
    rankingStore.onState("upRanking", this.rankingHandle(3))

  },

  //网络请求
  getPageData() {
    getBanners().then(res => {
      this.setData({banners: res.banners})
    })

    getSongList().then(res => {
      this.setData({hotList: res.playlists})
    })

    getSongList('华语').then(res => {
      this.setData({recommendList: res.playlists})
    })
  },

  //实践处理
  handleImageLoad() {
    throttleQueryRect('.swiper-image').then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height })
    })
  },

  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index'
    })
  },

  handleMoreClick() {
    this.navigateToSongs("hotRanking")
  },

  handleRankingClick(event) {
    // console.log('click');
    const idx = event.currentTarget.dataset.idx;
    const name = rankingMap[idx]
    this.navigateToSongs(name)
  },

  navigateToSongs(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?rankingName=${rankingName}&type=rank`
    })
  },

  onUnload() {
    // rankingStore.offState("newRanking",this.newRankingHandler)
  },

  rankingHandle(idx) {
    return (res) => {
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const songList = res.tracks.slice(0, 3)
      const playCount = res.playCount
      const rankingObj = { name, coverImgUrl, songList, playCount }
      const newRankings = { ...this.data.rankings, [idx]: rankingObj }
      this.setData({rankings: newRankings})
    }
  }

})