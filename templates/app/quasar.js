/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
<% if (supportIE) { %>
import 'quasar-framework/dist/quasar.ie.polyfills'
<% }

let importStatement, useStatement = [ `cfg: ${JSON.stringify(framework.cfg)}` ]

if (framework.i18n) { %>
import lang from 'quasar-framework/i18n/<%= framework.i18n %>'
<%
  useStatement.push('i18n: lang')
}

if (framework.iconSet) { %>
import iconSet from 'quasar-framework/icons/<%= framework.iconSet %>'
<%
  useStatement.push('iconSet: iconSet')
}

if (framework.all) {
  importStatement = ', * as All'
  useStatement.push(
    'components: All',
    'directives: All',
    'plugins: All'
  )
}
else {
  importStatement = []

  ;['components', 'directives', 'plugins'].forEach(type => {
    if (framework[type]) {
      let items = framework[type].filter(item => item)
      if (items.length > 0) {
        useStatement.push(type + ': {' + items.join(',') + '}')
        importStatement = importStatement.concat(items)
      }
    }
  })

  importStatement = importStatement.length
    ? ', {' + importStatement.join(',') + '}'
    : ''
}
%>

import Vue from 'vue'
import Quasar<%= importStatement || '' %> from 'quasar'

Vue.use(Quasar, { <%= useStatement.join(',') %> })
