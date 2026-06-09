<template>
  <div class="product-reviews">
    <div class="reviews-header">
      <div class="stats-overview" v-if="reviewStats">
        <div class="average-rating">
          <div class="rating-number">{{ reviewStats.averageRating }}</div>
          <el-rate v-model="reviewStats.averageRating" disabled :show-score="false" />
          <div class="rating-count">共 {{ reviewStats.total }} 条评价</div>
        </div>
        <div class="rating-distribution">
          <div 
            v-for="rating in [5, 4, 3, 2, 1]" 
            :key="rating" 
            class="rating-bar-item"
          >
            <span class="rating-label">{{ rating }}星</span>
            <div class="rating-bar">
              <div 
                class="rating-bar-fill" 
                :style="{ width: getRatingPercent(rating) + '%' }"
              ></div>
            </div>
            <span class="rating-count">{{ getRatingCount(rating) }}</span>
          </div>
        </div>
      </div>
      
      <div class="write-review-section">
        <el-button 
          type="primary" 
          icon="el-icon-edit" 
          @click="handleWriteReview"
        >
          写评价
        </el-button>
      </div>
    </div>
    
    <div class="reviews-filter">
      <el-radio-group v-model="filterRating" @change="handleFilterChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="good">好评</el-radio-button>
        <el-radio-button label="medium">中评</el-radio-button>
        <el-radio-button label="bad">差评</el-radio-button>
      </el-radio-group>
      
      <el-radio-group v-model="sortBy" @change="handleFilterChange" class="sort-group">
        <el-radio-button label="time">最新</el-radio-button>
        <el-radio-button label="useful">有用</el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="reviews-list" v-loading="loading">
      <div v-if="reviewList.length > 0">
        <div 
          v-for="review in reviewList" 
          :key="review.id" 
          class="review-item"
        >
          <div class="review-header">
            <img :src="review.userAvatar" :alt="review.userName" class="user-avatar" />
            <div class="user-info">
              <div class="user-name">{{ review.userName }}</div>
              <el-rate v-model="review.rating" disabled size="small" />
            </div>
            <div class="review-time">{{ review.createTime }}</div>
          </div>
          <div class="review-content">{{ review.content }}</div>
          <div class="review-footer">
            <span 
              class="useful-btn" 
              :class="{ active: review.isUseful }"
              @click="toggleUseful(review)"
            >
              <i class="el-icon-thumb"></i>
              有用 ({{ review.usefulCount }})
            </span>
          </div>
        </div>
        
        <div class="pagination-wrapper" v-if="total > pageSize">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      
      <el-empty v-else description="暂无评价" />
    </div>
    
    <el-dialog
      title="写评价"
      :visible.sync="showReviewDialog"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="reviewForm" :rules="reviewRules" ref="reviewFormRef" label-width="80px">
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="reviewForm.rating" />
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input
            type="textarea"
            v-model="reviewForm.content"
            placeholder="请输入您的评价内容"
            :rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showReviewDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          :loading="submitting"
          @click="handleSubmitReview"
        >
          提交评价
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductReviews',
  props: {
    productId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      filterRating: 'all',
      sortBy: 'time',
      currentPage: 1,
      showReviewDialog: false,
      reviewForm: {
        rating: 5,
        content: ''
      },
      reviewRules: {
        rating: [
          { required: true, message: '请选择评分', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入评价内容', trigger: 'blur' },
          { min: 5, message: '评价内容至少5个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('review', [
      'reviewList',
      'reviewStats',
      'canReview',
      'total',
      'pageSize',
      'loading',
      'submitting'
    ]),
    ...mapState('user', [
      'isLogin'
    ])
  },
  created() {
    this.loadReviews()
    this.loadReviewStats()
    this.fetchCanReview()
  },
  methods: {
    ...mapActions('review', [
      'getReviewList',
      'submitReview',
      'checkCanReview',
      'getReviewStats'
    ]),
    
    async loadReviews() {
      try {
        await this.getReviewList({
          productId: this.productId,
          rating: this.filterRating,
          sortBy: this.sortBy,
          page: this.currentPage
        })
      } catch (error) {
        this.$message.error('加载评价列表失败')
      }
    },
    
    async loadReviewStats() {
      try {
        await this.getReviewStats(this.productId)
      } catch (error) {
        console.error('加载评价统计失败:', error)
      }
    },
    
    async fetchCanReview() {
      if (!this.isLogin) return
      try {
        await this.checkCanReview(this.productId)
      } catch (error) {
        console.error('检查是否可评价失败:', error)
      }
    },
    
    handleWriteReview() {
      if (!this.isLogin) {
        this.$message.warning('请先登录')
        this.$router.push({
          path: '/login',
          query: { redirect: this.$route.fullPath }
        })
        return
      }
      
      if (!this.canReview) {
        this.$message.warning('您还没有购买过该商品，无法评价')
        return
      }
      
      this.showReviewDialog = true
    },
    
    getRatingPercent(rating) {
      if (!this.reviewStats || this.reviewStats.total === 0) return 0
      return (this.reviewStats.ratingDistribution[rating] / this.reviewStats.total) * 100
    },
    
    getRatingCount(rating) {
      if (!this.reviewStats) return 0
      return this.reviewStats.ratingDistribution[rating] || 0
    },
    
    handleFilterChange() {
      this.currentPage = 1
      this.loadReviews()
    },
    
    handlePageChange(page) {
      this.currentPage = page
      this.loadReviews()
    },
    
    toggleUseful(review) {
      if (review.isUseful) {
        review.usefulCount--
      } else {
        review.usefulCount++
      }
      review.isUseful = !review.isUseful
    },
    
    handleSubmitReview() {
      if (!this.isLogin) {
        this.$message.warning('请先登录')
        this.showReviewDialog = false
        this.$router.push({
          path: '/login',
          query: { redirect: this.$route.fullPath }
        })
        return
      }
      
      this.$refs.reviewFormRef.validate(async (valid) => {
        if (valid) {
          try {
            await this.submitReview({
              productId: this.productId,
              rating: this.reviewForm.rating,
              content: this.reviewForm.content
            })
            this.$message.success('评价提交成功')
            this.showReviewDialog = false
            this.reviewForm = {
              rating: 5,
              content: ''
            }
            this.loadReviewStats()
          } catch (error) {
            this.$message.error('提交评价失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-reviews {
  .reviews-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    background: #fafafa;
    border-radius: 4px;
    margin-bottom: 20px;
    
    .stats-overview {
      display: flex;
      align-items: center;
      gap: 40px;
      
      .average-rating {
        text-align: center;
        
        .rating-number {
          font-size: 48px;
          font-weight: bold;
          color: #e4393c;
          line-height: 1;
          margin-bottom: 10px;
        }
        
        .rating-count {
          font-size: 14px;
          color: #999;
          margin-top: 8px;
        }
      }
      
      .rating-distribution {
        .rating-bar-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          
          .rating-label {
            width: 40px;
            color: #666;
          }
          
          .rating-bar {
            width: 120px;
            height: 8px;
            background: #e4e7ed;
            border-radius: 4px;
            margin: 0 10px;
            overflow: hidden;
            
            .rating-bar-fill {
              height: 100%;
              background: #e4393c;
              border-radius: 4px;
              transition: width 0.3s;
            }
          }
          
          .rating-count {
            width: 40px;
            color: #999;
          }
        }
      }
    }
    
    .write-review-section {
      text-align: center;
      
      .tip {
        font-size: 12px;
        color: #999;
        margin-top: 8px;
      }
    }
  }
  
  .reviews-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e4e7ed;
    
    .sort-group {
      margin-left: auto;
    }
  }
  
  .reviews-list {
    .review-item {
      padding: 20px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .review-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
        }
        
        .user-info {
          flex: 1;
          
          .user-name {
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
        font-size: 14px;
        color: #666;
        line-height: 1.8;
        margin-bottom: 12px;
      }
      
      .review-footer {
        text-align: right;
        
        .useful-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #999;
          cursor: pointer;
          transition: color 0.3s;
          
          &:hover,
          &.active {
            color: #e4393c;
          }
          
          i {
            font-size: 16px;
          }
        }
      }
    }
    
    .pagination-wrapper {
      text-align: center;
      margin-top: 30px;
    }
  }
  
  .dialog-footer {
    text-align: right;
  }
}
</style>
