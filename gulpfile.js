var gulp     = require('gulp');
var gulpif   = require('gulp-if');
var clean    = require('gulp-rimraf');
var concat   = require('gulp-concat');
var uglify   = require('gulp-uglify');
var stylus   = require('gulp-stylus');
var cssMin   = require('gulp-minify-css');
var nib      = require('nib');
var es       = require('event-stream');
var merge    = require('event-stream').concat;

var publicDir       = './public';
var publicAssetsDir = './public/assets';

var concatLibJS = function(minifyMe) {
  return gulp.src([
    './src/lib/jquery/dist/jquery.js',
    './src/lib/bootstrap/dist/js/bootstrap.js',
    './src/lib/bootstrap/js/button.js',
    './src/lib/moment/moment.js',
    './src/lib/underscore/underscore.js',
    './src/lib/angular/angular.js',
    './src/lib/angular-route/angular-route.js',
  ])
  .pipe(concat('lib.js'))
  .pipe(gulpif(minifyMe, uglify()))
  .pipe(gulp.dest(publicAssetsDir));

};
var concatAppJS = function(minifyMe) {
  return gulp.src([
    './src/app/**/*.js'
  ])
  .pipe(concat('app.js'))
  .pipe(gulpif(minifyMe, ngMin()))
  .pipe(gulpif(minifyMe, uglify()))
  .pipe(gulp.dest(publicAssetsDir));
};
var concatCSS = function(minifyMe){
  return gulp.src([
    './src/app/**/*.styl',
  ])
  .pipe(stylus({use: [nib()]}))
  .pipe(concat('app.css'))
  .pipe(gulpif(minifyMe, cssMin()))
  .pipe(gulp.dest(publicAssetsDir));
};
var copyStuff = function(minifyMe) {
  return gulp.src([
    './src/**/*', 
    '!./src/**/*.js', 
    '!./src/**/*.styl', 
    '!./src/lib/**/*'
  ])
  .pipe(filterEmptyDirs())
  .pipe(gulp.dest(publicDir));
};
//removes empty dirs from stream
var filterEmptyDirs = function() {
  return es.map(function(file, cb) {
      if (file.stat.isFile()) {
        return cb(null, file);
      } else {
        return cb();
      }
  });
};

// converts '/assets/app.js' into '//cdn.foodbot.io/assets/app.js'
var cdnizeStuff = function(){
  return gulp.src([
    publicDir+"/**/*.html",
    publicDir+"/**/app.js",
  ])
  .pipe(replace(/\/?(assets\/.*\..*?)/gi, defaultCDNBase+'/$1'))
  .pipe(gulp.dest(publicDir));
};
var minifyImages = function(){
  return gulp.src([
    publicAssetsDir+"/**/*",
  ])
  .pipe(imageMin())
  .pipe(gulp.dest(publicAssetsDir));
};

gulp.task('clean', function(){
  return gulp.src(publicDir,{read: false})
  .pipe(clean());
});

gulp.task('default', ['clean'], function(){

  gulp.watch('./src/app/**/*.js', function(){
    console.log("File change - concatAppJS()");
    concatAppJS();
  });
  gulp.watch('./src/lib/**/*.js', function(){
    console.log("File change - concatLibJS()");
    concatLibJS();
  });
  gulp.watch('./src/app/**/*.styl', function(){
    console.log("File change - concatCSS()");
    concatCSS();
  });
  gulp.watch(['./src/**/*', '!./src/**/*.js', '!./src/**/*.styl', '!./src/lib/**/*'], function(){
    console.log("File change - copyStuff()");
    copyStuff();
  });

  return merge(copyStuff(), concatLibJS(), concatAppJS(), concatCSS());
});
gulp.task('build', ['clean'], function(){
  return merge(copyStuff(), concatLibJS(true), concatAppJS(true), concatCSS(true))
  .on("end", function(){
    minifyImages();
  });
});

//production build + cdn support
gulp.task('build-cdn', ['clean'], function(){
  return merge(copyStuff(), concatLibJS(true), concatAppJS(true), concatCSS(true))
  .on("end", function(){
    cdnizeStuff();
    minifyImages();
  });
});
