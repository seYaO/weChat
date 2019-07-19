import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    init() {
        const { id = '' } = this.data
        const params = { id, table: 'books' }

        services.detail(params).then(res => {
            this.setData({ datas: res }, () => {
                wx.hideLoading()
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({ title: '加载中' })
        this.setData({ ...options })

        this.init()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})