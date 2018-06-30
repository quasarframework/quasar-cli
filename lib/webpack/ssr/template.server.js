const
  fs = require('fs'),
  path = require('path'),
  LRU = require('lru-cache'),
  express = require('express'),<% if (opts.gzip) { %>
  compression = require('compression'),
  <% } %>resolve = file => path.resolve(__dirname, 'www', file),
  { createBundleRenderer } = require('vue-server-renderer')

const
  app = express(),
  port = process.env.PORT || <%= opts.port %>,
  cacheValue = <%= opts.cache %>

<% if (opts.colors) { %>
const
  chalk = require('chalk'),
  green = chalk.green,
  grey = chalk.grey,
  red = chalk.red
<% } else { %>
const
  green = text => text,
  grey = green,
  red = green
<% } %>

const
  template = fs.readFileSync(resolve('../template.html'), 'utf-8'),
  bundle = require('./vue-ssr-server-bundle.json'),
  clientManifest = require('./vue-ssr-client-manifest.json')

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const renderer = createBundleRenderer(bundle, {
  template,
  clientManifest,
  // for component caching
  cache: LRU(<%= JSON.stringify(opts.componentCache) %>),
  basedir: resolve('.'),
  // recommended for performance
  runInNewContext: false
})

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache ? cacheValue : 0
})

<% if (opts.gzip) { %>app.use(compression({ threshold: 0 }))<% } %>
<% if (opts.log) { %>app.get('*', (req, res, next) => {
  console.log(
    `GET ${green(req.url)} [${grey(req.ip)}] ${new Date()}`
  )
  next()
})<% } %>

app.use('/service-worker.js', serve('service-worker.js'))
app.use('/', serve('.', true))

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')

  const context = {
    url: req.url,
    req,
    res
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.url) {
        res.redirect(err.url)
      }
      else if (err.code === 404) {
        res.status(404).send('404 | Page Not Found')
        <% if (opts.log) { %>
          console.log(red(`  404 on ${req.url}`))
        <% } %>
      }
      else {
        // Render Error Page or Redirect
        res.status(500).send('500 | Internal Server Error')
        <% if (opts.log) { %>
        console.error(red(`  500 on ${req.url} [${req.ip}]`))
        console.error(err.stack)
        <% } %>
      }

      return
    }

    res.send(html)
  })
})

<% if (opts.https) { %>
function getServer (app) {
  return require('spdy').createServer({
    key: fs.readFileSync(<%= opts.https.key %>),
    cert: fs.readFileSync(<%= opts.https.cert %>),
    spdy: {
      protocols: ['h2', 'http/1.1']
    }
  }, app)
}
<% } %>

<% if (opts.https) { %>getServer(app)<% } else { %>app<% } %>.listen(port, () => {
  const info = [
    ['Quasar Framework', 'v<%= opts.banner.quasarVersion %>'],
    ['Listening port', '<%= opts.port %>'],
    ['Web server root', resolve('.')],
    <% if (opts.https) { %>['HTTPS', 'enabled'],<% } %>
    <% if (opts.gzip) { %>['Gzip', 'enabled'],<% } %>
    ['Cache (max-age)', cacheValue || 'disabled']
  ].map(msg => ' ' + msg[0].padEnd(21, '.') + ' ' + green(msg[1]))

  console.log('\n' + info.join('\n') + '\n')
})
