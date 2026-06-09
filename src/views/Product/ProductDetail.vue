<template>
  <div class="product-detail-page">
    <Header />
    
    <div class="container" v-loading="loading">
      <div class="product-detail" v-if="product">
        <!-- 商品主要信息 -->
        <el-row :gutter="20">
          <!-- 左侧图片 -->
          <el-col :span="10">
            <div class="product-images">
              <div class="main-image">
                <img :src="currentImage" :alt="product.name" />
              </div>
              <div class="image-list">
                <div
                  v-for="(img, index) in product.images"
                  :key="index"
                  class="image-item"
                  :class="{ active: currentImage === img }"
                  @click="currentImage = img"
                >
                  <img :src="img" />
                </div>
              </div>
            </div>
          </el-col>

          <!-- 右侧信息 -->
          <el-col :span="14">
            <div class="product-info">
              <h1 class="product-title">{{ product.name }}</h1>
              
              <div class="product-tags" v-if="product.tags">
                <el-tag v-for="tag in product.tags" :key="tag" type="danger" size="small">
                  {{ tag }}
                </el-tag>
              </div>

              <div class="product-price-box">
                <div class="price-line">
                  <span class="label">价格</span>
                  <span class="price">¥{{ product.price }}</span>
                  <span class="original-price" v-if="product.originalPrice">
                    ¥{{ product.originalPrice }}
                  </span>
                </div>
              </div>

              <div class="product-meta">
                <div class="meta-item">
                  <span class="label">销量:</span>
                  <span class="value">{{ formatSales(product.sales) }}</span>
                </div>
                <div class="meta-item">
                  <span class="label">库存:</span>
                  <span class="value">{{ product.stock }}件</span>
                </div>
                <div class="meta-item">
                  <span class="label">评分:</span>
                  <el-rate v-model="product.rating" disabled show-score />
                </div>
              </div>

              <!-- 商品规格 -->
              <div class="product-specs" v-if="product.specs">
                <div class="spec-item">
                  <span class="label">品牌:</span>
                  <span class="value">{{ product.specs.brand }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">型号:</span>
                  <span class="value">{{ product.specs.model }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">产地:</span>
                  <span class="value">{{ product.specs.origin }}</span>
                </div>
              </div>

              <!-- 数量选择 -->
              <div class="quantity-box">
                <span class="label">数量:</span>
                <el-input-number
                  v-model="quantity"
                  :min="1"
                  :max="product.stock"
                  size="medium"
                />
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <el-button
                  type="danger"
                  size="large"
                  icon="el-icon-shopping-cart-2"
                  @click="handleAddToCart"
                >
                  加入购物车
                </el-button>
                <el-button
                  type="primary"
                  size="large"
                  @click="handleBuyNow"
                >
                  立即购买
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 商品详情描述 -->
        <div class="product-description">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="商品详情" name="detail">
              <div class="desc-content">
                <p>{{ product.description }}</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户评价" name="reviews">
              <div class="reviews-content">
                <ProductReviews :product-id="Number($route.params.id)" v-if="product" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <el-empty v-else description="商品不存在"></el-empty>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import ProductReviews from '@/components/business/ProductReviews.vue'
import { getProductDetail } from '@/api/product'

export default {
  name: 'ProductDetail',
  components: {
    Header,
    Footer,
    ProductReviews
  },
  data() {
    return {
      product: null,
      currentImage: '',
      quantity: 1,
      activeTab: 'detail',
      loading: false
    }
  },
  created() {
    this.loadProductDetail()
  },
  methods: {
    async loadProductDetail() {
      const productId = this.$route.params.id
      this.loading = true
      
      try {
        const res = await getProductDetail(productId)
        this.product = res.data
        if (this.product && this.product.images && this.product.images.length > 0) {
          this.currentImage = this.product.images[0]
        }
      } catch (error) {
        console.error('加载商品详情失败:', error)
        this.$message.error('加载商品详情失败')
      } finally {
        this.loading = false
      }
    },
    
    handleAddToCart() {
      if (!this.product) return
      
      this.$store.dispatch('cart/addToCart', {
        ...this.product,
        count: this.quantity
      })
      
      this.$message.success('已添加到购物车')
    },
    
    handleBuyNow() {
      if (!this.$store.state.user.isLogin) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      
      this.handleAddToCart()
      this.$router.push('/cart')
    },
    
    formatSales(sales) {
      if (sales >= 10000) {
        return (sales / 10000).toFixed(1) + '万'
      }
      return sales
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.container {
  flex: 1;
  padding: 20px 0;
}

.product-detail {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
}

.product-images {
  .main-image {
    width: 100%;
    height: 400px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .image-list {
    display: flex;
    gap: 10px;
    margin-top: 10px;

    .image-item {
      width: 80px;
      height: 80px;
      border: 2px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s;

      &:hover,
      &.active {
        border-color: #e4393c;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.product-info {
  .product-title {
    font-size: 24px;
    color: #333;
    margin: 0 0 15px;
  }

  .product-tags {
    margin-bottom: 20px;

    .el-tag {
      margin-right: 10px;
    }
  }

  .product-price-box {
    background: #f5f5f5;
    padding: 20px;
    margin: 20px 0;
    border-radius: 4px;

    .price-line {
      display: flex;
      align-items: baseline;

      .label {
        font-size: 14px;
        color: #666;
        margin-right: 10px;
      }

      .price {
        font-size: 32px;
        color: #e4393c;
        font-weight: bold;
      }

      .original-price {
        font-size: 16px;
        color: #999;
        text-decoration: line-through;
        margin-left: 15px;
      }
    }
  }

  .product-meta {
    padding: 15px 0;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 20px;

    .meta-item {
      display: inline-block;
      margin-right: 30px;
      margin-bottom: 10px;

      .label {
        color: #999;
        margin-right: 8px;
      }

      .value {
        color: #333;
      }
    }
  }

  .product-specs {
    margin-bottom: 20px;

    .spec-item {
      padding: 10px 0;
      border-bottom: 1px dashed #e4e7ed;

      .label {
        color: #999;
        margin-right: 15px;
        min-width: 60px;
        display: inline-block;
      }

      .value {
        color: #333;
      }
    }
  }

  .quantity-box {
    display: flex;
    align-items: center;
    margin: 30px 0;

    .label {
      margin-right: 15px;
      color: #333;
    }
  }

  .action-buttons {
    display: flex;
    gap: 15px;

    .el-button {
      flex: 1;
      height: 50px;
      font-size: 16px;
    }
  }
}

.product-description {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e4e7ed;

  .desc-content,
  .specs-content,
  .reviews-content {
    padding: 20px;
    min-height: 200px;

    p {
      line-height: 1.8;
      color: #666;
      margin-bottom: 15px;
    }
  }
}
</style>
