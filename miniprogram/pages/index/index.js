// pages/index/index.js
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
      wx.getUserProfile({
          // 声明获取用户个人信息后的用途，后续会展示在弹窗中 谨慎填写
          desc: '您的授权将用于完善用户初始资料',
          success: (res) => {
              // console.log(res.userInfo); 
              this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
              })
          }
      })
  },
  getUserInfo(e) {
      // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，且返回匿名的用户个人信息
      this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
      })
  },
})