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

<% if (loadingBar) { %>
import bar from './loading-bar.js'
<% } %>

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      <% if (loadingBar) { %>
      const proceed = () => {
        bar.stop()
        next()
      }

      bar.start()
      <% } %>
      asyncData({
        <%= store ? 'store: this.$store,' : '' %>
        route: to
      })
      .then(<%= loadingBar ? 'proceed' : 'next' %>)
      .catch(<%= loadingBar ? 'proceed' : 'next' %>)
    }
    else {
      next()
    }
  }
})

export function addAsyncDataHooks (router<%= store ? ', store' : '' %>) {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const
      matched = router.getMatchedComponents(to),
      prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const components = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    }).filter(c => c && typeof c.asyncData === 'function')

    if (!components.length) { return next() }

<% if (loadingBar) { %>
    const proceed = () => {
      bar.stop()
      next()
    }

    bar.start()
<% } %>
    Promise.all(
      components.map(c => c.asyncData({
        <%= store ? 'store,' : '' %>
        route: to
      }))
    )
    .then(<%= loadingBar ? 'proceed' : 'next' %>)
    .catch(<%= loadingBar ? 'proceed' : 'next' %>)
  })
}
