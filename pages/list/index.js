const app = getApp()
import util from '../../utils/index'
import config from '../../utils/config'
import services from '../../services/index'

let limit = 10 // 每页显示几条数据
let offset = 0 // 页码
let page = 1 //总页数

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataloaded: false,
        value: '',
        authorId: '',
        isAll: false,
        coverImg: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
        list: [],
    },

    init() {
        let { search = '', authorId = '' } = this.data
        let isAll = !!search || !!authorId
        search = decodeURIComponent(search)
        if (search) {
            this.getSearch(search)
        }

        this.setData({ value: search }, () => {
            this.getList({ refresh: true })
        })
    },

    getList({ refresh = false }) {
        let { list, hotType = '', value = '', authorId = '' } = this.data
        let query = {}
        if (hotType) {
            query.hotType = hotType
        }
        if (value) {
            query.contain = { key: 'title', value }
        }
        if (authorId) {
            const pointer = services.getPointer({ table: config.tables.authors, id: authorId })
            query.compare = { key: 'authorPointer', operator: '=', value: pointer }
        }
        const params = { table: config.tables.books, limit, offset, query: services.conditions(query) }

        services.list(params).then(res => {
            const { meta, objects } = res
            page = Math.floor(meta.total_count / limit)
            objects.map(item => {
                item.typeList = []
                item.announcerList = []
                item.announcerValue = ''
                item.authorObj = {}
                item.minImgUrl = util.setImageSize(item.headerImgUrl) || ''
                return item;
            })
            if (objects && objects[0]) {
                this.setData({ dataloaded: true, list: refresh ? [...objects] : list.concat([...objects]), }, () => {
                    this.updateList(limit, offset)
                })
            }

            if (refresh) {
                wx.stopPullDownRefresh()
            }
        })
    },

    getSearch(text) {
        const contain1 = { key: 'nickName', value: text }
        const params1 = { table: config.tables.announcers, limit: 100, query: services.conditions({ contain: contain1 }) }
        const contain2 = { key: 'name', value: text }
        const params2 = { table: config.tables.authors, limit: 100, query: services.conditions({ contain: contain2 }) }

        services.list(params1).then(res => {
            const { meta, objects } = res
            if (objects && objects[0]) {
                this.setData({ dataloaded: true, announcers: objects })
            }
        })
        services.list(params2).then(res => {
            const { meta, objects } = res
            if (objects && objects[0]) {
                this.setData({ dataloaded: true, authors: objects })
            }
        })
    },

    updateList(limit, offset) {
        let datas = this.data.list
        const { list } = this.data

        for (let i = offset * limit; i < limit * (offset + 1); i++) {
            if (datas[i]) {
                const { types = [], announcers = [], authorId = '' } = datas[i];
                let allArr = []

                if (types && types[0]) {
                    const params = { table: config.tables.types, limit: 1000, query: services.conditions({ ids: types.slice(0, 4) }) }
                    const res = services.list(params)
                    allArr.push(res)
                } else {
                    allArr.push(null)
                }

                if (announcers && announcers[0]) {
                    const params = { table: config.tables.announcers, limit: 1000, query: services.conditions({ ids: announcers }) }
                    const res = services.list(params)
                    allArr.push(res)
                } else {
                    allArr.push(null)
                }
                Promise.all(allArr).then(res => {
                    let typeArr = [], tags = [], announcerArr = [], announcerNum = 0, announcerValue = ''
                    res.map((item, index) => {
                        if (item) {
                            const { objects } = item
                            objects.map((_item, _index) => {
                                if (index == 0) {
                                    typeArr.push({ id: _item.id, name: _item.name })
                                    tags.push(_item.name)
                                }
                                if (index == 1) {
                                    if (_index < 3) {
                                        announcerArr.push(_item.nickName)
                                    }
                                    announcerNum = announcerNum + (_index + 1)
                                }
                            })
                        }
                    })
                    announcerValue = `${announcerArr.join(',')}${announcerNum > 3 ? '...' : ''}`
                    list[i].tags = tags
                    list[i].typeList = typeArr
                    list[i].announcerValue = announcerValue || '暂无'
                    this.setData({ list })
                })

                // this.getData('author', authorId)
            }

        }
    },

    getData(tableName, recordId, cb) {
        const Product = new wx.BaaS.TableObject(tableName)

        Product.get(recordId).then(res => {
            typeof cb === 'function' && cb(res.data);
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({ ...options })
        const { listNavBarTitle } = app.globalData
        if (listNavBarTitle) {
            wx.setNavigationBarTitle({
                title: listNavBarTitle
            })
        }
        this.init()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        console.log('页面相关事件处理函数--监听用户下拉动作')

        offset = 0
        this.getList({ refresh: true })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log('页面上拉触底事件的处理函数')

        if (offset < page) {
            offset++
            this.getList({})
        }
    },

    searchFocus() {
        wx.redirectTo({
            url: `/pages/search/index`,
        })
    },

    onCancel(e) {
        wx.navigateBack()
    },

    openAnnouncer(e) {
        const { id } = e.currentTarget.dataset

        wx.navigateTo({
            url: `/pages/announcer/index?id=${id}`,
        })
    },

    openAuthor(e) {
        const { id, name } = e.currentTarget.dataset
        app.globalData.listNavBarTitle = name

        wx.redirectTo({
            url: `/pages/list/index?authorId=${id}`,
        })
    },
})