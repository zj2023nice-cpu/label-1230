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
                <!-- 评分概览 -->
                <div class="reviews-summary" v-if="reviewStats.total > 0">
                  <div class="summary-score">
                    <div class="score-num">{{ reviewStats.average }}</div>
                    <el-rate
                      :value="Number(reviewStats.average) || 0"
                      disabled
                      allow-half
                      text-color="#ff9900"
                    />
                    <div class="score-total">共 {{ reviewStats.total }} 条评价</div>
                  </div>
                  <div class="summary-filter">
                    <el-radio-group
                      v-model="filterRating"
                      size="small"
                      @change="handleRatingChange"
                    >
                      <el-radio-button label="all">全部</el-radio-button>
                      <el-radio-button
                        v-for="star in [5, 4, 3, 2, 1]"
                        :key="star"
                        :label="star"
                      >
                        {{ star }}星 ({{ reviewStats.distribution[star] || 0 }})
                      </el-radio-button>
                    </el-radio-group>
                  </div>
                </div>

                <!-- 写评价入口 -->
                <div class="review-form-box">
                  <div v-if="!isLogin" class="form-tip">
                    <span>登录后可发表评价</span>
                    <el-button type="text" @click="goLogin">去登录</el-button>
                  </div>
                  <div v-else-if="!purchased" class="form-tip">
                    <i class="el-icon-info"></i>
                    仅已购买该商品的用户可以发表评价
                  </div>
                  <el-form
                    v-else
                    ref="reviewForm"
                    :model="reviewForm"
                    :rules="reviewRules"
                    label-width="80px"
                    class="review-form"
                  >
                    <el-form-item label="评分" prop="rating">
                      <el-rate v-model="reviewForm.rating" />
                    </el-form-item>
                    <el-form-item label="评价内容" prop="content">
                      <el-input
                        v-model="reviewForm.content"
                        type="textarea"
                        :rows="3"
                        maxlength="300"
                        show-word-limit
                        placeholder="请分享您对该商品的使用感受"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        :loading="submitting"
                        @click="handleSubmitReview"
                      >
                        提交评价
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>

                <!-- 评价列表 -->
                <div class="review-list" v-loading="reviewLoading">
                  <el-empty
                    v-if="!reviewLoading && reviewList.length === 0"
                    description="暂无评价"
                  ></el-empty>
                  <div
                    v-for="item in reviewList"
                    :key="item.id"
                    class="review-item"
                  >
                    <div class="review-user">
                      <img class="avatar" :src="item.avatar" :alt="item.nickname" />
                      <div class="user-info">
                        <div class="nickname">{{ item.nickname }}</div>
                        <el-rate
                          :value="item.rating"
                          disabled
                          text-color="#ff9900"
                        />
                      </div>
                      <div class="review-time">{{ item.createTime }}</div>
                    </div>
                    <div class="review-content">{{ item.content }}</div>
                  </div>
                </div>
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
import { mapState } from 'vuex'
import { getProductDetail } from '@/api/product'

export default {
  name: 'ProductDetail',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      product: null,
      currentImage: '',
      quantity: 1,
      activeTab: 'detail',
      loading: false,
      filterRating: 'all',
      reviewForm: {
        rating: 5,
        content: ''
      },
      reviewRules: {
        rating: [
          {
            type: 'number',
            required: true,
            message: '请选择评分',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value || value < 1) {
                callback(new Error('请选择 1-5 星评分'))
              } else {
                callback()
              }
            }
          }
        ],
        content: [
          { required: true, message: '请填写评价内容', trigger: 'blur' },
          { min: 5, message: '评价内容至少 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['isLogin']),
    reviewList() {
      return this.$store.state.review.reviewList
    },
    reviewStats() {
      return this.$store.state.review.reviewStats
    },
    reviewLoading() {
      return this.$store.state.review.loading
    },
    submitting() {
      return this.$store.state.review.submitting
    },
    purchased() {
      return this.$store.state.review.purchased
    },
    productId() {
      return parseInt(this.$route.params.id)
    }
  },
  watch: {
    activeTab(val) {
      if (val === 'reviews') {
        this.loadReviews()
      }
    },
    '$route.params.id'() {
      this.resetReviewState()
      this.loadProductDetail()
    }
  },
  created() {
    this.loadProductDetail()
  },
  beforeDestroy() {
    this.$store.commit('review/RESET')
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

    resetReviewState() {
      this.filterRating = 'all'
      this.reviewForm = { rating: 5, content: '' }
      this.$store.commit('review/RESET')
    },

    async loadReviews() {
      if (!this.productId) return
      this.$store.commit('review/SET_CURRENT_RATING', this.filterRating)
      await this.$store.dispatch('review/fetchReviewList', {
        productId: this.productId,
        rating: this.filterRating
      })
      if (this.isLogin) {
        this.$store.dispatch('review/checkPurchased', this.productId)
      } else {
        this.$store.commit('review/SET_PURCHASED', false)
      }
    },

    handleRatingChange(rating) {
      this.$store.dispatch('review/changeRating', {
        productId: this.productId,
        rating
      })
    },

    goLogin() {
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      })
    },

    handleSubmitReview() {
      if (!this.isLogin) {
        this.$message.warning('请先登录后再发表评价')
        this.goLogin()
        return
      }

      this.$refs.reviewForm.validate(async (valid) => {
        if (!valid) return

        try {
          await this.$store.dispatch('review/submitReview', {
            productId: this.productId,
            rating: this.reviewForm.rating,
            content: this.reviewForm.content
          })
          this.$message.success('评价提交成功')
          this.reviewForm = { rating: 5, content: '' }
          this.$refs.reviewForm.clearValidate()
          // 提交后重置筛选为全部，便于看到自己的评价
          this.filterRating = 'all'
          this.$store.commit('review/SET_CURRENT_RATING', 'all')
        } catch (e) {
          // 错误提示已在 request 拦截器中处理
        }
      })
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

.reviews-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 20px;

  .summary-score {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;

    .score-num {
      font-size: 28px;
      font-weight: bold;
      color: #ff9900;
    }

    .score-total {
      font-size: 13px;
      color: #999;
    }
  }
}

.review-form-box {
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;

  .form-tip {
    color: #909399;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;

    .el-icon-info {
      color: #e6a23c;
    }
  }
}

.review-list {
  min-height: 120px;

  .review-item {
    padding: 16px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .review-user {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 12px;
        object-fit: cover;
        background: #f5f5f5;
      }

      .user-info {
        flex: 1;

        .nickname {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
      }

      .review-time {
        font-size: 12px;
        color: #999;
      }
    }

    .review-content {
      color: #333;
      line-height: 1.7;
      padding-left: 52px;
    }
  }
}
</style>
