export default {
  namespaced: true,
  state: () => ({
    token: uni.getStorageSync('token') || '',
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    // 重定向的 object 对象 {openType, from}
    redirectInfo: null
  }),
  mutations: {
    // 更新重定向信息对象
    updateRedirectInfo(state, info) {
        state.redirectInfo = info
        console.log(state.redirectInfo);
    },
    updateAddresss(state, address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    // 定义将 address 持久化存储的方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更新用户信息
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      // 将最新的用户信息再次持久化保存
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 持久化保存用户信息
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    // 更新 token 字符串
    updateToken(state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    // 将 token 字符串持久化存储在本地
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    }
  },
  getters: {
    addStr(state) {
      if (!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}
