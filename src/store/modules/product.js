const product = {
  namespaced: true,
  state: {
    productList: [],
    categoryList: [],
    productDetail: null,
    loading: false
  },
  
  mutations: {
    SET_PRODUCT_LIST(state, list) {
      state.productList = list
    },
    
    SET_CATEGORY_LIST(state, list) {
      state.categoryList = list
    },
    
    SET_PRODUCT_DETAIL(state, detail) {
      state.productDetail = detail
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  
  actions: {
    // 获取商品列表
    async getProductList({ commit }, params) {
      commit('SET_LOADING', true)
      // API调用将由mock拦截
      commit('SET_LOADING', false)
    },
    
    // 获取商品详情
    async getProductDetail({ commit }, productId) {
      commit('SET_LOADING', true)
      // API调用将由mock拦截
      commit('SET_LOADING', false)
    },
    
    // 获取分类列表
    async getCategoryList({ commit }) {
      // API调用将由mock拦截
    }
  }
}

export default product
