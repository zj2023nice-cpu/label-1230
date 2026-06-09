<template>
  <div class="user-center-page">
    <Header />
    
    <div class="container">
      <div class="center-container">
        <el-row :gutter="20">
          <!-- 左侧菜单 -->
          <el-col :span="6">
            <div class="side-menu">
              <h3>用户中心</h3>
              <el-menu
                :default-active="activeMenu"
                class="menu-list"
                @select="handleMenuSelect"
              >
                <el-menu-item index="/user/info">
                  <i class="el-icon-user"></i>
                  <span>个人信息</span>
                </el-menu-item>
                <el-menu-item index="/user/orders">
                  <i class="el-icon-s-order"></i>
                  <span>我的订单</span>
                </el-menu-item>
              </el-menu>
            </div>
          </el-col>

          <!-- 右侧内容 -->
          <el-col :span="18">
            <div class="content-area">
              <router-view />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

export default {
  name: 'UserCenter',
  components: {
    Header,
    Footer
  },
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  created() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      if (!this.$store.state.user.isLogin) {
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/user/center')
      }
    },
    
    handleMenuSelect(index) {
      if (this.$route.path !== index) {
        this.$router.push(index).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.container {
  flex: 1;
  padding: 20px 0;
}

.center-container {
  min-height: 600px;
}

.side-menu {
  background: #fff;
  padding: 20px;
  border-radius: 4px;

  h3 {
    font-size: 18px;
    color: #333;
    margin: 0 0 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e4e7ed;
  }

  .menu-list {
    border: none;

    ::v-deep .el-menu-item {
      height: 50px;
      line-height: 50px;
      margin-bottom: 5px;
      border-radius: 4px;

      &:hover {
        background: #fff5f5;
        color: #e4393c;
      }

      &.is-active {
        background: #e4393c;
        color: #fff;

        &:hover {
          background: #c81623;
        }
      }

      i {
        margin-right: 10px;
      }
    }
  }
}

.content-area {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  min-height: 600px;
}
</style>
