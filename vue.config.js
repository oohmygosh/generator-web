const { defineConfig } = require('@vue/cli-service')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    plugins:[
      new MonacoWebpackPlugin()
    ]
  }
/*  chainWebpack: (config) => {
    config.module
        .rule('vue')
        .use('vue-loader')
        .tap((options) => {
          return {
            ...options,
            reactivityTransform: true
          }
        })
  }*/
})
