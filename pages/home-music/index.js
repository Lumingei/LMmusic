import { getBanners,getSongList } from '../../service/api_music'
import { queryRect } from '../../utils/query_rect'
import { throttle } from '../../utils/throttle'

import { rankingStore, rankingMap, playerStore } from '../../store/index'

const throttleQueryRect = throttle(queryRect, 1000)

Page({

  data: {
    banners: [],
    swiperHeight: 0,
    recommend: [],
    hotList: [],
    recommendList: [],
    rankings: { 0: {}, 1: {}, 2: {}, 3: {} },
    
    currentSong: {},
    isPlaying: false,
    playAnimState: "paused",

    playList: [],
    isShowPopup: false,


  },
  onLoad(options) {
    playerStore.dispatch("playMusicWithIdAction", { id: 1842025914 })

    this.getPageData()

    rankingStore.dispatch("getRankingDataAction")

    this.setupPlayerStoreListener()
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

  //事件处理
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
    const idx = event.currentTarget.dataset.idx
    const name = rankingMap[idx]
    this.navigateToSongs(name)
  },

  //获取播放列表和索引
  handleItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playList", this.data.recommend)
    playerStore.setState("playListIndex", index)
    // console.log(index);
  },

  handlePlayBtnClick(event) {
    playerStore.dispatch("changePlayStateAction", !this.data.isPlaying)

  },

  handlePlayBarClick() {
    wx.navigateTo({
      url: "/pages/music-player/index?id=" + this.data.currentSong.id
    })
  },

  //歌曲列表展示
  handleMusicListClick() {
    this.setData({isShowPopup: true})
  },

  //关闭弹出层
  closePopup() {
    this.setData({isShowPopup: false})
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
  },

  setupPlayerStoreListener() {
    // 排行榜数据监听
    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return
      const recommend = res.tracks.slice(0, 6)
      this.setData({recommend})
    })

    rankingStore.onState("newRanking", this.rankingHandle(0))
    rankingStore.onState("hotRanking", this.rankingHandle(1))
    rankingStore.onState("originRanking", this.rankingHandle(2))
    rankingStore.onState("upRanking", this.rankingHandle(3))

    //播放数据监听
    playerStore.onStates(["currentSong", "isPlaying", "playList"], ({currentSong, isPlaying, playList}) => {
      if (currentSong) {
        this.setData({ currentSong })
      }
      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying, 
          playAnimState: isPlaying ? "running": "paused" 
        })
      }
      if (playList) {
        this.setData({ playList })
      }
    })

  }

  

})