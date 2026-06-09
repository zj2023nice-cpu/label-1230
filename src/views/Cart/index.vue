<template>
  <div class="cart-page">
    <Header />
    
    <div class="container">
      <div class="cart-container">
        <h2 class="page-title">
          <i class="el-icon-shopping-cart-2"></i> 购物车
        </h2>

        <!-- 购物车列表 -->
        <div v-if="cartList.length > 0">
          <!-- 表头 -->
          <div class="cart-header">
            <el-checkbox v-model="isAllSelected" @change="handleSelectAll">全选</el-checkbox>
            <span class="header-item product-info">商品信息</span>
            <span class="header-item">单价</span>
            <span class="header-item">数量</span>
            <span class="header-item">小计</span>
            <span class="header-item">操作</span>
          </div>

          <!-- 商品列表 -->
          <div class="cart-list">
            <div
              v-for="item in cartList"
              :key="item.productId"
              class="cart-item"
            >
              <el-checkbox
                v-model="item.selected"
                @change="handleSelectItem"
              ></el-checkbox>
              
              <div class="product-info">
                <img :src="item.image" :alt="item.name" class="product-image" />
                <div class="product-detail">
                  <p class="product-name">{{ item.name }}</p>
                </div>
              </div>

              <div class="product-price">
                <span class="price">¥{{ item.price }}</span>
              </div>

              <div class="product-quantity">
                <el-input-number
                  v-model="item.count"
                  :min="1"
                  :max="item.stock"
                  size="small"
                  @change="handleQuantityChange(item)"
                />
              </div>

              <div class="product-subtotal">
                <span class="subtotal">¥{{ (item.price * item.count).toFixed(2) }}</span>
              </div>

              <div class="product-actions">
                <el-button
                  type="text"
                  size="small"
                  class="delete-btn"
                  @click="handleRemove(item.productId)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>

          <!-- 底部结算栏 -->
          <div class="cart-footer">
            <div class="footer-left">
              <el-checkbox v-model="isAllSelected" @change="handleSelectAll">全选</el-checkbox>
              <el-button type="text" size="small" @click="handleClearSelected">
                删除选中商品
              </el-button>
            </div>
            <div class="footer-right">
              <div class="total-info">
                <span class="label">已选择</span>
                <span class="count">{{ selectedCount }}</span>
                <span class="label">件商品</span>
              </div>
              <div class="total-price">
                <span class="label">总价:</span>
                <span class="price">¥{{ selectedTotal.toFixed(2) }}</span>
              </div>
              <el-button
                type="danger"
                size="large"
                :disabled="selectedCount === 0"
                @click="handleCheckout"
              >
                去结算
              </el-button>
            </div>
          </div>
        </div>

        <!-- 空购物车 -->
        <el-empty v-else description="购物车空空如也">
          <el-button type="primary" @click="$router.push('/')">去首页逛逛</el-button>
        </el-empty>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Cart',
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', ['selectedTotal', 'selectedCount']),
    isAllSelected: {
      get() {
        return this.cartList.length > 0 && this.cartList.every(item => item.selected)
      },
      set(val) {
        this.$store.commit('cart/TOGGLE_ALL_SELECTED', val)
      }
    }
  },
  methods: {
    handleSelectAll(val) {
      this.$store.commit('cart/TOGGLE_ALL_SELECTED', val)
    },
    
    handleSelectItem() {
      // 选择状态已通过 v-model 更新,无需额外操作
    },
    
    handleQuantityChange(item) {
      this.$store.dispatch('cart/updateCartItem', {
        productId: item.productId,
        count: item.count
      })
    },
    
    handleRemove(productId) {
      this.$confirm('确定要删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('cart/removeFromCart', productId)
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    
    handleClearSelected() {
      if (this.selectedCount === 0) {
        this.$message.warning('请先选择商品')
        return
      }
      
      this.$confirm(`确定要删除选中的${this.selectedCount}件商品吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('cart/clearSelectedItems')
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    
    handleCheckout() {
      if (!this.$store.state.user.isLogin) {
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/cart')
        return
      }
      
      if (this.selectedCount === 0) {
        this.$message.warning('请先选择商品')
        return
      }
      
      this.$router.push('/order/confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.container {
  flex: 1;
  padding: 20px 0;
}

.cart-container {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  min-height: 500px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin: 0 0 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e4e7ed;

  i {
    color: #e4393c;
    margin-right: 10px;
  }
}

.cart-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 15px;

  .el-checkbox {
    margin-right: 20px;
  }

  .header-item {
    color: #666;
    font-size: 14px;
    text-align: center;

    &.product-info {
      flex: 1;
      text-align: left;
      margin-left: 20px;
    }

    &:not(.product-info) {
      width: 120px;
    }
  }
}

.cart-list {
  .cart-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e4e7ed;
    transition: background 0.3s;

    &:hover {
      background: #f9f9f9;
    }

    .el-checkbox {
      margin-right: 20px;
    }

    .product-info {
      flex: 1;
      display: flex;
      align-items: center;
      margin-left: 20px;

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
          margin: 0;
          line-height: 1.5;
          cursor: pointer;

          &:hover {
            color: #e4393c;
          }
        }
      }
    }

    .product-price,
    .product-quantity,
    .product-subtotal,
    .product-actions {
      width: 120px;
      text-align: center;
    }

    .product-price {
      .price {
        font-size: 16px;
        color: #e4393c;
        font-weight: bold;
      }
    }

    .product-subtotal {
      .subtotal {
        font-size: 18px;
        color: #e4393c;
        font-weight: bold;
      }
    }
  }
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
  background: #f5f5f5;
  border-radius: 4px;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 30px;

    .total-info {
      font-size: 14px;
      color: #666;

      .count {
        color: #e4393c;
        font-weight: bold;
        margin: 0 5px;
      }
    }

    .total-price {
      .label {
        font-size: 14px;
        color: #666;
        margin-right: 10px;
      }

      .price {
        font-size: 24px;
        color: #e4393c;
        font-weight: bold;
      }
    }

    .el-button {
      padding: 15px 50px;
      font-size: 16px;
    }
  }
.el-button--text {
      color: #e4393c !important;
}
  .delete-btn {
    color: #e4393c !important;

    &:hover {
      color: #c81623 !important;
    }
  }
}
</style>
