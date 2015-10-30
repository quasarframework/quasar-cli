'use strict';

var
  _ = require('lodash'),

  src         = 'src',
  build       = 'build',
  dist        = 'dist'
  ;

function mapToNodeModules(suffix, list) {
  return _.map(list, function(item) {
    if (item.indexOf('!') === 0) {
      return item.substr(1) + suffix;
    }
    return 'node_modules/' + item + suffix;
  });
}


module.exports = {

  clean: [build],
  base: src,
  plugins: require('gulp-load-plugins')(),

  dist: {
    src: build + '/**',
    dest: dist
  },

  css: {
    all: src + '/**/*.styl',
    src: [
      src + '/css/*.styl',
      src + '/pages/*/css/*.styl'
    ],
    dest: build
  },

  js: {
    all: src + '/**/*.js',
    src: [
      src + '/js/*.js',
      src + '/pages/*/js/*.js'
    ],
    dest: build,
    manifest: src + '/pages/*/page.*.yml',
    tmp: {
      src: [
        '.tmp/js/*.js',
        '.tmp/pages/*/js/*.js'
      ],
      pages: '.tmp/pages/*/js/page.*.js',
      dest: '.tmp'
    },
    yml: src + '/pages/*/page.*.yml'
  },

  webpack: {
    output: {
      libraryTarget: 'commonjs2'
    }
  },

  html: {
    src: [
      src + '/index.html',
      src + '/html/*.html',
      src + '/pages/*/html/*.html'
    ],
    dest: build
  },

  assets: {
    src: [
      src + '/assets/**',
      src + '/pages/*/assets/**'
    ],
    dest: build
  },

  deps: {
    name: 'app-dependencies',
    js: {
      src: mapToNodeModules('.js', [
        'quasar-framework/dist/js/quasar-dependencies',
        'quasar-framework/dist/js/quasar'
      ]),
      dest: build + '/js'
    },
    css: {
      src: mapToNodeModules('.css', [
        'quasar-framework/dist/css/quasar-dependencies',
        'quasar-framework/dist/css/quasar'
      ]),
      dest: build + '/css'
    }
  },

  preview: {
    server: {
      port: 3000,
      ui: {port: 3001},
      open: false,
      reloadOnRestart: true,
      server: {
        baseDir: build
      }
    }
  }

};
