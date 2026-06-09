<template>
  <div class="order-payment-page">
    <Header />
    
    <div class="container">
      <div class="payment-container">
        <div class="payment-success">
          <i class="el-icon-success success-icon"></i>
          <h2>订单提交成功！</h2>
          <p class="order-no">订单号: {{ orderNo }}</p>
        </div>

        <div class="payment-info">
          <h3>支付金额</h3>
          <p class="amount">¥{{ amount }}</p>
        </div>

        <div class="payment-methods">
          <h3>选择支付方式</h3>
          <el-radio-group v-model="paymentMethod" class="method-list">
            <el-radio label="alipay" class="method-item">
              <span class="method-name">支付宝</span>
            </el-radio>
            <el-radio label="wechat" class="method-item">
              <span class="method-name">微信支付</span>
            </el-radio>
            <el-radio label="union" class="method-item">
              <span class="method-name">银联支付</span>
            </el-radio>
          </el-radio-group>
        </div>

        <div class="payment-actions">
          <el-button type="primary" size="large" @click="handlePay">
            立即支付
          </el-button>
          <el-button size="large" @click="handleCancel">
            取消订单
          </el-button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

export default {
  name: 'OrderPayment',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      orderId: '',
      orderNo: 'JD202402040001',
      amount: 0,
      paymentMethod: 'alipay'
    }
  },
  created() {
    this.orderId = this.$route.params.id
    this.loadOrderInfo()
  },
  methods: {
    loadOrderInfo() {
      // 模拟订单数据
      this.orderNo = `JD${Date.now()}`
      this.amount = (Math.random() * 1000 + 100).toFixed(2)
    },
    
    handlePay() {
      this.$message.success('支付成功！(演示)')
      setTimeout(() => {
        this.$router.push('/user/orders')
      }, 1500)
    },
    
    handleCancel() {
      this.$confirm('确定要取消订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.info('订单已取消')
        this.$router.push('/user/orders')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.order-payment-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.container {
  flex: 1;
  padding: 40px 0;
}

.payment-container {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 4px;
  padding: 40px;
}

.payment-success {
  text-align: center;
  padding: 30px 0;
  border-bottom: 1px solid #e4e7ed;

  .success-icon {
    font-size: 60px;
    color: #67c23a;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 24px;
    color: #333;
    margin: 0 0 15px;
  }

  .order-no {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.payment-info {
  text-align: center;
  padding: 30px 0;
  border-bottom: 1px solid #e4e7ed;

  h3 {
    font-size: 16px;
    color: #666;
    margin: 0 0 15px;
    font-weight: normal;
  }

  .amount {
    font-size: 36px;
    color: #e4393c;
    font-weight: bold;
    margin: 0;
  }
}

.payment-methods {
  padding: 30px 0;
  border-bottom: 1px solid #e4e7ed;

  h3 {
    font-size: 16px;
    color: #333;
    margin: 0 0 20px;
  }

  .method-list {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .method-item {
      padding: 15px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        border-color: #e4393c;
        background: #fff5f5;
      }

      .method-name {
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}

.payment-actions {
  padding-top: 30px;
  text-align: center;

  .el-button {
    padding: 15px 50px;
    font-size: 16px;
  }

  .el-button + .el-button {
    margin-left: 20px;
  }
}
</style>
