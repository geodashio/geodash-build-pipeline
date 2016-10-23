/**
 * Wrapper function for a Gulp chain for compiling a CSS file
 *
 * @function css
 * @param {(Object)} options - An object containing options src, dest, and outfile
 * @return a Gulp callback
 * @memberof compile
 */

var gulp = require('gulp');
var concat = require('gulp-concat');

module.exports = function(options)
{
  var src = options.src;
  var dest = options.dest;
  var outfile = options.outfile;

  return gulp.src(src)
    .pipe(concat(outfile))
    .pipe(gulp.dest(dest));
};
