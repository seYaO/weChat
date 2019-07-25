import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '',
    },

    searchFocus() {
        wx.navigateTo({
            url: `/pages/search/index`,
        })
    },

    init() {
        services.list({ table: 'books', limit: 6, query: services.conditions({ hotType: 'isLike' }) }).then(res => {
            const { meta, objects } = res
            this.setData({ likeList: objects })
        })
        services.list({ table: 'books', limit: 6, query: services.conditions({ hotType: 'isRecommend' }) }).then(res => {
            const { meta, objects } = res
            this.setData({ recommendList: objects })
        })
        services.list({ table: 'books', limit: 6, query: services.conditions({ hotType: 'isGoods' }) }).then(res => {
            const { meta, objects } = res
            this.setData({ goodsList: objects })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.init()
    },

    openList(e) {
        const { type = '' } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/list/index?hotType=${type}`,
        })
    },

    openDetail(e) {
        const { id } = e.currentTarget.dataset

        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
        })
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