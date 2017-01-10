import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SpritesmithPlugin from 'webpack-spritesmith'
import autoprefixer from 'autoprefixer'

const env = process.env.NODE_ENV

export default {
  entry: {
    wz: './src/',
  },
  output: {
    path: './dist/',
    filename: '[name].[hash].js',
    publicPath: (env === 'development') ? '/' : 'http://spells.witch.zone/tumblr/',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      test: /\.html?$/,
      loader: 'html-loader?minimize=true&removeAttributeQuotes=false',
    }, {
      test: /\.woff2?$/,
      loader: 'url-loader?limit=65000',
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
    modulesDirectories: ['src', 'node_modules', 'build/spritesmith-generated'],
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  plugins: [
    new CleanWebpackPlugin(['dist', 'build']),
    new ExtractTextPlugin('[name].[hash].css'),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new SpritesmithPlugin({
      src: {
        cwd: './src/assets/sprites/bat/',
        glob: '*.png',
      },
      target: {
        image: './build/spritesmith-generated/bat.png',
        css: [
          [
            './build/spritesmith-generated/_bat-sprite.scss',
            { format: 'scss' },
          ],
        ],
      },
      apiOptions: {
        cssImageRef: '~bat.png',
      },
      spritesmithOptions: {
        algorithm: 'top-down',
      },
    }),
  ],
  devServer: {
    historyApiFallback: true,
    inline: true,
    stats: 'errors-only',
  },
  devtool: (env === 'development') ? 'source-map' : '',
}
