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
        myid:"",
        myname:"",

        yourface_url:"",
        yourid:"",
        yourname:"",

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
            key: 'yourname',
            success(res){
              console.log(res.data) //userinfo
              that.setData({
                yourname:res.data
              })
            }
        })
        wx.getStorage({
          key: 'yoururl',
          success(res){
            console.log(res.data) //userinfo
            that.setData({
              yourface_url:res.data
            })
          }
      })
        wx.getStorage({
          key: 'yourid',
          success(res){
            console.log(res.data) //userinfo
            that.setData({
              yourid:res.data
            })
          }
      })
    },
    

    formSubmit: function (e) {
      var that = this;
      if(!e.detail.value.userName) return
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
                somenew:[0,1],
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
            var which1=0
            var which2=0
            if(res.data[0].userid[0]==that.data.myid) {which1=0,which2=1}
            else {which1=1,which2=0}
            wx.cloud.database().collection('Chat_Record').where({
              userid: _.all([that.data.myid,that.data.yourid])
            }).update({
              data:{
                messages:that.data.allmessage,
                lasttime:that.data.Time,
                somenew:[which1,which2]
              }
            })
            console.log('meijinlai');
          }
        },
      })
      this.pageScrollToBottom()
    },

    down:function(){
      this.pageScrollToBottom()
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      var that=this
      var wh=[0,0]
      var which=0
      wx.setNavigationBarTitle({
        title: that.data.yourname,
      })
      wx.cloud.database().collection('Chat_Record').where({
        userid: _.all([that.data.myid,that.data.yourid])
      }).get({
        success:function(res){
          console.log(res);
          if(res.data.length){
            if(res.data[0].userid[0]==that.data.myid) which=0
            else which=1
            wh=res.data[0].somenew
            wh[which]=0
            wx.cloud.database().collection('Chat_Record').where({
              userid: _.all([that.data.myid,that.data.yourid])
            }).update({
              data:{
                somenew:wh
              }
            })
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
            key: 'yourid',
          })
          wx.removeStorage({
            key: 'yourname',
          })
          wx.removeStorage({
            key: 'yoururl',
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