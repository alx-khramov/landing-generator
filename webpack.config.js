const webpack = require('webpack');
const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    styles: 'assets/styles/index.scss',
    app: ['jquery', 'assets/js/app.js']
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'public'),
    publicPath: '/public/',
    pathinfo: false
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
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } }
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

  resolve: {
    extensions: ['.scss', '.pug'],
    modules: [
      resolve('assets/styles'),
      resolve('templates'),
      'node_modules'
    ]
  },

  resolveLoader: {
    modules: ['node_modules']
  },

  devtool: 'cheap-eval-source-map',

  devServer: {
    clientLogLevel: 'none',
    https: false,
    host: '0.0.0.0',
    port: '8080',
    contentBase: 'public',
    publicPath: 'public',
    compress: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    },
    stats: 'minimal',
  }
};
