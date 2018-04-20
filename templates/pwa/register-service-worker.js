import { register } from 'register-service-worker'

register(`${process.env.VUE_ROUTER_BASE}service-worker.js`, {
  ready () {
    console.log('Service worker is active.')
  },
  cached () {
    console.log('Content has been cached for offline use.')
  },
  updated () {
    console.log('New content is available; please refresh.')
  },
  offline () {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error (error) {
    console.error('Error during service worker registration:', error)
  }
})
