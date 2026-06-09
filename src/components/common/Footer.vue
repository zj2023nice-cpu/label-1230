<template>
  <div class="footer">
    <div class="footer-content">
      <div class="container">
        <el-row :gutter="40">
          <el-col :span="6">
            <h4>购物指南</h4>
            <ul>
              <li><a href="#" @click.prevent="showInfo('购物流程', '1.浏览商品 → 2.加入购物车 → 3.确认订单 → 4.在线支付 → 5.等待收货')">购物流程</a></li>
              <li><a href="#" @click.prevent="showInfo('会员介绍', '成为会员即可享受积分奖励、专属优惠、生日特权等多项会员福利！')">会员介绍</a></li>
              <li><a href="#" @click.prevent="showInfo('支付方式', '支持微信支付、支付宝、银联等多种在线支付方式')">支付方式</a></li>
              <li><a href="#" @click.prevent="showInfo('配送方式', '提供标准配送和极速达两种配送方式，标准配送免运费')">配送方式</a></li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>售后服务</h4>
            <ul>
              <li><a href="#" @click.prevent="showInfo('退换货政策', '7天无理由退换货，商品完好无损即可办理退换货')">退换货政策</a></li>
              <li><a href="#" @click.prevent="showInfo('退换货流程', '申请退换货 → 客服审核 → 寄回商品 → 质检通过 → 退款/换货')">退换货流程</a></li>
              <li><a href="#" @click.prevent="showInfo('价格保护', '购买后30天内降价，可申请价格保护，退还差价')">价格保护</a></li>
              <li><a href="#" @click.prevent="showInfo('退款说明', '退款将在3-7个工作日内原路退回至您的支付账户')">退款说明</a></li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>关于我们</h4>
            <ul>
              <li><a href="#" @click.prevent="showInfo('公司简介', '京东商城演示项目，采用Vue.js 2技术栈开发，仅供学习使用')">公司简介</a></li>
              <li><a href="#" @click.prevent="showInfo('联系我们', '客服热线：400-888-8888\n邮箱：service@jd-demo.com\n地址：北京市朝阳区')">联系我们</a></li>
              <li><a href="#" @click.prevent="showInfo('招聘信息', '我们正在寻找优秀的前端工程师、后端工程师、产品经理等人才加入！')">招聘信息</a></li>
              <li><a href="#" @click.prevent="showInfo('友情链接', '这是一个演示项目，暂无真实的友情链接')">友情链接</a></li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>客户服务</h4>
            <p class="service-phone">400-888-8888</p>
            <p class="service-time">周一至周日 8:00-20:00</p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2024 京东商城 演示项目 | 仅供学习使用</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    showInfo(title, content) {
      this.$alert(content, title, {
        confirmButtonText: '知道了',
        customClass: 'footer-info-dialog'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  background: #f5f5f5;
  margin-top: 50px;

  .footer-content {
    padding: 40px 0;
    
    h4 {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 10px;

        a {
          color: #666;
          font-size: 14px;
          text-decoration: none;
          cursor: pointer;

          &:hover {
            color: #e4393c;
          }
        }
      }
    }

    .service-phone {
      font-size: 24px;
      color: #e4393c;
      font-weight: bold;
      margin: 10px 0;
    }

    .service-time {
      color: #666;
      font-size: 14px;
    }
  }

  .footer-bottom {
    background: #e4e4e4;
    padding: 20px 0;
    text-align: center;

    p {
      margin: 0;
      color: #999;
      font-size: 12px;
    }
  }
}
</style>

<style lang="scss">
.footer-info-dialog {
  .el-message-box__message {
    white-space: pre-line;
    line-height: 1.8;
  }
  
  .el-message-box__btns .el-button--primary {
    background-color: #e4393c;
    border-color: #e4393c;
    
    &:hover {
      background-color: #c81623;
      border-color: #c81623;
    }
  }
}
</style>
