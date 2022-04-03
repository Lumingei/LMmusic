//[01:26.41]
const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(string) {
  const lyricInfos = []
  const lyricGro = string.split('\n')
  for (let lyric of lyricGro) {
    //获取时间
    const time = timeReg.exec(lyric)
    if(!time) continue
    const minute = time[1] * 60 * 1000
    const second = time[2] * 1000
    const millisecondCopy = time[3]
    const millisecond = millisecondCopy.length === 2 ? millisecondCopy * 10 : millisecondCopy * 1
    const timeFin = minute + second + millisecond

    // 获s取歌词文本
    // const text = lyric.replace(time[0], "")
    const textFin = lyric.replace(timeReg, "")
    const lyricInfo = { timeFin, textFin }
    lyricInfos.push(lyricInfo)
  }
  return lyricInfos
}