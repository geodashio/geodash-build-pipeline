var gulp = require('gulp');
var replace = require("gulp-replace");

module.exports = function(options)
{
  var prefix_regex = options.prefix_regex;
  var prefix_repl = options.prefix_repl;

  var src = options.src;
  var targets = options.targets;

  return src.reduce(
    function(stream, filename) {
      return stream.pipe(replace(
        new RegExp(prefix_regex+filename, "g"),
        prefix_repl+filename
      ));
    },
    gulp.src(targets, {base: './'})
  ).pipe(gulp.dest("./"));

};
