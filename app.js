
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
    showToast(msg, icon, duration) {
        wx.showToast({
            title: msg,
            icon: icon || 'none',
            mask: true,
            duration: duration || 2000
        });
    },
    hideToast() {
        wx.hideToast()
    },
    showLoading(msg) {
        wx.showLoading({ title: msg || '加载中...', mask: true });
    },
    hideLoading() {
        wx.hideLoading();
    },
    globalData: {
        clientId: '88bfb11e2bc47ad2beb5',
        userInfo: null,
        token: null,
    },
})



