const
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  fs = require('fs'),
  appPaths = require('./app-paths'),
  postCssFile = appPaths.resolve.app('.postcssrc.js'),
  warn = require('../helpers/logger')('css-utils', 'red')

if (!fs.existsSync(postCssFile)) {
  warn('Missing /.postcssrc.js file...')
  warn()
  process.exit(1)
}

const postCss = require(postCssFile)

if (!postCss.plugins || !Array.isArray(postCss.plugins)) {
  console.log(`Your newer Quasar CLI requires a minor change to /.postcssrc.js.
"plugins" property needs to be converted into an Array.

Example:

// before
plugins: {
  autoprefixer: {}
}

// change to:
plugins: [
  require('autoprefixer')
]
`)
  process.exit(1)
}

function cssLoaders (options = {}) {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      // only minimize if necessary
      // (if extract and minimize then dedupe plugin does minimization)
      minimize: options.extract && options.minimize
        ? false
        : options.minimize,
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  if (options.rtl) {
    const rtlOptions = options.rtl === true
      ? {}
      : options.rtl

    postcssLoader.options.plugins = () => {
      return [
        require('postcss-rtl')(rtlOptions)
      ]
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.postCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders)
    }

    return ['vue-style-loader'].concat(loaders)
  }

  const stylusLoader = generateLoaders('stylus')

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    'styl(us)?': stylusLoader
  }
}

module.exports.styleLoaders = function (options) {
  const
    output = [],
    loaders = cssLoaders(options)

  for (let extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
