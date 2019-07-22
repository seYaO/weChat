const app = getApp()
import Toast from '../../lib/toast/toast'
import util from '../../utils/index'
import services from '../../services/index'


const baiduData = require('../../services/baiduData')
const valueObj = {
    typeValue: '多人播,穿越,古言,言情',
    authorValue: '天下无病',
    annValue: '清灵,阑珊梦,小编C,糖葫芦,红樱桃,生死朗读,南瓜楠少,鲛綃,猫镇豆子,訫念,拈水笑,兮小颜,百里屠屠,南割式,沁沁,馨少主',
    updateId: '5d29996ac1be535543169841',
}
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
            Toast('bookId不能为空');
            return false
        }

        return true
    },

    createStore() {
        const values = baiduData.value
        let arr = values.split('\n'), _arr = [], list = []
        for (let i = 0; i < arr.length - 1; i++) {
            if (util.trim(arr[i])) {
                _arr.push(util.trim(arr[i]))
            }
        }
        for (let i = 0; i < _arr.length - 1; i = i + 2) {
            list.push({ name: _arr[i], desc: _arr[i + 1] })
        }

        console.log(list)

        // const MyTableObject = new wx.BaaS.TableObject('store')
        // MyTableObject.createMany(list).then(res => {
        //     console.log(res.data.succeed)
        // })
    },

    create({ table, key, values }, cb) {
        const params = { table, limit: 1000 }
        services.list(params).then(res => {
            const { meta, objects } = res
            let list = []

            objects.map(item => {
                let idx = values.indexOf(item[key])
                if (idx > -1) {
                    values.splice(idx, 1);
                }
            })

            values.map(item => {
                list.push({ [key]: item })
            })
            // console.log(list)

            if (list.length > 0) {
                services.createMany({ table, list }).then(res => {
                    return typeof cb === 'function' && cb(res)
                })
            } else {
                return typeof cb === 'function' && cb()
            }
        })
    },

    // 类型
    createType() {
        if (!this.validate()) return

        const values = this.data.typeValue.split(reg)

        this.create({ table: 'types', key: 'name', values }, (res) => {
            if (res) {
                console.log('类型数据批量新建---', res.succeed)
                Toast('类型数据批量新建成功')
            } else {
                Toast('无需更新类型数据')
            }
        })
    },

    // 作者
    createAuthor() {
        if (!this.validate()) return

        const values = this.data.authorValue.split(reg)

        this.create({ table: 'authors', key: 'name', values }, (res) => {
            if (res) {
                console.log('作者数据批量新建---', res.succeed)
                Toast('作者数据批量新建成功')
            } else {
                Toast('无需更新作者数据')
            }
        })
    },

    // 播音员
    createAnnouncer() {
        if (!this.validate()) return

        const values = this.data.annValue.split(reg)

        this.create({ table: 'announcers', key: 'nickName', values }, (res) => {
            if (res) {
                console.log('播音员数据批量新建---', res.succeed)
                Toast('播音员数据批量新建成功')
            } else {
                Toast('无需更新播音员数据')
            }
        })

    },

    // 更新部分字段
    updateBaidu() {
        if (!this.validate()) return

        const { typeValue, authorValue, annValue, updateId } = this.data
        const typeDatas = services.list({ table: 'types', limit: 1000 })
        const authorDatas = services.list({ table: 'authors', limit: 1000 })
        const announcerDatas = services.list({ table: 'announcers', limit: 1000 })

        Promise.all([typeDatas, authorDatas, announcerDatas]).then(res => {
            let key = '', text, arr;
            for (let i = 0; i < 3; i++) {
                if (i == 0) {
                    key = 'types'
                    text = typeValue.split(reg)
                    arr = res[0].objects
                } else if (i == 1) {
                    key = 'authorId'
                    text = util.trim(authorValue)
                    arr = res[1].objects
                } else if (i == 2) {
                    key = 'announcers'
                    text = annValue.split(reg)
                    arr = res[2].objects
                }
                contrast(key, text, arr)
            }
        })

        function contrast(key, text, arr) {
            // console.log(key, text, arr)
            let _value = '', _arr = [], _obj
            arr.map(item => {
                if (key == 'authorId') {
                    if (item.name == text) {
                        _value = item.id
                    }
                } else {
                    let _key = key == 'types' ? 'name' : 'nickName'
                    let idx = text.indexOf(item[_key])
                    if (idx > -1) {
                        _arr.push(item.id)
                    }
                }
            })
            _obj = { [key]: key == 'authorId' ? _value : _arr }
            // console.log(_obj)
            services.update({ table: 'books', id: updateId, values: _obj }).then(res => {
                console.log('数据更新---', res)
                Toast('数据更新成功')
            })
        }

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
            Toast('数据批量新建成功')
        })
    },

    // -------------------
    unique() {
        const params = { table: 'books', limit: 1000 }

        services.list(params).then(res => {
            const { meta, objects } = res
            let list = [], result = [], obj = {}, arr = [], uniqueObj = {}

            objects.map(item => {
                if (item.announcers.length > 4) {
                    list.push(item.id)
                }
            })

            console.log(JSON.stringify(list))
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
    conditions(array) {
        const query = new wx.BaaS.Query()
        // 梦回大清|倾城之恋|诛砂|香蜜沉沉|秀色|妻居一品|世嫁|娇医有毒|春闺梦里多人|庶女有毒|君九龄|良陈美锦|祸水|花开春暖|名门医女|掌事|医香|色遍天下|三生三世十里桃花|锦心|特工傻后|簪中录|执子之手
        let regExp = /梦回大清|倾城之恋|诛砂|香蜜沉沉|簪中录|执子之手/i
        query.matches('title', regExp)
        return query
    },
    updateSelect() {
        const params = { table: 'books', limit: 1000, query: this.conditions(), list: [{ key: 'isGoods', value: true }] }
        services.updateMany(params).then(res => {
            console.log(res)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.BaaS.auth.loginWithWechat().then(user => {
            this.init()
        })
    },
})