import request from '@/utils/request'

export function getReviewList(productId, params) {
  return request({
    url: `/review/list/${productId}`,
    method: 'get',
    params
  })
}

export function submitReview(data) {
  return request({
    url: '/review/submit',
    method: 'post',
    data
  })
}

export function checkCanReview(productId) {
  return request({
    url: `/review/can-review/${productId}`,
    method: 'get'
  })
}

export function getReviewStats(productId) {
  return request({
    url: `/review/stats/${productId}`,
    method: 'get'
  })
}
