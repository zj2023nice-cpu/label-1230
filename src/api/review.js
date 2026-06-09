import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'

export function getReviewList(params) {
  return request({
    url: '/review/list',
    method: 'get',
    params
  })
}

export function submitReview(data) {
  const baseURL = process.env.VUE_APP_BASE_API || '/api'
  const token = store.state.user.token
  return axios({
    url: baseURL + '/review/submit',
    method: 'post',
    data,
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    timeout: 10000
  }).then(response => {
    const res = response.data
    if (res.code !== 200 && res.code !== 0) {
      const error = new Error(res.message || 'Error')
      error.code = res.code
      throw error
    }
    return res
  })
}

export function checkCanReview(productId) {
  return request({
    url: '/review/canReview',
    method: 'get',
    params: { productId }
  })
}
