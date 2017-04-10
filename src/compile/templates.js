/**
 * Wrapper function for a Gulp chain for compiling angular templates into
 * inline javascript code using [gulp-angular-templatecache](https://www.npmjs.com/package/gulp-angular-templatecache).
 *
 * @function templates
 * @param {(Object)} options - An object containing options src, dest, and outfile.
 * @return a Gulp callback
 * @memberof compile
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');

module.exports = function(options)
{
  var src = options.src;
  var dest = options.dest || "build/templates/";
  var outfile = options.outfile || "templates.js";

  var templateHeader = options.templateHeader || 'geodash.templates = {static:{}};\n';
  var templateBody = options.templateBody || 'geodash.templates.static["<%= url %>"] = "<%= contents %>";';
  var templateFooter = options.templateFooter || '\n';

  return gulp.src(src)
    .pipe(templateCache(outfile, {
      templateHeader: templateHeader,
      templateBody: templateBody,
      templateFooter: templateFooter
    }))
    .pipe(gulp.dest(dest));
};
