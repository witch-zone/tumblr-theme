import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SpritesmithPlugin from 'webpack-spritesmith'
import autoprefixer from 'autoprefixer'

const env = process.env.NODE_ENV

const makeSprite = sprite => new SpritesmithPlugin({
  src: {
    cwd: `./src/assets/sprites/${sprite}/`,
    glob: '*.png',
  },
  target: {
    image: `./build/spritesmith-generated/${sprite}.png`,
    css: [
      [
        `./build/spritesmith-generated/_${sprite}-sprite.scss`,
        { format: 'scss' },
      ],
    ],
  },
  apiOptions: {
    cssImageRef: `~${sprite}.png`,
  },
  spritesmithOptions: {
    algorithm: 'left-right',
  },
})

const config = {}

config.default = {
  entry: {
    wz: './src/',
  },

  output: {
    path: './dist/',
    filename: '[name].[hash].js',
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
      loader: 'url',
    }, {
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract(['css', 'postcss', 'sass']),
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: 'file?name=assets/images/[name].[ext]!img?minimize',
    }]
  },

  postcss: [
    autoprefixer({ browsers: ['last 2 versions', 'ie 9-11'] }),
  ],

  resolve: {
    modulesDirectories: ['src', 'node_modules', 'build/spritesmith-generated'],
    extensions: ['', '.js', '.jsx', '.scss'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env === 'development' ? 'development' : 'production'),
      },
    }),
    new CleanWebpackPlugin(['dist', 'build']),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    makeSprite('bat'),
  ],
}

config.production = {
  ...config.default,

  output: {
    ...config.default.output,
    publicPath: 'http://spells.witch.zone/tumblr/',
  },

  plugins: [
    ...config.default.plugins,
    new webpack.optimize.UglifyJsPlugin(),
  ]
}

config.development = {
  ...config.default,

  output: {
    ...config.default.output,
    publicPath: '/',
  },

  devtool: 'source-map',

  devServer: {
    historyApiFallback: true,
    inline: true,
    stats: 'errors-only',
  },
}

export default (env === 'development') ? config.development : config.production
