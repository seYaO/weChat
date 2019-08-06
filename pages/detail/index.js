const app = getApp()
import util from '../../utils/index'
import config from '../../utils/config'
import wxInfo from '../../utils/wxInfo'
import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerImg: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
        dataloaded: false,
    },

    // 配置项
    setConfig() {
        this.dirMask = this.selectComponent("#dirMask")
        this.dirMask.setConfig({
            title: '目录结构',
            // scrollToView: true
        });
    },

    init() {
        // wxInfo.getCurrentPages()

        const { id = '' } = this.data
        const params = { id, table: config.tables.books, expand: ['authorPointer'] }

        services.detail(params).then(res => {
            let intro = res.intro || ''
            let announcerIntro = res.announcerIntro || ''
            let figureIntro = res.figureIntro || ''
            let minImgUrl = util.setImageSize(res.headerImgUrl) || ''
            let directory = ''
            if (intro) {
                intro = util.newline(intro)
            }
            if (announcerIntro) {
                announcerIntro = util.newline(announcerIntro)
            }
            if (figureIntro) {
                figureIntro = util.newline(figureIntro)
            }
            if (res.directory) {
                let arr = JSON.parse(res.directory)
                directory = []
                arr.map((item, index) => {
                    let num = index + 1
                    directory.push({ num: ('000' + num).slice(-3), title: item })
                })
                // directory = JSON.parse(res.directory)
            }

            this.setData({ minImgUrl, datas: res, authorObj: res.authorPointer, directory }, () => {
                this.updateData()
            })
        })
    },

    conditions(array) {
        const query = new wx.BaaS.Query()
        query.in('id', array)
        return query
    },

    updateData() {
        const { announcers, types } = this.data.datas
        const typeData = this.typeData(types)
        const announcerData = this.announcerData(announcers)

        Promise.all([typeData, announcerData]).then(res => {
            let obj = {}
            if (res && res[0]) {
                res.map(item => {
                    obj = { ...obj, ...item }
                })
            }
            this.setData({ ...obj, dataloaded: true })
            wx.hideLoading()
            this.handlerData()
        })
    },

    typeData(ids) {
        const params = { table: config.tables.types, limit: 1000, query: this.conditions(ids) }
        return new Promise((resolve, reject) => {
            services.list(params).then(res => {
                resolve({ typeList: res.objects })
            })
        })
    },

    announcerData(ids) {
        const params = { table: config.tables.announcers, limit: 1000, query: this.conditions(ids) }
        return new Promise((resolve, reject) => {
            services.list(params).then(res => {
                resolve({ announcerList: res.objects })
            })
        })
    },

    handlerData() {
        const { announcerList, authorObj } = this.data
        if (announcerList) {
            let arr = [], value = ''
            announcerList.map((item, index) => {
                if (index < 2) {
                    arr.push(item.nickName)
                }
            })
            value = `${arr.join(',')}${announcerList.length > 2 ? '等' : ''}`
            this.setData({ announcerValue: value })
        }

        if (authorObj) {
            this.setData({ authorName: authorObj.name, authorIntro: util.newline(authorObj.intro) })
        }
    },

    previewImage(e) {
        const { img } = e.currentTarget.dataset
        wxInfo.previewImage(img, [img])
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({ title: '加载中' })
        this.setData({ ...options })
        this.setConfig()

        this.init()
    },

    openType(e) {
        const { values } = e.currentTarget.dataset
    },

    openAnnouncer(e) {
        const { values } = e.currentTarget.dataset

        wx.navigateTo({
            url: `/pages/announcer/index?id=${values.id}`,
        })
    },

    openDir() {
        const { directory } = this.data

        this.dirMask.showPopMasker()
    },

    openAuthor() {
        const { id, name } = this.data.authorObj
        app.globalData.listNavBarTitle = name

        wx.redirectTo({
            url: `/pages/list/index?authorId=${id}`,
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})