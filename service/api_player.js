import mcRequest from './index'

export function getSongDetail(ids) {
  return mcRequest.get("/song/detail", {
    ids
  })
}

export function getSongLyric(id) {
  return mcRequest.get("/lyric", {
    id
  })
}

