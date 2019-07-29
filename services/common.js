import { requestData } from '../utils/wxInfo'

/**
 * 基础信息/喜马
 * ?albumId=16556782
 * @param {*} param0 
 */
const index = ({ params = {}, header = {} }) => {
    return new Promise((resolve, reject) => {
        requestData({
            url: `https://www.ximalaya.com/revision/album`,
            header,
            // method: 'POST',
            data: params,
            success(res) {
                resolve(res.data)
            }
        })
    })
}

/**
 * 列表信息/喜马
 * ?albumId=16556782&pageSize=600&pageNum=1
 * @param {*} param0 
 */
const list = ({ params = {}, header = {} }) => {
    return new Promise((resolve, reject) => {
        requestData({
            url: `https://www.ximalaya.com/revision/album/v1/getTracksList`,
            header,
            // method: 'POST',
            data: params,
            success(res) {
                resolve(res.data)
            }
        })
    })
}

/**
 * 基础信息/懒人
 * ?id=69288
 * @param {*} param0 
 */
const albumInfo = ({ params = {}, header = {} }) => {
    return new Promise((resolve, reject) => {
        requestData({
            url: `https://m.lrts.me/ajax/getAlbumInfo`,
            header,
            // method: 'POST',
            data: params,
            success(res) {
                resolve(res.data)
            }
        })
    })
}

/**
 * 基础信息/懒人
 * ?id=69288
 * @param {*} param0 
 */
const bookInfo = ({ params = {}, header = {} }) => {
    return new Promise((resolve, reject) => {
        requestData({
            url: `https://m.lrts.me/ajax/getBookInfo`,
            header,
            // method: 'POST',
            data: params,
            success(res) {
                resolve(res.data)
            }
        })
    })
}


module.exports = {
    index,
    list,
    albumInfo,
    bookInfo,
}