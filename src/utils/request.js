import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token到请求头
    const token = store.state.user.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据自定义的状态码判断请求是否成功
    if (res.code !== 200 && res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3000
      })
      
      // 401: 未授权，跳转登录页
      if (res.code === 401) {
        store.dispatch('user/logout')
        window.location.href = '/login'
      }
      
      const error = new Error(res.message || 'Error')
      error.code = res.code
      return Promise.reject(error)
    } else {
      return res
    }
  },
  error => {
    console.error('Response error:', error)
    Message({
      message: error.message || '网络错误',
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default service
