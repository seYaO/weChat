/**
 * 比较查询
 * query.compare(key, operator, value)
 * operator 包含 =, !=, <, <=, >, >=
 * query.compare('amount', '>',  1)
 * query.compare('amount', '>',  1) 多个查询
 * 
 * 字符串查询
 * query.contains('name', 'apple')
 * query.matches('name', regExp)  正则匹配
 * 
 * 数组查询
 * query.in(fieldName, array)  field 的类型不限制，field 的 value 含有 array 中的一个或多个
 * query.notIn(fieldName, array)  field 的类型不限制，field 的 value 不含有 array 中的任何一个
 * query.arrayContains(fieldName, array)  field 的类型必须为数组, field 的 value 包含 array 中的每一个 ( * sdk version >= v1.1.1 )
 * query.compare(fieldName, '=', array)  如果希望查找数组中只包含指定数组中所有的值的记录，可以使用比较查询
 * 
 * null 或非 null 查询
 * query.isNull('name')
 * query.isNull(['name', 'price'])
 * query.isNotNull('name')
 * query.isNotNull(['name', 'price'])
 * 
 * 空或非空查询
 * query.exists('name')
 * query.exists(['name', 'price'])
 * query.notExists('name')
 * query.notExists(['name', 'price'])
 */


// let query1 = new wx.BaaS.Query()
// query1.contains('title', '一')
// let query2 = new wx.BaaS.Query()
// query2.contains('title', '光')
// // //...

// // // and 查询
// let andQuery = wx.BaaS.Query.and(query1, query2)

// // or 查询中包含 and 查询
// let query3 = new wx.BaaS.Query()
// query3.contains('title', '一')
// let query4 = new wx.BaaS.Query()
// // query4.contains('title', '光')
// let orQuery = wx.BaaS.Query.or(query4)



// // query.contains('title', '一')
// // let regExp = /宝|光/i
// // query.matches('title', regExp)
// // query.in('id', ['5d29996ac1be5355431697da', '5d29996ac1be5355431697f5'])

module.exports = {
    conditions(options) {
        const query = new wx.BaaS.Query()
        // 特殊字段判断
        if (options.hotType) {
            query.compare(options.hotType, '=', true)
        }
        if (options.ids) {
            query.in('id', options.ids)
        }
        if (options.ins) {
            query.in(options.ins.key, options.ins.array)
        }

        // 普遍字段判断
        if (options.compare) { // 比较查询
            query.compare(options.key, options.operator, options.value)
        }
        if (options.contain) { // 字符串查询
            query.contains(options.contain.key, options.contain.value)
        }
        if (options.contains) { // 字符串查询
            options.contains.map(item => {
                query.contains(item.key, item.value)
            })
        }
        if (options.matches) { // 正则
            query.matches(options.matches.key, options.matches.regExp)
        }
        // let regExp = /梦回大清|倾城之恋|诛砂|香蜜沉沉|簪中录|执子之手/i
        // query.matches('title', regExp)
        return query
    },
    getPointer({ table, id }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        return MyTableObject.getWithoutData(id)
    },
    // 查询数据列表---无条件
    list({ table, limit = 10, offset = 0, query, andQuery, orQuery }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        query = query || new wx.BaaS.Query()
        if (andQuery) {
            query = andQuery
        }
        if (orQuery) {
            query = orQuery
        }

        return new Promise((resolve, reject) => {
            MyTableObject.setQuery(query).orderBy('-created_at').limit(limit).offset(offset * limit).find().then(res => {
                resolve(res.data)
            })
        })
    },
    // 查询数据列表---and
    listAnd() { },
    // 查询单条数据
    detail({ table, id }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        return new Promise((resolve, reject) => {
            MyTableObject.get(id).then(res => {
                resolve(res.data)
            })
        })
    },
    // 数据批量新建
    createMany({ table, list }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        return new Promise((resolve, reject) => {
            MyTableObject.createMany(list).then(res => {
                resolve(res.data)
            })
        })
    },
    // 新增数据
    create({ table, id }) {
        const MyTableObject = new wx.BaaS.TableObject(table)

    },
    // 数据批量更新
    updateMany({ table, limit = 10, offset = 0, list = [], query, andQuery, orQuery }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        query = query || new wx.BaaS.Query()
        if (andQuery) {
            query = andQuery
        }
        if (orQuery) {
            query = orQuery
        }
        const records = MyTableObject.limit(limit).offset(offset * limit).getWithoutData(query)
        list.map(item => {
            records.set(item.key, item.value)
        })

        return new Promise((resolve, reject) => {
            records.update().then(res => {
                resolve(res.data)
            })
        })
    },
    // 更新数据
    update({ table, id, values }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        const product = MyTableObject.getWithoutData(id)
        return new Promise((resolve, reject) => {
            product.set(values).update().then(res => {
                resolve(res.data)
            })
        })
    },
    // 删除数据
    delete({ table, id }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        return new Promise((resolve, reject) => {
            MyTableObject.delete(id).then(res => {
                resolve(res.data)
            })
        })
    }
}

