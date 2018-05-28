const appPaths = require('./app-paths')

function makeTag (tagName, attributes, closeTag = false) {
  return {
    tagName,
    attributes,
    closeTag
  }
}

function makeScriptTag (innerHTML) {
  return {
    tagName: 'script',
    closeTag: true,
    innerHTML
  }
}

module.exports = class HtmlAddonsPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('webpack-plugin-html-addons', compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('webpack-plugin-html-addons', (data, callback) => {
        /** HEAD **/

        if (this.cfg.build.appBase) {
          data.head.push(
            makeTag('base', { href: this.cfg.build.appBase })
          )
        }

        if (this.cfg.ctx.mode.electron && this.cfg.ctx.dev) {
          data.head.push(
            makeScriptTag(`
              require('module').globalPaths.push('${appPaths.resolve.app('node_modules').replace(/\\/g, '\\\\')}')
            `)
          )
        }

        /** BODY **/

        if (this.cfg.ctx.mode.cordova) {
          data.body.unshift(
            makeTag('script', { src: 'cordova.js' }, true)
          )
        }

        let bodyScript = ''

        if (this.cfg.ctx.dev) {
          bodyScript += `
            console.info('[Quasar] Running ${this.cfg.ctx.modeName.toUpperCase()} with ${this.cfg.ctx.themeName.toUpperCase()} theme.');
          `

          if (this.cfg.ctx.mode.pwa) {
            bodyScript += `
              console.info('[Quasar] PWA: a no-op service worker is being supplied in dev mode in order to reset any previous registered one. This ensures HMR works correctly.');
              console.info('[Quasar] Do not run Lighthouse test in dev mode.');
            `
          }
        }

        if (this.cfg.ctx.mode.electron && this.cfg.ctx.prod) {
          // set statics path in production;
          // the reason we add this is here is because the folder path
          // needs to be evaluated at runtime
          bodyScript += `
            window.__statics = require('path').join(__dirname, 'statics').replace(/\\\\/g, '\\\\');
          `
        }

        if (bodyScript.length > 0) {
          data.body.push(
            makeScriptTag(bodyScript)
          )
        }

        // finally, inform Webpack that we're ready
        callback(null, data)
      })
    })
  }
}
