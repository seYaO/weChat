import util from '../../utils/index'
import config from '../../utils/config'
import services from '../../services/index'
import comServices from '../../services/common'
import create from './create'
const baiduData = require('../../services/baiduData')
const testData = require('../../services/testData')
const reg = /\s*[,，、]\s*/
const regAttr = /\s*?[a-zA-Z0-9_-]+\s*?=\s*?([‘"])[\s\S].*?\1/ig
const regImg = /<img.*?s[a-zA-Z0-9_-]+\s*?=\s*?([‘"])[\s\S].*?>/g
const regHtml = /<(p)>([\s\S]*?)<\/\1>/g
const clearTypes = ['会员有声书', '大神作品', '女频', '原创']
const ximaList = baiduData.list
let ximaIndex = 0

module.exports = {
    unique() {
        const params = { table: config.tables.announcers, limit: 1000 }

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
            table: config.tables.books,
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
    // 更新部分字段
    updateBaidu() {
        if (!this.validate()) return
        const { typeValue, authorValue, annValue, updateId } = this.data

        const typeDatas = services.list({ table: config.tables.types, limit: 1000 })
        const authorDatas = services.list({ table: config.tables.authors, limit: 1000 })
        const announcerDatas = services.list({ table: config.tables.announcers, limit: 1000 })

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
            services.update({ table: config.tables.books, id: updateId, values: _obj }).then(res => {
                console.log('数据更新---', res)
                getApp().showToast('数据更新成功')
            })
        }

    },
    // 批量操作播音员 [更新/新建]
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

        const params = { table: config.tables.announcers, limit: 1000 }

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
                services.update({ table: config.tables.announcers, id: updateId, values: _obj }).then(res => {
                    console.log('数据更新---', res)
                    getApp().showToast('数据更新成功')
                })
            }
        }

        function create(list) {
            // console.log('播音员数据批量新建>>>>>>', list)
            services.createMany({ table: config.tables.announcers, list }).then(res => {
                console.log('播音员数据批量新建---', res.succeed)
            })
        }

    },
    // 更新作者
    updateAuthor() {
        const params = { table: config.tables.books, limit: 1000 }
        let list = []

        services.list(params).then(res => {
            const { meta, objects } = res

            objects.map(item => {
                if (item.authorId) {
                    const pointer = services.getPointer({ table: config.tables.authors, id: item.authorId })
                    fn(item.id, { authorPointer: pointer })
                }
            })
        })

        function fn(updateId, _obj) {
            // console.log('数据更新>>>>>>', updateId, _obj)
            services.update({ table: config.tables.books, id: updateId, values: _obj }).then(res => {
                console.log('数据更新---', res)
                // getApp().showToast('数据更新成功')
            })
        }
    },
    // 条件更新
    updateSelect() {
        // 梦回大清|倾城之恋|诛砂|香蜜沉沉|秀色|妻居一品|世嫁|娇医有毒|春闺梦里多人|庶女有毒|君九龄|良陈美锦|祸水|花开春暖|名门医女|掌事|医香|色遍天下|三生三世十里桃花|锦心|特工傻后|簪中录|执子之手
        let regExp = /梦回大清|倾城之恋|诛砂|香蜜沉沉|簪中录|执子之手/i
        const query = {
            matches: { key: 'title', regExp }
        }
        const params = { table: config.tables.books, limit: 1000, query: services.conditions(query), list: [{ key: 'isGoods', value: true }] }
        services.updateMany(params).then(res => {
            console.log(res)
        })
    },
    /**
     * 例子
     * {
        id: '5d3dbaf6f3231513d3b735d4',
        title: '星际男神是我爸',
        albumId: 16556782, // xima ID
        tingId: '', // ting ID
        pageSize: 1000,
        types: '',
        author: '尤前',
        authorIntro: '起点女生网优秀作家，作者专注于塑造精品，人物描写很丰满，在情节中展现角色，用角色推进故事的能力非常的强，在读者群体中有着良好的口碑。',
        announcers: '清灵',
        subAnnouncers: '',
    },
     */
    updateTest() {
        ximaFn(ximaList[ximaIndex])

        function ximaFn(options) {
            let xima0 = null, xima1 = null, ting = null
            if (options.albumId) {
                xima0 = comServices.index({ params: { albumId: options.albumId } })
                xima1 = comServices.list({ params: { albumId: options.albumId, pageSize: options.pageSize, pageNum: 1 } })
            }
            if (options.tingId) {
                if (options.isAlbum) {
                    ting = comServices.albumInfo({ params: { id: options.tingId } })
                } else {
                    ting = comServices.bookInfo({ params: { id: options.tingId } })
                }
            }

            Promise.all([xima0, xima1, ting]).then(res => {
                let directory = [], directoryValue = '', typeValue = '', announcerValue = '', subAnnouncerValue = '', authorValue = '', types = [], headerImgUrl = '', recommend = '', intro = '', authorIntro = '', announcerIntro = ''
                authorValue = options.author || ''
                authorIntro = options.authorIntro || ''
                announcerValue = options.announcers || ''
                subAnnouncerValue = options.subAnnouncers || ''

                if (options.albumId) {
                    const { mainInfo } = res[0].data
                    const { tracks } = res[1].data
                    let { metas, detailRichIntro, cover } = mainInfo
                    let imgHtml = detailRichIntro.match(regImg)
                    detailRichIntro = detailRichIntro.replace(regImg, '')
                    detailRichIntro = detailRichIntro.replace(regAttr, '')
                    if (imgHtml) {
                        imgHtml.map(item => {
                            detailRichIntro += `<p>${item}</p>`
                        })
                    }
                    intro = detailRichIntro
                    tracks.map((item, index) => {
                        directory.push(item.title)
                    })
                    metas.map(item => {
                        types.push(item.metaDisplayName)
                    })
                    headerImgUrl = `https:${cover}`
                    directoryValue = JSON.stringify(directory)
                }
                if (options.tingId) {
                    let extraInfos, labels, description
                    if (options.isAlbum) {
                        extraInfos = res[2].ablumn.extraInfos
                        labels = res[2].ablumn.labels
                        description = res[2].ablumn.description
                    } else {
                        extraInfos = res[2].extraInfos
                        labels = res[2].labels
                        description = res[2].desc
                        authorValue = res[2].author
                    }
                    recommend = description
                    labels.map(item => {
                        let idx = types.indexOf(item.name)
                        if (idx == -1) {
                            types.push(item.name)
                        }
                    })
                    extraInfos.map(item => {
                        if (item.title == '内容概述') {
                            intro = item.content + intro
                        }
                        if (!options.isAlbum && item.title == '作者简介') {
                            authorIntro = item.content
                        }
                        if (item.title == '主播简介') {
                            announcerIntro = item.content
                        }
                    })
                }
                clearTypes.map(item => {
                    let idx = types.indexOf(item)
                    if (idx > -1) {
                        types.splice(idx, 1);
                    }
                })
                typeValue = types.join(',');
                let obj = {
                    id: options.id,
                    typeValue,
                    announcerValue,
                    subAnnouncerValue,
                    authorValue,
                    headerImgUrl,
                    recommend,
                    intro,
                    authorIntro,
                    announcerIntro,
                    directory: directoryValue,
                }

                // 展示xima
                // console.log(intro.match(regHtml))
                // console.log(obj)

                createIds(obj)
            })
        }

        function createIds(data) {
            let annValue = data.announcerValue
            if (data.subAnnouncerValue) {
                annValue += ',' + data.subAnnouncerValue
            }
            const typeArr = data.typeValue.split(reg)
            const authorArr = data.authorValue.split(reg)
            const annArr = annValue.split(reg)
            const params0 = { table: config.tables.types, key: 'name', values: typeArr }
            const params1 = { table: config.tables.authors, key: 'name', values: authorArr, desc: data.authorIntro } // 作者
            const params2 = { table: config.tables.announcers, key: 'nickName', values: annArr }

            Promise.all([create.create(params0), create.create(params1), create.create(params2)]).then(res => {
                selectIds(data)
            })
        }

        function selectIds(data) {
            const typeArr = data.typeValue.split(reg)
            const authorArr = data.authorValue.split(reg)
            const announcerArr = data.announcerValue.split(reg)
            const subAnnouncerArr = data.subAnnouncerValue.split(reg)
            const ins0 = { key: 'name', array: typeArr }
            const params0 = { table: config.tables.types, limit: 100, query: services.conditions({ ins: ins0 }) }
            const ins1 = { key: 'name', array: authorArr }
            const params1 = { table: config.tables.authors, limit: 100, query: services.conditions({ ins: ins1 }) }
            const ins2 = { key: 'nickName', array: announcerArr }
            const params2 = { table: config.tables.announcers, limit: 100, query: services.conditions({ ins: ins2 }) }
            const ins3 = { key: 'nickName', array: subAnnouncerArr }
            const params3 = { table: config.tables.announcers, limit: 100, query: services.conditions({ ins: ins3 }) }
            const arr = [typeArr, authorArr, announcerArr, subAnnouncerArr]

            // console.log(arr)
            Promise.all([services.list(params0), services.list(params1), services.list(params2), services.list(params3)]).then(res => {
                // console.log(res)
                let obj = {}
                res.map((item, index) => {
                    const { objects } = item
                    const ids = resultIds(arr[index], objects)
                    switch (index) {
                        case 0:
                            obj.types = ids;
                            break;
                        case 1:
                            obj.authorId = String(ids);
                            obj.authorPointer = services.getPointer({ table: config.tables.authors, id: obj.authorId })
                            break;
                        case 2:
                            obj.announcers = ids;
                            break;
                        case 3:
                            obj.subAnnouncers = ids;
                            break;
                    }
                })
                obj = { ...obj, headerImgUrl: data.headerImgUrl, recommend: data.recommend, intro: data.intro, announcerIntro: data.announcerIntro, directory: data.directory }
                update(data.id, obj)
            })
        }

        function resultIds(names, arr) {
            let ids = new Array(names.length)
            arr.map(item => {
                let idx = names.indexOf(item.name || item.nickName)
                if (idx > -1) {
                    ids[idx] = item.id
                }
            })
            return ids
        }

        function update(id, values) {
            // console.log({ id, values })
            services.update({ table: config.tables.books, id, values }).then(res => {
                console.log('数据更新---', ximaIndex)
                // getApp().showToast('数据更新成功')
                // 下一个
                ximaIndex++
                if (ximaIndex < ximaList.length) {
                    ximaFn(ximaList[ximaIndex])
                }
            })
        }
    },
}