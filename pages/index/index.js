import services from '../../services/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  init(){
        services.list({ table: 'store', limit: 50 }).then(res=>{
            const {objects}=res
            let arr = []
            objects.map(item=>{
                // {name:item.name,desc:item.desc}
                arr.push(`${item.name} - ${item.desc}`)
            })
            console.log(JSON.stringify(arr))
        })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
      this.init()
  },
})