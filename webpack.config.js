var PATH = require("path");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var WriteFilePlugin = require('write-file-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var isProd = process.env.NODE_ENV === 'production';
var envPlugin = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    },
});

var prodPlugins = isProd ? ([new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false })
]) : [];

module.exports = [
{
    entry: './server.js',
    output: {
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        path: PATH.join(__dirname, './dist/server'),
        publcPath: '/',
    },
    plugins: [envPlugin],
    target: 'node',
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query:
            {
                presets: ['react', 'es2015']
            }
        },
        {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    }
}
,{
    entry: "./src/app/browser.js",
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ].concat(prodPlugins),
    module:
    {
        loaders: [
        {
            test: /\.sass$/,
            loader: ExtractTextPlugin.extract('style', ['css-loader?minimize&zindex', 'postcss', 'sass']),
        },
        {
            test: /\.(jpg|png)$/,
            loader: 'file-loader?name=images/[name].[ext]',
            exclude: /\b(favicon)\b/,
        },
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query:
            {
                presets: ['react', 'es2015']
            }
        }]
    },
    postcss: () =>
    {
        return [require('autoprefixer')];
    },
    output:
    {
        filename: 'bundle.js',
        path: PATH.join(__dirname, './dist')
    },    
}];
