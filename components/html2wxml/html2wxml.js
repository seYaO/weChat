var html2wxml = require('html2wxml-main.js');
const showdown = require('../parser/showdown-2.0.0')
const html2nodes = require('../parser/Parser');

Component({
    data: {},
    options: {
        addGlobalClass: true
    },
    properties: {
        text: {
            type: String,
            value: null,
            observer: function (newVal, oldVal) {
                if (newVal == '') return;
                let html = this.data.text, type = this.data.type

                if (this.data.type == 'md' || this.data.type == 'markdown') {
                    var converter = new showdown.Converter();
                    html = converter.makeHtml(html);
                    type = 'html'
                    // console.log(JSON.stringify(html))
                }

                if (this.data.type == 'html' || this.data.type == 'markdown' || this.data.type == 'md') {
                    var data = {
                        text: html,
                        type: type,
                        highlight: this.data.highlight,
                        linenums: this.data.linenums
                    };

                    if (this.data.imghost != null) {
                        data.imghost = this.data.imghost;
                    }

                    wx.request({
                        url: 'https://html2wxml.qwqoffice.com/api/',
                        data: data,
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: res => {
                            console.log('html2wxml >>>>>>>>', res.data)
                            html2wxml.html2wxml(res.data, this, this.data.padding);
                        }
                    })
                }
            }
        },
        json: {
            type: Object,
            value: {},
            observer: function (newVal, oldVal) {
                html2wxml.html2wxml(this.data.json, this, this.data.padding);
            }
        },
        type: {
            type: String,
            value: 'html'
        },
        highlight: {
            type: Boolean,
            value: true,
        },
        highlightStyle: {
            type: String,
            value: 'darcula'
        },
        linenums: {
            type: Boolean,
            value: true,
        },
        padding: {
            type: Number,
            value: 5
        },
        imghost: {
            type: String,
            value: null
        },
        showLoading: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        wxmlTagATap: function (e) {
            this.triggerEvent('WxmlTagATap', {
                src: e.currentTarget.dataset.src
            });
        }
    },
    attached: function () { }
})