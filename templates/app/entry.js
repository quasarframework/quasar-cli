<%
function hash (str) {
  const name = str.replace(/\W+/g, '')
  return name.charAt(0).toUpperCase() + name.slice(1)
}

let QImports, QOptions = []
if (framework === 'full') {
  QImports = ', * as All'
  QOptions = ', {components: All, directives: All, plugins: All}'
}
else if (framework !== false) {
  let options = []
  ;['components', 'directives', 'plugins'].forEach(type => {
    if (framework[type]) {
      let items = framework[type].filter(item => item)
      if (items.length > 0) {
        QOptions.push(type + ': {' + items.join(',') + '}')
        options = options.concat(items)
      }
    }
  })
  if (options.length) {
    QImports = ', {' + options.join(',') + '}'
    QOptions = ', {' + QOptions.join(',') + '}'
  }
}
%>

<% if (supportIE) { %>
require('quasar-framework/dist/quasar.ie.polyfills.js')
<% } %>

import Vue from 'vue'
import Quasar<%= QImports || '' %> from 'quasar'

Vue.config.productionTip = false
import App from '~/App'

<%
extras && extras.filter(asset => asset).forEach(asset => {
%>
require('quasar-extras/<%= asset %>')
<% }) %>

<%
animations && animations.filter(asset => asset).forEach(asset => {
%>
require('quasar-extras/animate/<%= asset %>.css')
<% }) %>

require(`~/themes/app.<%= ctx.themeName %>.styl`)

<% css && css.filter(css => css).forEach(asset => { %>
require('~/css/<%= asset %>')
<% }) %>

Vue.use(Quasar<%= QImports ? QOptions : '' %>)

import { createRouter } from '~/router'
<% if (store) { %>
import { createStore } from '~/store'
<% } %>

const
  router = createRouter()<% if (store) { %>,
  store = createStore()<% } %>

const app = {
  el: '#q-app',
  router,<% if (store) { %>
  store,<% } %>
  ...App
}

<% if (plugins) { %>
const plugins = []
<%
plugins.filter(asset => asset).forEach(asset => {
  let importName = 'plugin' + hash(asset)
%>
import <%= importName %> from '~/plugins/<%= asset %>'
plugins.push(<%= importName %>)
<% }) %>
plugins.forEach(plugin => plugin({ app, router,<% if (store) { %> store,<% } %> Vue }))
<% } %>

<% if (ctx.mode.electron) { %>
Vue.prototype.$q.electron = require('electron')
<% } %>

<% if (ctx.mode.cordova) { %>
document.addEventListener('deviceready', () => {
Vue.prototype.$q.cordova = window.cordova
<% } %>

/* eslint-disable no-new */
new Vue(app)

<% if (ctx.mode.cordova) { %>
}, false) // on deviceready
<% } %>
