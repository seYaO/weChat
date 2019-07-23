import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '',
    },

    conditions(key, value) {
        const query = new wx.BaaS.Query()
        query.compare(key, '=', value)
        return query
    },

    init() {
        services.list({ table: 'books', limit: 6, query: this.conditions('isRecommend', true) }).then(res => {
            const { meta, objects } = res
            this.setData({ recommendList: objects })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.init()
    },

    openDetail(e) {
        const { id } = e.currentTarget.dataset

        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
        })
    },
})