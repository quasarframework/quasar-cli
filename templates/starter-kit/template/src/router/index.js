import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

export function createRouter () {
  const Router = new VueRouter({
    /*
     * NOTE! Change Vue Router mode from quasar.conf.js -> build.env.VUE_ROUTER_MODE
     *
     * If you decide to go with "history" mode, please also set "build.publicPath"
     * to something other than an empty string.
     * Example: '/' instead of ''
     */

    // Leave as is and change from quasar.conf.js instead!
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    scrollBehavior: () => ({ y: 0 }),
    routes
  })

  // Inform Google Analytics
  Router.beforeEach((to, from, next) => {
    if (typeof ga !== 'undefined') {
      ga('set', 'page', to.path)
      ga('send', 'pageview')
    }
    next()
  })

  return Router
}
