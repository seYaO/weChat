
App({
    onLaunch() {
        require('./utils/sdk-wechat.2.2.0')
        const { clientId } = this.globalData
        wx.BaaS.init(clientId)
    },
    /**
     * 授权登录获取userInfo、token
     */
    getlogin(cb) {

    },
    onShow() {
    },
    globalData: {
        clientId: '88bfb11e2bc47ad2beb5',
        userInfo: null,
        token: null,
    },
})



