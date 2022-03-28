var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var connect = require('gulp-connect');

gulp.task('default', function() {

});

gulp.task('serve', ['sass', 'fonts'], function() {
  connect.server({
    root: "./",
    port: 3000
  });

  gulp.watch('./public/fonts/digital-7-webfont.*', ['fonts']);
  gulp.watch("./public/scss/*.scss", ['sass']);
  gulp.watch("./public/app/*.js").on('change', bs.reload);
  gulp.watch("./*.html").on('change', bs.reload);
});

gulp.task('fonts', function() {
  return gulp.src(['./public/fonts/digital-7-webfont.*'])
          .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('sass', function() {
  return gulp.src('./public/scss/*.scss')
   .pipe(sass().on('error', sass.logError))
   .pipe(gulp.dest('./dist/css'))
   .pipe(bs.stream());
});

gulp.task('watch', function () {
  gulp.watch('./public/fonts/digital-7-webfont.*', ['fonts']);
  gulp.watch('./public/scss/*.scss', ['sass']);
  gulp.watch("./index.html").on('change', bs.reload);
});
