/**
 * Wrapper function for a Gulp chain for compiling a TypeScript file
 *
 * @function ts
 * @param {(Object)} options - An object containing options src, dest, outfile, and uglify
 * @return a Gulp callback
 * @memberof compile
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

module.exports = function(options)
{
  var src = options.src;
  var dest = options.dest;
  var outfile = options.outfile;

  if(options.uglify == true)
  {
    return gulp.src(src, {base: './'})
      .pipe(concat(outfile))
      .pipe(gulp.dest(dest))
      .pipe(rename({ extname: '.min.js'}))
      .pipe(uglify({mangle: false}))
      // Important not to mangle so files can be compressed with other sources
      //.pipe(uglify({mangle: false, preserveComments: 'all'}))
      //.pipe(minifier({mangle: false, preserveComments: 'all'}, uglifyjs))
      .pipe(gulp.dest(dest));
  }
  else
  {
    return gulp.src(src, {base: './'})
      .pipe(concat(outfile))
      .pipe(gulp.dest(dest));
  }
};
