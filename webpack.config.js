const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const libs = [
  'react', 'react-dom', 'react-redux', 'react-router-dom', 'reactstrap',
  'immutable', 'redux', 'redux-thunk', 'redux-immutable', 'classname'
];

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, './client/app.jsx'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, 'client')
    }, {
      test: /\.scss$/,
      loaders: [
        'style-loader',
        { loader: 'css-loader', options: { modules: true } },
        'sass-loader'
      ],
      include: path.join(__dirname, 'client/css')
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
      include: path.join(__dirname, 'client/css')
    }]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        lib: {
          test: new RegExp(`[\\/]node_modules[\\/](${libs.join('|')})[\\/]`),
          name: 'lib',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: './client/index.html'
    })
  ]
};
