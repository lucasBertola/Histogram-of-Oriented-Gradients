var gulp        = require('gulp');
var beautify    = require('gulp-beautify');
var uglify      = require("gulp-uglify");
var renameGulp  = require("gulp-rename");
var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');


gulp.task('beautify', function() {
  return gulp.src('./src/*.js')
    .pipe(beautify({indentSize: 2}))
    .pipe(gulp.dest('./src/'))
});

gulp.task('minifyjs', function () {
   return gulp.src('./dist/histogram-of-oriented-gradients.js')
    .pipe(renameGulp("histogram-of-oriented-gradients.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', function () {
   return gulp.src(['src/index.js'])
    .pipe(browserify())
    .pipe(renameGulp("histogram-of-oriented-gradients.js"))
    .pipe(gulp.dest('./dist/'))
});


gulp.task('default',function(callback){
  runSequence('beautify','build','minifyjs',callback)
}
);
