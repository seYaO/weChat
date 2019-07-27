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
        const { values } = this.data
        this.setData({ ...values })
    },

    methods: {
        clickEvent(e) {
            wx.navigateBack()
        },
    }
})