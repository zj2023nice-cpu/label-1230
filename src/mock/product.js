import Mock from 'mockjs'

const Random = Mock.Random

// 商品分类数据
const categories = [
  { id: 1, name: '手机通讯', icon: 'el-icon-mobile-phone', color: '4A90E2' },
  { id: 2, name: '电脑办公', icon: 'el-icon-monitor', color: '7B68EE' },
  { id: 3, name: '家用电器', icon: 'el-icon-refrigerator', color: '50C878' },
  { id: 4, name: '服饰鞋靴', icon: 'el-icon-shopping-bag-1', color: 'FF69B4' },
  { id: 5, name: '图书音像', icon: 'el-icon-reading', color: 'F4A460' },
  { id: 6, name: '运动户外', icon: 'el-icon-basketball', color: 'FF6347' },
  { id: 7, name: '食品饮料', icon: 'el-icon-dish', color: 'FFB347' },
  { id: 8, name: '家居家装', icon: 'el-icon-house', color: '8B7355' }
]

// 生成商品数据 (60个商品)
const productNames = {
  1: ['iPhone 15 Pro Max', 'HUAWEI Mate 60 Pro', '小米14 Ultra', 'OPPO Find X7', 'vivo X100 Pro', '荣耀Magic6 Pro', '一加12', '真我GT5'],
  2: ['MacBook Pro 14', '联想拯救者Y9000P', '戴尔XPS 13', '华硕天选4', 'iPad Pro 12.9', '微软Surface Pro 9', '惠普战66', '宏碁暗影骑士'],
  3: ['Carousell微波炉', '海尔洗衣机', '小米洗衣机', 'TCL电视', '海信电视', 'Carousell微波炉', '九阳豆浆机'],
  4: ['耐克运动鞋', '耐克跑鞋', '优衣库T恤', 'ZARA外套', 'H&M连衣裙', '李宁运动服', '安踏篮球鞋', 'New Balance跑鞋'],
  5: ['三体全集', '冰火之歌全集', 'qq书店书籍盲盒', '红楼梦', '爱上书店', '未来简史', '明朝那些事儿', '围城'],
  6: ['李宁羽毛球拍', '天天户外杂物盲盒', 'CI运动', 'Nike运动背包', '高尔夫球杆', '瑜伽垫', '哑铃套装', '跑步机'],
  7: ['乐事薯片', 'itambe牛奶', '伊利酸奶', '农夫山泉', '可口可乐', '百事可乐', '王老吉凉茶', '红牛功能饮料'],
  8: ['全友家居沙发', '顾家家居床', 'IKEA家具', '慕思床垫', '九牧卫浴', '欧普照明', '立邦涂料', '诺贝尔瓷砖']
}

// 商品图片映射 - 使用真实商品相关图片
const productImages = {
  1: [ // 手机通讯
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1592286927505-2ff0536be24d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop'
  ],
  2: [ // 电脑办公
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=300&h=300&fit=crop'
  ],
  3: [ // 家用电器
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1593078165771-3e9c8e7c2e3d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=300&fit=crop'
  ],
  4: [ // 服饰鞋靴
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop'
  ],
  5: [ // 图书音像
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=300&h=300&fit=crop'
  ],
  6: [ // 运动户外
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop'
  ],
  7: [ // 食品饮料
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1624869174772-8eb0c8acc1ab?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1568565473013-82bdb2246df6?w=300&h=300&fit=crop'
  ],
  8: [ // 家居家装
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1564540579594-0930edb6de43?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop'
  ]
}

// 设置Mock.js的随机种子，确保数据稳定
Mock.Random.extend({
  randomSeed: function() {
    return this.pick([1, 2, 3, 4, 5])
  }
})

