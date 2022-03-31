// pages/home-video/index.js
import {getTopMV} from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // getTopMV(0, 10).then(res => {
    //   console.log(res);
    //   this.setData({topMVs: res.data})
    // })
    this.getTopMVData(0)
  },

  //封装网络请求
  getTopMVData(offset) {
    if (!this.data.hasMore && offset !== 0)
      return
    wx.showNavigationBarLoading()

    getTopMV(offset).then(res => {
      wx.hideNavigationBarLoading()
      if (offset === 0) {
        // console.log('stop');
        wx.stopPullDownRefresh()
        this.setData({ topMVs: res.data })
      } else {
        this.setData({topMVs: this.data.topMVs.concat(res.data) })
      }
      this.setData({ hasMore: res.hasMore })
    })
  },

  //点击视频
  videoItemClick(event) {
    const id = event.currentTarget.dataset.item.id
    //页面跳转
    wx.navigateTo({
      url: '../detail-video/index?id=' + id
    })
  },

    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getTopMVData(this.data.topMVs.length)
  },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getTopMVData(0)
  }

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady() {

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow() {

  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide() {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload() {

  // },





  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage() {

  // }
})