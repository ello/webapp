/* eslint-disable import/no-extraneous-dependencies */
import autoprefixer from 'autoprefixer'
import path from 'path'
import postcssApply from 'postcss-apply'
import postcssCalc from 'postcss-calc'
import postcssColorFunction from 'postcss-color-function'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssImport from 'postcss-import'
import postcssPxToRem from 'postcss-pxtorem'
import postcssReporter from 'postcss-reporter'
import postcssUrl from 'postcss-url'
import webpack from 'webpack'
import pkg from './package.json'
// load env vars first
require('dotenv').load()

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: ['./src/main', 'webpack-hot-middleware/client'],
  },
  output: {
    filename: '[name].entry.js',
    path: path.join(__dirname, 'public/static'),
    publicPath: '/static/',
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 'process.env': {
      API_DOMAIN: `'${process.env.API_DOMAIN || process.env.AUTH_DOMAIN}'`,
      APP_DEBUG: `'${process.env.APP_DEBUG}'`,
      AUTH_CLIENT_ID: `'${process.env.AUTH_CLIENT_ID}'`,
      AUTH_CLIENT_SECRET: `'${process.env.AUTH_CLIENT_SECRET}'`,
      AUTH_DOMAIN: `'${process.env.AUTH_DOMAIN}'`,
      LOGO_MARK: `'${process.env.LOGO_MARK}'`,
      NODE_ENV: "'development'",
      PROMO_HOST: `'${process.env.PROMO_HOST}'`,
      SEGMENT_WRITE_KEY: `'${process.env.SEGMENT_WRITE_KEY}'`,
      USE_LOCAL_EMOJI: `'${process.env.USE_LOCAL_EMOJI}'` },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [
          path.join(__dirname, 'src'),
        ],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                postcssImport({ root: loader.resourcePath }),
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
      },
    ],
  },
}

