const order = {
  namespaced: true,
  state: {
    orderList: [],
    orderDetail: null,
    currentOrder: null
  },
  
  mutations: {
    SET_ORDER_LIST(state, list) {
      state.orderList = list
    },
    
    SET_ORDER_DETAIL(state, detail) {
      state.orderDetail = detail
    },
    
    SET_CURRENT_ORDER(state, order) {
      state.currentOrder = order
    }
  },
  
  actions: {
    // 创建订单
    async createOrder({ commit }, orderData) {
      // API调用将由mock拦截
      return orderData
    },
    
    // 获取订单列表
    async getOrderList({ commit }) {
      // API调用将由mock拦截
    },
    
    // 获取订单详情
    async getOrderDetail({ commit }, orderId) {
      // API调用将由mock拦截
    },
    
    // 取消订单
    async cancelOrder({ commit }, orderId) {
      // API调用将由mock拦截
    }
  }
}

export default order
