import Mock from 'mockjs'
import './product'
import './user'
import './order'

// 配置Mock
Mock.setup({
  timeout: '200-600' // 模拟网络延迟
})

console.log('Mock数据已加载')
