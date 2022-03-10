// pages/chat/chat.js

var time = require('../../utils/util.js')
const _ = wx.cloud.database().command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputMessage:"",
        SendTime: '',
        Time: '',

        myface_url:"",
        myid:"heloo",
        myname:"",

        yourface_url:"",
        yourid:"",
        yourname:"",

        // allmessage:[
        //     {sender:"meteor shower",content:"你好啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊埃里克森的皇家萨拉昆达山东黄金"},
        //     {sender:"小红",content:"不好啊啊啊是卡洛夫基本是分开紧急应对措施v将发生啊看出你是"},
        //     {sender:"meteor shower",content:"在干嘛啊啊啊"},
        //     {sender:"meteor shower",content:"你好啊啊啊"},
        //     {sender:"小红",content:"不"},
        //     {sender:"meteor shower",content:"在干嘛啊啊啊"},
        //     {sender:"meteor shower",content:"你好啊啊啊"},
        //     {sender:"小红",content:"不好啊啊啊"},
        //     {sender:"meteor shower",content:"在干嘛啊啊啊"},
        //     {sender:"meteor shower",content:"你好啊啊啊"},
        //     {sender:"小红",content:"不好啊啊啊"},
        //     {sender:"meteor shower",content:"在干嘛啊啊啊"},
        // ]
        allmessage:[]
    },

    pageScrollToBottom: function() {
      wx.createSelectorQuery().select('#body-view').boundingClientRect(function(rect){
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: 10000
        })
      }).exec()
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this
        wx.getStorage({
          key: 'userInfo',
          success(res){
            that.setData({
                myface_url:res.data.avatarUrl,
                myname:res.data.nickName
            })
          }
        })
        wx.getStorage({
            key: 'myOpenId',
            success(res){
              that.setData({
                myid:res.data
              })
            }
          })
        wx.getStorage({
            key: 'you',
            success(res){
              console.log(res.data) //userinfo
              that.setData({
                yourface_url:res.data.userimg,
                yourid:res.data.userid,
                yourname:res.data.username
              })
            }
        })
    },
    

    formSubmit: function (e) {
      var that = this;
      if(!e.detail.value.userName) return
      this.pageScrollToBottom()
      console.log(e);
      this.setData({
        inputMessage: e.detail.value.userName,
        SendTime: Date.now(),
        Time: time.formatTime(new Date),
      })
      var newmessage = that.data.allmessage;
      newmessage.push({sender:that.data.myid,content:e.detail.value.userName});
      this.setData({
        allmessage:newmessage,
        inputMessage:''
      })
      // console.log(this.data.allmessage)

      wx.cloud.database().collection('Chat_Record').where({
        userid: _.all([that.data.myid,that.data.yourid])
      }).get({
        success:function(res){
          console.log(res);
          if(!res.data.length){
            console.log('jinlaile')
            wx.cloud.database().collection('Chat_Record').add({
              data:{
                userid:[that.data.myid,that.data.yourid],
                username:[that.data.myname,that.data.yourname],
                userface:[that.data.myface_url,that.data.yourface_url],
                messages:that.data.allmessage,
                lasttime:that.data.Time
              },success: function (res) {
                console.log(res);
              },
              fail:function(){
                console.error();
              }
            })
          }
          else{
            wx.cloud.database().collection('Chat_Record').where({
              userid: _.all([that.data.myid,that.data.yourid])
            }).update({
              data:{
                messages:that.data.allmessage,
                lasttime:that.data.Time
              }
            })
            console.log('meijinlai');
          }
        },
      })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      var that=this
      wx.setNavigationBarTitle({
        title: that.data.yourname,
      })
      wx.cloud.database().collection('Chat_Record').where({
        userid: _.all([that.data.myid,that.data.yourid])
      }).get({
        success:function(res){
          console.log(res);
          if(res.data.length){
            that.setData({
              allmessage:res.data[0].messages
            })
          }
        }
      })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      var that=this
      this.pageScrollToBottom();
      wx.cloud.database().collection('Chat_Record').where({
        userid: _.all([that.data.myid,that.data.yourid])
      }).get({
        success:function(res){
          console.log(res);
          if(res.data.length){
            that.setData({
              allmessage:res.data[0].messages
            })
          }
        }
      })
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
        wx.removeStorage({
            key: 'you',
          })
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