module.exports = {
    // 查询数据列表
    list({ table, limit = 10, offset = 0 }) {
        const MyTableObject = new wx.BaaS.TableObject(table)
        const query = new wx.BaaS.Query()
        return new Promise((resolve, reject) => {
            MyTableObject.setQuery(query).limit(limit).offset(offset * limit).find().then(res => {
                resolve(res.data)
            })
        })
    },
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

