var gulp = require('gulp')
  , bower = require('gulp-bower-files')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , css_minify = require('gulp-minify-css')
  , watch = require('gulp-watch')

gulp.task('bower', function() {
  return bower()
    .pipe(uglify())
    .pipe(concat('libs.js', {newLine: '\n\n'}))
    .pipe(gulp.dest('public/min'))
})

gulp.task('js', function() {
  return gulp.src('app/assets/javascripts/*.js')
    .pipe(uglify())
    .pipe(concat('application.js', {newLine: '\n\n'}))
    .pipe(gulp.dest('public/min'))
})

gulp.task('css', function() {
  return gulp.src('app/assets/stylesheets/*.css')
    .pipe(css_minify())
    .pipe(concat('application.css'))
    .pipe(gulp.dest('public/min'))
})


gulp.task('watch_js', function() {
  watch({glob: 'app/assets/javascripts/*.js'}, function(files) {
    return files
      .pipe(concat('application.js', {newLine: '\n\n'}))
      .pipe(gulp.dest('public'))
  })
})

gulp.task('watch_css', function() {
  watch({glob: 'app/assets/stylesheets/*.css'}, function(files) {
    return files
      .pipe(concat('application.css', {newLine: '\n\n'}))
      .pipe(gulp.dest('public'))
  })
})

gulp.task('watch_bower', function() {
  watch({glob: 'bower.json'}, function(files) {
    return bower()
      .pipe(concat('libs.js', {newLine: '\n\n'}))
      .pipe(gulp.dest('public'))
  })
})


gulp.task('build', ['bower', 'css', 'js'], function() {})

gulp.task('default', ['watch_js', 'watch_css', 'watch_bower'], function() {})