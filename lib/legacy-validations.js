const
  fs = require('fs'),
  fse = require('fs-extra')

const
  appPaths = require('./app-paths')

module.exports = function legacyValidations (cfg) {
  let file, content, error = false

  file = appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate)
  if (!fs.existsSync(file)) {
    console.log('⚠️  Missing index html file...')
    console.log()
    error = true
  }
  content = fs.readFileSync(file, 'utf-8')
  if (content.indexOf('<base href') > -1) {
    console.log(`⚠️  Your newer Quasar CLI requires a minor change to /src/index.template.html
   Please remove this tag completely:
  <base href="<%= htmlWebpackPlugin.options.appBase %>">
  `)
    console.log()
    error = true
  }

  if (content.indexOf(`chunk.initial ? 'preload' : 'prefetch'`) > -1) {
    console.log(`\n⚠️  Your newer Quasar CLI requires a minor change to /src/index.template.html
   Please remove this section completely:

  <!--
    The following is optional if you DON'T build for PWA.
    Preloads/prefetches chunks/assets.
  -->
  <% if (!['cordova', 'electron'].includes(htmlWebpackPlugin.options.ctx.modeName) && htmlWebpackPlugin.options.ctx.prod) {
      for (var chunk of webpack.chunks) {
        for (var file of chunk.files) {
          if (file.match(/\.(js|css)$/)) { %>
    <link rel="<%= chunk.initial ? 'preload' : 'prefetch' %>" href="<%= file %>" as="<%= file.match(/\.css$/)? 'style' : 'script' %>">
  <% }}}} %>
  `)
    console.log()
    error = true
  }

  if (content.indexOf('<link rel="manifest"') > -1) {
    console.log(`\n⚠️  Your newer Quasar CLI requires a minor change to /src/index.template.html
   Please remove this section completely:

   <% if (htmlWebpackPlugin.options.ctx.mode.pwa) { %>
    <!-- Add to home screen for Android and modern mobile browsers -->
    .....
   <% } %>
  `)
    console.log()
    error = true
  }

  if (content.indexOf('htmlWebpackPlugin.options.headScripts') > -1) {
    console.log(`\n⚠️  Your newer Quasar CLI requires a minor change to /src/index.template.html
   Please remove this section completely:

   <%= htmlWebpackPlugin.options.headScripts %>
  `)
    console.log()
    error = true
  }

  if (content.indexOf('htmlWebpackPlugin.options.bodyScripts') > -1) {
    console.log(`\n⚠️  Your newer Quasar CLI requires a minor change to /src/index.template.html
   Please remove this section completely:

   <%= htmlWebpackPlugin.options.bodyScripts %>
  `)
    console.log()
    error = true
  }

  if (error) {
    process.exit(1)
  }

  file = appPaths.resolve.app('.babelrc')
  if (!fs.existsSync(file)) {
    console.log('⚠️  Missing .babelrc file...')
    console.log()
    process.exit(1)
  }
  content = fs.readFileSync(file, 'utf-8')
  if (content.indexOf('"transform-runtime"') > -1) {
    console.log()
    console.log(' ⚠️  WARNING')
    console.log(` Your newer Quasar CLI requires a change to .babelrc file.`)
    console.log(` Doing it automatically. Please review the changes.`)
    console.log()

    fse.copySync(
      appPaths.resolve.cli('templates/app/babelrc'),
      appPaths.resolve.app('.babelrc')
    )
  }
}
