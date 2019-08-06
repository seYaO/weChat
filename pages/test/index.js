
Page({

    /**
     * 页面的初始数据
     */
    data: {
        html: `
        | 标题1 | 标题2 |\n|:---:|:---:|\n| 内容1 | 内容2 |\n\n
        <div style="text-align:center;">\n  <img src="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo1-1.jpg?sign=4ac0a0441f2c0e3c80909c11fcc278e2&t=1560246174" />\n<p style="color:gray;font-size:12px;text-align:center">点击图片预览</p>\n</br>\n  <img ignore src="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo1-3.gif?sign=4dd623d040aba5e2ca781e9e975800bd&t=1560247351" width="50%"/>\n  <p style="color:gray;font-size:12px">装饰图片不能预览</p>\n</div><div style="text-align:center">\n  <a href="/pages/component/component">\n    <img src="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo1-1.jpg?sign=4ac0a0441f2c0e3c80909c11fcc278e2&t=1560246174" />\n  </a>\n  <p style="font-size:12px;color:gray">图片链接，点击可以跳转</p>\n  <br />\n  <a href="https://github.com/jin-yufeng/Parser">https://github.com/jin-yufeng/Parser</a>\n  <p style="color:gray;font-size:12px">外部链接，长按可以复制</p>\n</div>
        <p><img data-key=\"0\" src=\"http://fdfs.xmcdn.com/group52/M0A/75/D8/wKgLcFwbCVvClip7AAHfQwWR8zU765_mobile_large.jpg\" alt=\"\" data-origin=\"http://fdfs.xmcdn.com/group52/M0A/75/D8/wKgLcFwbCVvClip7AAHfQwWR8zU765.jpg\" data-large=\"http://fdfs.xmcdn.com/group52/M0A/75/D8/wKgLcFwbCVvClip7AAHfQwWR8zU765_mobile_large.jpg\" data-large-width=\"750\" data-large-height=\"300\" data-preview=\"http://fdfs.xmcdn.com/group52/M0A/75/D8/wKgLcFwbCVvClip7AAHfQwWR8zU765_mobile_small.jpg\" data-preview-width=\"140\" data-preview-height=\"56\" /></p>
        <div style="text-align:center;">\n  <video src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" controls></video>\n</div>
        <div style="text-align:center;">\n  <img src="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo1-1.jpg?sign=4ac0a0441f2c0e3c80909c11fcc278e2&t=1560246174" />\n<p style="color:gray;font-size:12px;text-align:center">点击图片预览</p>\n</br>\n  <img ignore src="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo1-3.gif?sign=4dd623d040aba5e2ca781e9e975800bd&t=1560247351" width="50%"/>\n  <p style="color:gray;font-size:12px">装饰图片不能预览</p>\n</div>
        <pre>function test(){\n  console.log("Hello World!");\n}</pre>
        `
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.request({
            // url: 'https://www.qwqoffice.com/html2wxml/example.html',
            url: 'https://cloud-minapp-28765.cloud.ifanrusercontent.com/1hqtagdolX5SSJS4.md',
            success: res => {
                this.setData({ text: res.data });
                // debugger

                var data = {
                    text: res.data,
                    type: 'markdown',
                    highlight: true,
                    linenums: true
                };

                // if (this.data.imghost != null) {
                //     data.imghost = this.data.imghost;
                // }

                wx.request({
                    url: 'https://www.qwqoffice.com/html2wxml/',
                    data: data,
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: _res => {
                        console.log(_res)
                        // html2wxml.html2wxml(res.data, this, this.data.padding);
                    }
                })
            }
        })
    },
    wxmlTagATap(e) { }
})