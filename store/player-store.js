import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from "../service/api_player"
import { parseLyric } from "../utils/parse-lyric"

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricData: [],

    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: 0,

    playModeIndex: 0,
    playList: [],
    playListIndex: 0,

    isPlaying: false,
    isStoping: false
  },

  actions: {
    playMusicWithIdAction(ctx, { id, isRefresh = false }) {
      // 暂停后退出，重新进入可以继续播放
      if (ctx.id === id && !isRefresh) {
        this.dispatch("changePlayStateAction", true)
        return
      }

      ctx.id = id
      
      //修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricData = []

      ctx.currentTime = 0
      ctx.currentLyricText = ""
      ctx.currentLyricIndex = 0

      //歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
  
      //歌词信息
      getSongLyric(id).then(res => {
        const songLyric = res.lrc.lyric
        const lyricData = parseLyric(songLyric)
        ctx.lyricData = lyricData
      })

      // 播放歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      audioContext.title = id

      //监听AudioContect事件
      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextAction")
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextAction(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
      }) 
      // 监听时间改变
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000;
        // if (!this.data.isSliderChanging) {
        //   this.setData({ currentTime })
        //   const sliderValue = currentTime / this.data.durationTime * 100
        //   this.setData({sliderValue})
        // }
        ctx.currentTime = currentTime
        // 查找歌词
        if(!ctx.lyricData.length) return
        let  i = 0
        for (; i < ctx.lyricData.length; i++) {
          const lyricInfo = ctx.lyricData[i]
          if (currentTime < lyricInfo.timeFin) {
            break
          }
        }
        //设置歌词索引和内容文本
        const currentLyricIndex = i - 1
        if (ctx.currentLyricIndex !== currentLyricIndex) {
          const currentLyric = ctx.lyricData[currentLyricIndex]
          // console.log(currentLyric.textFin);
          // this.setData({ currentLyricText: currentLyric.textFin })
          // this.setData({currentLyricIndex,lyricScrollTop: currentLyricIndex * 35})
          ctx.currentLyricText = currentLyric.textFin
          ctx.currentLyricIndex = currentLyricIndex
        }
      })
      audioContext.onEnded(() => {
        this.dispatch("changeMusicAction")
      })
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },

    changePlayStateAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        ctx.isStoping = false
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.title = currentSong.name
      }
      if (ctx.isPlaying) {
        audioContext.play()
      } else {
        audioContext.pause()
      }
    },

    changeMusicAction(ctx, isNext = true) {
      // 1.获取当前索引
      let index = ctx.playListIndex

      // 2.根据不同的播放模式, 获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1: index -1
          if (index === -1) index = ctx.playList.length - 1
          if (index === ctx.playList.length) index = 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playList.length)
          break
      }

      console.log(index)

      // 3.获取歌曲
      let currentSong = ctx.playList[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 记录最新的索引
        ctx.playListIndex = index
      }

      // 4.播放新的歌曲
      this.dispatch("playMusicWithIdAction", { id: currentSong.id, isRefresh: true })
    }

  }
})

export {audioContext, playerStore}