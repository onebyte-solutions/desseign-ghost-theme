(function() {

  'use strict';

  // Include Gulp & Plugins
  var gulp         = require('gulp'),
      sass         = require('gulp-sass')(require('sass')),
      cleanCSS     = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps   = require('gulp-sourcemaps'),
      concat       = require('gulp-concat'),
      rename       = require('gulp-rename'),
      terser       = require('gulp-terser'),
      plumber      = require('gulp-plumber'),
      size         = require('gulp-size'),
      livereload   = require('gulp-livereload'),
      zip          = require('gulp-zip'),
      beeper       = require('beeper'),
      fs           = require('fs');

  var onError = function( err ) {
    console.log('An error occurred:', err.message);
    beeper();
    this.emit('end');
  };

  // Start server
  gulp.task('serve', function (done) {
    livereload.listen();
    done();
  });

  // Cleanup
  gulp.task('clean', function (done) {
    del(['dist'])
  });

  // SASS
  gulp.task('css', function (done) {
    return gulp.src('./assets/css/styles.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/built'))
    .pipe(size())
    .pipe(livereload())
    done();
  });

  // JavaScript
  gulp.task('js', function(done) {
    return gulp.src([
      './node_modules/jquery/dist/jquery.js',
      './node_modules/clipboard/dist/clipboard.js',
      './node_modules/fitvids.1.1.0/jquery.fitvids.js',
      './node_modules/medium-zoom/dist/medium-zoom.min.js',
      './node_modules/slick-carousel/slick/slick.min.js',
      './node_modules/infinite-scroll/dist/infinite-scroll.pkgd.min.js',
      './assets/js/animate-css-grid.js',
      './assets/js/disqusLazy.js',
      './assets/js/scripts.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('scripts.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./assets/built'))
      .pipe(size())
      .pipe(livereload())
      done();
  });

  // Templates
  gulp.task('hbs', function(done) {
    return gulp.src('**/*.hbs')
      .pipe(livereload())
      done();
  });

  // Icons
  gulp.task('icons', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
      .pipe(gulp.dest('assets/fonts/'));
  });

  // Watch
  gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('assets/css/**/*.scss', gulp.series('css'));
    gulp.watch('assets/js/**/*.js', gulp.series('js'));
    gulp.watch('**/*.hbs', gulp.series('hbs'));
  });

  // Zip for production
  gulp.task('zipper', function(done) {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
      '**',
      '!node_modules', '!node_modules/**',
      '!dist', '!dist/**'
    ])
    .pipe(zip(filename))
    .pipe(gulp.dest(targetDir));
  });

  // Production build task
  gulp.task(
    'build',
    gulp.series('css', 'js', 'icons', 'hbs')
  );

  // The default task that watches for changes
  gulp.task(
    'default',
    gulp.series('build', 'serve', 'watch')
  );

})();
