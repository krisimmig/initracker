module.exports = {
  chainWebpack: config => {
    config.module
      .rule('svg-sprite')
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        plugins: [
          {removeAttrs: {attrs:['fill', 'stroke']}}
        ]
      })
  },

  transpileDependencies: [
    'vuetify'
  ]
}
