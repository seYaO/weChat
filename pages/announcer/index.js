import util from '../../utils/index'
import config from '../../utils/config'
import wxInfo from '../../utils/wxInfo'
import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataloaded: false,
        coverImg: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
        scrollTop: 0,
        isoverflow: false,
        showNavbarColor: false,
        menuWidth: 100,
        headerHeight: 100,
        list: null,
        values: {
            id: 'dskahjfd23874',
            imgUrl: '',
            title: '商品标题',
            desc: '描述信息',
            tags: ['标签', '标签'],
            announcerValue: '',
            cloudDownload: '',
        }
    },

    setConfigNavBar() {
        let menuWidth = 100;

        if (wx.getMenuButtonBoundingClientRect) {
            try {
                let info = wx.getMenuButtonBoundingClientRect()
                // 注： 小程序微信7.0.3以下版本获取到的width 有时会是 整个屏幕的宽度
                menuWidth = Math.min(info && info.width || 100, 120);
            } catch (e) { }
        }
        // 注 下面字段依赖公共
        this.setData({
            menuWidth: menuWidth,
        })
    },

    setConfigHeader() {
        wxInfo.querySelect('#header').then(res => {
            const data = res[0]
            this.setData({ headerHeight: data.height })
        })
    },

    init() {
        const { id = '' } = this.data
        const query = services.conditions({ ins: { key: 'announcers', array: [id] } })
        const params = { table: config.tables.books, limit: 100, query }
        services.detail({ id, table: config.tables.announcers }).then(res => {
            const { cover, nickName, intro } = res
            this.setData({ dataloaded: true, cover: util.setImageSize(cover) || '', nickName, intro })
            wx.hideLoading()
            this.setConfigHeader()
        })
        services.list(params).then(res => {
            const { meta, objects } = res
            objects.map(item => {
                item.typeList = []
                item.announcerList = []
                item.announcerValue = ''
                item.authorObj = {}
                item.minImgUrl = util.setImageSize(item.headerImgUrl) || ''
                return item;
            })
            if (objects && objects[0]) {
                this.setData({ dataloaded: true, list: objects, }, () => {
                    this.updateList(100, 0)
                })
            }
        })
    },

    updateList(limit, offset) {
        let datas = this.data.list
        const { list } = this.data

        for (let i = offset * limit; i < limit * (offset + 1); i++) {
            if (datas[i]) {
                const { types = [], announcers = [], authorId = '' } = datas[i];
                let allArr = []

                if (types && types[0]) {
                    const params = { table: config.tables.types, limit: 1000, query: services.conditions({ ids: types.slice(0, 4) }) }
                    const res = services.list(params)
                    allArr.push(res)
                } else {
                    allArr.push(null)
                }

                if (announcers && announcers[0]) {
                    const params = { table: config.tables.announcers, limit: 1000, query: services.conditions({ ids: announcers }) }
                    const res = services.list(params)
                    allArr.push(res)
                } else {
                    allArr.push(null)
                }
                Promise.all(allArr).then(res => {
                    let typeArr = [], tags = [], announcerArr = [], announcerNum = 0, announcerValue = ''
                    res.map((item, index) => {
                        if (item) {
                            const { objects } = item
                            objects.map((_item, _index) => {
                                if (index == 0) {
                                    typeArr.push({ id: _item.id, name: _item.name })
                                    tags.push(_item.name)
                                }
                                if (index == 1) {
                                    if (_index < 3) {
                                        announcerArr.push(_item.nickName)
                                    }
                                    announcerNum = announcerNum + (_index + 1)
                                }
                            })
                        }
                    })
                    announcerValue = `${announcerArr.join(',')}${announcerNum > 3 ? '...' : ''}`
                    list[i].tags = tags
                    list[i].typeList = typeArr
                    list[i].announcerValue = announcerValue || '暂无'
                    this.setData({ list })
                })

                // this.getData('author', authorId)
            }

        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({ title: '加载中' })
        this.setData({ ...options })

        this.setConfigNavBar()
        this.init()
        // wx.request({
        //     // url: 'https://www.qwqoffice.com/html2wxml/example.html',
        //     url: 'https://cloud-minapp-28765.cloud.ifanrusercontent.com/1hqtagdolX5SSJS4.md',
        //     success: res => {
        //         this.setData({ text: res.data });
        //     }
        // })
    },
    scroll(e) {
        const { scrollTop } = e.detail
        this.navBarChange(scrollTop)
    },
    top() { },
    scrolltolower() { },

    navBarChange(scrollTop) {
        const { showNavbarColor, headerHeight } = this.data
        if (!showNavbarColor && scrollTop > headerHeight - 20) {
            this.setData({
                showNavbarColor: true
            })
        } else if (showNavbarColor && scrollTop < headerHeight - 20) {
            this.setData({
                showNavbarColor: false
            })
        }
    },

    wxmlTagATap(e) {
        console.log(e);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },
})