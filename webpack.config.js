const webpack = require('webpack');
const { resolve, join } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env = { production: false }) => {
  const config = {
    entry: {
      app: ['jquery', 'app.js', 'index.scss']
    },

    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'public'),
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
              { loader: 'css-loader', options: { sourceMap: true, minimize: env.production } },
              { loader: 'postcss-loader', options: { sourceMap: true } },
              { loader: 'sass-loader', options: { sourceMap: true } },
            ]
          })
        },
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000' },
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
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          },
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin('[name].css'),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'templates/main.pug'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
      }),
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

  if(env.production) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true,
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|json|ico|svg|eot|otf|ttf|woff|woff2)$/
      })
    )
  }

  return config;
};
