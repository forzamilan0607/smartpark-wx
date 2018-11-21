import wepy from 'wepy'
// import toast from './toast'
// const devUrl = 'http://47.99.125.173:3000/mock/14/'
// const devUrl = 'http://192.168.3.182:8087/'
const devUrl = 'http://47.99.125.173:8087/'

export default class Api extends wepy.mixin {
  /**
   * api接口封装
   * url: 接口地址 params: 参数 method: 请求方法 flag: 是否携带(token, tokenId) 传就不带
  */
  request (url, params, method, flag) {
    let that = this
    that.showLoading()
    let header = {
      'Content-type': 'application/json',
      'token': wepy.getStorageSync('token')
    }
    if (flag) {
      header = {
        'Content-type': 'application/json'
      }
    }
    const pormise = new Promise((resolve, reject) => {
      wepy.request({
        url: devUrl + url,
        data: params || {},
        method: method || 'GET',
        header: header,
        success: res => {
          console.log(res)
          if (res.data.code === 200) {
            resolve(res)
          } else if (res.data.code === 401) {
            resolve(res)
            this.toast('登录信息失效!', 'none')
            wepy.clearStorageSync('token', '')
            that.$redirect('../pages/login')
            // that.selfToast(res.error)
          } else if (res.data.code === 500) {
            that.selfToast(res.data.msg, 'none', 2000)
            resolve(res)
          } else {
            resolve(res)
          }
        },
        fail: err => {
          reject(err)
        },
        complete: res => {
          setTimeout(() => {
            that.hideLoading()
          }, 500)
        }
      })
    })
    return pormise
  }

  /**
   * 登录
   * @param {手机号} mobile
   * @param {密码} password
   */
  loginApi (mobile, password) {
    return this.request('app/login', {mobile: mobile, password: password}, 'POST', true)
  }

  /**
   * 注册
   * @param {手机号} phone
   * @param {密码} password
   * @param {验证码} verifyCode
   * @param {openId} openId
   */
  registerNum (phone, password, verifyCode, openId) {
    return this.request('app/register', {
      mobile: phone,
      password: password,
      verifyCode: verifyCode,
      openId: openId
    }, 'POST')
  }

  /**
   * 根据手机号查询员工信息
   * @param {手机号} mobile
   */
  queryByMobile (mobile) {
    return this.request('base/basestaff/queryByMobile.notoken', {mobile: mobile}, 'POST')
  }

  /**
   * 获取验证码
   * @param {手机号} mobile
   * @param {模板ID} templateCode SMS_150172084预约  SMS_150182159 注册
   */
  getVerifyCode (mobile, templateCode) {
    return this.request('sys/sms/sendVerifyCode.notoken', {mobile: mobile, templateCode: templateCode}, 'POST')
  }

  /**
   * 查询预约单列表
   * @param {openId} openId
   * @param {type} type 为1是访客 为2是员工
   */
  getOrderList (openId, type) {
    return this.request('app/visitorreservation/queryReservationOrdersByOpenId', {openId: openId, type: type}, 'POST')
  }

  /**
   * 保存预约单
   * @param {param} param
   */
  saveVisitor (param) {
    return this.request('app/visitorreservation/save', param, 'POST')
  }

  /**
   * 查询预约单详情
   * @param {id} id
   */
  getVisitorInfo (id) {
    return this.request(`app/visitorreservation/info/${id}`)
  }

  /**
   * 获取门禁权限信息
   * @param {openId} openId
   */
  getDoorNodes (openId) {
    return this.request(`app/entrance/queryDoorNodes?openId=${openId}`)
  }

  /**
   * 预约授权
   * @param {param} param
   */
  approve (param) {
    return this.request('app/visitorreservation/approve', param, 'POST')
  }
}
