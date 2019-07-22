import util from '../../utils/index'
import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerImg: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
        dataloaded: false,
    },

    init() {
        const { id = '' } = this.data
        const params = { id, table: 'books' }

        services.detail(params).then(res => {
            let intro = res.intro || ''
            let announcerIntro = res.announcerIntro || ''
            let figureIntro = res.figureIntro || ''
            let minImgUrl = util.setImageSize(res.headerImgUrl) || ''
            if (intro) {
                intro = util.newline(intro)
            }
            if (announcerIntro) {
                announcerIntro = util.newline(announcerIntro)
            }
            if (figureIntro) {
                figureIntro = util.newline(figureIntro)
            }

            this.setData({ minImgUrl, datas: res, intro, announcerIntro, figureIntro }, () => {
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
        const { announcers, authorId, types } = this.data.datas
        const typeData = this.typeData(types)
        const authorData = this.authorData(authorId)
        const announcerData = this.announcerData(announcers)

        Promise.all([typeData, authorData, announcerData]).then(res => {
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
        const params = { table: 'types', limit: 1000, query: this.conditions(ids) }
        return new Promise((resolve, reject) => {
            services.list(params).then(res=>{
                resolve({ typeList: res.objects })
            })
        })
    },

    authorData(id) {
        return new Promise((resolve, reject) => {
            services.detail({ id, table: 'authors' }).then(res => {
                resolve({ authorObj: res })
            })
        })
    },

    announcerData(ids) {
        const params = { table: 'announcers', limit: 1000, query: this.conditions(ids) }
        return new Promise((resolve, reject) => {
            services.list(params).then(res=>{
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({ title: '加载中' })
        this.setData({ ...options })

        this.init()
    },

    openType(e) {
        const { values } = e.currentTarget.dataset
    },

    openAnnouncer(e) {
        const { values } = e.currentTarget.dataset

        console.log(values)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})