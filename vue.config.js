const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // resolve: {
  //   fallback: {
  //     "fs": false,
  //   },
  // },
  configureWebpack: {
    resolve: {
      fallback: {
        "fs": false,
      },
    },
  },
  devServer: {
    allowedHosts: 'all',
    // proxy: {
    //   '': {
    //     target: 'http://localhost:3000', // 目标服务器地址
    //     changeOrigin: true, // 是否开启跨域
    //   }
    // }
  }
})
