import { getMVURL } from '../../../service/api_video'
import { getMVDetail } from '../../../service/api_video'
import { getRelatedMV } from '../../../service/api_video'

Page({
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedMV: []

  },

  onLoad(options) {
    const id = options.id
    this.getPageInfo(id)

  },

  //封装获取数据
  getPageInfo(id) {
    getMVURL(id).then(res => {
      this.setData({ mvURLInfo: res.data })
    })

    getMVDetail(id).then(res => {
      this.setData({ mvDetail: res.data })
    })

    getRelatedMV(id).then(res => {
      this.setData({ relatedMV: res.data })
    })
  }

})