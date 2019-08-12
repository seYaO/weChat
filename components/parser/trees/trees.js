let realWindowWidth = 0, realWindowHeight = 0;
wx.getSystemInfo({
    success: function (res) {
        realWindowWidth = res.windowWidth
        realWindowHeight = res.windowHeight
    }
})

Component({
    properties: {
        nodes: {
            type: Array,
            value: []
        },
        controls: {
            type: Object,
            value: {}
        },
        padding: {
            type: Number,
            value: 5
        },
    },
    methods: {
        //冒泡事件
        playEvent(e) {
            this.triggerEvent('play', e.currentTarget.dataset.id, {
                bubbles: true,
                composed: true
            });
        },
        previewEvent(e) {
            console.log(e.target.dataset.hasOwnProperty('ignore'), e.currentTarget.dataset.src)
            if (!e.target.dataset.hasOwnProperty('ignore')) {
                this.triggerEvent('preview', e.currentTarget.dataset.src, {
                    bubbles: true,
                    composed: true
                });
            }
        },
        tapEvent(e) {
            this.triggerEvent('linkpress', e.currentTarget.dataset.href, {
                bubbles: true,
                composed: true
            });
        },
        errorEvent(e) {
            //尝试加载其他源
            if (!this.data.controls[e.currentTarget.dataset.id] && e.currentTarget.dataset.source.length > 1) {
                this.data.controls[e.currentTarget.dataset.id] = {
                    play: false,
                    index: 1
                }
            } else if (this.data.controls[e.currentTarget.dataset.id] && e.currentTarget.dataset.source.length > (this.data.controls[e.currentTarget.dataset.id].index + 1)) {
                this.data.controls[e.currentTarget.dataset.id].index++;
            }
            this.setData({
                controls: this.data.controls
            })
            this.triggerEvent('error', {
                target: e.currentTarget,
                message: e.detail.errMsg
            }, {
                    bubbles: true,
                    composed: true
                });
        },
        //内部方法：加载视频
        _loadVideo(e) {
            this.data.controls[e.currentTarget.dataset.id] = {
                play: true,
                index: 0
            }
            this.setData({
                controls: this.data.controls
            })
        },
        _loadImg(e) {
            const { width, height } = e.detail
            // 获取图片的原始长宽
            let windowWidth = 0, windowHeight = 0;
            let autoWidth = 0, autoHeight = 0;
            let results = {};
            let padding = this.data.padding;
            windowWidth = realWindowWidth - 2 * padding;
            windowHeight = realWindowHeight;
            // 判断按照那种方式进行缩放
            // 在图片width大于手机屏幕width时候
            if (width > windowWidth) {
                autoWidth = windowWidth;
                autoHeight = (autoWidth * height) / width;
                results.imageWidth = autoWidth;
                results.imageHeight = autoHeight;
            }
            // 否则展示原来的数据
            else {
                results.imageWidth = width;
                results.imageHeight = height;
            }

            this.setData({ ...results })
        },
    }
})