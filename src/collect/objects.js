/**
 * Collect all the objects for a plugin's facet, such as controllers, directives, templates, etc.
 * @function objects
 * @param {(string)} pluginPath - path to the plugin
 * @param {(Object)} plugin - the plugin object
 * @param {(string)} facet - The facet to collect, such as controllers, directives, templates, shemas, etc.
 * @return a list of objects
 * @memberof collect
 */

var path = require('path');

module.exports = function(pluginPath, plugin, facet)
{
  var arr = [];
  if(plugin[facet] != undefined)
  {
    var prefix = path.dirname(pluginPath);
    for(var i = 0; i < plugin[facet].length; i++)
    {
      var x = plugin[facet][i];
      var y = undefined;
      if(typeof x == 'string')
      {
        y = path.join(prefix, facet,x);
      }
      else
      {
        y = x;
        y.path = path.join(prefix, facet, y.path);
      }
      arr.push(y);
    }
  }
  return arr;
};
