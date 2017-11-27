var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './app/game-of-life.js'),
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
            loader: "babel-loader"
        }
      },
      {
      test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};