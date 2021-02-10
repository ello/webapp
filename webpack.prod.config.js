/* eslint-disable import/no-extraneous-dependencies */
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const S3Plugin = require('webpack-s3-plugin')
const autoprefixer = require('autoprefixer')
const fs = require('fs')
const path = require('path')
const postcssApply = require('postcss-apply')
const postcssCalc = require('postcss-calc')
const postcssColorFunction = require('postcss-color-function')
const postcssCustomMedia = require('postcss-custom-media')
const postcssCustomProperties = require('postcss-custom-properties')
const postcssImport = require('postcss-import')
const postcssPxToRem = require('postcss-pxtorem')
const postcssReporter = require('postcss-reporter')
const postcssUrl = require('postcss-url')
const webpack = require('webpack')
const pkg = require('./package.json')
const UploadHTMLPlugin = require('./src/server/upload_html_plugin')

// load env vars first
require('dotenv').load({ silent: true })

module.exports = env => ({
  mode: 'production',
  devtool: 'source-map',
  entry: {
    main: './src/main',
  },
  output: {
    filename: `${env.commitsha}.js`,
    chunkFilename: '[id].chunk.js',
    path: path.join(__dirname, 'public/static'),
    publicPath: `${(process.env.CDN || '')}/`,
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: "'production'" } }),
    new ExtractTextPlugin({ filename: `${env.commitsha}.css` }),
    new HtmlWebpackPlugin({
      filename: `${env.commitsha}.html`,
      chunks: ['main'],
      hash: true,
      template: '!!html-loader!public/template.html',
      inject: 'body',
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.optimize.minimize({
    //   compress: {
    //     screw_ie8: true,
    //   },
    //   sourceMap: true,
    // }),
    new S3Plugin({
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
      s3UploadOptions: {
        Bucket: process.env.S3_BUCKET,
      },
    }),
    new UploadHTMLPlugin({
      endpoint: process.env.APEX_SERVE_ENDPOINT,
      username: process.env.APEX_SERVE_USERNAME,
      password: process.env.APEX_SERVE_PASSWORD,
    }),
    function webpackStats() {
      this.plugin('done', (stats) => {
        fs.writeFileSync(
          path.join(__dirname, 'webpack-stats/prod.json'),
          JSON.stringify(stats.toJson()))
      })
    },
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: loader => [
                  postcssImport({ result: { messages: { dependency: loader } } }),
                  postcssUrl(),
                  postcssCustomProperties(),
                  postcssApply(),
                  postcssCalc(),
                  postcssColorFunction(),
                  postcssCustomMedia(),
                  postcssPxToRem({ propWhiteList: [], minPixelValue: 5 }),
                  autoprefixer({ browsers: pkg.browserlist }),
                  postcssReporter(),
                ],
              },
            },
          ],
        }),
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
})

