/*
const db = wx.cloud.database({ })
const _ = db.command
*/
Page({
  data: {
    replyNumber: 0,
    toupNumber: 0,
    chatNumber: 0,
    hiddenmodalput: true,
    Username:'',
    Join_Time:'',
    User_head_url:'',
    U_id:'',
    Oldname:''

  },
  //点击按钮
  modalinput: function () {
    this.setData({
      Oldname: this.data.Username,
      hiddenmodalput: !this.data.hiddenmodalput
    })
    console.log(this.data.Oldname)
  },
  //取消按钮
  cancel: function () {
    let that=this
    that.setData({
      hiddenmodalput: true
    });
    if (that.data.Oldname != that.data.Username){
      that.setData({
        Username:that.data.Oldname
      });
    }
  },
  chatbutton: function () {
    /*
    var data = new Date()
    console.log(wx.getStorageSync("myOpenId"), "--------", data)
    wx.cloud.callFunction({
      name: 'upDateChat',
      data: {
        youid: wx.getStorageSync("myOpenId"),
        time: data.getTime()
      },
      success: function (res) {
        console.log(res, "-------------")
      }
    })
    */
    this.setData({
      chatNumber: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideTabBarRedDot({
      index: 1,
    })
    let Nowtime=Date.now();
    db.collection('Assistant_User').where({
      _openid: wx.getStorageSync("myOpenId"),
    }).get({
      success: res => {
       // console.log(res);
        if (86400000>(Nowtime - res.data[0].Creat_user_Time))
        {
          Nowtime=1;
        }
        else{
          Nowtime=parseInt((Nowtime - res.data[0].Creat_user_Time) / 86400000)+1
        }
        console.log(Nowtime)
        that.setData({
          Username:res.data[0].Username,
          User_head_url:res.data[0].User_head_url,
          Last_to_Reply: res.data[0].Last_to_Reply,
          Last_toup_Time: res.data[0].Last_toup_Time,
          U_id:res.data[0]._id,
          Join_Time: Nowtime
        })
      }
    })
  }
})
