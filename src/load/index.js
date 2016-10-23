/**
 * Functions to load files from disk
 * @namespace load
 */

var expandHomeDir = require('expand-home-dir');
var fs = require('fs');
var gutil = require('gulp-util');
var log = require("geodash-build-log");
var yaml = require("yamljs");
var resolve = require("../resolve")

var obj =
{
  /**
   * Loads a file from disk and selects which loaded based off file extension.
   * @function file
   * @param {(Object)} path - The path of the file to load
   * @param {(string)} cwd - Current Working Directory
   * @return Javascript object of file
   * @memberof load
   *
   * @example <caption>Basic</caption>
   * var geodash = require("geodash-build-pipeline");
   * var obj = geodash.load.file("./config.yml", "/home/vagrant/geodash-viewer.git");
   */
  "file": function(path, cwd)
  {
    if(path.indexOf(".json", path.length - ".json".length) != -1)
    {
      return obj.json(path, cwd)
    }
    else if(path.indexOf(".yml", path.length - ".yml".length) != -1)
    {
      return obj.yaml(path, cwd)
    }
    else
    {
      return require(resolve.path(path, cwd));
    }
  },
  /**
   * Loads a JSON file from disk into a Javascript object.
   * @function json
   * @param {(Object)} path - The path of the file to load
   * @param {(string)} cwd - Current Working Directory
   * @return Javascript object of file
   * @memberof load
   *
   * @example <caption>Basic</caption>
   * var geodash = require("geodash-build-pipeline");
   * var obj = geodash.load.json("./config.json", "/home/vagrant/geodash-viewer.git");
   */
  "json": function(path, cwd)
  {
    return require(resolve.path(path, cwd));
  },
  /**
   * Loads a YAML file from disk into a Javascript object.
   * @function yaml
   * @param {(Object)} path - The path of the file to load
   * @param {(string)} cwd - Current Working Directory
   * @return Javascript object of file
   * @memberof load
   *
   * @example <caption>Basic</caption>
   * var geodash = require("geodash-build-pipeline");
   * var obj = geodash.load.yaml("./config.yml", "/home/vagrant/geodash-viewer.git");
   */
  "yaml": function(path, cwd)
  {
    return yaml.parse(fs.readFileSync(resolve.path(path, cwd), 'utf8'));
  },
  /**
   * Recursively loads GeoDash config files into a tree
   * @function config
   * @param {(Object)} configPath - The path of the current config to load
   * @param {(string)} cwd - Current Working Directory
   * @return tree of configs
   * @memberof load
   *
   * @example <caption>Basic</caption>
   * var geodash = require("geodash-build-pipeline");
   * var rootConfig = geodash.load.config("./config.yml", "/home/vagrant/geodash-viewer.git");
   */
  "config": function(configPath, cwd)
  {
    var children = [];

    var configObject = obj.yaml(configPath, cwd);

    if("dependencies" in configObject)
    {
      if("production" in configObject["dependencies"])
      {
        if("project" in configObject["dependencies"]["production"])
        {
          var projects = configObject["dependencies"]["production"]["project"];
          for (var i = 0; i < projects.length; i++)
          {
            var project = projects[i];
            children.push(obj.config(project, cwd));
          }
        }
      }
    }

    return {
      'path': configPath,
      "children": children
    };
  }
};

module.exports = obj;
