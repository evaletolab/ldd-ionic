var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var path = require('path');
var sass = require('gulp-sass');
var sh = require('shelljs');

//
// webpack
var del              = require('del');
var open             = require('open');
var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig    = require('./webpack.config.js');

var paths = {
  sass: ['./scss/**/*.scss']
};


//
// SASS
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./app/css/'))
    .on('end', done);
});

//
// WEBPACK
gulp.task('webpack', function (callback) {
  gulp.watch(paths.sass, ['sass']);
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      colors: true
    }));

    callback();
  });
});

//
// WEBPACK DEV SERVER
gulp.task('webpack-dev-server', function (callback) {
  gulp.watch(paths.sass, ['sass']);
  
  new WebpackDevServer(webpack(webpackConfig), {

    contentBase: path.join(__dirname, 'www'),

    stats: {
      colors: true
    }

  }).listen(8080, 'localhost', function (err) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    var startUrl = 'http://localhost:8080/webpack/index.html';
    open(startUrl);
    gutil.log('[webpack]', startUrl);

  });
});

//
// CLEAN
gulp.task('clean', function (cb) {
  del([
    'www/**/*',
    '!www/.gitignore'
  ], {
    dot: true
  }, cb);
});

//
// CLEAN ALL
gulp.task('clean-all', function (cb) {
  del([
    'www/**/*',
    '!www/.gitignore',
    'node_modules',
    'bower_components'
  ], {
    dot: true
  }, cb);
});



gulp.task('install', ['webpack']);
gulp.task('watch', ['webpack-dev-server']);
gulp.task('default', ['install']);
