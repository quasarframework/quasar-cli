const
  ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports.cssLoaders = function (options = {}) {
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
    postcssLoader.options.plugins = () => {
      return [
        require('postcss-rtl')({
          onlyDirection: 'rtl'
        })
      ]
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader, postcssLoader]

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
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    }

    return ['vue-style-loader'].concat(loaders)
  }

  const stylusLoader = generateLoaders('stylus')

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: stylusLoader,
    styl: stylusLoader
  }
}

// Generate loaders for standalone style files (outside of .vue)
module.exports.styleLoaders = function (options) {
  const
    output = [],
    loaders = module.exports.cssLoaders(options)

  for (let extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
