const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

// For generating new HTML files and editing old ones
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


var path_prebuild = path.resolve(__dirname, 'mellonsforsale/static/mellonsforsale/prebuild-js');
var path_postbuild = path.resolve(__dirname, 'mellonsforsale/static/mellonsforsale/js');


// consider adding parallel webapck in future
module.exports = {
  entry: {
    // Not built through webpack, edited directly in JS
    // mellonsforsale: path.resolve(path_prebuild, 'mellonsforsale.js'),

    profile_my_items: path.resolve(path_prebuild, 'profile_my_items.js'),
    profile_other_items: path.resolve(path_prebuild, 'profile_other_items.js'),
    storefront: path.resolve(path_prebuild, 'storefront.js'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        enforce: "pre",
        loader: "eslint-loader"
      },
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['react']
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          reuseExistingChunk: true
        }
      }
    }
  },
  output: {
    filename: '[name].js',
    path: path_postbuild,
  },
  plugins: [
    new CompressionPlugin(),
    new HtmlWebpackPlugin()
  ],
};