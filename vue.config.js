const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 禁用编译时的ESLint检查
  devServer: {
    port: 3000
  }
})
