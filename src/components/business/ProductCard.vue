<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
      <div class="tags" v-if="product.tags && product.tags.length">
        <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    <div class="product-info">
      <h4 class="product-name ellipsis-2">{{ product.name }}</h4>
      <p class="product-desc ellipsis">{{ product.description }}</p>
      <div class="product-price">
        <span class="price">¥{{ product.price }}</span>
        <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
      </div>
      <div class="product-meta">
        <span class="sales">已售{{ formatSales(product.sales) }}</span>
        <el-rate
          v-model="product.rating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        />
      </div>
      <el-button
        type="danger"
        size="small"
        class="add-cart-btn"
        @click.stop="addToCart"
      >
        <i class="el-icon-shopping-cart-2"></i> 加入购物车
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToDetail() {
      this.$router.push(`/product/detail/${this.product.id}`)
    },
    addToCart() {
      this.$store.dispatch('cart/addToCart', this.product)
      this.$message.success('已添加到购物车')
    },
    formatSales(sales) {
      if (sales >= 10000) {
        return (sales / 10000).toFixed(1) + '万'
      }
      return sales
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);

    .add-cart-btn {
      opacity: 1;
    }
  }

  .product-image {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
    background: #f5f5f5;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tags {
      position: absolute;
      top: 10px;
      left: 10px;

      .tag {
        display: inline-block;
        background: #e4393c;
        color: #fff;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 2px;
        margin-right: 5px;
      }
    }
  }

  .product-info {
    padding: 15px;

    .product-name {
      font-size: 14px;
      color: #333;
      margin: 0 0 8px;
      height: 40px;
      line-height: 20px;
    }

    .product-desc {
      font-size: 12px;
      color: #999;
      margin: 0 0 10px;
    }

    .product-price {
      margin-bottom: 10px;

      .price {
        font-size: 20px;
        color: #e4393c;
        font-weight: bold;
      }

      .original-price {
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
        margin-left: 8px;
      }
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .sales {
        font-size: 12px;
        color: #999;
      }

      ::v-deep .el-rate {
        height: 18px;

        .el-rate__text {
          font-size: 12px;
        }
      }
    }

    .add-cart-btn {
      width: 100%;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
}
</style>
