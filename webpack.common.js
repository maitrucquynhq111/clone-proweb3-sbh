/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const APP_DIR = path.join(__dirname, "src");
const NODE_MODULES = path.join(__dirname, "node_modules");

require("dotenv").config({ path: "./.env" });

module.exports = {
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: process.env.PUBLIC_PATH,
    filename: `[name]-[contenthash].js?v=${process.env.CI_COMMIT_SHORT_SHA}`,
    chunkFilename: `[name]_[contenthash].js?v=${process.env.CI_COMMIT_SHORT_SHA}`,
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "postcss-loader",
        ],
        include: APP_DIR,
        exclude: NODE_MODULES,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false
            }
          }
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        include: APP_DIR,
        exclude: NODE_MODULES,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        include: APP_DIR,
        exclude: NODE_MODULES,
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        use: "url-loader?limit=10000&name=[name]-[hash].[ext]",
        include: APP_DIR,
        exclude: NODE_MODULES,
      },
      {
        test: /\.ico$/,
        use: "file-loader?name=[name].[ext]",
        exclude: NODE_MODULES,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", "scss"],
    alias: {
      "~app": path.resolve(APP_DIR),
    },
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/workers/offline", to: "offline" },
        { from: "src/public", to: "./" },
      ],
    }),
    new MiniCssExtractPlugin(),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      hash: true,
      title: "Sổ bán hàng - Ứng dụng quản lý bán hàng toàn diện dễ sử dụng nhất",
    }),
  ],
};
