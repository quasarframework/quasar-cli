/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import createApp from './app.js'
import Vue from 'vue'
<% if (preFetch) { %>
import App from 'app/<%= sourceFiles.rootComponent %>'
<% } %>

<%
const pluginNames = []
if (plugins) {
  function hash (str) {
    const name = str.replace(/\W+/g, '')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  plugins.filter(asset => asset.path !== 'boot' && asset.server !== false).forEach(asset => {
    let importName = 'plugin' + hash(asset.path)
    pluginNames.push(importName)
%>
import <%= importName %> from 'src/plugins/<%= asset.path %>'
<% }) } %>

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  return new Promise((resolve, reject) => {
    const { app, <%= store ? 'store, ' : '' %>router } = createApp(context)

    <% if (pluginNames.length > 0) { %>
    ;[<%= pluginNames.join(',') %>].forEach(plugin => plugin({
      app,
      router,
      <%= store ? 'store,' : '' %>
      Vue,
      ssrContext: context
    }))
    <% } %>

    const
      { url } = context,
      { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    // set router's location
    router.push(url)

    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      <% if (preFetch) { %>

      App.preFetch && matchedComponents.unshift(App)

      // Call preFetch hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      Promise.all(
        matchedComponents.map(c => c.preFetch && c.preFetch({
          <% if (store) { %>store,<% } %>
          route: router.currentRoute,
          ssrContext: context
        }))
      ).then(() => {
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // Expose the state on the render context, and let the request handler
        // inline the state in the HTML response. This allows the client-side
        // store to pick-up the server-side state without having to duplicate
        // the initial data fetching on the client.
        <% if (store) { %>context.state = store.state<% } %>

        <% if (__meta) { %>
        const App = new Vue(app)
        context.$getMetaHTML = App.$getMetaHTML(App)
        resolve(App)
        <% } else { %>
        resolve(new Vue(app))
        <% } %>

      }).catch(reject)

      <% } else { %>

      <% if (store) { %>context.state = store.state<% } %>

      <% if (__meta) { %>
      const App = new Vue(app)
      context.$getMetaHTML = App.$getMetaHTML(App)
      resolve(App)
      <% } else { %>
      resolve(new Vue(app))
      <% } %>

      <% } %>
    }, reject)
  })
}
