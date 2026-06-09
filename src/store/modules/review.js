const review = {
  namespaced: true,
  state: {
    reviewList: [],
    reviewTotal: 0,
    reviewLoading: false,
    ratingFilter: 0
  },

  mutations: {
    SET_REVIEW_LIST(state, list) {
      state.reviewList = list
    },

    SET_REVIEW_TOTAL(state, total) {
      state.reviewTotal = total
    },

    SET_REVIEW_LOADING(state, loading) {
      state.reviewLoading = loading
    },

    SET_RATING_FILTER(state, rating) {
      state.ratingFilter = rating
    },

    ADD_REVIEW(state, review) {
      state.reviewList.unshift(review)
      state.reviewTotal += 1
    }
  },

  actions: {
    async getReviewList({ commit }, params) {
      commit('SET_REVIEW_LOADING', true)
      try {
        const { getReviewList } = require('@/api/product')
        const res = await getReviewList(params)
        commit('SET_REVIEW_LIST', res.data.list)
        commit('SET_REVIEW_TOTAL', res.data.total)
        return res
      } finally {
        commit('SET_REVIEW_LOADING', false)
      }
    },

    async submitReview({ commit }, reviewData) {
      const { submitReview } = require('@/api/product')
      const res = await submitReview(reviewData)
      commit('ADD_REVIEW', res.data)
      return res
    }
  }
}

export default review
