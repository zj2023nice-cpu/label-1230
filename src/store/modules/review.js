import { getReviewList, submitReview, checkPurchased } from '@/api/review'

const review = {
  namespaced: true,
  state: {
    // 当前商品评价列表
    reviewList: [],
    // 评分统计 { total, average, distribution: {1..5} }
    reviewStats: {
      total: 0,
      average: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    },
    // 当前筛选评分（'all' 或 1-5）
    currentRating: 'all',
    // 是否已购买当前商品
    purchased: false,
    // 加载状态
    loading: false,
    submitting: false
  },

  mutations: {
    SET_REVIEW_LIST(state, list) {
      state.reviewList = list || []
    },
    SET_REVIEW_STATS(state, stats) {
      state.reviewStats = stats || {
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    },
    SET_CURRENT_RATING(state, rating) {
      state.currentRating = rating
    },
    SET_PURCHASED(state, purchased) {
      state.purchased = !!purchased
    },
    SET_LOADING(state, loading) {
      state.loading = !!loading
    },
    SET_SUBMITTING(state, submitting) {
      state.submitting = !!submitting
    },
    PREPEND_REVIEW(state, review) {
      if (review) {
        state.reviewList = [review, ...state.reviewList]
      }
    },
    RESET(state) {
      state.reviewList = []
      state.reviewStats = {
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
      state.currentRating = 'all'
      state.purchased = false
      state.loading = false
      state.submitting = false
    }
  },

  actions: {
    // 拉取评价列表
    async fetchReviewList({ commit, state }, { productId, rating } = {}) {
      if (!productId) return
      const useRating = typeof rating !== 'undefined' ? rating : state.currentRating
      commit('SET_LOADING', true)
      try {
        const params = {}
        if (useRating && useRating !== 'all') {
          params.rating = useRating
        }
        const res = await getReviewList(productId, params)
        commit('SET_REVIEW_LIST', res.data && res.data.list)
        commit('SET_REVIEW_STATS', res.data && res.data.stats)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 切换评分筛选
    async changeRating({ commit, dispatch }, { productId, rating }) {
      commit('SET_CURRENT_RATING', rating)
      await dispatch('fetchReviewList', { productId, rating })
    },

    // 校验购买状态
    async checkPurchased({ commit, rootState }, productId) {
      if (!rootState.user.isLogin) {
        commit('SET_PURCHASED', false)
        return false
      }
      try {
        const res = await checkPurchased(productId)
        const purchased = !!(res.data && res.data.purchased)
        commit('SET_PURCHASED', purchased)
        return purchased
      } catch (e) {
        commit('SET_PURCHASED', false)
        return false
      }
    },

    // 提交评价
    async submitReview({ commit, dispatch }, payload) {
      commit('SET_SUBMITTING', true)
      try {
        const res = await submitReview(payload)
        // 重新拉取列表，保证统计数据同步
        await dispatch('fetchReviewList', { productId: payload.productId })
        return res.data
      } finally {
        commit('SET_SUBMITTING', false)
      }
    }
  }
}

export default review
