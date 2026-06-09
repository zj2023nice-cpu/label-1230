import request from '@/utils/request'

// 获取商品评价列表（支持评分筛选）
export function getReviewList(productId, params) {
  return request({
    url: `/review/list/${productId}`,
    method: 'get',
    params
  })
}

// 提交评价
export function submitReview(data) {
  return request({
    url: '/review/submit',
    method: 'post',
    data
  })
}

// 校验当前用户是否购买过该商品
export function checkPurchased(productId) {
  return request({
    url: `/review/check-purchase/${productId}`,
    method: 'get'
  })
}
