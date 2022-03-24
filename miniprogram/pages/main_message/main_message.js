const _ = wx.cloud.database().command

// pages/output/output.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // chatlist:[
    //   {username:"小明",userid:"小明",userimg:"../../icon/user-unlogin.png",lastmessage:"好的"},
    //   {username:"小红",userid:"小红",userimg:"../../icon/user-unlogin.png",lastmessage:"不要了"},
    //   {username:"小蓝",userid:"小蓝",userimg:"../../icon/user-unlogin.png",lastmessage:"谢谢你"},
    // ],
    chatlist:[],
    myid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.getStorage({
      key: 'myOpenId',
      success(res){
        that.setData({
            myid:res.data
        })
      }
    })
  },

  switch: function (e) {
    // console.log(e.currentTarget.dataset.you)
    wx.setStorage({
      data: e.currentTarget.dataset.you.username,
      key: 'yourname',
    })
    wx.setStorage({
      data: e.currentTarget.dataset.you.userimg,
      key: 'yoururl',
    })
    wx.setStorage({
      data: e.currentTarget.dataset.you.userid,
      key: 'yourid',
    })
    wx.navigateTo({
      url: '../chat/chat',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    wx.cloud.database().collection('Chat_Record').where({
      userid:_.all([that.data.myid])
    }).orderBy('lasttime','desc').get({
      success:function(res){
        console.log(res);
        var i=0
        var which=0
        var newlist=[]
        for(i=0;i<res.data.length;i++){
          if(res.data[i].userid[0]==that.data.myid) which=1
          else which=0
          newlist.push({
            username:res.data[i].username[which],
            userid:res.data[i].userid[which],
            userimg:res.data[i].userface[which],
            lastmessage:res.data[i].messages[res.data[i].messages.length-1].content,
            lasttime:res.data[i].lasttime,
            newmessage:res.data[i].somenew[(which+1)%2]
          })
        }
        that.setData({
          chatlist:newlist
        })
      }
    })
    console.log('smready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    wx.cloud.database().collection('Chat_Record').where({
      userid:_.all([that.data.myid])
    }).orderBy('lasttime','desc').get({
      success:function(res){
        console.log(res);
        var i=0
        var which=0
        var newlist=[]
        for(i=0;i<res.data.length;i++){
          if(res.data[i].userid[0]==that.data.myid) which=1
          else which=0
          newlist.push({
            username:res.data[i].username[which],
            userid:res.data[i].userid[which],
            userimg:res.data[i].userface[which],
            lastmessage:res.data[i].messages[res.data[i].messages.length-1].content,
            lasttime:res.data[i].lasttime,
            newmessage:res.data[i].somenew[(which+1)%2]
          })
        }
        console.log(newlist)
        that.setData({
          chatlist:newlist
        })
      }
    })
    console.log('smshow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})