import { getSongDetail, getSongLyric } from "../../../service/api_player"
import { parseLyric } from "../../../utils/parse-lyric"
import { audioContext, playerStore } from "../../../store/index"

const playModeNames = ['order', 'repeat', 'random']

Page({
  data: {
    id: 0,

    currentSong: {},
    durationTime: 0,
    lyricData: [],

    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: 0,

    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,

    lyricScrollTop: 0,
    sliderValue: 0,
    isSliderChanging: false,

    playModeIndex: 0,
    playModeName: 'order',

    playList: [],
    isShowPopup: false,

    isPlaying: false,
    isPlayingName: 'pause'
  },

  //页面加载
  onLoad(options) {
    const id = options.id
    this.setData({id})
    // this.getPageData(id)
    this.setupPlayerStoreListener()
    //计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    const heiWidRatio = globalData.heiWidRatio
    this.setData({isMusicLyric: heiWidRatio >= 2})
    this.setData({ contentHeight })
    
    // 使用播放器
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    
    //this.setAudioText()
  },

  // 网络请求
  // getPageData(id) {
    // getSongDetail(id).then(res => {
    //   this.setData({ currentSong: res.songs[0] })
    //   this.setData({ durationTime: res.songs[0].dt })
    // })

    // getSongLyric(id).then(res => {
    //   const songLyric = res.lrc.lyric
    //   const lyricData = parseLyric(songLyric)
    //   this.setData({lyricData})
    // })
  // },

  // 音频监听
  //setAudioText() {
    // audioContext.onCanplay(() => {
    //   audioContext.play()
    // }) 
    // // 监听时间改变
    // audioContext.onTimeUpdate(() => {
    //   const currentTime = audioContext.currentTime * 1000;
    //   if (!this.data.isSliderChanging) {
    //     this.setData({ currentTime })
    //     const sliderValue = currentTime / this.data.durationTime * 100
    //     this.setData({sliderValue})
    //   }
    //   // 查找歌词
    //   if(!this.data.lyricData.length) return
    //   let  i = 0
    //   for (; i < this.data.lyricData.length; i++) {
    //     const lyricInfo = this.data.lyricData[i]
    //     if (currentTime < lyricInfo.timeFin) {
    //       break
    //     }
    //   }
    //   //设置歌词索引和内容文本
    //   const currentLyricIndex = i - 1
    //   if (this.data.currentLyricIndex !== currentLyricIndex) {
    //     const currentLyric = this.data.lyricData[currentLyricIndex]
    //     // console.log(currentLyric.textFin);
    //     this.setData({ currentLyricText: currentLyric.textFin })
    //     this.setData({currentLyricIndex,lyricScrollTop: currentLyricIndex * 35})
    //   }
    //  })
  //},

  // 事件处理
  //轮播图变化
  handleSwiperChange(event) {
    const currentPage = event.detail.current
    this.setData({currentPage})
  },

  //事件监听 
  //进度条点击
  handleSliderChange(event) {
    const sliderValue = event.detail.value
    const currentTime = this.data.durationTime * sliderValue / 100
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    // this.setData({ currentTime })
    this.setData({ sliderValue })
    this.setData({ isSliderChanging: false })
  },

  //进度条拖拽
  handleSliderChanging(event) {
    const sliderValue = event.detail.value
    const currentTime = this.data.durationTime * sliderValue / 100
    this.setData({ isSliderChanging: true, currentTime })
  },

  //返回处理
  handleBackClick() {
    // console.log('click');
    wx.navigateBack()
  },

  //模式切换
  handleModeClick() {
    let playModeIndex = (this.data.playModeIndex + 1) % 3
    playerStore.setState("playModeIndex", playModeIndex)
  },

  //播放状态切换
  handlePlayClick() {
    playerStore.dispatch("changePlayStateAction", !this.data.isPlaying)
  },

  handlePrevMusic() {
    playerStore.dispatch("changeMusicAction", false)
  },

  handleNextMusic() {
    playerStore.dispatch("changeMusicAction")
  },

  //歌曲列表展示
  handleMusicListClick() {
    this.setData({isShowPopup: true})
  },

  //关闭弹出层
  closePopup() {
    this.setData({isShowPopup: false})
  },

  //数据监听
  setupPlayerStoreListener() {
    playerStore.onStates(["currentSong", "durationTime", "lyricData"], ({
      currentSong,
      durationTime,
      lyricData
    }) => {
      if(currentSong) this.setData({currentSong})
      if(durationTime) this.setData({durationTime})
      if(lyricData) this.setData({lyricData})
    })

    playerStore.onStates(["currentTime", "currentLyricText", "currentLyricIndex"], ({
      currentTime,
      currentLyricText,
      currentLyricIndex
    }) => {
      //时间变化
      if (currentTime && !this.data.isSliderChanging) { 
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({currentTime, sliderValue})
      } 
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({currentLyricIndex, lyricScrollTop: currentLyricIndex * 35})
      } 

      if (currentLyricText) {
        this.setData({currentLyricText})
      } 
    })

    playerStore.onStates(["playModeIndex", "isPlaying", "playList"], ({ playModeIndex, isPlaying, playList }) => {
      if (playModeIndex !== undefined) {
        this.setData({
        playModeIndex,
        playList,
        playModeName: playModeNames[playModeIndex]
      })}
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          isPlayingName: isPlaying ? 'pause' : 'resume'
        })
      }
    })
  }

})