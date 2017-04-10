/**
 * Wrapper functions for the low-level Gulp pipeline API like gulp.src(...).dest(...).
 * @namespace compile
 */

module.exports =
{
  "css": require("./css"),
  "js": require("./js"),
  "ts": require("./ts"),
  "less": require("./less"),
  "templates": require("./templates")
};
