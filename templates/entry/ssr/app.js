import './import-quasar'

import Vue from 'vue'
Vue.config.productionTip = <%= ctx.dev ? false : true %>

import Quasar from 'quasar'
import App from 'app/<%= sourceFiles.rootComponent %>'
import { createRouter } from 'app/<%= sourceFiles.router %>'
import router from
<% if (store) { %>
import { createStore } from 'app/<%= sourceFiles.store %>'
<% } %>

<%
if (plugins) {
  function hash (str) {
    const name = str.replace(/\W+/g, '')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
%>
  const plugins = []
  <%
  plugins.filter(asset => asset && asset !== 'boot').forEach(asset => {
    if (asset === 'boot') { return }
    let importName = 'plugin' + hash(asset)
  %>
  import <%= importName %> from 'src/plugins/<%= asset %>'
  plugins.push(<%= importName %>)
<%
  })
}
%>

export function createApp (ssrContext) {
  // create store and router instances
  const router = createRouter()
  <% if (store) { %>
  const store = createStore()
  <% } %>

  <% if (plugins) { %>
  plugins.forEach(plugin => plugin({
    app,
    router,
    <% if (store) { %> store,<% } %>
    Vue
  }))
  <% } %>

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    router,
    <% if (store) { %>store,<% } %>
    ...App
  }

  const ctx = { app }

  if (ssrContext) {
    ctx.ssr = {
      req: ssrContext.req,
      res: ssrContext.res,
      setBodyClasses (cls) {
        ssrContext.bodyClasses = cls.join(' ')
      },
      setHtmlAttrs (attrs) {
        const str = []
        for (let key in attrs) {
          str.push(`${key}=${attrs[key]}`)
        }
        ssrContext.htmlAttrs = str.join(' ')
      }
    }
  }

  Quasar.ssrUpdate(ctx)

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app: new Vue(app),
    <% if (store) { %>store,<% } %>
    router
  }
}
