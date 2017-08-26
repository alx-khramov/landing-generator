const webpack = require('webpack');
const { resolve, join } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: ['jquery', 'app.js', 'index.scss']
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'public/build'),
    publicPath: '/',
    pathinfo: false
  },

  resolve: {
    extensions: ['.scss', '.pug', '.js'],
    modules: [
      resolve(__dirname, 'assets/styles'),
      resolve(__dirname, 'assets/js'),
      resolve(__dirname, 'templates'),
      'node_modules'
    ]
  },

  resolveLoader: {
    modules: ['node_modules']
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        loader: 'pug-loader'
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ]
        })
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery',
          },
          {
            loader: 'expose-loader',
            options: '$',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devtool: 'cheap-eval-source-map',

  devServer: {
    clientLogLevel: 'none',
    https: false,
    host: '0.0.0.0',
    port: '8080',
    contentBase: join(__dirname, 'public'),
    publicPath: '/',
    compress: false,
    headers: {'Access-Control-Allow-Origin': '*'},
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    },
    stats: 'minimal',
  }
};
