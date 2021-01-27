const path = require('path')
const dayjs = require('dayjs')
const isDev = process.env.NODE_ENV === 'development'
const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const publicPath = '/galaxy-tally/'
const PORT = process.env.PORT || 3000
const cdn = {
  dev: {
    css: [],
    js: [publicPath + 'lib/echarts.min.js', publicPath + 'lib/vconsole.min.js']
  },
  build: {
    css: [],
    js: [publicPath + 'lib/echarts.min.js', publicPath + 'lib/vconsole.min.js']
  }
}
module.exports = {
  publicPath,
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: PORT,
    host: '0.0.0.0',
    overlay: {
      warnings: true,
      errors: true
    },
    before(app) {
      app.post('/upload', (req, res) => {
        setTimeout(() => {
          res.send({
            data: null
          })
        }, 1500)
      })
    },
    proxy: {
      '/server': {
        target: 'http://qyhever.com/e-admin',
        changeOrigin: true,
        pathRewrite: {
          '^/server': '/'
        }
      }
    }
  },
  pluginOptions: {
    // import global less variables and mixins
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('./src/assets/styles/var.less')]
    }
  },
  chainWebpack(config) {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    config.plugin('html').tap(args => {
      args[0].cdn = isDev ? cdn.dev : cdn.build
      return args
    })

    config.plugin('define').tap(args => {
      // DefinePlugin 设置值 必须 JSON 序列化 或者 使用 双引号 包起来
      args[0]['process.env'].NOW = JSON.stringify(now)
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            '@green': '#ffcd38'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
