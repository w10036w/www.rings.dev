const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const appModuleRoot = './'
const pluginRoot = './client/plugins'
const componentsRoot = './client/components'
const pubModuleRoot = './public'
const nodeModuleRoot = 'node_modules'

const styl_var = path.resolve(__dirname, '../client/styl/__var.styl')

module.exports = {
  devtool: '#source-map',
  entry: {
    app: './client/client-entry.js',
    vendor: ['vue', 'vue-router', 'vuex', 'lru-cache']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'client-bundle.js'
  },
  resolve: {
    modules: [
      appModuleRoot, pluginRoot, componentsRoot,
      pubModuleRoot, nodeModuleRoot
    ],
    descriptionFiles: ['package.json'],
    alias: {
      styl_var
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        loader: 'css'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      vue: vueConfig
    })
  ]
}
