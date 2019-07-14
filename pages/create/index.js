import Toast from '../../lib/toast/toast'
import util from '../../utils/index'


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

    // 类型
    createType() {
        if (!this.validate()) return

        const MyTableObject = new wx.BaaS.TableObject('types')
        const values = this.data.typeValue.split(reg)
        // console.log(values)
        // return false

        search((res) => {
            res.map(item => {
                let idx = values.indexOf(item.name)
                if (idx > -1) {
                    values.splice(idx, 1);
                }
            })

            let list = []
            values.map(item => {
                list.push({ name: item })
            })
            // console.log(list)

            if (list.length > 0) create(list)
        })

        function search(cb) {
            const query = new wx.BaaS.Query()
            MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                const { meta, objects } = res.data
                typeof cb === 'function' && cb(objects);
            })
        }

        function create(values) {
            MyTableObject.createMany(values).then(res => {
                console.log(res.data.succeed)
            })
        }
    },

    // 作者
    createAuthor() {
        if (!this.validate()) return

        const MyTableObject = new wx.BaaS.TableObject('authors')
        const values = this.data.authorValue.split(reg)

        // return false

        search((res) => {
            res.map(item => {
                let idx = values.indexOf(item.name)
                if (idx > -1) {
                    values.splice(idx, 1);
                }
            })

            let list = []
            values.map(item => {
                list.push({ name: item })
            })
            // console.log(values)

            if (list.length > 0)
                create(list)
        })

        function search(cb) {
            const query = new wx.BaaS.Query()
            MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                const { meta, objects } = res.data
                // console.log(objects)
                typeof cb === 'function' && cb(objects);
            })
        }

        function create(values) {
            MyTableObject.createMany(values).then(res => {
                console.log(res.data.succeed)
            })
        }
    },

    // 播音员
    createAnnouncer() {
        if (!this.validate()) return

        const MyTableObject = new wx.BaaS.TableObject('announcers')
        const values = this.data.annValue.split(reg)

        // return false

        search((res) => {
            res.map(item => {
                let idx = values.indexOf(item.nickName)
                if (idx > -1) {
                    values.splice(idx, 1);
                }
            })

            let list = []
            values.map(item => {
                list.push({ nickName: item })
            })

            if (list.length > 0)
                create(list)
        })

        function search(cb) {
            const query = new wx.BaaS.Query()
            MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                const { meta, objects } = res.data
                // console.log(objects)
                typeof cb === 'function' && cb(objects);
            })
        }

        function create(values) {
            MyTableObject.createMany(values).then(res => {
                console.log(res.data.succeed)
            })
        }
    },

    // 更新部分字段
    updateBaidu() {
        if (!this.validate()) return
        // 
        const _this = this
        fn()

        function fn(params) {
            const typeDatas = search('types'),
                authorDatas = search('authors'),
                announcerDatas = search('announcers')

            Promise.all([typeDatas, authorDatas, announcerDatas]).then(res => {
                let key = '', text, arr;
                for (let i = 0; i < 3; i++) {
                    if (i == 0) {
                        key = 'types'
                        text = _this.data.typeValue.split(reg)
                        arr = res[0]
                    } else if (i == 1) {
                        key = 'authorId'
                        text = util.trim(_this.data.authorValue)
                        arr = res[1]
                    } else if (i == 2) {
                        key = 'announcers'
                        text = _this.data.annValue.split(reg)
                        arr = res[2]
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
                update(_obj)
            }
        }

        function search(tableName) {
            const MyTableObject = new wx.BaaS.TableObject(tableName)
            const query = new wx.BaaS.Query()
            return new Promise((resolve, reject) => {
                MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                    const { meta, objects } = res.data
                    resolve(objects);
                })
            })

        }

        function update(values) {
            const MyTableObject = new wx.BaaS.TableObject('books')
            const product = MyTableObject.getWithoutData(_this.data.updateId)
            product.set(values).update().then(res => {
                console.log(res.data)
            })
        }
    },

    // 数据批量新建
    createBaidu() {
        const MyTableObject = new wx.BaaS.TableObject('books')
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

        MyTableObject.createMany(list).then(res => {
            console.log(res.data.succeed)
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