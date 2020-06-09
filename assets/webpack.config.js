const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = (env, options) => ({
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  entry: {
    './js/app.js': glob.sync('./vendor/**/*.js').concat(['./js/app.js'])
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../priv/static/js')
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      }, 'postcss-loader']
    }, {
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'postcss-loader', 'sass-loader'],
    }, {
      test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      use: 'url-loader'
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/app.css'
    }),
    new CopyWebpackPlugin([{
      from: 'static/',
      to: '../'
    }])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
});