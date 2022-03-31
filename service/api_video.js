import mcRequest from "./index";

export function getTopMV(offset, limit = 10) {
    return mcRequest.get("/top/mv", {
        offset,
        limit
    })
}

export function getMVURL(id) {
    return mcRequest.get("/mv/url", {
        id
    })
}

export function getMVDetail(mvid) {
    return mcRequest.get("/mv/detail", {
        mvid
    })
}

export function getRelatedMV(id) {
    return mcRequest.get("/related/allvideo", {
        id
    })
}