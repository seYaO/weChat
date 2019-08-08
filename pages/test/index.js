Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.request({
            url: 'https://www.qwqoffice.com/html2wxml/example.html',
            success: res => {
                this.setData({ html: res.data });
            }
        })
        wx.request({
            url: 'https://cloud-minapp-28765.cloud.ifanrusercontent.com/1hvZmypTyz8uEFzk.md',
            success: res => {
                this.setData({ text: res.data });
            }
        })


    },
    /**
     * https://seyao.github.io/static/pdf/1.pdf
     * https://seyao.github.io/static/txt/1.txt
     * https://seyao.github.io/static/md/test.md
     * https://www.qwqoffice.com/html2wxml/example.html
     */
    init() {
        this.bgAudio()
        // this.innerAudio()
    },
    innerAudio() {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = 'https://cloud-minapp-29305.cloud.ifanrusercontent.com/1hvDYAMpsyXPPgCv.mp3'
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    bgAudio() {
        const backgroundAudioManager = wx.getBackgroundAudioManager()

        backgroundAudioManager.title = '不染'
        backgroundAudioManager.epname = '不染-毛不易'
        backgroundAudioManager.singer = '毛不易'
        backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = 'https://seyao.github.io/static/music/1.mp3'

    },
    wxmlTagATap(e) { },
})