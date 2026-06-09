<template>
  <div class="header-wrapper">
    <!-- 顶部栏 -->
    <div class="header-top">
      <div class="container flex-between">
        <div class="left">
          <span>欢迎来到京东商城!</span>
        </div>
        <div class="right">
          <template v-if="isLogin">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <i class="el-icon-user"></i>
                {{ (userInfo && userInfo.nickname) || (userInfo && userInfo.username) || '用户' }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userCenter">用户中心</el-dropdown-item>
                <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/login" class="link">登录</router-link>
          
          </template>
          <span class="divider">|</span>
          <router-link to="/user/orders" class="link">我的订单</router-link>
        </div>
      </div>
    </div>

    <!-- 主导航栏 -->
    <div class="header-main">
      <div class="container flex-between">
        <div class="logo">
          <router-link to="/">
            <h1 class="logo-text">京东商城</h1>
          </router-link>
        </div>

        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入商品名称"
            class="search-input"
            @keyup.enter.native="handleSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>

        <!-- 购物车 -->
        <div class="cart-box">
          <router-link to="/cart" class="cart-link">
            <el-badge :value="cartCount" :hidden="cartCount === 0" class="cart-badge">
              <i class="el-icon-shopping-cart-2 cart-icon"></i>
            </el-badge>
            <span class="cart-text">购物车</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="header-nav">
      <div class="container">
        <el-menu mode="horizontal" :default-active="activeMenu" class="nav-menu">
          <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
          <el-menu-item
            v-for="category in categories"
            :key="category.id"
            :index="String(category.id + 1)"
            @click="goToCategory(category.id)"
          >
            {{ category.name }}
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getCategoryList } from '@/api/product'

export default {
  name: 'Header',
  data() {
    return {
      searchKeyword: '',
      categories: [],
      activeMenu: '1'
    }
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin']),
    ...mapGetters('cart', ['cartCount'])
  },
  watch: {
    // 监听路由变化,更新菜单高亮
    '$route': {
      handler() {
        this.updateActiveMenu()
      },
      immediate: true
    }
  },
  created() {
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategoryList()
        this.categories = res.data || []
        this.updateActiveMenu()
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    },
    updateActiveMenu() {
      // 根据当前路由更新菜单高亮
      const categoryId = this.$route.query.categoryId
      if (categoryId && this.$route.path === '/product/list') {
        // 菜单index是从1开始,分类ID+1对应菜单项
        this.activeMenu = String(parseInt(categoryId) + 1)
      } else if (this.$route.path === '/') {
        this.activeMenu = '1'
      } else {
        // 其他页面（如购物车、用户中心等）不高亮任何菜单
        this.activeMenu = ''
      }
    },
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.$router.push({
          path: '/product/list',
          query: { keyword: this.searchKeyword }
        }).catch(err => {
          // 忽略重复导航错误
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })
      }
    },
    goToCategory(categoryId) {
      this.$router.push({
        path: '/product/list',
        query: { categoryId }
      }).catch(err => {
        // 忽略重复导航错误
        if (err.name !== 'NavigationDuplicated') {
          throw err
        }
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'userCenter':
          this.$router.push('/user/center')
          break
        case 'orders':
          this.$router.push('/user/orders')
          break
        case 'logout':
          this.$confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('user/logout')
            this.$message.success('已退出登录')
            this.$router.push('/')
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-wrapper {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-top {
  background: #f5f5f5;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #999;

  .link {
    color: #999;
    margin: 0 5px;
    
    &:hover {
      color: #e4393c;
    }
  }

  .divider {
    margin: 0 8px;
  }

  .user-info {
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #e4393c;
    }
  }
}

.header-main {
  padding: 20px 0;

  .logo-text {
    font-size: 32px;
    font-weight: bold;
    color: #e4393c;
    margin: 0;
  }

  .search-box {
    flex: 1;
    max-width: 600px;
    margin: 0 50px;

    .search-input {
      ::v-deep .el-input-group__append {
        background: #e4393c;
        border-color: #e4393c;
        color: #fff;
        cursor: pointer;

        &:hover {
          background: #c81623;
        }
      }
    }
  }

  .cart-box {
    .cart-link {
      display: flex;
      align-items: center;
      color: #666;
      font-size: 14px;

      &:hover {
        color: #e4393c;
      }

      .cart-icon {
        font-size: 28px;
        margin-right: 5px;
      }

      .cart-text {
        font-size: 14px;
      }
    }
  }
}

.header-nav {
  background: #e4393c;

  .nav-menu {
    background: transparent;
    border: none;

    ::v-deep .el-menu-item {
      color: #fff;
      border-bottom: none;

      &:hover,
      &.is-active {
        background: #c81623;
        border-bottom: none;
      }
    }
  }
}
</style>
