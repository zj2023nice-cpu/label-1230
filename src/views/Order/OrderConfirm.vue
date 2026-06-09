<template>
  <div class="order-confirm-page">
    <Header />
    
    <div class="container">
      <div class="confirm-container">
        <h2 class="page-title">
          <i class="el-icon-s-order"></i> 确认订单
        </h2>

        <!-- 收货地址 -->
        <div class="section address-section">
          <h3 class="section-title">收货地址</h3>
          <div class="address-list" v-if="addressList.length > 0">
            <div
              v-for="address in addressList"
              :key="address.id"
              class="address-item"
              :class="{ active: selectedAddress && selectedAddress.id === address.id }"
              @click="selectAddress(address)"
            >
              <div class="address-info">
                <p class="receiver">
                  {{ address.receiver }} {{ address.phone }}
                  <el-tag v-if="address.isDefault" type="danger" size="mini">默认</el-tag>
                </p>
                <p class="detail">
                  {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                </p>
              </div>
              <i v-if="selectedAddress && selectedAddress.id === address.id" class="el-icon-check check-icon"></i>
            </div>
          </div>
          <el-empty v-else description="暂无收货地址">
            <el-button type="primary" size="small" @click="addAddress">添加收货地址</el-button>
          </el-empty>
        </div>

        <!-- 商品清单 -->
        <div class="section products-section">
          <h3 class="section-title">商品清单</h3>
          <div class="products-list">
            <div
              v-for="item in selectedProducts"
              :key="item.productId"
              class="product-item"
            >
              <img :src="item.image" :alt="item.name" class="product-image" />
              <div class="product-info">
                <p class="product-name">{{ item.name }}</p>
                <p class="product-price">¥{{ item.price }}</p>
              </div>
              <div class="product-quantity">× {{ item.count }}</div>
              <div class="product-subtotal">¥{{ (item.price * item.count).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- 配送方式 -->
        <div class="section delivery-section">
          <h3 class="section-title">配送方式</h3>
          <el-radio-group v-model="deliveryMethod">
            <el-radio label="standard">标准配送 (免运费)</el-radio>
            <el-radio label="express">极速达 (¥10)</el-radio>
          </el-radio-group>
        </div>

        <!-- 订单备注 -->
        <div class="section remark-section">
          <h3 class="section-title">订单备注</h3>
          <el-input
            v-model="remark"
            type="textarea"
            :rows="3"
            placeholder="选填，请先和商家协商一致"
          ></el-input>
        </div>

        <!-- 结算信息 -->
        <div class="settlement-box">
          <div class="settlement-info">
            <div class="info-line">
              <span class="label">商品总额:</span>
              <span class="value">¥{{ productTotal.toFixed(2) }}</span>
            </div>
            <div class="info-line">
              <span class="label">运费:</span>
              <span class="value">¥{{ deliveryFee.toFixed(2) }}</span>
            </div>
            <div class="info-line total">
              <span class="label">应付总额:</span>
              <span class="value price">¥{{ orderTotal.toFixed(2) }}</span>
            </div>
          </div>
          <div class="settlement-action">
            <el-button
              type="danger"
              size="large"
              :disabled="!canSubmit"
              @click="handleSubmit"
            >
              提交订单
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { mapState } from 'vuex'
import { getAddressList } from '@/api/user'
import { createOrder } from '@/api/order'

export default {
  name: 'OrderConfirm',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      addressList: [],
      selectedAddress: null,
      deliveryMethod: 'standard',
      remark: ''
    }
  },
  computed: {
    ...mapState('cart', ['cartList']),
    selectedProducts() {
      return this.cartList.filter(item => item.selected)
    },
    productTotal() {
      return this.selectedProducts.reduce((total, item) => {
        return total + item.price * item.count
      }, 0)
    },
    deliveryFee() {
      return this.deliveryMethod === 'express' ? 10 : 0
    },
    orderTotal() {
      return this.productTotal + this.deliveryFee
    },
    canSubmit() {
      return this.selectedAddress && this.selectedProducts.length > 0
    }
  },
  created() {
    this.checkLogin()
    this.checkCart()
    this.loadAddressList()
  },
  methods: {
    checkLogin() {
      if (!this.$store.state.user.isLogin) {
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/order/confirm')
      }
    },
    
    checkCart() {
      if (this.selectedProducts.length === 0) {
        this.$message.warning('请先选择商品')
        this.$router.push('/cart')
      }
    },
    
    async loadAddressList() {
      try {
        const res = await getAddressList()
        this.addressList = res.data || []
        
        // 默认选中默认地址
        const defaultAddress = this.addressList.find(addr => addr.isDefault)
        if (defaultAddress) {
          this.selectedAddress = defaultAddress
        } else if (this.addressList.length > 0) {
          this.selectedAddress = this.addressList[0]
        }
      } catch (error) {
        console.error('加载地址失败:', error)
      }
    },
    
    selectAddress(address) {
      this.selectedAddress = address
    },
    
    addAddress() {
      this.$message.info('收货地址管理功能开发中')
    },
    
    async handleSubmit() {
      if (!this.canSubmit) return
      
      const orderData = {
        products: this.selectedProducts.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          count: item.count
        })),
        totalAmount: this.orderTotal,
        address: this.selectedAddress,
        deliveryMethod: this.deliveryMethod,
        deliveryFee: this.deliveryFee,
        remark: this.remark
      }
      
      try {
        const res = await createOrder(orderData)
        
        // 清空购物车中已选商品
        this.$store.dispatch('cart/clearSelectedItems')
        
        this.$message.success('订单提交成功')
        
        // 跳转到支付页面
        this.$router.push(`/order/payment/${res.data.id}`)
      } catch (error) {
        console.error('提交订单失败:', error)
        this.$message.error('提交订单失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-confirm-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.container {
  flex: 1;
  padding: 20px 0;
}

.confirm-container {
  background: #fff;
  border-radius: 4px;
  min-height: 600px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin: 0;
  padding: 30px;
  border-bottom: 2px solid #e4e7ed;

  i {
    color: #e4393c;
    margin-right: 10px;
  }
}

.section {
  padding: 30px;
  border-bottom: 1px solid #e4e7ed;

  .section-title {
    font-size: 16px;
    color: #333;
    margin: 0 0 20px;
    font-weight: bold;
  }
}

.address-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  .address-item {
    position: relative;
    padding: 20px;
    border: 2px solid #e4e7ed;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #e4393c;
    }

    &.active {
      border-color: #e4393c;
      background: #fff5f5;
    }

    .address-info {
      .receiver {
        font-size: 14px;
        color: #333;
        margin: 0 0 10px;
        font-weight: bold;

        .el-tag {
          margin-left: 10px;
        }
      }

      .detail {
        font-size: 14px;
        color: #666;
        margin: 0;
        line-height: 1.6;
      }
    }

    .check-icon {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 24px;
      color: #e4393c;
    }
  }
}

.products-list {
  .product-item {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px dashed #e4e7ed;

    &:last-child {
      border-bottom: none;
    }

    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      margin-right: 15px;
    }

    .product-info {
      flex: 1;

      .product-name {
        font-size: 14px;
        color: #333;
        margin: 0 0 8px;
      }

      .product-price {
        font-size: 14px;
        color: #e4393c;
        margin: 0;
      }
    }

    .product-quantity {
      width: 100px;
      text-align: center;
      color: #666;
    }

    .product-subtotal {
      width: 120px;
      text-align: right;
      font-size: 16px;
      color: #e4393c;
      font-weight: bold;
    }
  }
}

.settlement-box {
  padding: 30px;
  background: #fafafa;

  .settlement-info {
    max-width: 400px;
    margin-left: auto;
    margin-bottom: 20px;

    .info-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;

      .label {
        color: #666;
      }

      .value {
        color: #333;
      }

      &.total {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #e4e7ed;
        font-size: 16px;

        .price {
          font-size: 24px;
          color: #e4393c;
          font-weight: bold;
        }
      }
    }
  }

  .settlement-action {
    text-align: right;

    .el-button {
      padding: 15px 60px;
      font-size: 16px;
    }
  }
}
</style>
