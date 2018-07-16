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
import App from 'app/<%= sourceFiles.rootComponent %>'

<% if (__loadingBar) { %>
import { LoadingBar } from 'quasar'
<% } %>

// a global mixin that calls `preFetch` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { preFetch } = this.$options
    if (preFetch) {
      let redirected = false
      const proceed = () => {
        <% if (__loadingBar) { %>
        LoadingBar.stop()
        <% } %>
        if (!redirected) { next() }
      }

      <% if (__loadingBar) { %>
      LoadingBar.start()
      <% } %>
      preFetch({
        <%= store ? 'store: this.$store,' : '' %>
        currentRoute: to,
        redirect: url => {
          redirected = true
          next(url)
        }
      })
      .then(proceed)
      .catch(proceed)
    }
    else {
      next()
    }
  }
})

<% if (!ctx.mode.ssr) { %>
let appPrefetch = App.preFetch
<% } %>

export function addPreFetchHooks (router<%= store ? ', store' : '' %>) {
  // Add router hook for handling preFetch.
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
    }).filter(c => c && typeof c.preFetch === 'function')

    <% if (!ctx.mode.ssr) { %>
    if (appPrefetch) {
      appPrefetch = false
      components.unshift(App)
    }
    <% } %>

    if (!components.length) { return next() }

    let redirected = false
    const redirect = url => {
      redirected = true
      next(url)
    }
    const proceed = () => {
      <% if (__loadingBar) { %>
      LoadingBar.stop()
      <% } %>
      if (!redirected) { next() }
    }

    <% if (__loadingBar) { %>
    LoadingBar.start()
    <% } %>
    Promise.all(
      components.map(c => {
        if (redirected) { return }
        if (c && c.preFetch) {
          return c.preFetch({
            <% if (store) { %>store,<% } %>
            currentRoute: router.currentRoute,
            redirect
          })
        }
      })
    )
    .then(proceed)
    .catch(proceed)
  })
}
