import util from '../../utils/index'
import config from '../../utils/config'
import services from '../../services/index'
const baiduData = require('../../services/baiduData')
const reg = /\s*,\s*/

function create({ table, key, values, desc = '' }, cb) {
    const params = { table, limit: 1000 }
    return new Promise((resolve, reject) => {
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
                let obj = { [key]: item }
                if (desc) {
                    obj.intro = desc
                }
                list.push(obj)
            })
            // console.log(list)

            if (list.length > 0) {
                services.createMany({ table, list }).then(res => {
                    resolve(res)
                    return typeof cb === 'function' && cb(res)
                })
            } else {
                resolve('')
                return typeof cb === 'function' && cb()
            }
        })
    })
}

module.exports = {
    create,
    createJson() {
        const datas = baiduData.list
        let list = []
        datas.map(item => {
            list.push({ content: JSON.stringify(item) })
        })

        services.createMany({ table: config.tables.json, list }).then(res => {
            console.log('JSON数据批量新建---', res.succeed)
            getApp().showToast('JSON数据批量新建成功')
        })
    },
    // 新增店铺
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
        const values = this.data.typeValue.split(reg)

        create({ table: config.tables.types, key: 'name', values }, (res) => {
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

        operation.create({ table: config.tables.authors, key: 'name', values }, (res) => {
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

        operation.create({ table: config.tables.announcers, key: 'nickName', values }, (res) => {
            if (res) {
                console.log('播音员数据批量新建---', res.succeed)
                getApp().showToast('播音员数据批量新建成功')
            } else {
                getApp().showToast('无需更新播音员数据')
            }
        })

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

        const params = { table: config.tables.books, list }
        services.createMany(params).then(res => {
            console.log('数据批量新建---', res.succeed)
            getApp().showToast('数据批量新建成功')
        })
    },
    createToBook() {
        const ids = ['5d3dbaf6f3231513d3b735d4', '5d3dba5ef3231513d3b73471', '5d3dba5ef3231513d3b73473', '5d29996ac1be5355431697d5', '5d29996ac1be5355431697d7', '5d29996ac1be5355431697dc', '5d29996ac1be5355431697e5', '5d29996ac1be5355431697e1', '5d29996ac1be5355431697dd', '5d29996ac1be535543169841', '5d29996ac1be535543169840', '5d29996ac1be535543169839', '5d29996ac1be535543169838']
        const params = { table: config.tables.books, limit: 50, query: services.conditions({ ids }) }

        services.list(params).then(res => {
            const { meta, objects } = res
            let list = []

            objects.map(item => {
                const { announcers, authorId, headerImgUrl, intro, title, types } = item
                list.push({
                    announcers, authorId, headerImgUrl, intro, title, types,
                    authorPointer: services.getPointer({ table: config.tables.authors, id: authorId })
                })
            })
            // console.log(list)

            services.createMany({ table: 'books', list }).then(res => {
                console.log('数据批量新建---', res.succeed)
                getApp().showToast('数据批量新建成功')
            })
        })

        // const params = {
        //     table: 'books',
        //     limit: 1000,
        //     list: [
        //         { key: 'cloudDownload', value: '' },
        //     ]
        // }
        // services.updateMany(params).then(res => {
        //     console.log(res)
        // })
    },
}