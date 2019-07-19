const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    clickBtn() { },

    getUserInfo(e) {
        if (app.globalData.userParam && app.globalData.userParam.callback) {
            app.globalData[app.globalData.userParam.callback](e.detail);
        }
        if (app.globalData.userParam && app.globalData.userParam.goBack) {
            app.globalData[app.globalData.userParam.goBack]();
        } else {
            wx.navigateBack()
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    onUnload() {
        console.log('onUnload')
    },
})