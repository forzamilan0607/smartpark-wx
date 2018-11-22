import wepy from 'wepy'

export default class util extends wepy.mixin {
  // 手机号码正则验证
  checkPhone (tel) {
    console.log(tel)
    if (!(/^1[3456789]\d{9}$/.test(tel))) {
      return false
    }
    return true
  }

  checkMobile (telNum) {
    if (!telNum || !/^1[3|4|5|6|7|8][0-9]{9}$/.test(telNum)) {
      return {
        msg: '手机号码格式不正确',
        result: false
      }
    } else {
      return {
        msg: 'SUCCESS',
        result: true
      }
    }
  }

  // 扫码
  shareCode () {
    let that = this
    // 判断是否授权摄像头
    wx.getSetting({
      success: res => {
        // 未授权让用户授权
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success () {
              wx.scanCode({
                success (res) {
                  that.signInApi(res.result).then(data => {
                    console.log(data, 111)
                    let Data = data.data.data
                    if (data.data.resultCode === 1000) {
                      that.$navigate('./signOk',
                        {
                          user_name: Data.user.user_name,
                          icon: Data.user.icon,
                          village_name: Data.user.villageInfo.village_name,
                          door_number: Data.user.userAut.door_number
                        }
                      )
                    } else {
                      console.log(data.data)
                      that.$navigate('./lose', {error: data.data.error})
                    }
                  })
                }
              })
            },
            // 拒绝授权处理
            fail () {
              console.log('用户拒绝授权')
            }
          })
        } else {
          wx.scanCode({
            success (res) {
              that.signInApi(res.result).then(data => {
                console.log(data, 111)
                let Data = data.data.data
                console.log(Data)
                if (data.data.resultCode === 1000) {
                  that.$navigate('./signOk',
                    {
                      user_name: Data.user.user_name,
                      icon: Data.user.icon,
                      village_name: Data.user.villageInfo.village_name,
                      door_number: Data.user.userAut.door_number
                    }
                  )
                } else {
                  console.log(data.data)
                  that.$navigate('./lose', {error: data.data.error})
                }
              })
            }
          })
        }
      }
    })
  }
}
