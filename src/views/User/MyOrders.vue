<template>
  <div class="my-orders-content">
    <h2 class="page-title">
      <i class="el-icon-s-order"></i> 我的订单
    </h2>

    <!-- 订单状态标签 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="全部订单" name="all"></el-tab-pane>
      <el-tab-pane label="待支付" name="pending"></el-tab-pane>
      <el-tab-pane label="已支付" name="paid"></el-tab-pane>
      <el-tab-pane label="已发货" name="shipped"></el-tab-pane>
      <el-tab-pane label="已完成" name="completed"></el-tab-pane>
      <el-tab-pane label="已取消" name="cancelled"></el-tab-pane>
    </el-tabs>

        <!-- 订单列表 -->
        <div class="orders-list" v-loading="loading">
          <div
            v-for="order in orderList"
            :key="order.id"
            class="order-item"
          >
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-info">
                <span class="order-no">订单号: {{ order.orderNo }}</span>
                <span class="order-time">下单时间: {{ order.createTime }}</span>
              </div>
              <div class="order-status">
                <el-tag :type="getStatusType(order.status)">
                  {{ order.statusText }}
                </el-tag>
              </div>
            </div>

            <!-- 订单商品 -->
            <div class="order-products">
              <div
                v-for="(product, index) in order.products"
                :key="index"
                class="product-item"
              >
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="product-detail">
                  <p class="product-name">{{ product.name }}</p>
                  <p class="product-price">¥{{ product.price }} × {{ product.count }}</p>
                </div>
              </div>
            </div>

            <!-- 订单底部 -->
            <div class="order-footer">
              <div class="order-total">
                <span class="label">订单总额:</span>
                <span class="price">¥{{ order.totalAmount }}</span>
              </div>
              <div class="order-actions">
                <el-button
                  v-if="order.status === 'pending'"
                  type="danger"
                  size="small"
                  @click="handlePay(order)"
                >
                  去支付
                </el-button>
                <el-button
                  v-if="order.status === 'shipped'"
                  type="primary"
                  size="small"
                  @click="handleConfirm(order)"
                >
                  确认收货
                </el-button>
                <el-button
                  v-if="order.status === 'pending'"
                  type="text"
                  size="small"
                  @click="handleCancel(order)"
                >
                  取消订单
                </el-button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <el-empty v-if="!loading && orderList.length === 0" description="暂无订单">
            <el-button type="primary" @click="$router.push('/')">去首页逛逛</el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderList, cancelOrder, confirmOrder } from '@/api/order'

export default {
  name: 'MyOrders',
  data() {
    return {
      activeTab: 'all',
      orderList: [],
      loading: false
    }
  },
  created() {
    this.checkLogin()
    this.loadOrders()
  },
  methods: {
    checkLogin() {
      if (!this.$store.state.user.isLogin) {
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/user/orders')
      }
    },
    
    async loadOrders() {
      this.loading = true
      try {
        const params = {
          status: this.activeTab === 'all' ? undefined : this.activeTab
        }
        const res = await getOrderList(params)
        console.log('订单API响应:', res)
        this.orderList = res.data || []
        console.log('订单列表:', this.orderList)
      } catch (error) {
        console.error('加载订单失败:', error)
        this.$message.error('加载订单失败')
      } finally {
        this.loading = false
      }
    },
    
    handleTabClick() {
      this.loadOrders()
    },
    
    getStatusType(status) {
      const typeMap = {
        pending: 'warning',
        paid: 'success',
        shipped: 'primary',
        completed: 'info',
        cancelled: 'danger'
      }
      return typeMap[status] || 'info'
    },
    
    handlePay(order) {
      this.$router.push(`/order/payment/${order.id}`)
    },
    
    async handleConfirm(order) {
      this.$confirm('确认收到货物了吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(async () => {
        try {
          await confirmOrder(order.id)
          this.$message.success('确认收货成功')
          this.loadOrders()
        } catch (error) {
          console.error('确认收货失败:', error)
        }
      }).catch(() => {})
    },
    
    async handleCancel(order) {
      this.$confirm('确定要取消该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await cancelOrder(order.id)
          this.$message.success('订单已取消')
          this.loadOrders()
        } catch (error) {
          console.error('取消订单失败:', error)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.my-orders-content {
  .page-title {
    font-size: 20px;
    color: #333;
    margin: 0 0 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e4e7ed;

    i {
      color: #e4393c;
      margin-right: 10px;
    }
  }

  .orders-list {
    margin-top: 20px;
  }

  .order-item {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    margin-bottom: 20px;
    overflow: hidden;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f5f5f5;
    border-bottom: 1px solid #e4e7ed;

    .order-info {
      display: flex;
      gap: 30px;

      .order-no {
        font-size: 14px;
        color: #333;
        font-weight: bold;
      }

      .order-time {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .order-products {
    padding: 20px;

    .product-item {
      display: flex;
      align-items: center;
      padding: 10px 0;

      &:not(:last-child) {
        border-bottom: 1px dashed #e4e7ed;
      }

      .product-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        margin-right: 15px;
      }

      .product-detail {
        flex: 1;

        .product-name {
          font-size: 14px;
          color: #333;
          margin: 0 0 8px;
          line-height: 1.5;
        }

        .product-price {
          font-size: 14px;
          color: #e4393c;
          margin: 0;
        }
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #fafafa;
    border-top: 1px solid #e4e7ed;

    .order-total {
      .label {
        font-size: 14px;
        color: #666;
        margin-right: 10px;
      }

      .price {
        font-size: 20px;
        color: #e4393c;
        font-weight: bold;
      }
    }

    .order-actions {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
