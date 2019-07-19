import util from './index'
import services from '../services/index'
import { requestPayment } from './wxInfo'

function getUser(param) {
    let userParam = util.extend(true, {}, param, {
        callback: 'userCallback'
    })
    getApp().globalData.userCallback = function (data) {
        return param.callback && param.callback(data)
    }

    if (param.goBack) {
        userParam.goBack = 'usergoBack';
        getApp().globalData.usergoBack = function (data) {
            param.goBack(data)
        }
    }
    getApp().globalData.userParam = userParam;
    wx.navigateTo({
        url: '/pages/userInfo/userInfo',
    })
}

function getJoin(param) {
    let joinParam = util.extend(true, {}, param, {
        callback: 'joinCallback'
    })
    getApp().globalData.joinCallback = function (data) {
        return param.callback && param.callback(data)
    }

    if (param.goBack) {
        joinParam.goBack = 'joingoBack';
        getApp().globalData.joingoBack = function (data) {
            param.goBack(data)
        }
    }
    getApp().globalData.joinParam = joinParam;
    wx.navigateTo({
        url: `/pages/editorJoin/editorJoin`,
    })
}

function gotoPay(params = {}, cb) {
    services.pay({ params }).then((res) => {
        // const { OrderSerialId, EquipmentSerialIds, PayParams, Code } = res
        if (res.Code == 200) {
            if (res.PayParams) {
                const payData = JSON.parse(res.PayParams)
                const { OrderSerialid, appId, ...other } = payData
                requestPayment(other).then((result) => {
                    return typeof cb === 'function' && cb(result)
                })
            } else {
                return typeof cb === 'function' && cb(false)
            }

        } else {
            return typeof cb === 'function' && cb(false)
        }

    })
}


module.exports = {
    getUser,
    getJoin,
    gotoPay,
}