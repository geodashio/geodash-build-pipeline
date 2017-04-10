/**
 * Wrapper function for a Gulp chain for linting a TypeScript file
 *
 * @function ts
 * @param {(Object)} options - An object containing options src, dest, outfile, and uglify
 * @return a Gulp callback
 * @memberof compile
 */

var gulp = require('gulp');
var tslint = require('gulp-tslint');

module.exports = function(options)
{
  var src = options.src;

  return gulp.src(src)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
};
