<template>
  <div class="home-page">
    <Header />
    
    <div class="home-content">
      <!-- 轮播图 -->
      <div class="banner-section">
        <div class="container">
          <el-carousel height="400px" indicator-position="outside">
            <el-carousel-item v-for="(item, index) in banners" :key="index">
              <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
                <div class="banner-content">
                  <h2>{{ item.title }}</h2>
                  <p>{{ item.subtitle }}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <!-- 分类导航 -->
      <div class="category-section">
        <div class="container">
          <h3 class="section-title">商品分类</h3>
          <el-row :gutter="20">
            <el-col :span="3" v-for="category in categories" :key="category.id">
              <div class="category-item" @click="goToCategory(category.id)">
                <i :class="category.icon" class="category-icon"></i>
                <p>{{ category.name }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 热门商品 -->
      <div class="hot-products-section">
        <div class="container">
          <h3 class="section-title">
            <i class="el-icon-s-goods"></i> 热门商品
          </h3>
          <el-row :gutter="20" v-loading="loading">
            <el-col :span="6" v-for="product in hotProducts" :key="product.id">
              <ProductCard :product="product" />
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 推荐商品 -->
      <div class="recommend-section">
        <div class="container">
          <h3 class="section-title">
            <i class="el-icon-star-off"></i> 为你推荐
          </h3>
          <el-row :gutter="20" v-loading="loading">
            <el-col :span="6" v-for="product in recommendProducts" :key="product.id">
              <ProductCard :product="product" />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import ProductCard from '@/components/business/ProductCard.vue'
import { getCategoryList, getHotProducts, getRecommendProducts } from '@/api/product'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    ProductCard
  },
  data() {
    return {
      banners: [
        {
          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
          title: '等你来购',
          subtitle: '最新款式，全面升级'
        },
        {
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
          title: '品质生活购物节',
          subtitle: '精选好物，优惠多多'
        }
      ],
      categories: [],
      hotProducts: [],
      recommendProducts: [],
      loading: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        // 加载分类
        const categoryRes = await getCategoryList()
        this.categories = categoryRes.data || []
        
        // 加载热门商品
        const hotRes = await getHotProducts()
        this.hotProducts = (hotRes.data || []).slice(0, 2)
        
        // 加载推荐商品
        const recommendRes = await getRecommendProducts()
        this.recommendProducts = (recommendRes.data || []).slice(0, 2)
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },
    goToCategory(categoryId) {
      this.$router.push({
        path: '/product/list',
        query: { categoryId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-content {
  flex: 1;
  background: #f5f5f5;
}

.banner-section {
  padding: 20px 0;

  .banner-item {
    height: 400px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }

    .banner-content {
      position: relative;
      z-index: 1;
      text-align: center;
      color: #fff;

      h2 {
        font-size: 48px;
        margin: 0 0 20px;
      }

      p {
        font-size: 24px;
        margin: 0;
      }
    }
  }

  ::v-deep .el-carousel__indicator {
    button {
      background: rgba(255, 255, 255, 0.5);
    }

    &.is-active button {
      background: #e4393c;
    }
  }
}

.section-title {
  font-size: 24px;
  color: #333;
  margin: 0 0 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e4393c;
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    color: #e4393c;
  }
}

.category-section {
  padding: 40px 0;
  background: #fff;

  .category-item {
    text-align: center;
    padding: 30px 15px;
    background: #f5f5f5;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #e4393c;
      color: #fff;
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(228, 57, 60, 0.3);

      .category-icon {
        color: #fff;
      }
    }

    .category-icon {
      font-size: 40px;
      color: #e4393c;
      transition: color 0.3s;
    }

    p {
      margin: 15px 0 0;
      font-size: 16px;
    }
  }
}

.hot-products-section,
.recommend-section {
  padding: 40px 0;

  .el-col {
    margin-bottom: 20px;
  }
}

.recommend-section {
  background: #fff;
}
</style>
