const user = {
  namespaced: true,
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || '',
    isLogin: !!localStorage.getItem('token')
  },
  
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      if (userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      } else {
        localStorage.removeItem('userInfo')
      }
    },
    
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    
    SET_LOGIN_STATUS(state, status) {
      state.isLogin = status
    }
  },
  
  actions: {
    // 登录
    login({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
      commit('SET_TOKEN', userInfo.token)
      commit('SET_LOGIN_STATUS', true)
    },
    
    // 退出登录
    logout({ commit }) {
      commit('SET_USER_INFO', null)
      commit('SET_TOKEN', '')
      commit('SET_LOGIN_STATUS', false)
      // 清除购物车
      localStorage.removeItem('cartList')
    },
    
    // 更新用户信息
    updateUserInfo({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  }
}

export default user
