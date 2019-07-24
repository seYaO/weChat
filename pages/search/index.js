import services from '../../services/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '梦',
    },

    conditions({ hotType, matches }) {
        const query = new wx.BaaS.Query()
        if (hotType) {
            query.compare(hotType, '=', true)
        }
        if (matches) {
            query.matches(matches.key, matches.regExp)
        }

        return query
    },

    init() {
        services.list({ table: 'books', limit: 6, query: services.conditions({ hotType: 'isRecommend' }) }).then(res => {
            const { meta, objects } = res
            this.setData({ recommendList: objects })
        })

        let historyList = wx.getStorageSync('ting.history')
        if (historyList) {
            this.setData({ historyList })
        }

        this.search('梦')
    },

    search(text) {
        let contain = { key: 'title', value: text }
        services.list({ table: 'books', limit: 50, query: services.conditions({ contain }) }).then(res => {
            const { meta, objects } = res
            let searchList = []
            if (objects) {
                objects.map(item => {
                    let obj = {}
                    obj.title = item.title
                    obj.id = item.id
                    obj.highLight = this.highLightWord(item.title, [text])
                    searchList.push(obj)
                })
            }
            this.setData({ searchList })
        })
    },

    onSearch(e) {
        const value = e.detail
        this.setData({ value })
        // console.log('onSearch---', e)
    },
    onChange(e) {
        const value = e.detail
        this.setData({ value })
        // console.log('onChange---', e)
        this.search(value)
    },
    onCancel(e) {
        wx.navigateBack()
    },

    clear() {
        wx.setStorageSync('ting.history', null)
    },

    uniq(array) {
        var temp = [];
        var index = [];
        var l = array.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                if (array[i] === array[j]) {
                    i++;
                    j = i;
                }
            }
            temp.push(array[i]);
            index.push(i);
        }
        return temp;
    },

    highLightWord(title = '', key = []) {
        let keyList = [],
            highLightArr = [];

        key.map(item => {
            let items = item.split('');
            items.map((item) => {
                keyList.push(item)
            })
        })
        keyList = this.uniq(keyList);
        let keyStr = keyList.join('')

        if (key.length) {
            title.split('').map(elem => {
                if (keyStr.indexOf(elem) != -1) {
                    highLightArr.push({
                        title: elem,
                        isHighLight: true,
                    })
                } else {
                    highLightArr.push({
                        title: elem,
                        isHighLight: false,
                    })
                }
            })
        }
        return highLightArr;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // let arr = ['kakasjdf', '拉卡加水淀粉', 'kakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdfkakasjdf']
        // wx.setStorageSync('ting.history', arr)
        this.init()
    },

    openDetail(e) {
        const { id } = e.currentTarget.dataset

        wx.navigateTo({
            url: `/pages/detail/index?id=${id}`,
        })
    },
})