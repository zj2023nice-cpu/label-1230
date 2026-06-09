<template>
  <div class="review-form">
    <div class="form-header">
      <h3>发表评价</h3>
    </div>
    <div v-if="isLogin" class="form-body">
      <div v-if="checking" class="checking-status">
        <i class="el-icon-loading"></i> 正在验证购买状态...
      </div>
      <div v-else-if="hasPurchased">
        <el-form :model="form" :rules="rules" ref="reviewForm" label-width="80px">
          <el-form-item label="商品评分" prop="rating">
            <el-rate
              v-model="form.rating"
              :texts="['很差', '较差', '一般', '满意', '非常满意']"
              show-text
            />
          </el-form-item>
          <el-form-item label="评价内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请分享您的购物体验..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
              提交评价
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="purchase-tip">
        <el-alert
          title="购买后才可以评价"
          type="warning"
          :closable="false"
          show-icon
        />
      </div>
    </div>
    <div v-else class="login-tip">
      <el-alert
        title="登录后可以发表评价"
        type="info"
        :closable="false"
        show-icon
      />
      <el-button type="primary" size="small" @click="goLogin" style="margin-top: 12px;">
        去登录
      </el-button>
    </div>
  </div>
</template>

<script>
import { checkPurchase } from '@/api/product'

export default {
  name: 'ReviewForm',
  props: {
    productId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      form: {
        rating: 5,
        content: ''
      },
      rules: {
        rating: [
          { required: true, message: '请选择评分', trigger: 'change', type: 'number', min: 1 }
        ],
        content: [
          { required: true, message: '请输入评价内容', trigger: 'blur' },
          { min: 5, max: 500, message: '评价内容长度在5到500个字符之间', trigger: 'blur' }
        ]
      },
      submitting: false,
      checking: false,
      hasPurchased: false
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.user.isLogin
    },
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  watch: {
    isLogin(val) {
      if (val) {
        this.checkPurchaseStatus()
      }
    },
    productId() {
      if (this.isLogin) {
        this.checkPurchaseStatus()
      }
    }
  },
  created() {
    if (this.isLogin) {
      this.checkPurchaseStatus()
    }
  },
  methods: {
    goLogin() {
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      })
    },
    async checkPurchaseStatus() {
      this.checking = true
      try {
        const res = await checkPurchase(this.productId)
        this.hasPurchased = res.data.purchased
      } catch (error) {
        this.hasPurchased = false
      } finally {
        this.checking = false
      }
    },
    handleSubmit() {
      if (!this.isLogin) {
        this.$router.push({
          path: '/login',
          query: { redirect: this.$route.fullPath }
        })
        return
      }
      this.$refs.reviewForm.validate(async (valid) => {
        if (!valid) return

        this.submitting = true
        try {
          const reviewData = {
            productId: parseInt(this.productId),
            userId: this.userInfo?.id || 1,
            nickname: this.userInfo?.nickname || this.userInfo?.username || '匿名用户',
            avatar: this.userInfo?.avatar || '',
            rating: this.form.rating,
            content: this.form.content
          }

          await this.$store.dispatch('review/submitReview', reviewData)
          this.$message.success('评价提交成功')
          this.resetForm()
          this.$emit('submitted')
        } catch (error) {
          this.$message.error('评价提交失败，请稍后重试')
        } finally {
          this.submitting = false
        }
      })
    },
    resetForm() {
      this.form.rating = 5
      this.form.content = ''
      this.$nextTick(() => {
        if (this.$refs.reviewForm) {
          this.$refs.reviewForm.clearValidate()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.review-form {
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 24px;

  .form-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;

    h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }
  }

  .checking-status {
    padding: 20px 0;
    text-align: center;
    color: #999;
    font-size: 14px;

    .el-icon-loading {
      margin-right: 6px;
    }
  }

  .purchase-tip,
  .login-tip {
    padding: 10px 0;
  }
}
</style>
