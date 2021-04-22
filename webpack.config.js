const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const libs = [
  'react', 'react-dom', 'react-redux', 'react-router-dom', 'reactstrap',
  'immutable', 'redux', 'redux-thunk', 'redux-immutable', 'classname'
];

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, './client/app.jsx'),
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      include: path.join(__dirname, 'client')
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { modules: true } },
        'sass-loader'
      ],
      include: path.join(__dirname, 'client/css')
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.join(__dirname, 'client/css')
    }]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html'
    })
  ]
};
