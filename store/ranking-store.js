import { HYEventStore } from "hy-event-store";

import { getRanking } from "../service/api_music";

const rankingMap = {0: "newRanking", 1: "hotRanking", 2: "originRanking", 3: "upRanking",}

const rankingStore = new HYEventStore({
  state: {
    newRanking: {},
    hotRanking: {},
    originRanking: {},
    upRanking: {}
  },
  actions: {
    getRankingDataAction(ctx) {
      for (let i = 0; i < 4; i++) {
        getRanking(i).then(res => {
          const rankingName = rankingMap[i]
          ctx[rankingName] = res.playlist
        })
      }
    }
  }
})

export {rankingStore, rankingMap}