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

                if (types && types[0]) {
                    let typeArr = []
                    types.map(item => {
                        const params = { id: item, table: 'types' }
                        const res = services.detail(params)
                        typeArr.push(res)
                    })
                    // console.log(typeArr)
                    Promise.all(typeArr).then(res => {
                        let arr = []
                        if (res && res[0]) {
                            res.map((item, index) => {
                                if (index < 6) {
                                    arr.push({ id: item.id, name: item.name })
                                }
                            })
                        }
                        list[i].typeList = arr
                        this.setData({ list })
                    })
                }

                if (announcers && announcers[0]) {
                    let announcerArr = []
                    announcers.map(item => {
                        const params = { id: item, table: 'announcers' }
                        const res = services.detail(params)
                        announcerArr.push(res)

                    })
                    // console.log(announcerArr)
                    Promise.all(announcerArr).then(res => {
                        let arr = [], isMore = false, value = ''
                        if (res && res[0]) {
                            res.map((item, index) => {
                                if (index < 3) {
                                    arr.push(item.nickName)
                                }
                            })
                            value = `${arr.join(',')}${res.length > 3 ? '...' : ''}`
                        }

                        list[i].announcerValue = value || '暂无'
                        this.setData({ list })
                    })
                }

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