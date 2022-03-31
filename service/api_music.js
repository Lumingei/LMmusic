import mcRequest from './index'

export function getBanners() {
  return mcRequest.get("/banner", {
    type: 2
  })
}

export function getRanking(idx) {
  return mcRequest.get("/top/list", {
    idx
  })
}

export function getSongList(cat = '全部', limit = 6, offset = 0) {
  return mcRequest.get("/top/playlist", {
    cat,limit,offset
  })
}

export function getSongListDetail(id) {
  return mcRequest.get("/playlist/detail/dynamic", {
    id
  })
}