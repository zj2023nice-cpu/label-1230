import Mock from 'mockjs'

const Random = Mock.Random

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'demo',
    password: '123456',
    nickname: '演示用户',
    avatar: 'https://picsum.photos/200/200?random=user1',
    phone: '13800138000',
    email: 'demo@jd.com',
    token: 'mock-token-' + Random.guid()
  }
]

// 模拟收货地址
let addresses = [
  {
    id: 1,
    userId: 1,
    receiver: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '某某大厦1001室',
    isDefault: true
  },
  {
    id: 2,
    userId: 1,
    receiver: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '世纪大道888号',
    isDefault: false
  }
]

// 登录
Mock.mock('/api/user/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  const user = users.find(u => u.username === username && u.password === password)
  
  if (user) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        email: user.email,
        token: user.token
      }
    }
  } else {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null
    }
  }
})

// 注册
Mock.mock('/api/user/register', 'post', (options) => {
  const { username, password, phone } = JSON.parse(options.body)
  
  // 检查用户名是否已存在
  const existUser = users.find(u => u.username === username)
  if (existUser) {
    return {
      code: 400,
      message: '用户名已存在',
      data: null
    }
  }
  
  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    password,
    nickname: username,
    avatar: `https://picsum.photos/200/200?random=user${users.length + 1}`,
    phone,
    email: '',
    token: 'mock-token-' + Random.guid()
  }
  
  users.push(newUser)
  
  return {
    code: 200,
    message: '注册成功',
    data: {
      id: newUser.id,
      username: newUser.username,
      nickname: newUser.nickname,
      avatar: newUser.avatar,
      phone: newUser.phone,
      token: newUser.token
    }
  }
})

// 获取用户信息
Mock.mock('/api/user/info', 'get', {
  code: 200,
  message: 'success',
  data: users[0]
})

// 更新用户信息
Mock.mock('/api/user/info', 'put', (options) => {
  const data = JSON.parse(options.body)
  
  return {
    code: 200,
    message: '更新成功',
    data: { ...users[0], ...data }
  }
})

// 获取收货地址列表
Mock.mock('/api/user/address', 'get', {
  code: 200,
  message: 'success',
  data: addresses
})

// 添加收货地址
Mock.mock('/api/user/address', 'post', (options) => {
  const data = JSON.parse(options.body)
  const newAddress = {
    id: addresses.length + 1,
    userId: 1,
    ...data
  }
  addresses.push(newAddress)
  
  return {
    code: 200,
    message: '添加成功',
    data: newAddress
  }
})

// 更新收货地址
Mock.mock(/\/api\/user\/address\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/(\d+)$/)[1])
  const data = JSON.parse(options.body)
  const index = addresses.findIndex(a => a.id === id)
  
  if (index !== -1) {
    addresses[index] = { ...addresses[index], ...data }
    return {
      code: 200,
      message: '更新成功',
      data: addresses[index]
    }
  }
  
  return {
    code: 404,
    message: '地址不存在',
    data: null
  }
})

// 删除收货地址
Mock.mock(/\/api\/user\/address\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/(\d+)$/)[1])
  const index = addresses.findIndex(a => a.id === id)
  
  if (index !== -1) {
    addresses.splice(index, 1)
    return {
      code: 200,
      message: '删除成功',
      data: null
    }
  }
  
  return {
    code: 404,
    message: '地址不存在',
    data: null
  }
})

export default {
  users,
  addresses
}
