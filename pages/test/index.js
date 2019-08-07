Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.request({
            url: 'https://www.qwqoffice.com/html2wxml/example.html',
            success: res => {
                this.setData({ html: res.data });
            }
        })
        wx.request({
            url: 'https://cloud-minapp-28765.cloud.ifanrusercontent.com/1hqtagdolX5SSJS4.md',
            success: res => {
                this.setData({ text: res.data });
            }
        })
    },
    wxmlTagATap(e) { }
})