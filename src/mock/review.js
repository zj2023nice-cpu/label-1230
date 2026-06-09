import Mock from 'mockjs'
import productData from './product'
import orderData from './order'

const Random = Mock.Random

const reviewContents = [
  '商品质量非常好，包装也很精美，物流速度很快，非常满意！',
  '用了一段时间才来评价，确实不错，性价比很高，推荐购买。',
  '和描述的一样，正品行货，客服态度也很好，下次还会再来。',
  '宝贝收到了，比想象中的还要好，做工精细，材质很棒！',
  '整体很满意，就是发货稍微慢了一点，不过东西还是很好的。',
  '第三次购买了，一如既往的好，值得信赖的商家。',
  '买来送给朋友的，朋友说很喜欢，质量确实没话说。',
  '价格实惠，质量上乘，五星好评！',
  '使用体验很好，功能强大，操作简单，推荐给大家。',
  '外观设计很漂亮，手感也不错，很满意这次购物。',
  '非常好的卖家，有问题都能及时解答，服务很到位。',
  '快递很给力，第二天就到了，东西完好无损，赞一个！',
  '跟实体店一样，但价格便宜很多，太划算了！',
  '用了几天感觉还不错，没发现什么问题，希望耐用。',
  '家人都说好看，实用性也强，非常满意的一次网购。'
]

const usernames = [
  '用户****1234', '爱***购', 'j***k', '小***子', '大***家',
  't***a', '老***哥', 'l***y', '阿***明', 'f***h',
  '追***者', '月***光', '云***端', '星***空', '海***洋'
]

function generateReviews() {
  const reviews = []
  const products = productData.products
  let reviewId = 1

  products.forEach(product => {
    const reviewCount = Math.floor(Math.random() * 20) + 5
    for (let i = 0; i < reviewCount; i++) {
      const daysAgo = Math.floor(Math.random() * 180) + 1
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      
      reviews.push({
        id: reviewId++,
        productId: product.id,
        userId: Math.floor(Math.random() * 1000) + 1,
        username: usernames[Math.floor(Math.random() * usernames.length)],
        avatar: `https://picsum.photos/seed/user${Math.floor(Math.random() * 100)}/40/40`,
        rating: Math.random() > 0.1 ? (Math.floor(Math.random() * 2) + 4) : (Math.floor(Math.random() * 3) + 1),
        content: reviewContents[Math.floor(Math.random() * reviewContents.length)],
        createTime: date.toISOString().slice(0, 19).replace('T', ' '),
        images: Math.random() > 0.7 ? [
          `https://picsum.photos/seed/rev${reviewId}1/80/80`,
          `https://picsum.photos/seed/rev${reviewId}2/80/80`
        ] : [],
        helpful: Math.floor(Math.random() * 100)
      })
    }
  })

  return reviews
}

const reviews = generateReviews()

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

function calculateStats(allReviewsForProduct) {
  return {
    total: allReviewsForProduct.length,
    average: allReviewsForProduct.length > 0 
      ? (allReviewsForProduct.reduce((sum, r) => sum + r.rating, 0) / allReviewsForProduct.length).toFixed(1)
      : 0,
    goodCount: allReviewsForProduct.filter(r => r.rating >= 4).length,
    goodRate: allReviewsForProduct.length > 0 
      ? ((allReviewsForProduct.filter(r => r.rating >= 4).length / allReviewsForProduct.length) * 100).toFixed(0)
      : 0,
    ratingCounts: [5, 4, 3, 2, 1].map(r => ({
      rating: r,
      count: allReviewsForProduct.filter(item => item.rating === r).length
    }))
  }
}

Mock.mock(/\/api\/review\/list/, 'get', (options) => {
  const { productId, rating = 0, page = 1, pageSize = 10 } = parseQuery(options.url)
  const pid = parseInt(productId)
  
  const allProductReviews = reviews.filter(r => r.productId === pid)
  
  let filtered = allProductReviews
  
  if (parseInt(rating) > 0) {
    filtered = filtered.filter(r => r.rating === parseInt(rating))
  }

  filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

  const start = (parseInt(page) - 1) * parseInt(pageSize)
  const end = start + parseInt(pageSize)

  const ratingStats = calculateStats(allProductReviews)

  return {
    code: 200,
    message: 'success',
    data: {
      list: filtered.slice(start, end),
      total: filtered.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      stats: ratingStats
    }
  }
})

Mock.mock('/api/review/submit', 'post', (options) => {
  const data = JSON.parse(options.body)
  const token = localStorage.getItem('token')
  
  if (!token) {
    return {
      code: 401,
      message: '请先登录'
    }
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  
  const hasPurchased = orderData.orders.some(
    o => o.userId === userInfo.id && 
         o.status !== 'cancelled' && 
         o.products.some(p => p.productId === data.productId)
  )
  
  if (!hasPurchased) {
    return {
      code: 403,
      message: '购买后才可以评价'
    }
  }

  const newReview = {
    id: reviews.length + 1,
    productId: data.productId,
    userId: userInfo ? userInfo.id : 0,
    username: userInfo ? (userInfo.username || userInfo.phone || '用户') : '匿名用户',
    avatar: `https://picsum.photos/seed/usernew/40/40`,
    rating: data.rating,
    content: data.content,
    createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    images: data.images || [],
    helpful: 0
  }

  reviews.unshift(newReview)

  return {
    code: 200,
    message: '评价提交成功',
    data: newReview
  }
})

Mock.mock(/\/api\/review\/canReview/, 'get', (options) => {
  const { productId } = parseQuery(options.url)
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const pid = parseInt(productId)

  if (!token || !userInfo) {
    return {
      code: 200,
      message: 'success',
      data: { canReview: false, reason: '请先登录' }
    }
  }

  const hasPurchased = orderData.orders.some(
    o => o.userId === userInfo.id && 
         o.status !== 'cancelled' && 
         o.products.some(p => p.productId === pid)
  )

  if (!hasPurchased) {
    return {
      code: 200,
      message: 'success',
      data: { canReview: false, reason: '购买后才可以评价' }
    }
  }

  const hasReviewed = reviews.some(
    r => r.productId === pid && r.userId === userInfo.id
  )

  if (hasReviewed) {
    return {
      code: 200,
      message: 'success',
      data: { canReview: false, reason: '您已评价过该商品' }
    }
  }

  return {
    code: 200,
    message: 'success',
    data: { canReview: true, reason: '' }
  }
})

export default {
  reviews
}
