'use strict';

var
  src         = 'src',
  dist        = 'dist'
  ;


module.exports = {

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
  },

  clean: [dist, 'coverage'],
  base: src,
  browser: require('browser-sync').create(),

  appManifest: {
    watch: {
      pages: src + '/pages/*/config.*.yml',
      layouts: src + '/layouts/*/layout.*.yml'
    }
  },

  lint: {
    css: src + '/**/*.styl',
    js: src + '/**/*.js'
  },

  css: {
    watch: [
      src + '/**/*.styl',
      'node_modules/quasar-framework/dist/css/**/*.styl'
    ],
    src: [
      src + '/css/*.styl',
      src + '/pages/*/style.*.styl',
      src + '/layouts/*/layout.*.styl'
    ],
    dest: dist
  },

  js: {
    watch: [
      src + '/**/*.js',
      src + '/**/*.html',
    ],
    src: [
      src + '/js/*.js',
      src + '/pages/*/script.*.js',
      src + '/layouts/*/layout.*.js'
    ],
    dest: dist
  },

  html: {
    watch: [src + '/index.html'],
    src: src + '/index.html',
    dest: dist
  },

  webpack: {
    cache: true,
    output: {
      libraryTarget: 'commonjs2'
    }
  },

  assets: {
    src: [
      src + '/assets/**',
      src + '/pages/*/assets/**',
      src + '/layouts/*/assets/**'
    ],
    dest: dist
  },

  appAdditions: {
    base: 'node_modules/quasar-framework/dist/app-additions/',
    src: 'node_modules/quasar-framework/dist/app-additions/**/*',
    dest: dist
  },

  deps: {
    name: 'deps',
    js: {
      src: [
        'node_modules/quasar-framework/dist/deps/quasar-dependencies',
        'node_modules/quasar-framework/dist/js/quasar'
      ],
      dest: dist + '/js'
    },
    css: {
      src: [
        'node_modules/quasar-framework/dist/deps/quasar-dependencies'
      ],
      dest: dist + '/css'
    }
  },

  preview: {
    port: 3000,
    ui: {port: 3001},
    open: false,
    reloadOnRestart: true,
    ghostMode: false,
    server: {
      baseDir: dist
    }
  },

  responsive: {
    port: 3100,
    ui: false,
    ghostMode: false,
    open: false,
    reloadOnRestart: true,
    server: {
      baseDir: [dist, __dirname + '/../../assets/responsive-preview/'],
      index: '___responsive-preview.html'
    }
  }

};
