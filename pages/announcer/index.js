// pages/announcer/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverImg: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.request({
            // url: 'https://www.qwqoffice.com/html2wxml/example.html',
            url: 'https://cloud-minapp-28765.cloud.ifanrusercontent.com/1hqtagdolX5SSJS4.md',
            success: res => {
                this.setData({ text: res.data });
            }
        })
    },

    wxmlTagATap(e) {
        console.log(e);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})