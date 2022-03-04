// pages/index/index.js
const app=getApp()
Page({
  data: {
  },

  onLoad: function (options) {
    if(!wx.cloud){
      wx.showToast({
        title: '尚未登陆',  //提示内容
        icon: 'loading',  //显示加载的图标
        duration: 1500  //提示的延迟时间
      })
      return 
    }
    wx.getSetting({ //获取用户的当前设置
      success: res => { //接口调用成功的回调函数，res是服务器返回的内容，相当于object
        if(res.authSetting['scope.userInfo']){  //scope.userInfo：是否授权信息
          wx.cloud.callFunction({
            name: "login",
            data: {},
            success: res => {
              // app.globalData.openid = res.result.openid
              // wx.setStorageSync("myOpenId", res.result.openid);
              wx.getUserProfile({
                desc: '授权将用于完善用户资料',
                success: res => {
                  this.setData({  //用户设置
                    userInfo: res.userInfo,
                    hasUserInfo: true
                  })
                  wx.setStorage({ //将数据存储在本地缓存中指定的 key 中
                    key: "Userinfo",  //本地缓存中指定的key
                    data: this.data.userInfo  //需要储存的内容
                  })
                  wx.switchTab({  //界面跳转到指定页面，这里要跳转到我们的广场
                    /*************这里做好后要填起来填************/
                    url: 'url',
                  })
                }
              })
            },
            fail: err => {  //接口调用失败
              console.error('[云函数] [login] 调用失败', err)
              wx.showToast({
                title: '云函数：调用失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
        else{
          wx.redirectTo({ //关闭当前页面，并跳转到指定页面，这里要跳到登录页面
            /*************这里做好后要填起来填************/
            url: 'url',
          })
        }
      },
    })
  },
})