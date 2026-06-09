import { getReviewList, submitReview, checkCanReview } from '@/api/review'

const review = {
  namespaced: true,
  state: {
    reviewList: [],
    reviewStats: null,
    currentProductId: null,
    currentFilterRating: 0,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    loading: false,
    canReview: false,
    canReviewReason: '',
    submitting: false
  },

  mutations: {
    SET_REVIEW_LIST(state, list) {
      state.reviewList = list
    },
    SET_REVIEW_STATS(state, stats) {
      state.reviewStats = stats
    },
    SET_CURRENT_PRODUCT_ID(state, id) {
      state.currentProductId = id
    },
    SET_FILTER_RATING(state, rating) {
      state.currentFilterRating = rating
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_CAN_REVIEW(state, { canReview, reason }) {
      state.canReview = canReview
      state.canReviewReason = reason
    },
    SET_SUBMITTING(state, submitting) {
      state.submitting = submitting
    }
  },

  actions: {
    async fetchReviewList({ commit }, { productId, rating = 0, page = 1, pageSize = 10 }) {
      commit('SET_LOADING', true)
      commit('SET_CURRENT_PRODUCT_ID', productId)
      commit('SET_FILTER_RATING', rating)
      
      try {
        const res = await getReviewList({ productId, rating, page, pageSize })
        commit('SET_REVIEW_LIST', res.data.list)
        commit('SET_REVIEW_STATS', res.data.stats)
        commit('SET_PAGINATION', {
          page: res.data.page,
          pageSize: res.data.pageSize,
          total: res.data.total
        })
      } catch (error) {
        console.error('获取评价列表失败:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async checkCanReview({ commit }, productId) {
      try {
        const res = await checkCanReview(productId)
        commit('SET_CAN_REVIEW', {
          canReview: res.data.canReview,
          reason: res.data.reason
        })
      } catch (error) {
        console.error('检查评价权限失败:', error)
      }
    },

    async submitReview({ commit, dispatch, state }, { productId, rating, content, images = [] }) {
      commit('SET_SUBMITTING', true)
      
      try {
        const res = await submitReview({ productId, rating, content, images })
        commit('SET_CAN_REVIEW', { canReview: false, reason: '您已评价过该商品' })
        await dispatch('fetchReviewList', {
          productId,
          rating: state.currentFilterRating,
          page: 1,
          pageSize: state.pagination.pageSize
        })
        return res
      } catch (error) {
        throw error
      } finally {
        commit('SET_SUBMITTING', false)
      }
    }
  }
}

export default review
