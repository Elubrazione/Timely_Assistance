// miniprogram/pages/delete-Reply-Word/delete-Reply-Word.js
var time = require('../../utils/util.js')
var app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    discussShow: false,
    inputMessage: '',
    SendTime: '',
    Time: '',
    HeadImageUrl: '',
    UserName: '',
    PageId: '',
    UpPageId: '',
    RemoveId: '',
    PostUserId: '',
    ReplyOpenId: '',
    PageData: [],
    dataArray: [],
    PostUserData: [],
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function () {
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  formSubmit: function (e) {
    var that = this;
    //that.data.SendTime = time.formatTime(new Date)
    //console.log(that.data.SendTime)
   // console.log('点击评论')
    wx.showToast({
      title: '评论成功',
      icon: 'none'
    })
    //console.log(e.detail.value)
    this.setData({
      discussShow: true,
      inputMessage: e.detail.value.userName,
      SendTime: Date.now(),
      Time: time.formatTime(new Date)
    })
    /*console.log(that.data.inputMessage)
    console.log(that.data.SendTime)
    console.log(that.data.PageId)
    console.log(that.data.Time)*/

    const db = wx.cloud.database({ env: 'cloud1-3gkv0ad979cb9-7b660ab05e3'})
    const _ = db.command
    db.collection('Assistant_DataSheet').doc(that.data.PageId).update({
      data: {
        Reply_Record_num: _.inc(1)
      }
    })
    db.collection('My_ReplyData').add({
      data: {
        context: that.data.inputMessage,
        image: that.data.HeadImageUrl,
        time: that.data.SendTime,
        name: that.data.UserName,
        PageId: that.data.PageId,
        PostUserId: that.data.PostUserId,
        PageTime: that.data.Time
      }, success: function (res) {
        that.setData({
          inputMessage: ''
        })
        //刷新页面数据
        db.collection('My_ReplyData').where({
          PageId: that.data.PageId
        }).get({
          success: function (res) {
            that.setData({
              dataArray: res.data
            })
          }
        })
      }
    })
  },

  Remove_Post: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '请问是否删除本条评论？',
      success: function (res) {
        if (res.confirm) {
          const db = wx.cloud.database({ env: 'cloud1-3gkv0ad979cb9-7b660ab05e3' })
          console.log("post_id: "+e.currentTarget.dataset.post_id)

          db.collection('My_ReplyData').doc(e.currentTarget.dataset.post_id).remove().then(res => {
            db.collection('My_ReplyData').where({
              PageId: that.data.PageId
            }).get({
              success: function(res){
                that.setData({
                  dataArray: res.data
                })
              }
            })
          })
          console.log("pageid:"+that.data.PageId)
          var now_reply_record_num = 0
          db.collection('Assistant_DataSheet').where({
            _id: that.data.PageId
          }).get({
            success: res => {
              console.log("length:"+res.data.length)
              now_reply_record_num = res.data[0].Reply_Record_num
              console.log("now:"+now_reply_record_num)
              db.collection('Assistant_DataSheet').doc(that.data.PageId).update({
                data: {
                  Reply_Record_num: now_reply_record_num - 1
                }
              }).then(res => {
                console.log('delete successfully')
              })
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'key',
      success(res) {
        that.setData({
          PageId: res.data.post_id,
          PostUserId: res.data.postopenid
        })
        //根据贴子ID来查找贴子的内容
        db.collection('Assistant_DataSheet').doc(that.data.PageId).get({
          success: function (res) {
            that.setData({
              PageData: res.data
            })
           // console.log("我是第一个", that.data.PageData.Photo_arr)
          }
        })
       // console.log("我是pageid", that.data.PageId)
        //根据贴子的ID获取贴子下面的回复内容
        db.collection('My_ReplyData').where({
          PageId: that.data.PageId
        }).get({
          success: function (res) {
            that.setData({
              dataArray: res.data,
              RemoveId: res.data._id
            })
            //console.log("我是记录ID",RemoveId)
           // console.log("我是第三个")
          }
        })
        //根据发帖人的openid查找他的头像和用户名
        db.collection('Assistant_User').where({
          _openid: that.data.PostUserId
        }).get({
          success: function (res) {
            that.setData({
              PostUserData: res.data
            })
            //console.log("我是第二个", that.data.PostUserData)
          }
        })
        //获取自己的头像和用户名，使其可以在评论栏显示。
        db.collection('Assistant_User').where({
          _openid: app.globalData.openid
        }).get({
          success: function (res) {
            that.setData({
              HeadImageUrl: res.data[0].User_head_url,
              UserName: res.data[0].Username,
              ReplyOpenId: res.data[0]._openid
            })
           // console.log("我是用户的头像和姓名：", that.data.HeadImageUrl)
          }
        })
      }
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading();
  },
})