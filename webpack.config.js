var webpack = require('webpack');
var path = require('path');

var SOURCE_DIR = path.resolve(__dirname, 'src');
var DIST_DIR = path.resolve(__dirname, 'dist');

var config = {
  entry: SOURCE_DIR + '/app/app.js',
  output: {
    path: DIST_DIR + "/app",
    filename: 'app_out.js',
    publicPath: '/app'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ]
  }
};

module.exports = config;
