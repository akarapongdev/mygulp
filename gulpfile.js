var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var csso        = require('gulp-csso');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');
var jade        = require('gulp-jade');
var livereload  = require('gulp-livereload');
var tinylr      = require('tiny-lr');
var express     = require('express');
var app         = express();
var marked      = require('marked');
var path        = require('path');
var server      = tinylr();

// Stylesheet Task
gulp.task('css', function() {
  return gulp.src('./src/sass/**/*.sass')
  .pipe(sourcemaps.init())
  .pipe(sass({
    includPaths: ['./src/sass/'],
    errLogToConsole: true,
    outputStyle: 'extended'
  }))
  .pipe(prefix({
    browsers: ['last 2 versions']
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/css/'))
  .pipe( livereload( server ));
});

// Script Task
gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
    .pipe( livereload( server ));
});

// HTML Template Task
gulp.task('jade', function() {
  return gulp.src('./src/*.jade')
  .pipe(jade({
    pretty: true
  }))  
  .pipe(gulp.dest('./dist/'))
  .pipe( livereload( server ));
});

// Express Template Task
gulp.task('express', function() {
  app.use(express.static(path.resolve('./dist')));
  app.listen(2500);
  gutil.log('Listening on port: 2500');
});

// Watch Task
gulp.task('watch', function () {
  livereload.listen(35729, function (err) {
    if (err) { return console.log(err); }
    gulp.watch('src/sass/**/*.sass',['css']);
    gulp.watch('src/js/*.js',['js']);
    gulp.watch('src/*.jade',['jade']);    
  });
});

// Default Task
gulp.task('default', ['js','css','jade','express','watch']);

// Production Task
gulp.task('production', function() {
  return gulp.src('./dist/css/*.css')
  .pipe(csso())
  .pipe(gulp.dest('./dist/css'));
});
