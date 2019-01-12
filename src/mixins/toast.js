import wepy from 'wepy'

export default class toast extends wepy.mixin {
	// showToast
  showToast () {
    wepy.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 3000
    })
  }

	// selfToast
  selfToast (title, icon, duration) {
    wepy.showToast({
      title: title,
      icon: icon || 'success',
      duration: duration || 2000
    })
  }

	// hideToast
  hideToast () {
    wepy.hideToast()
  }

	// loading
  showLoading (message) {
    if (wx.showLoading) {
      wx.showLoading({
        title: message || '加载中。。',
        mask: true
      })
    } else {
      // 低版本兼容处理
      wx.showToast({
        title: message || '加载中。。',
        icon: 'loading',
        mask: true,
        duration: 20000
      })
    }
  }

  // hideLoading
  hideLoading () {
    if (wx.hideLoading) {
      wx.hideLoading()
    } else {
      wx.showToast()
    }
  }
}
