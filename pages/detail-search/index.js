import { getHotSearch, getSearchSuggest, getSearchResult } from "../../service/api_search"
import { debounce } from "../../utils/debounce"
import { stringToNodes } from "../../utils/string_nodes"

const debounceGetSearchSuggest = debounce(getSearchSuggest, 200)

Page({
  data: {
    hotWords: [],
    suggestSongs: [],
    suggestSongsNodes:[],
    searchValue: "",
    searchResult: []
  },
  onLoad(options) {
    this.getPageData()
  },

  //网络请求
  getPageData() {
    getHotSearch().then(res => {
      this.setData({hotWords: res.result.hots})
    })
  },

  //事件处理
  handleSearchEvent(event) {
    //输入字符
    const searchValue = event.detail
    //输入字符为空
    if (!searchValue.length) {
      this.setData({ suggestSongs: [], searchValue: "" , searchResult: []})
      debounceGetSearchSuggest.cancel()
      return
    }
    this.setData({ searchValue })
    
    // 防抖处理
    debounceGetSearchSuggest(searchValue).then(res => {
      // if (!this.data.searchValue.length) {
      //   return
      // }
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if (!suggestSongs) return
      
      const suggestKeyWords = suggestSongs.map(item => item.keyword)

      const suggestSongsNodes = stringToNodes(suggestKeyWords, searchValue)
      this.setData({suggestSongsNodes})
    })
  },

  handleSearchAction() {
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      if(res.result.songs)
        this.setData({searchResult: res.result.songs})
    })
  },

  suggestItemClick(event) {
    const index = event.currentTarget.dataset.index
    const keyword = this.data.suggestSongs[index].keyword
    this.setData({ searchValue: keyword })
    this.handleSearchAction()
  },

  tagClick(event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({ searchValue: keyword })
    this.handleSearchAction()
  }
})