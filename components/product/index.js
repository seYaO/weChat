Component({

    properties: {
        values: {
            type: Object,
            value: null,
        },
        other: {
            type: [Object, String],
            value: null,
        },
    },

    data: {
        coverImg: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
    },

    created() {
        // this.priceSubmitPop = this.selectComponent("#priceSubmitPop");
        // this.priceSubmitPop.setConfig({
        //     showBtn: false,
        //     top: '',
        //     radius: '0',
        //     closeFn: () => {
        //         this.setData({
        //             isShowPriceDetailPop: false
        //         })
        //     }
        // });
    },

    methods: {
        // 复制内容
        getClipboard(e) {
            const { value } = e.currentTarget.dataset
            wx.setClipboardData({
                data: value,
                success(res) {
                    getApp().showToast('内容已复制,打开百度网盘')
                }
            })
        },
    }
})