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
  app: yaml.load(fs.readFileSync('quasar.build.yml')),

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
      pages: '.tmp/pages/*/js/script.*.js',
      dest: '.tmp'
    },
    yml: src + '/pages/*/config.*.yml'
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
  },

  karma: {
    // list of files / patterns to load in the browser
    files: [
      'build/js/app-dependencies.js',
      'test/setup.js',
      'test/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

    webpack: {
      output: {
        libraryTarget: 'umd'
      },
      module: {
        postLoaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|resources\/js\/vendor)/,
            loader: 'istanbul-instrumenter'
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'lcov',
          subdir: '.'
        }
      ]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-sinon-chai',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha-reporter'
    ]
  }

};
