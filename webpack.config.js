const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'docs'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  // devServer: {
  //   contentBase: './docs/',
  //   hot: true,
  //   port: 9605,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       pathRewrite: {'^/api': ''}
  //     }
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: false
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV == 'development'),
    })
  ]
}

module.exports = config
