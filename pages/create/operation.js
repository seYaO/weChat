import util from '../../utils/index'
import services from '../../services/index'
const baiduData = require('../../services/baiduData')
const reg = /\s*,\s*/

module.exports = {
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
    // 更新部分字段
    updateBaidu({ typeValue, authorValue, annValue, updateId }) {
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
                getApp().showToast('数据更新成功')
            })
        }

    },
}