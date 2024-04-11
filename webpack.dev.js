/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'hidden-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv(),
  ],
  devServer: {
    open: true,
    hot: true,
    // static: path.join(__dirname, 'dist'),
    port: 3000,
    historyApiFallback: true,
  },
});
