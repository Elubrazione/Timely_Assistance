// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const youOpenid = event.youid
  const nowTime = event.time
//   console.log(event)
//   return db.collection('Assistant_User').where({
//     _openid: youOpenid
//   }).update({
//     data: {
//       Last_to_foot: nowTime
//     },
//   }).then(res => {
//     console.log(res)
//   })
// }
  try {
    return await db.collection('Assistant_User').where({
      _openid=youOpenid
    })
    .update({
      data: {
        Last_to_foot:nowTime
      },
    })
  } catch(e) {
    console.error(e)
  }
}