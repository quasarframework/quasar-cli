/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import Vue from 'vue'
<% if (ctx.prod && ctx.mode.pwa) { %>
import 'app/<%= sourceFiles.registerServiceWorker %>'
<% } %>
import { createApp } from './app'

<% if (ctx.dev) { %>
console.info('[Quasar] Running <%= ctx.modeName.toUpperCase() %> with <%= ctx.themeName.toUpperCase() %> theme.')
<% if (ctx.mode.pwa) { %>
    console.info('[Quasar] PWA: a no-op service worker is being supplied in dev mode in order to reset any previous registered one. This ensures HMR works correctly.')
    console.info('[Quasar] Do not run Lighthouse test in dev mode.')
<%
  }
}
%>

<% if (loadingBar) { %>
// global progress bar
import { QAjaxBar } from 'quasar'
const bar = Vue.prototype.$bar = new Vue({
  render: h => h(QAjaxBar, {
    ref: 'bar'<% if (loadingBar !== true) { %>,
    props: <%= JSON.stringify(loadingBar) %><% } %>
  })
}).$mount().$refs.bar
document.body.appendChild(bar.$parent.$el)
<% } %>

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        <% if (store) { %>store: this.$store,<% } %>
        route: to
      }).then(next).catch(next)
    }
    else {
      next()
    }
  }
})

<%
if (plugins) {
  function hash (str) {
    const name = str.replace(/\W+/g, '')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
%>
  const plugins = []
  <%
  plugins.filter(asset => asset.client !== false).forEach(asset => {
    let importName = 'plugin' + hash(asset.path)
  %>
  import <%= importName %> from 'src/plugins/<%= asset.path %>'
  plugins.push(<%= importName %>)
<%
  })
}
%>

const { app, <% if (store) { %>store, <% } %>router } = createApp()

<% if (plugins) { %>
plugins.forEach(plugin => plugin({
  app,
  router,
  <% if (store) { %> store,<% } %>
  Vue
}))
<% } %>

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
<% if (store) { %>
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
<% } %>

const appInstance = new Vue(app)

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const
      matched = router.getMatchedComponents(to),
      prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)

    if (asyncDataHooks.length === 0) {
      return next()
    }

<% if (loadingBar) { %>
    const proceed = () => {
      bar.stop()
      next()
    }

    bar.start()
<% } %>
    Promise.all(
      asyncDataHooks.map(hook => hook({
        <% if (store) { %>store,<% } %>
        route: to
      }))
    )
    .then(<%= loadingBar ? 'proceed' : 'next' %>).catch(<%= loadingBar ? 'proceed' : 'next' %>)
  })

  // actually mount to DOM
  appInstance.$mount('#q-app')
})
