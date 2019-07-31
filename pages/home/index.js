import util from '../../utils/index'
import config from '../../utils/config'
import wxInfo from '../../utils/wxInfo'
import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '',
        pages: {},
        dataloaded: false,
        likeList: [],
        recommendList: [],
        goodsList: []
    },

    searchFocus() {
        wx.navigateTo({
            url: `/pages/search/index`,
        })
    },

    init() {

        const like = services.list({ table: config.tables.books, limit: 6, query: services.conditions({ hotType: 'isLike' }) })
        const recommend = services.list({ table: config.tables.books, limit: 6, query: services.conditions({ hotType: 'isRecommend' }) })
        const goods = services.list({ table: config.tables.books, limit: 6, query: services.conditions({ hotType: 'isGoods' }) })

        Promise.all([like, recommend, goods]).then(res => {
            let arr = ['likeList', 'recommendList', 'goodsList']
            let obj = { likeList: [], recommendList: [], goodsList: [] }
            res.map((item, index) => {
                const { meta, objects } = item
                objects.map(item => {
                    item.minImgUrl = util.setImageSize(item.headerImgUrl) || ''
                    return item;
                })
                obj[arr[index]] = objects
            })
            this.setData({ ...obj })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // wxInfo.getCurrentPages()
        // getCurrentPages()
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