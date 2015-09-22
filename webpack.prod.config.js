/*eslint-disable */
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var jade = require('jade')

module.exports = {
  entry: {
    main: './src/main',
    auth: './src/auth'
  },
  output: {
    path: path.join(__dirname, 'public/static'),
    filename: '[name].entry.js',
    chunkFilename: '[id].chunk.js',
    hash: true,
    publicPath: '/static/',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
      __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
      ENV: require(path.join(__dirname, './env.js'))
    }),
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.CommonsChunkPlugin('commons'),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      chunks: ['commons', 'auth', 'main'],
      templateContent: jade.renderFile('public/template.jade', { pretty: true }),
      hash:true,
      inject: 'body',
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
      exclude: /node_modules/
    },
    {
      test: /\.sass$/,
      loader: ExtractTextPlugin.extract(
          'css!sass!autoprefixer!sass?indentedSyntax'
      )
    }]
  }
}
