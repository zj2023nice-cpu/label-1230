<template>
  <div class="product-reviews" v-loading="loading">
    <div class="reviews-header" v-if="stats">
      <div class="stats-overview">
        <div class="average-score">
          <span class="score">{{ stats.average }}</span>
          <el-rate :value="Number(stats.average)" disabled show-score text-color="#ff9900" />
        </div>
        <div class="stats-info">
          <div class="good-rate">
            <span>好评率</span>
            <span class="rate-value">{{ stats.goodRate }}%</span>
          </div>
          <div class="total-count">共 {{ stats.total }} 条评价</div>
        </div>
      </div>

      <div class="rating-bars">
        <div
          v-for="item in stats.ratingCounts"
          :key="item.rating"
          class="rating-bar-item"
        >
          <span class="star-label">{{ item.rating }}星</span>
          <div class="bar-bg">
            <div
              class="bar-fill"
              :style="{ width: stats.total > 0 ? (item.count / stats.total * 100) + '%' : '0%' }"
            ></div>
          </div>
          <span class="bar-count">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <div class="write-review-section" v-if="isLogin">
      <div v-if="canReview" class="write-review-form">
        <div class="form-title">写评价</div>
        <div class="form-item">
          <span class="form-label">评分：</span>
          <el-rate v-model="reviewForm.rating" />
        </div>
        <div class="form-item">
          <span class="form-label">评价内容：</span>
          <el-input
            type="textarea"
            v-model="reviewForm.content"
            :rows="4"
            placeholder="分享您对这件商品的真实感受吧~"
            maxlength="500"
            show-word-limit
          />
        </div>
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmitReview" :loading="submitting">
            提交评价
          </el-button>
        </div>
      </div>
      <div v-else class="review-disabled">
        <i class="el-icon-info"></i>
        {{ canReviewReason }}
      </div>
    </div>

    <div class="write-review-section" v-else>
      <div class="review-disabled">
        <i class="el-icon-user"></i>
        登录后即可发表评价
        <el-button type="text" @click="goLogin">立即登录</el-button>
      </div>
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="filterRating" @change="handleFilterChange">
        <el-radio-button :label="0">全部</el-radio-button>
        <el-radio-button :label="5">好评 (5星)</el-radio-button>
        <el-radio-button :label="4">4星</el-radio-button>
        <el-radio-button :label="3">3星</el-radio-button>
        <el-radio-button :label="2">2星</el-radio-button>
        <el-radio-button :label="1">差评 (1星)</el-radio-button>
      </el-radio-group>
    </div>

    <div class="review-list">
      <div v-if="reviewList.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无符合条件的评价"></el-empty>
      </div>
      <div
        v-for="review in reviewList"
        :key="review.id"
        class="review-item"
      >
        <div class="review-user">
          <div class="user-avatar">
            <img :src="review.avatar" :alt="review.username" />
          </div>
          <div class="user-info">
            <div class="username">{{ review.username }}</div>
            <el-rate :value="review.rating" disabled size="small" />
          </div>
        </div>
        <div class="review-content">{{ review.content }}</div>
        <div class="review-images" v-if="review.images && review.images.length > 0">
          <div
            v-for="(img, idx) in review.images"
            :key="idx"
            class="review-image"
          >
            <img :src="img" />
          </div>
        </div>
        <div class="review-footer">
          <span class="review-time">{{ review.createTime }}</span>
          <span class="helpful-count">
            <i class="el-icon-thumb"></i>
            {{ review.helpful }}
          </span>
        </div>
      </div>
    </div>

    <div class="pagination-wrapper" v-if="pagination.total > pagination.pageSize">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
      reviewForm: {
        rating: 5,
        content: ''
      }
    }
  },
  computed: {
    ...mapState({
      reviewList: state => state.review.reviewList,
      stats: state => state.review.reviewStats,
      pagination: state => state.review.pagination,
      loading: state => state.review.loading,
      canReview: state => state.review.canReview,
      canReviewReason: state => state.review.canReviewReason,
      submitting: state => state.review.submitting,
      isLogin: state => state.user.isLogin
    }),
    filterRating: {
      get() {
        return this.$store.state.review.currentFilterRating
      },
      set(val) {
        this.$store.commit('review/SET_FILTER_RATING', val)
      }
    }
  },
  watch: {
    productId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.loadReviews(1)
          this.checkReviewPermission()
        }
      }
    }
  },
  methods: {
    async loadReviews(page = 1) {
      await this.$store.dispatch('review/fetchReviewList', {
        productId: this.productId,
        rating: this.filterRating,
        page,
        pageSize: 10
      })
    },
    async checkReviewPermission() {
      if (this.isLogin) {
        await this.$store.dispatch('review/checkCanReview', this.productId)
      }
    },
    handleFilterChange() {
      this.loadReviews(1)
    },
    handlePageChange(page) {
      this.loadReviews(page)
    },
    async handleSubmitReview() {
      if (!this.reviewForm.content.trim()) {
        this.$message.warning('请输入评价内容')
        return
      }
      if (this.reviewForm.rating < 1) {
        this.$message.warning('请选择评分')
        return
      }

      if (!this.isLogin) {
        this.goLogin()
        return
      }

      try {
        await this.$store.dispatch('review/submitReview', {
          productId: this.productId,
          rating: this.reviewForm.rating,
          content: this.reviewForm.content.trim()
        })
        this.$message.success('评价提交成功')
        this.reviewForm = {
          rating: 5,
          content: ''
        }
      } catch (error) {
        if (error.code === 401 || error.message === '请先登录') {
          this.$message.warning('请先登录')
          this.goLogin()
        } else if (error.code === 403) {
          this.$message.warning(error.message || '购买后才可以评价')
          this.checkReviewPermission()
        } else {
          this.$message.error(error.message || '提交失败')
        }
      }
    },
    goLogin() {
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-reviews {
  min-height: 100px;
}

.reviews-header {
  display: flex;
  gap: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stats-overview {
  text-align: center;
}

.average-score {
  .score {
    font-size: 48px;
    font-weight: bold;
    color: #e4393c;
    line-height: 1;
    display: block;
    margin-bottom: 8px;
  }
}

.stats-info {
  margin-top: 15px;

  .good-rate {
    font-size: 14px;
    color: #666;

    .rate-value {
      color: #67c23a;
      font-size: 18px;
      font-weight: bold;
      margin-left: 5px;
    }
  }

  .total-count {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
  }
}

.rating-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 10px;

  .star-label {
    width: 40px;
    font-size: 13px;
    color: #666;
  }

  .bar-bg {
    flex: 1;
    height: 8px;
    background: #e4e7ed;
    border-radius: 4px;
    overflow: hidden;

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff9900, #f56c6c);
      border-radius: 4px;
      transition: width 0.3s;
    }
  }

  .bar-count {
    width: 40px;
    text-align: right;
    font-size: 13px;
    color: #999;
  }
}

.write-review-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.write-review-form {
  .form-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 15px;
  }

  .form-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;

    .form-label {
      width: 80px;
      line-height: 32px;
      color: #666;
      flex-shrink: 0;
    }

    .el-input {
      flex: 1;
    }
  }

  .form-actions {
    padding-left: 80px;
  }
}

.review-disabled {
  text-align: center;
  color: #999;
  padding: 10px 0;

  i {
    margin-right: 5px;
  }

  .el-button {
    padding: 0 5px;
  }
}

.filter-bar {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.review-list {
  .review-item {
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .review-user {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        background: #f5f5f5;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-info {
        .username {
          font-size: 14px;
          color: #333;
          font-weight: 500;
          margin-bottom: 4px;
        }
      }
    }

    .review-content {
      font-size: 14px;
      line-height: 1.8;
      color: #333;
      margin-bottom: 12px;
    }

    .review-images {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;

      .review-image {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #e4e7ed;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .review-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #999;

      .helpful-count {
        i {
          margin-right: 4px;
        }
      }
    }
  }
}

.empty-state {
  padding: 40px 0;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: center;
}
</style>
