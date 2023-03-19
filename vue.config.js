const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'https://Tu-Chuang.ccyellowstar.repl.co',
        changeOrigin: true,
      }
    }
  }
})
