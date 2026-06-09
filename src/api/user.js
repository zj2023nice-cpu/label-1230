import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 获取收货地址列表
export function getAddressList() {
  return request({
    url: '/user/address',
    method: 'get'
  })
}

// 添加收货地址
export function addAddress(data) {
  return request({
    url: '/user/address',
    method: 'post',
    data
  })
}

// 更新收货地址
export function updateAddress(id, data) {
  return request({
    url: `/user/address/${id}`,
    method: 'put',
    data
  })
}

// 删除收货地址
export function deleteAddress(id) {
  return request({
    url: `/user/address/${id}`,
    method: 'delete'
  })
}