function generateProducts() {
  const products = []
  let productId = 1
  
  // 固定的销量数据，避免每次刷新变化
  const fixedSales = [
    88888, 77777, 66666, 55555, 44444, 33333, 22222, 11111,
    98765, 87654, 76543, 65432, 54321, 43210, 32109, 21098,
    95000, 85000, 75000, 65000, 55000, 45000, 35000, 25000,
    92000, 82000, 72000, 62000, 52000, 42000, 32000, 22000,
    89000, 79000, 69000, 59000, 49000, 39000, 29000, 19000,
    86000, 76000, 66000, 56000, 46000, 36000, 26000, 16000,
    83000, 73000, 63000, 53000, 43000, 33000, 23000, 13000,
    80000, 70000, 60000, 50000, 40000, 30000, 20000, 10000
  ]
  
  // 使用简单稳定的占位图
  const getCategoryColor = (categoryId) => {
    const colors = {
      1: '4A90E2', // 手机通讯 - 蓝色
      2: '7B68EE', // 电脑办公 - 紫色
      3: '50C878', // 家用电器 - 绿色
      4: 'FF69B4', // 服饰鞋靴 - 粉色
      5: 'F4A460', // 图书音像 - 沙棕色
      6: 'FF6347', // 运动户外 - 番茄红
      7: 'FFB347', // 食品饮料 - 橙色
      8: '8B7355'  // 家居家装 - 棕色
    }
    return colors[categoryId] || '999999'
  }
  
  let salesIndex = 0
  
  categories.forEach(category => {
    const names = productNames[category.id]
    const images = productImages[category.id] || []
    names.forEach((name, index) => {
      const imageUrl = images[index] || `https://via.placeholder.com/300x300/${getCategoryColor(category.id)}/FFFFFF?text=${encodeURIComponent(name)}`
      products.push({
        id: productId++,
        name: name,
        categoryId: category.id,
        categoryName: category.name,
        price: parseFloat((Math.sin(productId * 137) * 5000 + 5500).toFixed(2)),
        originalPrice: parseFloat((Math.sin(productId * 139) * 10000 + 10500).toFixed(2)),
        image: imageUrl,
        images: [imageUrl, imageUrl, imageUrl, imageUrl],
        stock: Math.floor(Math.abs(Math.sin(productId * 141) * 9989) + 10),
        sales: fixedSales[salesIndex++ % fixedSales.length],
        rating: parseFloat((Math.sin(productId * 143) * 0.5 + 4.5).toFixed(1)),
        reviews: Math.floor(Math.abs(Math.sin(productId * 147) * 9899) + 100),
        description: `${name}，品质保证，正品行货，售后无忧。采用先进工艺制造，性能卓越，深受用户好评。限时优惠，欲购从速！`,
        specs: {
          brand: ['华为', '小米', '苹果', '三星', '联想', '戴尔', '耐克', '阿迪', '美的', '海尔'][productId % 10],
          model: String.fromCharCode(65 + (productId % 26)) + String.fromCharCode(65 + ((productId * 2) % 26)) + (100 + (productId * 13) % 900),
          origin: ['北京市', '上海市', '广州市', '深圳市', '杭州市', '成都市'][productId % 6]
        },
        tags: [['热销', '新品'], ['限时优惠', '包邮'], ['爆款', '热销'], ['新品', '包邮']][productId % 4]
      })
    })
  })
  
  return products
}

const products = generateProducts()

// 获取商品列表
Mock.mock(/\/api\/product\/list/, 'get', (options) => {
  const { categoryId, page = 1, pageSize = 20, sortBy = 'default' } = parseQuery(options.url)
  
  let filteredProducts = products
  if (categoryId) {
    filteredProducts = products.filter(p => p.categoryId === parseInt(categoryId))
  }
  
  // 排序
  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'sales') {
    filteredProducts.sort((a, b) => b.sales - a.sales)
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
})

// 获取商品详情
Mock.mock(/\/api\/product\/detail\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/(\d+)$/)[1])
  const product = products.find(p => p.id === id)
  
  return {
    code: 200,
    message: 'success',
    data: product || null
  }
})

// 获取分类列表
Mock.mock('/api/product/category', 'get', {
  code: 200,
  message: 'success',
  data: categories
})

// 获取热门商品
Mock.mock('/api/product/hot', 'get', {
  code: 200,
  message: 'success',
  data: products.sort((a, b) => b.sales - a.sales).slice(0, 10)
})

// 获取推荐商品
Mock.mock('/api/product/recommend', 'get', {
  code: 200,
  message: 'success',
  data: products.slice(10, 30)
})

// 搜索商品
Mock.mock(/\/api\/product\/search/, 'get', (options) => {
  const { keyword } = parseQuery(options.url)
  const results = products.filter(p => p.name.includes(keyword))
  
  return {
    code: 200,
    message: 'success',
    data: results
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
  products,
  categories
}
