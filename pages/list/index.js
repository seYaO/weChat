import Toast from '../../lib/toast/toast'
import util from '../../utils/index'
import services from '../../services/index'

let limit = 10 // 每页显示几条数据
let offset = 0 // 页码
let page = 1 //总页数

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
        list: null,
    },

    conditions(array) {
        const query = new wx.BaaS.Query()
        query.in('id', array)
        return query
    },

    getList({ refresh = false }) {
        let { list } = this.data
        const params = { table: 'books', limit, offset }

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
                this.setData({ list: refresh ? [...objects] : list.concat([...objects]), }, () => {
                    this.updateList(limit, offset)
                })
            }

            if (refresh) {
                wx.stopPullDownRefresh()
            }
            wx.hideLoading()
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
                    let arr = []
                    const params = { table: 'types', limit: 1000, query: this.conditions(types) }
                    const res = services.list(params)
                    allArr.push(res)
                } else {
                    allArr.push(null)
                }

                if (announcers && announcers[0]) {
                    const params = { table: 'announcers', limit: 1000, query: this.conditions(announcers) }
                    const res = services.list(params)
                    allArr.push(res)
                } else {
                    allArr.push(null)
                }
                Promise.all(allArr).then(res => {
                    let typeArr = [], announcerArr = [], announcerNum = 0, announcerValue = ''
                    res.map((item, index) => {
                        if (item) {
                            const { objects } = item
                            objects.map((_item, _index) => {
                                if (index == 0) {
                                    typeArr.push({ id: _item.id, name: _item.name })
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

    // 复制内容
    getClipboard(e) {
        const { value } = e.currentTarget.dataset
        wx.setClipboardData({
            data: value,
            success(res) {
                wx.hideToast()
                Toast('内容已复制,打开百度网盘');
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ title: '加载中', })
        this.getList({ refresh: true })
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

    openDetail(e) {
        const { id } = e.currentTarget.dataset

        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
        })
    },
})