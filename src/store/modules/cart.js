const cart = {
  namespaced: true,
  state: {
    cartList: JSON.parse(localStorage.getItem('cartList')) || [],
    selectedItems: []
  },
  
  mutations: {
    SET_CART_LIST(state, cartList) {
      state.cartList = cartList
      localStorage.setItem('cartList', JSON.stringify(cartList))
    },
    
    UPDATE_ITEM_COUNT(state, { productId, count }) {
      const item = state.cartList.find(item => item.productId === productId)
      if (item) {
        item.count = count
        localStorage.setItem('cartList', JSON.stringify(state.cartList))
      }
    },
    
    SET_SELECTED_ITEMS(state, items) {
      state.selectedItems = items
    },
    
    TOGGLE_ITEM_SELECTED(state, productId) {
      const item = state.cartList.find(item => item.productId === productId)
      if (item) {
        item.selected = !item.selected
        localStorage.setItem('cartList', JSON.stringify(state.cartList))
      }
    },
    
    TOGGLE_ALL_SELECTED(state, selected) {
      state.cartList.forEach(item => {
        item.selected = selected
      })
      localStorage.setItem('cartList', JSON.stringify(state.cartList))
    }
  },
  
  getters: {
    cartCount(state) {
      return state.cartList.reduce((total, item) => total + item.count, 0)
    },
    
    selectedTotal(state) {
      return state.cartList
        .filter(item => item.selected)
        .reduce((total, item) => total + item.price * item.count, 0)
    },
    
    selectedCount(state) {
      return state.cartList.filter(item => item.selected).length
    }
  },
  
  actions: {
    // 添加到购物车
    addToCart({ commit, state }, product) {
      const cartList = [...state.cartList]
      const existItem = cartList.find(item => item.productId === product.id)
      
      if (existItem) {
        // 如果商品已存在,增加数量
        existItem.count += product.count || 1
      } else {
        // 添加新商品
        cartList.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          count: product.count || 1,
          selected: true,
          stock: product.stock
        })
      }
      
      commit('SET_CART_LIST', cartList)
    },
    
    // 从购物车移除
    removeFromCart({ commit, state }, productId) {
      const cartList = state.cartList.filter(item => item.productId !== productId)
      commit('SET_CART_LIST', cartList)
    },
    
    // 更新商品数量
    updateCartItem({ commit }, { productId, count }) {
      commit('UPDATE_ITEM_COUNT', { productId, count })
    },
    
    // 清空购物车
    clearCart({ commit }) {
      commit('SET_CART_LIST', [])
    },
    
    // 清空选中的商品
    clearSelectedItems({ commit, state }) {
      const cartList = state.cartList.filter(item => !item.selected)
      commit('SET_CART_LIST', cartList)
    }
  }
}

export default cart
