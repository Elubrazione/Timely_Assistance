const app=getApp()

Page({
  data: {
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: false,
  },
  onLoad() {
      if (wx.getUserProfile) {
          this.setData({
              canIUseGetUserProfile: true
          })
        }
  },
  getUserProfile(e) {
      // 使用wx.getUserProfile获取用户信息 开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            app.globalData.openid = res.result.openid
            wx.setStorageSync("myOpenId", res.result.openid);
            wx.setStorage({
                key: "User_openid",
                data: app.globalData.openid
              })
          }
      })
      wx.getUserProfile({
          // 声明获取用户个人信息后的用途，后续会展示在弹窗中 谨慎填写
          desc: '您的授权将用于完善用户初始资料',
          success: (res) => {
              // console.log(res.userInfo); 
              this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
              })
              wx.setStorage({
                key: "userInfo",
                data: this.data.userInfo
              })
              const db = wx.cloud.database({ env: 'cloud1-3gkv0ad979cb9-7b660ab05e3' })
              db.collection('Assistant_User').where({_openid: app.globalData.openid,
              }).get({
                  success: reg => {
                      console.log(reg)
                      if(reg.data.length == 0){
                        db.collection('Assistant_User').add({ //添加人
                            data: {
                              Username: res.userInfo.nickName,
                              Last_to_Reply: Date.now(),
                              Last_toup_Time: Date.now(),
                              User_head_url: res.userInfo.avatarUrl,
                              Creat_user_Time: Date.now()
                            }
                        }) 
                        console.log(res, '###Add new user!###')
                      }
                      else{
                          console.log('###You have registered###')
                      }
                  },
              })
              wx.switchTab({
                url: '../my/my',
              })
          }
      })
  },
  getUserInfo(e) {
      this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
      })
  },
})