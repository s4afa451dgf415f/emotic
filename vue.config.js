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
    //   '/api': {
    //     target: 'localhost:3000',
    //     changeOrigin: true,
    //   }
    // }
  }
})
