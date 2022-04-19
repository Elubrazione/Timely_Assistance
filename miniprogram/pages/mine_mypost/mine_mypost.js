var app = getApp()
var util = require('../../utils/util.js');
var allId = new Array()
var allUpId = new Array()
const db = wx.cloud.database({ env: 'cloud1-3gkv0ad979cb9-7b660ab05e3' })
Page({

  data: {
    currentTab: 0,
    DataPost_arry: [],      
    User_head_url_arry: [], //存放用户的头像
    Up_array: [],           //用来存放有没有点赞，没点过就是0，点过了就是1
    Username_arry: [],      //存放用户的名字
    UserId: '',//app.globalData.openid
    replyData: []
  },
  MyEachHelp:function(){//去搜索我的互助
    var that = this
    var myOpenId=wx.getStorageSync("myOpenId");
    var used_id,used_openid;
    db.collection('Assistant_DataSheet').where({ //用来更新页面数据的
        _openid: myOpenId
      }).get({
        success: res => {
            console.log(res);
          for (var j = 0; j < res.data.length; j++) {
            let index = res.data.length - j - 1
            var Time ='DataPost_arry['+index+'].Time';
            var Context='DataPost_arry['+index+'].Context';
            var time = util.formatTime(res.data[j].Time)//格式化时间
            var Photo_arr='DataPost_arry['+index+'].Photo_arr';
            var Type='DataPost_arry['+index+'].Type';
            var _openid='DataPost_arry['+index+']._openid';
            var _id='DataPost_arry['+index+']._id';
            var Up_Record_num='DataPost_arry['+index+'].Up_Record_num';//记录的这条记录的点赞数
            var Reply_Record_num='DataPost_arry['+index+'].Reply_Record_num';//记录的是回复数
            used_id=res.data[index]._id;
            used_openid=res.data[index]._openid;
            console.log(time)
            that.setData({
              [Time]: time.substr(time.indexOf("-") + 1, 5), 
              [Context]:res.data[index].Context,
              [Photo_arr]:res.data[index].Photo_arr,
              [Type]:res.data[index].Type,
              [_openid]:res.data[index]._openid,
              [Up_Record_num]:res.data[index].Up_Record_num,
              [Reply_Record_num]:res.data[index].Reply_Record_num,
              [_id]:res.data[index]._id,
            })
           // console.log(used_id,used_openid);
            db.collection("Assistant_Up").where({
              _openid: used_openid,
              Up_Post_id: used_id
            }).get({
              success:res=>{
                console.log(res);
                console.log(res.data.length);
                if(res.data.length==0)   Up_array[index]=0;
                else  Up_array[index]=1;
              }
            })
            db.collection('Assistant_User').where({
              _openid: res.data[index]._openid
            }).get({
              success: res => {
                //console.log(res);
                // let headUrl = 'upList[' + index + '].headUrl';//获取头像
                // let userName = 'upList[' + index + '].userName';//获取名字
                var head_url='User_head_url_arry['+index+'].head_url';
                var username='Username_arry['+index+'].username';
                that.setData({
                  // [headUrl]: res.data[0].User_head_url,
                  // [userName]: res.data[0].Username
                  [head_url]:res.data[0].User_head_url,
                  [username]:res.data[0].Username
                })
              }
            })
          }//end of for
        }
      })
      
  },
//预览图片，纯调试
  previewImage: function (e) {
    //var current = e.target.dataset.src;
    wx.previewImage({
      //current: current, // 当前显示图片的http链接
      urls: [e.target.dataset.myimg], // 需要预览的图片http链接列表
    })
  },

  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 0) { this.get_DBinf(); }
    else { this.get_Sell_DBinf(); }
  },

  onLoad() {
    let that = this
    this.MyEachHelp();
  },

  upclickbutton: function (e) {
    var that = this
    console.log(e);
    var ind = e.currentTarget.dataset.nowindex
    //console.log("Post_id:" + e.currentTarget.dataset.post_id)
    const postuserid = e.currentTarget.dataset.postopenid

    //console.log(this.data.UpArray[ind] == 0)

    if (this.data.Up_array[ind] == 0)//说明没点赞过
    {
      var nowup = 'Up_array[' + ind + ']'//设置为点赞过
      this.setData({
        [nowup]: 1
      })
      const db = wx.cloud.database({ env: 'cloud1-3gkv0ad979cb9-7b660ab05e3' })
      return db.collection('Assistant_Up').add({ //添加帖子
        data: {
          Up_Post_id: e.currentTarget.dataset.post_id,
          Up_id: e.currentTarget.dataset.postopenid,
          Time_s: Date.now()
        }
      }).then(res => {
        console.log("Assistant_Up OK!");
        console.log("Pick the post_id:"+e.currentTarget.dataset.post_id);
        wx.cloud.callFunction({
          name: 'Up_Assistant_Post',
          data: {
            Post_id: e.currentTarget.dataset.post_id,
          },
          success: function (res) {
            console.log("Up_Assistant_Post OK!");
            that.get_DBinf()
            wx.showToast({
              title: '已点赞',
              image: '../../icon/Up_heart.jpeg',
              duration: 2000
            })
          },
          fail: err => {
            console.log('error:', err)
          }
        })
      })
    }
    else{
      wx.showToast({
        title: '已点赞过',
        image: '../../icon/Up_heart2.png',
        duration: 2000
      })
    }
  },


  Remove_Post:function(e){
    let that = this
    wx.showModal({
      title: '提示',
      content: '请问是否删除本条树洞？',
      success: function (res) {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.post_id)//事件的id
          wx.cloud.callFunction({
            name: 'Remove_Assistant_DataSheet',
            data: {
              youid: e.currentTarget.dataset.post_id,
            },
            success: function (res) {
              that.get_DBinf()
            }
          })
        }
      }
    })
  },

  to_Reply: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.post_id);//事件的id
    console.log(e.currentTarget.dataset.postopenid);//创建表的用户openid
    //console.log(e.currentTarget.dataset)
    that.setData({
      replyData: e.currentTarget.dataset
    })
    console.log(that.data.replyData)
    wx.setStorage({
      key: "key",
      data: that.data.replyData
    })
    wx.navigateTo({
      url: '../reply/reply',
    
    })
  },

  onShow(){
    this.get_DBinf();
    this.get_Sell_DBinf();
  },
  get_DBinf:function(){
    let that = this
     wx.getStorage({
       key: 'User_openid',
       success(res) {
         that.setData({
           UserId: res.data
         })
         ////
         var db = wx.cloud.database()
         let userid = res.data;
         //console.log("My openid:"+userid);
         db.collection('Assistant_Up').where({//获取自己的点赞列表
           _openid: userid
         }).get({
           success: res => {   
             
             //console.log("点赞列表:", res.data)
 
             for (var i = 0; i < res.data.length; i++) {
               UserUpId[i] = res.data[i].Up_Post_id//点赞列表赋值
             }
 
             db.collection('Assistant_DataSheet').get({
               success: res => {
                 //console.log("Assistant_DataSheet Res"+res);
                 that.setData({
                   alldata: res.data//所有的用户列表数据
                 })
                 for (var i = 0; i < res.data.length; i++) {
                   UserIdArry[i] = res.data[i]._id  //所有的用户列表_id
                   if (UserUpId.indexOf(UserIdArry[i]) == -1) {
                     var item = 'UpArray[' + i + ']'
                     that.setData({
                       [item]: 0
                     })
                   }
                   else {
                     var item = 'UpArray[' + i + ']'
                     that.setData({
                       [item]: 1
                     })
                   }
                 }
                 //console.log(that.data.UpArray)
               }
             })
           },
         })
       }
     })
     const get_inf_db = wx.cloud.database()//{ env: 'textllinpro-5br77' }
     get_inf_db.collection('Assistant_DataSheet').get({
       success: res => {
         that.setData({
           DataPostArry: res.data
         })
         Promise.all(res.data.map((item)=>{
           return item._openid
         })).then(res=>{
           let _ = get_inf_db.command;
             get_inf_db.collection('Assistant_User').where({
               _openid: _.in(res)
             }).get().then(res => {
               that.data.UsernameArry = [];
               that.data.UserHeadurlArry=[];
               for (let i = 0; i < this.data.DataPostArry.length;i++){
                 let openId = this.data.DataPostArry[i]._openid;
                 for(let j=0;j<res.data.length;j++){
                   if(openId == res.data[j]._openid){
                     that.data.UsernameArry.push(res.data[j].Username);
                     that.data.UserHeadurlArry.push(res.data[j].User_head_url);
                   }
                 }
               }
               that.setData({
                 UsernameArry: that.data.UsernameArry,
                 UserHeadurlArry: that.data.UserHeadurlArry
               });
             })
 
         }).catch((ex)=>{
           console.log(ex);
         })
 
       }
     })
   },
  get_Sell_DBinf:function(){
    let that=this
    wx.getStorage({
      key: 'User_openid',
      success(res) {
        that.setData({
          UserId: res.data
        })
        ////
        var db = wx.cloud.database()//{ env: 'textllinpro-5br77' }
        let userid = res.data;
        //console.log("My openid:"+userid);
        db.collection('Assistant_Sell_Intention').where({//获取自己的点赞列表
          _openid: userid
        }).get({
          success: res => {
            //console.log("点赞列表:", res.data)
  
            for (var i = 0; i < res.data.length; i++) {
              SellUserUpId[i] = res.data[i].buy_Post_id//点赞列表赋给allUpId
            }
  
            db.collection('Assistant_Sell_DataSheet').get({
              success: res => {
    
                that.setData({
                  buyalldata: res.data//所有的用户列表数据
                })
                for (var i = 0; i < res.data.length; i++) {
                  SellUserId[i] = res.data[i]._id  //所有的用户列表
                  if (SellUserUpId.indexOf(SellUserId[i]) == -1) {
                    var item = 'SellUpArray[' + i + ']'
                    that.setData({
                      [item]: 0
                    })
                  }
                  else {
                    var item = 'SellUpArray[' + i + ']'
                    that.setData({
                      [item]: 1
                    })
                  }
                }
                //console.log(that.data.SellUpArray)
              }
            })
          },
        })
      }
    })
    const get_Sell_inf_db = wx.cloud.database()//{ env: 'textllinpro-5br77' }
    get_Sell_inf_db.collection('Assistant_Sell_DataSheet').get({
        success: res => {
          that.setData({
            SellDataPostArry: res.data
          })
          //console.log(res.data);
          Promise.all(res.data.map((item) => {
            return item._openid
          })).then(res => {
            let _ = get_Sell_inf_db.command;
            get_Sell_inf_db.collection('Assistant_User').where({
              _openid: _.in(res)
            }).get().then(res => {
              that.data.SellUsernameArry = [];
              that.data.SellUserHeadurlArry = [];
              for (let i = 0; i < this.data.SellDataPostArry.length; i++) {
                let openId = this.data.SellDataPostArry[i]._openid;
                for (let j = 0; j < res.data.length; j++) {
                  if (openId == res.data[j]._openid) {
                    that.data.SellUsernameArry.push(res.data[j].Username);
                    that.data.SellUserHeadurlArry.push(res.data[j].User_head_url);
                  }
                }
              }
              that.setData({
                SellUsernameArry: that.data.SellUsernameArry,
                SellUserHeadurlArry: that.data.SellUserHeadurlArry
              });
              //console.log(that.data.SellUsernameArry)
            })
  
          }).catch((ex) => {
            console.log(ex);
          })
        }
      })
    },
})
