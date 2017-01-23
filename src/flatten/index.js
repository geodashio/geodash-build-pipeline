/**
 * Functions to flatten tree-like objects into lists
 * @namespace flatten
 */

var path = require('path');
var expandHomeDir = require('expand-home-dir');
var load = require("../load")
var resolve = require("../resolve")

var obj =
{
  /**
   * Flattens a dependency tree of configs into a single list
   * @function configs
   * @param {(Object)} curr - Current node in the tree
   * @param {(string)} cwd - Current Working Directory
   * @param {(string)} path_cache_projects - Path to directory for caching projects
   * @return an array of configs
   * @memberof flatten
   */
  "configs": function(curr, cwd, path_cache_projects)
  {
    var configs = [];
    var basepath = "";
    if(typeof curr.path != "string")
    {
      basepath = expandHomeDir(resolve.path(
        path.join(path_cache_projects, path.basename(uri.slice(7)), "config.yml"),
        cwd
      ));
    }
    else
    {
      basepath = resolve.path(curr.path, cwd);
    }

    if(basepath != undefined)
    {
      var config = load.yaml(basepath);
      config["path"]["base"] = path.dirname(basepath);
      configs.push(config);

      for(var i = 0; i < curr.children.length; i++)
      {
        configs = obj.configs(curr.children[i], cwd, path_cache_projects).concat(configs);
      }
    }
    return configs;
  }
};

module.exports = obj;
