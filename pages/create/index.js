const app = getApp()
import util from '../../utils/index'
import config from '../../utils/config'
import comServices from '../../services/common'
import services from '../../services/index'
import create from './create'
import update from './update'
const { updateBaidu, ...otherUpdate } = update
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
            getApp().showToast('bookId不能为空');
            return false
        }

        return true
    },
    // 新建部分
    ...create,
    // 更新部分
    ...update,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.BaaS.auth.loginWithWechat().then(user => {
            this.init()
        })

        // 创建临时匿名用户
        // wx.BaaS.auth.anonymousLogin().then(user => {
        //     console.log(user)
        // }).catch(err => {
        //     // HError
        // })
    },
})