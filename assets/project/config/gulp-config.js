'use strict';

var
  _ = require('lodash'),

  src         = './src',
  build       = './build',
  dist        = './dist'
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
  plugins: require('gulp-load-plugins')(),
  clean: [build],

  dist: {
    src: build + '/**/*',
    dest: dist
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

  js: {
    watch: src + '/js/**/*',
    entry: [
      src + '/js/app.js'
    ],
    dest: build + '/js'
  },

  webpack: {
    dev: {
      devtool: '#inline-source-map',
      output: {
        libraryTarget: 'commonjs2'
      }
    },
    prod: {
      output: {
        libraryTarget: 'commonjs2'
      }
    }
  },

  pages: {
    src: src + '/pages/**/*',
    dest: build + '/pages',
    assets: {
      watch: src + '/pages/*/assets/**/*'
    },
    js: {
      watch: src + '/pages/**/*.js',
      entry: build + '/pages/**/page.*.js',
    },
    css: {
      watch: src + '/pages/*/css/**/*.styl',
      entry: build + '/pages/*/css/page.*.styl'
    },
    html: {
      watch: src + '/pages/*/html/**/*.tpl'
    },
    clean: [build + '/pages/**/css/**/*.styl', build + '/pages/*/html']
  },

  css: {
    watch: src + '/css/**/*',
    entry: [
      src + '/css/app.styl'
    ],
    dest: build + '/css',
    autoprefixer: {browsers: ['last 3 versions']}
  },

  html: {
    watch: [src + '/**/*.html', '!' + src + '/pages'],
    dest: build,
    settings: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true,
      minifyJS: true,
      minifyCSS: true
    }
  }
};
