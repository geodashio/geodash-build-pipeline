/**
 * Resolves a path, replacing ./ with the current working directory, and ~/ with the user's home directory
 * @function path
 * @param {(string)} a - the path to resolve
 * @param {(string)} cwd - Current Working Directory
 * @return The reoslved path to the file on disk
 * @memberof resolve
 */

var path = require('path');
var expandHomeDir = require('expand-home-dir');

module.exports = function(a, cwd)
{
  a = (a[0] == "/" || a[0] == "." || a[0] == "~") ? a : ("./" + a);

  if(cwd != undefined && cwd != ".")
  {
    if(a.indexOf("./", 0) === 0)
    {
      a = path.join(cwd, a.substring(2));
    }
  }

  a = expandHomeDir(a)

  return a
};
