import Mock from 'mockjs'
import orderMock from './order'

const Random = Mock.Random

// 评价数据存储：key 为 productId，value 为评价列表
const reviewsStore = {}

// 预置一些评价数据
const presetContents = [
  '商品质量非常好，物流也很快，包装严实，是正品，强烈推荐！',
  '收到货立即试了一下，效果不错，做工精细，性价比高。',
  '价格实惠，外观漂亮，使用感受还不错，值得购买。',
  '一般般吧，没有想象中那么好，但也没什么大问题。',
  '客服态度很好，发货速度快，商品和描述一致，下次还来。',
  '用了一段时间才来评价，整体表现稳定，没有出现问题。',
  '包装有点简陋，但商品本身没问题，使用体验良好。',
  '收到货比较失望，与图片有色差，但功能正常。',
  '非常满意的一次购物，颜值高、手感好，老婆很喜欢。',
  '细节做得很到位，朋友看了也想买一个，已推荐给同事。'
]

const presetNicknames = ['梅***子', '老***伙', 'L***y', '清***风', '飞***鱼', '小***白', '阿***华', '果***冻', '陈***生', '叶***秋']
const presetAvatars = [
  'https://picsum.photos/100/100?random=1',
  'https://picsum.photos/100/100?random=2',
  'https://picsum.photos/100/100?random=3',
  'https://picsum.photos/100/100?random=4',
  'https://picsum.photos/100/100?random=5'
]

let reviewIdSeed = 1000

function seedReviewsForProduct(productId) {
  if (reviewsStore[productId]) return
  const count = 5 + (productId % 5)
  const list = []
  for (let i = 0; i < count; i++) {
    const seed = productId * 31 + i * 7
    const rating = ((seed % 5) + 1) // 1-5
    // 生成稳定的时间戳：以 2026-01-01 为基础往前推
    const day = String(((seed % 28) + 1)).padStart(2, '0')
    const month = String(((seed % 6) + 1)).padStart(2, '0')
    const hour = String(((seed * 3) % 24)).padStart(2, '0')
    const minute = String(((seed * 7) % 60)).padStart(2, '0')
    list.push({
      id: reviewIdSeed++,
      productId,
      userId: 1000 + i,
      nickname: presetNicknames[(seed) % presetNicknames.length],
      avatar: presetAvatars[seed % presetAvatars.length],
      rating,
      content: presetContents[seed % presetContents.length],
      createTime: `2026-${month}-${day} ${hour}:${minute}:00`
    })
  }
  // 按时间倒序
  list.sort((a, b) => b.createTime.localeCompare(a.createTime))
  reviewsStore[productId] = list
}

// 判断当前是否登录
function isLoggedIn() {
  return !!localStorage.getItem('token')
}

// 获取当前登录用户信息
function getCurrentUser() {
  const raw = localStorage.getItem('userInfo')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

// 校验用户是否购买过该商品（订单状态为 paid/shipped/completed 视为已购买）
function hasPurchased(userId, productId) {
  if (!userId) return false
  const orders = (orderMock && orderMock.orders) || []
  const eligibleStatuses = ['paid', 'shipped', 'completed']
  return orders.some(o =>
    o.userId === userId &&
    eligibleStatuses.indexOf(o.status) !== -1 &&
    Array.isArray(o.products) &&
    o.products.some(p => p.productId === productId)
  )
}

// 解析 URL 查询参数
function parseQuery(url) {
  const query = {}
  const queryStr = url.split('?')[1]
  if (queryStr) {
    queryStr.split('&').forEach(item => {
      const [key, value] = item.split('=')
      query[key] = decodeURIComponent(value || '')
    })
  }
  return query
}

// 获取评价列表（支持按 rating 筛选）
Mock.mock(/\/api\/review\/list\/\d+/, 'get', (options) => {
  const productId = parseInt(options.url.match(/\/review\/list\/(\d+)/)[1])
  const { rating } = parseQuery(options.url)

  seedReviewsForProduct(productId)
  let list = reviewsStore[productId].slice()

  if (rating && rating !== 'all' && rating !== '0') {
    const r = parseInt(rating)
    list = list.filter(item => item.rating === r)
  }

  // 默认按时间倒序
  list.sort((a, b) => b.createTime.localeCompare(a.createTime))

  // 评分统计
  const all = reviewsStore[productId]
  const stats = {
    total: all.length,
    average: all.length
      ? parseFloat((all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1))
      : 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  }
  all.forEach(r => { stats.distribution[r.rating] = (stats.distribution[r.rating] || 0) + 1 })

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      stats
    }
  }
})

// 校验当前用户是否购买过该商品
Mock.mock(/\/api\/review\/check-purchase\/\d+/, 'get', (options) => {
  if (!isLoggedIn()) {
    return { code: 401, message: '未登录', data: null }
  }
  const productId = parseInt(options.url.match(/\/check-purchase\/(\d+)/)[1])
  const user = getCurrentUser()
  const purchased = hasPurchased(user && user.id, productId)
  return {
    code: 200,
    message: 'success',
    data: { purchased }
  }
})

// 提交评价
Mock.mock('/api/review/submit', 'post', (options) => {
  if (!isLoggedIn()) {
    return { code: 401, message: '未登录，请先登录', data: null }
  }

  const data = JSON.parse(options.body)
  const productId = parseInt(data.productId)
  const rating = parseInt(data.rating)
  const content = (data.content || '').trim()

  if (!productId) {
    return { code: 400, message: '商品ID不能为空', data: null }
  }
  if (!rating || rating < 1 || rating > 5) {
    return { code: 400, message: '请选择 1-5 星评分', data: null }
  }
  if (!content) {
    return { code: 400, message: '评价内容不能为空', data: null }
  }

  const user = getCurrentUser()
  if (!hasPurchased(user && user.id, productId)) {
    return { code: 403, message: '仅已购买的用户可以发表评价', data: null }
  }

  seedReviewsForProduct(productId)

  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  const createTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const review = {
    id: reviewIdSeed++,
    productId,
    userId: user.id,
    nickname: user.nickname || user.username || '匿名用户',
    avatar: user.avatar || presetAvatars[0],
    rating,
    content,
    createTime
  }

  reviewsStore[productId].unshift(review)

  return {
    code: 200,
    message: '评价提交成功',
    data: review
  }
})

export default {
  reviewsStore
}
