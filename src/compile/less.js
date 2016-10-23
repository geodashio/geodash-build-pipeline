/**
 * Wrapper function for a Gulp chain for compiling a CSS file from LESS source files
 *
 * @function less
 * @param {(Object)} options - An object containing options src, dest, outfile, and LESS paths
 * @return a Gulp callback
 * @memberof compile
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');

module.exports = function(options)
{
  var src = options.src;
  var dest = options.dest;
  var outfile = options.outfile;
  var paths = options.paths;

  return gulp.src(src, {base: './'})
    .pipe(less({paths: paths}))
    .pipe(concat(outfile))
    .pipe(gulp.dest(dest));
};
