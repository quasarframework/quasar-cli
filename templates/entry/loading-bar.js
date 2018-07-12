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
import { QAjaxBar } from 'quasar'

const bar = Vue.prototype.$q.loadingBar = new Vue({
  render: h => h(QAjaxBar, {
    ref: 'bar'<% if (loadingBar !== true) { %>,
    props: <%= JSON.stringify(loadingBar) %><% } %>
  })
}).$mount().$refs.bar

document.body.appendChild(bar.$parent.$el)

export default bar
