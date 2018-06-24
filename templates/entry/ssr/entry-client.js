import Vue from 'vue'
import { createApp } from './app'
import { QAjaxBar } from 'quasar'

<% if (ctx.prod && ctx.mode.pwa) { %>
import 'app/<%= sourceFiles.registerServiceWorker %>'
<% } %>

<% if (ctx.dev) { %>
console.info('[Quasar] Running <%= ctx.modeName.toUpperCase() %> with <%= ctx.themeName.toUpperCase() %> theme.')
<% if (ctx.mode.pwa) { %>
    console.info('[Quasar] PWA: a no-op service worker is being supplied in dev mode in order to reset any previous registered one. This ensures HMR works correctly.')
    console.info('[Quasar] Do not run Lighthouse test in dev mode.')
<%
  }
}
%>

// global progress bar
const bar = Vue.prototype.$bar = new Vue({
  render: h => h(QAjaxBar, {
    ref: 'bar',
    props: { color: 'secondary' }
  })
}).$mount().$refs.bar
document.body.appendChild(bar.$parent.$el)

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

const { app, <% if (store) { %>store, <% } %>router } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
<% if (store) { %>
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
<% } %>

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()
    Promise.all(
      asyncDataHooks.map(hook => hook({
        <% if (store) { %>store,<% } %>
        route: to
      }))
    )
    .then(() => {
      bar.stop()
      next()
    })
    .catch(next)
  })

  // actually mount to DOM
  app.$mount('#q-app')
})
