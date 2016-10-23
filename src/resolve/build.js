/**
 * REsolves a name of a build to its actual path
 * @function file
 * @param {(Object)} rootConfig - The root GeoDash config
 * @param {(string)} name - The name of the build
 * @param {(boolean)} minified - If true, resovles the path to the minified version if exists
 * @return path to the build on disk
 * @memberof resolve
 */

var path = require('path');
var log = require("geodash-build-log");

module.exports = function(rootConfig, name, minified)
{
  log.debug(["!","!", "!", "resolveBuild(rootConfig, "+name+","+minified+")"]);
  var outfile = rootConfig['build'][name]['outfile'];
  if(minified == true)
  {
    outfile = path.basename(outfile, path.extname(outfile)) + ".min.js";
  }
  log.debug(["build "+ outfile, minified]);
  return path.join(rootConfig['build'][name]['dest'], outfile);
};
