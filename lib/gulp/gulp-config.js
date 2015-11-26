'use strict';

var
  fs = require('fs'),
  yaml = require('js-yaml'),

  src         = 'src',
  dist        = 'dist'
  ;


module.exports = {

  clean: [dist],
  base: src,
  app: yaml.load(fs.readFileSync('quasar.build.yml')),
  browser: require('browser-sync').create(),

  appManifest: {
    dest: dist + '/app.json'
  },

  css: {
    all: src + '/**/*.styl',
    src: [
      src + '/css/*.styl',
      src + '/pages/*/css/*.styl'
    ],
    dest: dist
  },

  js: {
    all: src + '/**/*.js',
    src: [
      src + '/js/*.js',
      src + '/pages/*/js/*.js'
    ],
    dest: dist,
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
    dest: dist
  },

  assets: {
    src: [
      src + '/assets/**',
      src + '/pages/*/assets/**'
    ],
    dest: dist
  },

  deps: {
    name: 'app-dependencies',
    js: {
      src: [
        'node_modules/quasar-framework/dist/deps/quasar-dependencies',
        'node_modules/quasar-framework/dist/lib/quasar'
      ],
      dest: dist + '/js'
    },
    css: {
      src: [
        'node_modules/quasar-framework/dist/deps/quasar-dependencies',
        'node_modules/quasar-framework/dist/lib/quasar'
      ],
      dest: dist + '/css'
    },
    semantic: {
      src: 'node_modules/quasar-framework/dist/deps/themes/**/*',
      dest: dist + '/css/themes'
    }
  },

  preview: {
    port: 3000,
    ui: {port: 3001},
    open: false,
    reloadOnRestart: true,
    server: {
      baseDir: dist
    }
  },

  rpreview: {
    port: 3100,
    ui: false,
    ghostMode: false,
    open: false,
    reloadOnRestart: true,
    server: {
      baseDir: [dist, __dirname + '/../../assets/responsive-preview/'],
      index: '___responsive-preview.html'
    }
  },

  karma: {
    // list of files / patterns to load in the browser
    files: [
      'test/setup.js',
      'dist/js/app-dependencies.js',
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
