<template>
  <div class="product-list-page">
    <Header />
    
    <div class="container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator=">" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentCategory">{{ currentCategory.name }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else-if="keyword">搜索结果</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="list-container">
        <!-- 筛选和排序 -->
        <div class="filter-bar">
          <div class="sort-options">
            <el-button
              :type="sortBy === 'default' ? 'danger' : ''"
              size="small"
              @click="handleSort('default')"
            >
              综合
            </el-button>
            <el-button
              :type="sortBy === 'sales' ? 'danger' : ''"
              size="small"
              @click="handleSort('sales')"
            >
              销量
            </el-button>
            <el-button
              :type="sortBy === 'price_asc' ? 'danger' : ''"
              size="small"
              @click="handleSort('price_asc')"
            >
              价格 <i class="el-icon-bottom"></i>
            </el-button>
            <el-button
              :type="sortBy === 'price_desc' ? 'danger' : ''"
              size="small"
              @click="handleSort('price_desc')"
            >
              价格 <i class="el-icon-top"></i>
            </el-button>
          </div>
          <div class="result-info">
            共找到 <span class="count">{{ 2 }}</span> 件商品
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="product-grid" v-loading="loading">
          <ProductCard
            v-for="product in productList"
            :key="product.id"
            :product="product"
            class="product-item"
          />
        </div>

        <!-- 空状态 -->
        <el-empty v-if="!loading && productList.length === 0" description="暂无商品"></el-empty>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import ProductCard from '@/components/business/ProductCard.vue'
import { getProductList, getCategoryList } from '@/api/product'

export default {
  name: 'ProductList',
  components: {
    Header,
    Footer,
    ProductCard
  },
  data() {
    return {
      productList: [],
      categories: [],
      currentCategory: null,
      keyword: '',
      sortBy: 'default',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      loading: false
    }
  },
  created() {
    this.loadCategories()
    this.loadProducts()
  },
  watch: {
    '$route.query': {
      handler() {
        this.currentPage = 1
        this.loadProducts()
      },
      deep: true
    }
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategoryList()
        this.categories = res.data || []
        this.updateCurrentCategory()
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    },
    
    updateCurrentCategory() {
      const categoryId = this.$route.query.categoryId
      if (categoryId && this.categories.length > 0) {
        this.currentCategory = this.categories.find(c => c.id === parseInt(categoryId))
      } else {
        this.currentCategory = null
      }
    },
    
    async loadProducts() {
      this.loading = true
      const { categoryId, keyword } = this.$route.query
      this.keyword = keyword || ''
      this.updateCurrentCategory()
      
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          sortBy: this.sortBy
        }
        
        if (categoryId) {
          params.categoryId = categoryId
        }
        
        if (keyword) {
          params.keyword = keyword
        }
        
        const res = await getProductList(params)
        this.productList = res.data.list || []
        this.total = res.data.total || 0
      } catch (error) {
        console.error('加载商品失败:', error)
        this.$message.error('加载商品失败')
      } finally {
        this.loading = false
      }
    },
    
    handleSort(sortType) {
      this.sortBy = sortType
      this.currentPage = 1
      this.loadProducts()
    },
    
    handlePageChange(page) {
      this.currentPage = page
      this.loadProducts()
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-list-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.container {
  flex: 1;
  padding: 20px 0;
}

.breadcrumb {
  background: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.list-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: 600px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e4e7ed;
  margin-bottom: 20px;

  .sort-options {
    display: flex;
    gap: 10px;

    .el-button {
      i {
        margin-left: 3px;
      }
    }
  }

  .result-info {
    color: #666;
    font-size: 14px;

    .count {
      color: #e4393c;
      font-weight: bold;
      margin: 0 3px;
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .product-item {
    height: 100%;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
