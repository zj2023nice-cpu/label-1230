import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/product/list',
    name: 'ProductList',
    component: () => import('@/views/Product/ProductList.vue'),
    meta: { title: '商品列表' }
  },
  {
    path: '/product/detail/:id',
    name: 'ProductDetail',
    component: () => import('@/views/Product/ProductDetail.vue'),
    meta: { title: '商品详情' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart/index.vue'),
    meta: { title: '购物车' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/User/Login.vue'),
    meta: { title: '登录' }
  },
//   {
//     path: '/register',
//     name: 'Register',
//     component: () => import('@/views/User/Register.vue'),
//     meta: { title: '注册' }
//   },
  {
    path: '/user/center',
    name: 'UserCenter',
    component: () => import('@/views/User/UserCenter.vue'),
    meta: { title: '用户中心', requireAuth: true },
    redirect: '/user/info',
    children: [
      {
        path: '/user/info',
        name: 'PersonalInfo',
        component: () => import('@/views/User/PersonalInfo.vue'),
        meta: { title: '个人信息', requireAuth: true }
      },
      {
        path: '/user/address',
        name: 'AddressList',
        component: () => import('@/views/User/AddressList.vue'),
        meta: { title: '收货地址', requireAuth: true }
      },
      {
        path: '/user/orders',
        name: 'MyOrders',
        component: () => import('@/views/User/MyOrders.vue'),
        meta: { title: '我的订单', requireAuth: true }
      }
    ]
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('@/views/Order/OrderConfirm.vue'),
    meta: { title: '确认订单', requireAuth: true }
  },
  {
    path: '/order/payment/:id',
    name: 'Payment',
    component: () => import('@/views/Order/OrderPayment.vue'),
    meta: { title: '支付订单', requireAuth: true }
  },
  {
    path: '/order/detail/:id',
    name: 'OrderDetail',
    component: () => import('@/views/Order/OrderDetail.vue'),
    meta: { title: '订单详情', requireAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 京东商城` : '京东商城'
  
  // 检查是否需要登录
  if (to.meta.requireAuth) {
    const isLogin = store.state.user.isLogin
    if (!isLogin) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
