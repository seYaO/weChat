import util from '../../utils/index'
import { throttle } from '../../utils/throttle'
import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '',
    },

    init() {
        services.list({ table: 'books', limit: 6, query: services.conditions({ hotType: 'isRecommend' }) }).then(res => {
            const { meta, objects } = res
            this.setData({ recommendList: objects })
        })

        let historyList = wx.getStorageSync('ting.history')
        if (historyList) {
            this.setData({ historyList })
        }
    },

    search(text) {
        let contain = { key: 'title', value: text }
        services.list({ table: 'books', limit: 50, query: services.conditions({ contain }) }).then(res => {
            const { meta, objects } = res
            let searchList = []
            if (objects) {
                objects.map(item => {
                    let obj = {}
                    obj.title = item.title
                    obj.id = item.id
                    obj.words = util.highLightWord(item.title, [text])
                    searchList.push(obj)
                })
            }
            this.setData({ searchList })
        })
    },

    onSearch(e) {
        const value = e.detail
        this.setData({ value })
        // console.log('onSearch---', e)
    },
    onChange: throttle(function (e) {
        const value = e.detail
        this.setData({ value })
        // console.log('onChange---', e)
        if (value) {
            this.search(value)
        } else {
            this.setData({ searchList: null })
        }

    }, 500),
    onCancel(e) {
        wx.navigateBack()
    },

    clear() {
        wx.setStorageSync('ting.history', null)
        this.setData({ historyList: null })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.init()
    },

    openNext(e) {
        let { historyList, value } = this.data
        historyList = historyList || []
        let idx = historyList.indexOf(value)
        if (idx == -1) {
            historyList.splice(0, 0, value)
            this.setData({ historyList })
            wx.setStorageSync('ting.history', historyList)
        }
    },

    openDetail(e) {
        const { id } = e.currentTarget.dataset

        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
        })
    },
})