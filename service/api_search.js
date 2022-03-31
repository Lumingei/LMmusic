import mcRequest from "./index";

export function getHotSearch() {
  return mcRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return mcRequest.get("/search/suggest", {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(keywords) {
  return mcRequest.get("/search", {
    keywords
  })
}