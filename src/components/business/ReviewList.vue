<template>
  <div class="review-list">
    <div class="filter-bar">
      <span class="filter-label">评分筛选：</span>
      <el-radio-group v-model="currentRating" size="small" @change="handleFilterChange">
        <el-radio-button :label="0">全部</el-radio-button>
        <el-radio-button :label="5">5星</el-radio-button>
        <el-radio-button :label="4">4星</el-radio-button>
        <el-radio-button :label="3">3星</el-radio-button>
        <el-radio-button :label="2">2星</el-radio-button>
        <el-radio-button :label="1">1星</el-radio-button>
      </el-radio-group>
      <span class="review-count">共 {{ reviewTotal }} 条评价</span>
    </div>

    <div v-loading="reviewLoading" class="list-wrapper">
      <div v-if="reviewList.length > 0" class="review-items">
        <div v-for="review in reviewList" :key="review.id" class="review-item">
          <div class="review-header">
            <div class="user-info">
              <img v-if="review.avatar" :src="review.avatar" class="avatar" />
              <div v-else class="avatar-placeholder">{{ (review.nickname || '?')[0] }}</div>
              <span class="nickname">{{ review.nickname }}</span>
            </div>
            <span class="review-time">{{ review.createTime }}</span>
          </div>
          <div class="review-rating">
            <el-rate v-model="review.rating" disabled />
          </div>
          <div class="review-content">{{ review.content }}</div>
        </div>
      </div>

      <el-empty v-else description="暂无评价"></el-empty>

      <div class="pagination-wrapper" v-if="reviewTotal > pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="reviewTotal"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewList',
  props: {
    productId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      currentRating: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    reviewList() {
      return this.$store.state.review.reviewList
    },
    reviewTotal() {
      return this.$store.state.review.reviewTotal
    },
    reviewLoading() {
      return this.$store.state.review.reviewLoading
    }
  },
  watch: {
    productId() {
      this.currentRating = 0
      this.currentPage = 1
      this.loadReviews()
    }
  },
  created() {
    this.loadReviews()
  },
  methods: {
    loadReviews() {
      const params = {
        productId: this.productId,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.currentRating > 0) {
        params.rating = this.currentRating
      }
      this.$store.dispatch('review/getReviewList', params)
    },
    handleFilterChange() {
      this.currentPage = 1
      this.loadReviews()
    },
    handlePageChange(page) {
      this.currentPage = page
      this.loadReviews()
    },
    refresh() {
      this.loadReviews()
    }
  }
}
</script>

<style lang="scss" scoped>
.review-list {
  .filter-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    .filter-label {
      font-size: 14px;
      color: #666;
      white-space: nowrap;
    }

    .review-count {
      margin-left: auto;
      font-size: 13px;
      color: #999;
      white-space: nowrap;
    }
  }

  .list-wrapper {
    min-height: 200px;
  }

  .review-items {
    .review-item {
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .review-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;

          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
          }

          .avatar-placeholder {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #e4393c;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
          }

          .nickname {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
        }

        .review-time {
          font-size: 12px;
          color: #999;
        }
      }

      .review-rating {
        margin-bottom: 8px;

        ::v-deep .el-rate {
          height: 20px;

          .el-rate__icon {
            font-size: 14px;
          }
        }
      }

      .review-content {
        font-size: 14px;
        color: #555;
        line-height: 1.6;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 16px;
  }
}
</style>
