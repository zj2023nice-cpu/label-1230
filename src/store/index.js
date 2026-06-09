import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import product from './modules/product'
import order from './modules/order'
import review from './modules/review'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cart,
    product,
    order,
    review
  }
})
