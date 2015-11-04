'use strict';

var
  _ = require('lodash'),
  fs = require('fs'),
  yaml = require('js-yaml'),

  src         = 'src',
  build       = 'build',
  dist        = 'dist'
  ;


module.exports = {

  clean: [build],
  base: src,
  app: yaml.load(fs.readFileSync('quasar.config.yml')),

  appManifest: {
    dest: build + '/app.json'
  },

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
      src: [
        'node_modules/quasar-framework/dist/js/quasar-dependencies.js',
        'node_modules/quasar-framework/dist/js/quasar.js'
      ],
      dest: build + '/js'
    },
    css: {
      src: [
        'node_modules/quasar-framework/dist/css/quasar-dependencies.css',
        'node_modules/quasar-framework/dist/css/quasar.css'
      ],
      dest: build + '/css'
    }
  },

  preview: {
    port: 3000,
    ui: {port: 3001},
    open: false,
    reloadOnRestart: true,
    server: {
      baseDir: build
    }
  }

};
