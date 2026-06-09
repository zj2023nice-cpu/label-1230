import Mock from 'mockjs'

const Random = Mock.Random

// 模拟订单数据
let orders = []
let orderId = 1

// 固定的订单状态和数据
const fixedStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
const fixedProducts = [
  { name: 'iPhone 15 Pro Max', price: 8999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop' },
  { name: 'MacBook Pro 14', price: 15999, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop' },
  { name: '海尔冰箱', price: 3299, image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=100&h=100&fit=crop' },
  { name: '耐克运动鞋', price: 699, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
  { name: '三体全集', price: 99, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop' }
]
const fixedAddresses = [
  { receiver: '张三', phone: '13800138000', province: '北京市', city: '北京市', district: '朝阳区', detail: '朝阳路88号' },
  { receiver: '李四', phone: '13900139000', province: '上海市', city: '上海市', district: '浦东新区', detail: '世纪大道100号' },
  { receiver: '王五', phone: '13700137000', province: '广东省', city: '广州市', district: '天河区', detail: '天河路99号' },
  { receiver: '赵六', phone: '13600136000', province: '浙江省', city: '杭州市', district: '西湖区', detail: '文一路66号' },
  { receiver: '钱七', phone: '13500135000', province: '江苏省', city: '南京市', district: '鼓楼区', detail: '中山路55号' }
]
const fixedPaymentMethods = ['alipay', 'wechat', 'union', 'alipay', 'wechat']
const fixedTimes = [
  '2026-02-01 10:30:00',
  '2026-02-02 14:20:00',
  '2026-02-03 09:15:00',
  '2026-02-04 16:45:00',
  '2026-02-05 11:10:00'
]

// 生成一些示例订单
for (let i = 0; i < 5; i++) {
  const status = fixedStatuses[i]
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  
  orders.push({
    id: orderId++,
    orderNo: 'JD202602' + String(1000 + i).padStart(4, '0'),
    userId: 1,
    status: status,
    statusText: statusMap[status],
    products: [
      {
        productId: i + 1,
        name: fixedProducts[i].name,
        image: fixedProducts[i].image,
        price: fixedProducts[i].price,
        count: (i % 3) + 1
      }
    ],
    totalAmount: fixedProducts[i].price * ((i % 3) + 1),
    address: fixedAddresses[i],
    paymentMethod: fixedPaymentMethods[i],
    createTime: fixedTimes[i],
    payTime: fixedTimes[i],
    shipTime: fixedTimes[i]
  })
}

// 创建订单
Mock.mock('/api/order/create', 'post', (options) => {
  const data = JSON.parse(options.body)
  const orderIndex = orderId - 1
  const newOrder = {
    id: orderId++,
    orderNo: 'JD202602' + String(1000 + orderIndex).padStart(4, '0'),
    userId: 1,
    status: 'pending',
    statusText: '待支付',
    ...data,
    createTime: new Date().toLocaleString('zh-CN', { hour12: false })
  }
  
  orders.unshift(newOrder)
  
  return {
    code: 200,
    message: '订单创建成功',
    data: newOrder
  }
})

// 获取订单列表
Mock.mock(/\/api\/order\/list/, 'get', (options) => {
  const { status } = parseQuery(options.url)
  
  let filteredOrders = orders
  if (status && status !== 'all') {
    filteredOrders = orders.filter(o => o.status === status)
  }
  
  return {
    code: 200,
    message: 'success',
    data: filteredOrders
  }
})

// 获取订单详情
Mock.mock(/\/api\/order\/detail\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/(\d+)$/)[1])
  const order = orders.find(o => o.id === id)
  
  return {
    code: 200,
    message: 'success',
    data: order || null
  }
})

// 取消订单
Mock.mock(/\/api\/order\/cancel\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/(\d+)$/)[1])
  const order = orders.find(o => o.id === id)
  
  if (order) {
    order.status = 'cancelled'
    order.statusText = '已取消'
    
    return {
      code: 200,
      message: '订单已取消',
      data: order
    }
  }
  
  return {
    code: 404,
    message: '订单不存在',
    data: null
  }
})

// 确认收货
Mock.mock(/\/api\/order\/confirm\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/(\d+)$/)[1])
  const order = orders.find(o => o.id === id)
  
  if (order) {
    order.status = 'completed'
    order.statusText = '已完成'
    order.completeTime = new Date().toLocaleString('zh-CN', { hour12: false })
    
    return {
      code: 200,
      message: '确认收货成功',
      data: order
    }
  }
  
  return {
    code: 404,
    message: '订单不存在',
    data: null
  }
})

// 支付订单
Mock.mock(/\/api\/order\/pay\/\d+/, 'post', (options) => {
  const id = parseInt(options.url.match(/\/(\d+)$/)[1])
  const order = orders.find(o => o.id === id)
  
  if (order) {
    order.status = 'paid'
    order.statusText = '已支付'
    order.payTime = new Date().toLocaleString('zh-CN', { hour12: false })
    
    return {
      code: 200,
      message: '支付成功',
      data: order
    }
  }
  
  return {
    code: 404,
    message: '订单不存在',
    data: null
  }
})

// 辅助函数：解析URL参数
function parseQuery(url) {
  const query = {}
  const queryStr = url.split('?')[1]
  if (queryStr) {
    queryStr.split('&').forEach(item => {
      const [key, value] = item.split('=')
      query[key] = decodeURIComponent(value)
    })
  }
  return query
}

export default {
  orders
}
