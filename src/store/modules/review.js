import { getReviewList, submitReview, checkCanReview, getReviewStats } from '@/api/review'

const review = {
  namespaced: true,
  state: {
    reviewList: [],
    reviewStats: null,
    canReview: false,
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    submitting: false
  },
  
  mutations: {
    SET_REVIEW_LIST(state, list) {
      state.reviewList = list
    },
    
    SET_REVIEW_STATS(state, stats) {
      state.reviewStats = stats
    },
    
    SET_CAN_REVIEW(state, canReview) {
      state.canReview = canReview
    },
    
    SET_TOTAL(state, total) {
      state.total = total
    },
    
    SET_PAGE(state, page) {
      state.page = page
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_SUBMITTING(state, submitting) {
      state.submitting = submitting
    },
    
    ADD_REVIEW(state, review) {
      state.reviewList.unshift(review)
      state.total++
    }
  },
  
  actions: {
    async getReviewList({ commit }, { productId, rating, sortBy, page }) {
      commit('SET_LOADING', true)
      try {
        const res = await getReviewList(productId, {
          rating: rating || 'all',
          sortBy: sortBy || 'time',
          page: page || 1,
          pageSize: 10
        })
        commit('SET_REVIEW_LIST', res.data.list)
        commit('SET_TOTAL', res.data.total)
        commit('SET_PAGE', res.data.page)
        return res.data
      } catch (error) {
        console.error('获取评价列表失败:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async submitReview({ commit }, reviewData) {
      commit('SET_SUBMITTING', true)
      try {
        const res = await submitReview(reviewData)
        commit('ADD_REVIEW', res.data)
        return res.data
      } catch (error) {
        console.error('提交评价失败:', error)
        throw error
      } finally {
        commit('SET_SUBMITTING', false)
      }
    },
    
    async checkCanReview({ commit }, productId) {
      try {
        const res = await checkCanReview(productId)
        commit('SET_CAN_REVIEW', res.data.canReview)
        return res.data.canReview
      } catch (error) {
        console.error('检查是否可评价失败:', error)
        throw error
      }
    },
    
    async getReviewStats({ commit }, productId) {
      try {
        const res = await getReviewStats(productId)
        commit('SET_REVIEW_STATS', res.data)
        return res.data
      } catch (error) {
        console.error('获取评价统计失败:', error)
        throw error
      }
    }
  },
  
  getters: {
    reviewList: state => state.reviewList,
    reviewStats: state => state.reviewStats,
    canReview: state => state.canReview,
    total: state => state.total,
    page: state => state.page,
    pageSize: state => state.pageSize,
    loading: state => state.loading,
    submitting: state => state.submitting
  }
}

export default review
