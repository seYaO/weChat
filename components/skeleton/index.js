Component({

    properties: {
        type: {
            type: String,
            value: 'vertical',
        },
        col: {
            type: Number,
            value: 1,
        },
        row: {
            type: Number,
            value: 3,
        },
        rowWidth: {
            type: [Number, String],
            value: 100
        },
        title: {
            type: Boolean,
            value: false,
        },
        titleWidth: {
            type: [Number, String],
            value: 40
        },
        avatar: {
            type: Boolean,
            value: false,
        },
        avatarSize: {
            type: [Number, String],
            value: 32
        },
        avatarShape: {
            type: String,
            value: 'round',
        },
        animate: {
            type: Boolean,
            value: true,
        },
        values: {
            type: Object,
            value: null,
        },
        other: {
            type: [Object, String],
            value: null,
        },
        loading: {
            type: Boolean,
            value: true,
        }
    },

    data: {
        value: '',
        cols: [],
        rows: [],
    },

    attached() {
        const { col, row, rowWidth } = this.data
        let rows = [], cols = []
        for (let i = 0; i < col; i++) {
            cols.push(i)
        }
        for (let i = 0; i < row; i++) {
            if (row == 1) {
                rows.push(rowWidth)
            } else {
                if (i == row - 1) {
                    rows.push(60)
                } else {
                    rows.push(rowWidth)
                }
            }
        }
        this.setData({ cols, rows })

    },

    methods: {
        clickEvent(e) {
            wx.navigateBack()
        },
    }
})