/**
 * Wrapper function for a Gulp chain for compiling a TypeScript file
 *
 * @function ts
 * @param {(Object)} options - An object containing options src, dest, outfile, and uglify
 * @return a Gulp callback
 * @memberof compile
 */

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(options)
{
  var src = options.src;
  var dest = options.dest;
  var outfile = options.outfile;
  var baseUrl = options.baseUrl || ".";
  var paths = options.paths;

  var ts_options = {
    typescript: require("typescript"),
    outFile: outfile,
    target: 'es5',
    module: 'system',
    moduleResolution: 'node',
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    lib: ['es2015', 'dom'],
    noImplicitAny: true,
    suppressImplicitAnyIndexErrors: true,
    baseUrl: baseUrl,
    paths: paths
  };

  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(tsc(ts_options))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
    
};
