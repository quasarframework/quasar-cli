const
  ExtractLoader = require('mini-css-extract-plugin').loader

function injectRule ({ chain, pref }, lang, test, loader, options) {
  const rule = chain.module.rule(lang).test(test)

  if (pref.extract) {
    rule.use('mini-css-extract')
      .loader(ExtractLoader)
  }
  else {
    rule.use('vue-style-loader')
      .loader('vue-style-loader')
      .options({
        sourceMap: pref.sourceMap
      })
  }

  rule.use('css-loader')
    .loader('css-loader')
    .options({
      minimize: pref.extract && pref.minimize
        ? false
        : pref.minimize
    })

  const postCssOpts = {
    sourceMap: pref.sourceMap
  }

  if (pref.rtl) {
    const rtlOptions = pref.rtl === true
      ? {}
      : pref.rtl

    postCssOpts.plugins = () => {
      return [
        require('postcss-rtl')(rtlOptions)
      ]
    }
  }

  rule.use('postcss-loader')
    .loader('postcss-loader')
    .options(postCssOpts)

  if (loader) {
    rule.use(loader)
      .loader(loader)
      .options(Object.assign(
        { sourceMap: pref.sourceMap },
        options
      ))
  }
}

module.exports = function (chain, options) {
  const meta = {
    chain,
    pref: options
  }

  injectRule(meta, 'css', /\.css$/)
  injectRule(meta, 'stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolver: 'webpack'
  })
  injectRule(meta, 'scss', /\.scss$/, 'sass-loader')
  injectRule(meta, 'sass', /\.sass$/, 'sass-loader', {
    indentedSyntax: true
  })
  injectRule(meta, 'less', /\.less$/, 'less-loader')
}
