import request from '@/utils/request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

// 获取商品详情
export function getProductDetail(id) {
  return request({
    url: `/product/detail/${id}`,
    method: 'get'
  })
}

// 获取分类列表
export function getCategoryList() {
  return request({
    url: '/product/category',
    method: 'get'
  })
}

// 搜索商品
export function searchProduct(keyword) {
  return request({
    url: '/product/search',
    method: 'get',
    params: { keyword }
  })
}

// 获取热门商品
export function getHotProducts() {
  return request({
    url: '/product/hot',
    method: 'get'
  })
}

// 获取推荐商品
export function getRecommendProducts() {
  return request({
    url: '/product/recommend',
    method: 'get'
  })
}

export function getReviewList(params) {
  return request({
    url: '/product/reviews',
    method: 'get',
    params
  })
}

export function submitReview(data) {
  return request({
    url: '/product/review',
    method: 'post',
    data
  })
}

export function checkPurchase(productId) {
  return request({
    url: '/product/review/check',
    method: 'get',
    params: { productId }
  })
}
