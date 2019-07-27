const app = getApp()
import util from '../../utils/index'
import services from '../../services/index'
import operation from './operation'
const baiduData = require('../../services/baiduData')
const testData = require('../../services/data')
const reg = /\s*,\s*/

Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeValue: '',
        authorValue: '',
        annValue: '',
        updateId: '',
    },

    init() { },

    changeValue(e) {
        const { key } = e.currentTarget.dataset
        const value = e.detail
        this.setData({ [key]: value })
    },

    clearValue() {
        this.setData({
            typeValue: '',
            authorValue: '',
            annValue: '',
            updateId: '',
        })
    },

    validate() {
        const { updateId } = this.data
        if (!updateId) {
            getApp().showToast('bookId不能为空');
            return false
        }

        return true
    },

    createStore() {
        operation.createStore()
    },

    // 类型
    createType() {
        if (!this.validate()) return

        const values = this.data.typeValue.split(reg)

        operation.create({ table: 'types', key: 'name', values }, (res) => {
            if (res) {
                console.log('类型数据批量新建---', res.succeed)
                getApp().showToast('类型数据批量新建成功')
            } else {
                getApp().showToast('无需更新类型数据')
            }
        })
    },

    // 作者
    createAuthor() {
        if (!this.validate()) return

        const values = this.data.authorValue.split(reg)

        operation.create({ table: 'authors', key: 'name', values }, (res) => {
            if (res) {
                console.log('作者数据批量新建---', res.succeed)
                getApp().showToast('作者数据批量新建成功')
            } else {
                getApp().showToast('无需更新作者数据')
            }
        })
    },

    // 播音员
    createAnnouncer() {
        if (!this.validate()) return

        const values = this.data.annValue.split(reg)

        operation.create({ table: 'announcers', key: 'nickName', values }, (res) => {
            if (res) {
                console.log('播音员数据批量新建---', res.succeed)
                getApp().showToast('播音员数据批量新建成功')
            } else {
                getApp().showToast('无需更新播音员数据')
            }
        })

    },

    // 更新部分字段
    updateBaidu() {
        if (!this.validate()) return

        const { typeValue, authorValue, annValue, updateId } = this.data

        operation.updateBaidu({ typeValue, authorValue, annValue, updateId })
    },

    // 数据批量新建
    createBaidu() {
        const data = baiduData.data.list
        let list = [], reg = /[^\/]*$/g
        data.map((item, index) => {
            const { typicalPath, shortlink, passwd } = item
            let tit = typicalPath.match(reg), title = ''
            if (tit) {
                title = tit[0]
            }

            list.push({
                title,
                cloudDownload: `链接：${shortlink} 提取码：${passwd}`
            })
        })
        // console.log(list)

        return false

        const params = { table: 'books', list }
        services.createMany(params).then(res => {
            console.log('数据批量新建---', res.succeed)
            getApp().showToast('数据批量新建成功')
        })
    },

    // -------------------
    unique() {
        const params = { table: 'announcers', limit: 1000 }

        services.list(params).then(res => {
            const { meta, objects } = res
            let list = [], result = [], obj = {}, arr = [], uniqueObj = {}

            objects.map(item => {
                console.log(item.nickName)
            })

            // console.log(JSON.stringify(list))
        })
    },
    update() {
        const params = {
            table: 'books',
            limit: 1000,
            list: [
                { key: 'isLike', value: false },
                { key: 'isRecommend', value: false },
                { key: 'isGoods', value: false }
            ]
        }
        services.updateMany(params).then(res => {
            console.log(res)
        })
    },
    conditions() {
        // 梦回大清|倾城之恋|诛砂|香蜜沉沉|秀色|妻居一品|世嫁|娇医有毒|春闺梦里多人|庶女有毒|君九龄|良陈美锦|祸水|花开春暖|名门医女|掌事|医香|色遍天下|三生三世十里桃花|锦心|特工傻后|簪中录|执子之手
        let regExp = /梦回大清|倾城之恋|诛砂|香蜜沉沉|簪中录|执子之手/i
        let obj = {
            matches: { key: 'title', regExp }
        }
        const query = services.conditions(obj)
        return query
    },
    updateSelect() {
        const params = { table: 'books', limit: 1000, query: this.conditions(), list: [{ key: 'isGoods', value: true }] }
        services.updateMany(params).then(res => {
            console.log(res)
        })
    },
    /**
     * 
     */
    updateAnnouncer() {
        // 喜马拉雅喜欢
        // const { followingsPageInfo } = testData.data
        // let filter = ["昔夜之音","千寻清语","南音专辑屋"]
        // let arr = [], datas = []
        // followingsPageInfo.map(item => {
        //     arr.push(item.anchorNickName)
        //     if (filter.indexOf(item.anchorNickName) > -1) {
        //         datas.push({ name: item.anchorNickName, cover: `https:${item.coverPath}`, desc: item.description })
        //     }
        // })
        // console.log(followingsPageInfo)
        // console.log(arr)
        // console.log(JSON.stringify(arr))
        // console.log(datas)
        // console.log(JSON.stringify(datas))

        const list = testData
        let arr = [], obj = {}, updateArr = [], createArr = []
        list.map(item => {
            arr.push(item.name)
            obj[item.name] = {
                nickName: item.name,
                cover: item.cover,
                intro: item.desc,
            }
        })
        // console.log(list)
        // console.log(arr)
        // console.log(obj)

        const params = { table: 'announcers', limit: 1000 }

        services.list(params).then(res => {
            const { meta, objects } = res

            objects.map(item => {
                let idx = arr.indexOf(item.nickName)
                if (idx > -1) {
                    updateArr.push({ ...obj[item.nickName], id: item.id })
                    arr.splice(idx, 1)
                }
            })

            arr.map(item => {
                createArr.push(obj[item])
            })

            // console.log(objects)
            // console.log(arr)
            console.log(updateArr)
            console.log(createArr)
            // create(createArr)
            update(updateArr)
        })

        // arr.map(item => {
        //     createArr.push(obj[item])
        // })
        // console.log(createArr)

        function update(list) {
            list.map(item => {
                const { id, ...other } = item
                fn(id, other)
            })


            function fn(updateId, _obj) {
                // console.log('数据更新>>>>>>', updateId, _obj)
                services.update({ table: 'announcers', id: updateId, values: _obj }).then(res => {
                    console.log('数据更新---', res)
                    getApp().showToast('数据更新成功')
                })
            }
        }

        function create(list) {
            // console.log('播音员数据批量新建>>>>>>', list)
            services.createMany({ table: 'announcers', list }).then(res => {
                console.log('播音员数据批量新建---', res.succeed)
            })
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.BaaS.auth.loginWithWechat().then(user => {
            this.init()
        })

        // 创建临时匿名用户
        // wx.BaaS.auth.anonymousLogin().then(user => {
        //     console.log(user)
        // }).catch(err => {
        //     // HError
        // })
    },
})