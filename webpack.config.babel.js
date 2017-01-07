import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'

export default {
  entry: {
    main: './src/',
  },
  output: {
    path: './dist/',
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      test: /\.woff$/,
      loader: 'url?limit=5000',
    }, {
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract(['css', 'postcss', 'sass']),
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: 'file?name=images/[name].[ext]!img?minimize',
    }, {
      test: /\.svg$/i,
      loader: 'svg-sprite!img?minimize',
      exclude: /src\/assets\/images/,
    }],
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions', 'ie 9-11'] }),
  ],
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  plugins: [
    new ExtractTextPlugin('[name].[hash].css'),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    inline: true,
    stats: 'errors-only',
  },
  devtool: 'source-map',
}
