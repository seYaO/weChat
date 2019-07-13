const baiduData = require('../../services/baiduData')
const util = require('../../utils/index')
const valueObj = {
    typeValue: '言情,多人播,青春',
    authorValue: '凤轻',
    annValue: '筱梦,布兰德',
    updateIndex: 0,
    updateId: '5d29996ac1be5355431697d4',
}

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    init() { },

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
        const MyTableObject = new wx.BaaS.TableObject('types')
        const values = valueObj.typeValue.split(',')

        return false

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
        const MyTableObject = new wx.BaaS.TableObject('authors')
        const values = valueObj.authorValue.split(',')

        return false

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
        const MyTableObject = new wx.BaaS.TableObject('announcers')
        const values = valueObj.annValue.split(',')

        return false

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
        // 
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
                        text = valueObj.typeValue.split(',')
                        arr = res[0]
                    } else if (i == 1) {
                        key = 'authorId'
                        text = valueObj.authorValue
                        arr = res[1]
                    } else if (i == 2) {
                        key = 'announcers'
                        text = valueObj.annValue.split(',')
                        arr = res[2]
                    }
                    contrast(key, text, arr)
                }
            })

            function contrast(key, text, arr) {
                // console.log(key, text, arr)
                let _value = [], _obj
                arr.map(item => {
                    if (key == 'authorId') {
                        _value = ''
                        if (item.name == text) {
                            _value = item.id
                        }
                    } else {
                        let _key = key == 'types' ? 'name' : 'nickName'
                        let idx = text.indexOf(item[_key])
                        if (idx > -1) {
                            _value.push(item.id)
                        }
                    }
                })
                _obj = { [key]: _value }
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
            const product = MyTableObject.getWithoutData(valueObj.updateId)
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