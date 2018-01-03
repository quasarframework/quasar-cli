// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      // 'axios'// ,
      // 'i18n',
      // 'some-package'
    ],
    css: [
      'my-style.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'
      // 'ionicons',
      // 'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: ['404.vue'],
      remove: []
    },
    build: {
      scopeHoisting: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      vueRouterMode: 'history',
      // publicPath: '/test',
      test () {
        // console.log('a')
      },
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
      }
    },
    devServer: {
      // https: true,
      open: false
    },
    framework: {
      components: [
        'QApp',
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QToolbar',
        'QBtn',
        'QIcon',
        'QInput',
        'QToolbarTitle',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QPageContainer',
        'QPage',
        'QCarousel',
        'QCarouselControl',
        'QCarouselSlide',
        'QActionSheet',
        'QCollapsible',
        'QCard',
        'QCardMain',
        'QCardTitle',
        'QDialog',
        'QTooltip',
        'QFab',
        'QFabAction',
        'QToggle',
        'QModal',
        'QModalLayout',
        'QSearch',
        'QPopover',
        'QChip',
        'QRadio',
        'QAlert',
        'QTransition'
      ],
      directives: [
        'Ripple'
      ],
      plugins: [
        'ActionSheet',
        'Dialog',
        'Notify'
      ]
    },
    animations: [
      'bounceInLeft',
      'bounceOutRight'
    ],
    pwa: {
      cacheExt: 'js,html,css,woff,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        icons: [
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ],
        background_color: '#ffffff',
        theme_color: '#027be3'
      }
    },
    cordova: {
      // id: 'org.quasar.cordova.ZappZ'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    }
  }
}
