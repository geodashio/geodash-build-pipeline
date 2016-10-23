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
   * @param {(Object)} n - Current node in the tree
   * @param {(string)} cwd - Current Working Directory
   * @return an array of configs
   * @memberof flatten
   */
  "configs": function(n, cwd)
  {
    var configs = [];
    var basepath = resolve.path(n.path, cwd);
    var config = load.yaml(basepath);
    config["path"]["base"] = path.dirname(basepath);
    configs.push(config);

    for(var i = 0; i < n.children.length; i++)
    {
      configs = obj.configs(n.children[i], cwd).concat(configs);
    }
    return configs;
  }
};

module.exports = obj;
