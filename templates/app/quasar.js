/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
<%
let QImports, QOptions = []
if (framework === 'all') {
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

if (supportIE) { %>
import 'quasar-framework/dist/quasar.ie.polyfills'
<% } %>

import Vue from 'vue'
import Quasar<%= QImports || '' %> from 'quasar'

Vue.use(Quasar<%= QImports ? QOptions : '' %>)

<% if (framework && framework.i18n) { %>
import lang from 'quasar-framework/i18n/<%= framework.i18n %>'
Quasar.i18n.set(lang)
<% } %>
<% if (framework && framework.iconSet) { %>
import iconSet from 'quasar-framework/icons/<%= framework.iconSet %>'
Quasar.icons.set(iconSet)
<% } %>
