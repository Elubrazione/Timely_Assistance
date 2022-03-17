
 const db = wx.cloud.database()
 const _ = db.command

Page({
  data: {
    favorNumber: 0,
    toupNumber: 0,
    footNumber: 0,
    hiddenmodalput: true,
    Username: '',
    Join_Time:'',
    User_head_url:'',
    U_id:'',
    Oldname:''
  },
  // modalinput:function(){
  //   this.setData({
  //     Oldname:this.data.Username,//将现在的名字作为旧名字设置
  //     hiddenmodalput:!this.data.hiddenmodalput  //将框显示
  //   })
  //   console.log(this.data.Oldname)
  // },
  // //取消按钮
  // cancel:function(){
  //   let that=this
  //   that.setData({
  //     hiddenmodalput:true//取消的时候再把它隐藏起来
  //   });
  //   if(that.data.Oldname!=that.data.Username){//如果现在的名字和之前的名字不一样
  //     that.setData({
  //       Username:that.data.Oldname  //要把名字改回去
  //     })
  //   }
  // },
  
  // //确认修改名字
  // confirm: function (e) {
  //   let that=this
  //   this.setData({
  //     hiddenmodalput: true//再把输入框隐藏
  //   })
  //   if(this.data.Oldname!=this.data.Username){//如果用户改名了
  //     wx.cloud.callFunction({
  //       name: 'Assistant_update_Username',//调用云函数在数据库中修改用户信息
  //       data: {
  //         Usernewname: that.data.Username,
  //         User_inf_id: that.data.U_id
  //       },
  //       success: function (res) {
  //         wx.showToast({
  //           title: '修改成功',
  //           icon: 'success',
  //           duration: 1500
  //         })
  //       },
  //       fail: err => {
  //         console.log('error:', err)
  //       }
  //     })
  //   }
  // },
  // ChangeName: function(e){
  //   this.setData({//改名 将用户名更改
  //     Username: e.detail.value
  //   })
  // },


  //收藏
  favor_button: function () {
    var data = new Date()
    db.collection("Assistant_User").where({
      _openid:wx.getStorageSync("myOpenId")
    }).update({
      data: {
        Last_to_favor:data.getTime()
      },
    }).then(res=>{
      console.log(res)
    })
    this.setData({ 
      favorNumber: 0
    })
    wx.navigateTo({ //跳转到我的收藏页面
      url: '../mine_favor/mine_favor',
    success:()=>{
      console.log('ok')
    }, 
    fail: (res) => {
      console.log(res)
    }
  })
  },
  //点赞
  upbutton: function () {
    var data = new Date()
    console.log(wx.getStorageSync("myOpenId"), "--------", data)
    db.collection("Assistant_User").where({
      _openid:wx.getStorageSync("myOpenId")
    }).update({
      data: {
        Last_to_up:data.getTime()
      },
    }).then(res=>{
      console.log(res)
    })
    this.setData({
      toupNumber: 0
    })
    wx.navigateTo({
      url: '../mine_up/mine_up',
    })
  },
//足迹
footbutton: function () {
  var data = new Date()
  console.log(wx.getStorageSync("myOpenId"), "--------", data)
  db.collection("Assistant_User").where({
    _openid:wx.getStorageSync("myOpenId")
  }).update({
    data: {
      Last_to_foot:data.getTime()
    },
  }).then(res=>{
    console.log(res)
  })
  this.setData({
    footNumber: 0
  })
  wx.navigateTo({
    url: '../mine_comment/mine_comment',
  })
},
  
  ShowAboutus:function(){
      wx.showToast({
        title: '两只老虎团队',
        image:'../../icon/my.png',
        // 延迟的时间
        duration:3000 
      })
  },
  //跳转
  toMinemypost:function(){
    wx.navigateTo({
      url: '../mine_mypost/mine_mypost',
    })
  },
  toMineMySell:function(){
    wx.navigateTo({
      url: '../mine_mysell/mine_mysell',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    //获取头像和名字
    console.log(that.data);
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        //console.log(res.data) //userinfo
        that.setData({
          Username:res.data.nickName,
          User_head_url:res.data.avatarUrl
        })
        // console.log(res.data.nickName)
      }
    })
    wx.hideTabBarRedDot({
      index: 1,//隐藏了消息中心的红点
    })
    let Nowtime=Date.now();
    // console.log(Nowtime);
    db.collection('Assistant_User').where({
      _openid: wx.getStorageSync("myOpenId"),
    }).get({
      success: res => {
        console.log(res);
        if (86400000>(Nowtime - res.data[0].Creat_user_Time))
        {
          Nowtime=1;
        }
        else{
          Nowtime=parseInt((Nowtime - res.data[0].Creat_user_Time) / 86400000)+1
        }
       // console.log(Nowtime)
        that.setData({
          //Username:res.data[0].Username,
          //User_head_url:res.data[0].User_head_url,
          Last_to_favor: res.data[0].Last_to_favor,
          Last_to_up: res.data[0].Last_to_up,
          U_id:res.data[0]._id,
          Join_Time: Nowtime
        })
        console.log(res);
        db.collection("Assistant_Up").where({
          Up_id: wx.getStorageSync("myOpenId"),
        }).get({
          success: res => {
            console.log(res);
            for (var i = 0; i < res.data.length; i++) {
             console.log("#######", res.data[i].Time_s)
             console.log(that.data.Last_to_up)
              if (res.data[i].Time_s > that.data.Last_to_up) { //越大的数字表示越前面
                that.setData({
                  toupNumber: that.data.toupNumber + 1
                })
                console.log(toupNumber);
              }
            }//end of for
          }
        })
        db.collection('My_ReplyData').where({
          PostUserId: wx.getStorageSync("myOpenId"),
        }).get({
          success: res => {
           // console.log(res.data)
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].time > that.data.Last_toup_Time) {
                that.setData({
                  replyNumber: that.data.replyNumber + 1
                })
              }
            }
          }
        })
        db.collection('Assistant_Sell_Intention').where({
          buypostopenid: wx.getStorageSync("myOpenId"),
        }).get({
          success: res => {
            console.log("-------", res.data)
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].Time_s > that.data.Last_toup_Time) {//改成最后进入聊天的时间
                that.setData({
                  chatNumber: that.data.chatNumber + 1
                })
              }
            }
          }
        })
      }//end of Usersuccess
    })
  }
})
