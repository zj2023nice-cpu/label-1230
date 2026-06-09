import Mock from 'mockjs'
import orderModule from './order'

const Random = Mock.Random

const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
const reviewContents = [
  '商品质量很好，物流也很快，非常满意！',
  '性价比很高，推荐购买。',
  '包装很精美，送人也很有面子。',
  '和描述一致，使用体验不错。',
  '客服态度很好，有问题都能及时解决。',
  '颜色很正，尺码合适，穿着舒服。',
  '大品牌就是不一样，品质有保障。',
  '已经是第二次购买了，一如既往的好。',
  '发货速度快，包装完好，没有破损。',
  '总体来说还不错，就是价格有点小贵。'
]
const avatarColors = ['4A90E2', '7B68EE', '50C878', 'FF69B4', 'F4A460', 'FF6347', 'FFB347', '8B7355']

function generateReviews(productId, count = 20) {
  const reviews = []
  const ratings = [5, 5, 5, 4, 4, 3, 2, 1]
  for (let i = 0; i < count; i++) {
    const rating = ratings[i % ratings.length]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    reviews.push({
      id: productId * 100 + i,
      productId: productId,
      userId: i + 1,
      userName: userNames[i % userNames.length],
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userNames[i % userNames.length])}&background=${avatarColors[i % avatarColors.length]}&color=fff`,
      rating: rating,
      content: reviewContents[i % reviewContents.length],
      createTime: date.toLocaleString('zh-CN', { hour12: false }),
      usefulCount: Math.floor(Math.random() * 100),
      isUseful: false
    })
  }
  return reviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
}

const reviewsMap = {}

for (let i = 1; i <= 60; i++) {
  reviewsMap[i] = generateReviews(i, Math.floor(Math.random() * 15) + 10)
}

Mock.mock(/\/api\/review\/list\/\d+/, 'get', (options) => {
  const productId = parseInt(options.url.match(/\/(\d+)\?/)[1]) || parseInt(options.url.match(/\/(\d+)$/)[1])
  const queryStr = options.url.split('?')[1]
  const params = {}
  
  if (queryStr) {
    queryStr.split('&').forEach(item => {
      const [key, value] = item.split('=')
      params[key] = decodeURIComponent(value)
    })
  }
  
  const { rating = 'all', page = 1, pageSize = 10, sortBy = 'time' } = params
  let reviews = reviewsMap[productId] || []
  
  if (rating !== 'all') {
    if (rating === 'good') {
      reviews = reviews.filter(r => r.rating >= 4)
    } else if (rating === 'medium') {
      reviews = reviews.filter(r => r.rating === 3)
    } else if (rating === 'bad') {
      reviews = reviews.filter(r => r.rating <= 2)
    }
  }
  
  if (sortBy === 'useful') {
    reviews = [...reviews].sort((a, b) => b.usefulCount - a.usefulCount)
  } else {
    reviews = [...reviews].sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  }
  
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  const list = reviews.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: list,
      total: reviews.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
})

Mock.mock('/api/review/submit', 'post', (options) => {
  const data = JSON.parse(options.body)
  const productId = data.productId
  const userId = 1
  
  let canReview = false
  const orders = orderModule.orders || []
  
  for (const order of orders) {
    if (order.userId === userId && order.status === 'completed') {
      for (const product of order.products) {
        if (product.productId === productId) {
          canReview = true
          break
        }
      }
    }
    if (canReview) break
  }
  
  if (!canReview) {
    return {
      code: 403,
      message: '您还没有购买过该商品，无法评价',
      data: null
    }
  }
  
  if (!reviewsMap[productId]) {
    reviewsMap[productId] = []
  }
  
  const newReview = {
    id: Date.now(),
    productId: productId,
    userId: userId,
    userName: '当前用户',
    userAvatar: `https://ui-avatars.com/api/?name=当前用户&background=4A90E2&color=fff`,
    rating: data.rating,
    content: data.content,
    createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
    usefulCount: 0,
    isUseful: false
  }
  
  reviewsMap[productId].unshift(newReview)
  
  return {
    code: 200,
    message: '评价提交成功',
    data: newReview
  }
})

Mock.mock(/\/api\/review\/can-review\/\d+/, 'get', (options) => {
  const productId = parseInt(options.url.match(/\/(\d+)$/)[1])
  
  let canReview = false
  const orders = orderModule.orders || []
  
  for (const order of orders) {
    if (order.status === 'completed') {
      for (const product of order.products) {
        if (product.productId === productId) {
          canReview = true
          break
        }
      }
    }
    if (canReview) break
  }
  
  return {
    code: 200,
    message: 'success',
    data: {
      canReview: canReview
    }
  }
})

Mock.mock(/\/api\/review\/stats\/\d+/, 'get', (options) => {
  const productId = parseInt(options.url.match(/\/(\d+)$/)[1])
  const reviews = reviewsMap[productId] || []
  
  const stats = {
    total: reviews.length,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  }
  
  if (reviews.length > 0) {
    let totalRating = 0
    reviews.forEach(review => {
      totalRating += review.rating
      stats.ratingDistribution[review.rating]++
    })
    stats.averageRating = parseFloat((totalRating / reviews.length).toFixed(1))
  }
  
  return {
    code: 200,
    message: 'success',
    data: stats
  }
})

export default {
  reviewsMap
}
