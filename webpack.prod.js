/* eslint-disable */
const { merge } = require('webpack-merge');
const { InjectManifest } = require('workbox-webpack-plugin');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  optimization: {
    splitChunks: {
       chunks: "all",
       minSize: 10000,
       maxSize: 30000
    },
  },
  plugins: [
    new Dotenv({ systemvars: true }),
    new CompressionPlugin({
      algorithm: "gzip",
    }),
    new InjectManifest({
      swSrc: './src/src-sw.js',
      swDest: 'sw.js',
    }),
  ],
});
