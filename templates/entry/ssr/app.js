/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import './import-quasar'

<%
extras && extras.filter(asset => asset).forEach(asset => {
%>
import 'quasar-extras/<%= asset %>/<%= asset %>.css'
<% }) %>

<%
if (animations) {
  if (animations === 'all') {
%>
import 'quasar-extras/animate'
<%
  }
  else {
    animations.filter(asset => asset).forEach(asset => {
%>
import 'quasar-extras/animate/<%= asset %>.css'
<%
    })
  }
}
%>

import 'quasar-app-styl'

<%
css && css.filter(css => css).forEach(asset => {
  let path = asset[0] === '~'
    ? asset.substring(1)
    : `src/css/${asset}`
%>
import '<%= path %>'
<% }) %>

import Quasar from 'quasar'
import App from 'app/<%= sourceFiles.rootComponent %>'
import { createRouter } from 'app/<%= sourceFiles.router %>'
<% if (store) { %>
import { createStore } from 'app/<%= sourceFiles.store %>'
<% } %>

export function createApp (ssrContext) {
  // create store and router instances
  <% if (store) { %>
  const store = createStore()
  <% } %>
  const router = createRouter(store)

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
        ssrContext.BODY_CLASSES = cls.join(' ')
      },
      setHtmlAttrs (attrs) {
        const str = []
        for (let key in attrs) {
          str.push(key + '=' + attrs[key])
        }
        ssrContext.HTML_ATTRS = str.join(' ')
      }
    }
  }

  Quasar.ssrUpdate(ctx)

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    <% if (store) { %>store,<% } %>
    router
  }
}
