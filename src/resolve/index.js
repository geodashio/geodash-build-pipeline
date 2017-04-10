/**
 * Resolve symbolic links to builds, relative paths, etc.
 * @namespace resolve
 */

var path = require('path');
var merge = require('merge');
var expandHomeDir = require('expand-home-dir');
var log = require("geodash-build-log");
var mkdirp = require("mkdirp");
var execSync = require('child_process').execSync;

var obj =
{
  build: require("./build"),
  path: require("./path"),
  resource: function(project, name, version, minified, variables, projects_by_name)
  {
    var resourcePath = undefined;

    if(name.indexOf(":") !== -1)
    {
      project = name.substring(0, name.indexOf(":"));
      name = name.substring(name.indexOf(":")+1);
    }

    if(name.indexOf("@") !== -1)
    {
      version = name.substring(name.indexOf("@")+1);
      name = name.substring(0, name.indexOf("@"));
    }

    if(projects_by_name[project] == undefined)
    {
      log.error("Missing project "+ project+" when trying to get resource "+name+".");
    }

    var project = projects_by_name[project];
    var resources = project['resources'];
    for(var i = 0; i < resources.length; i++)
    {
      if(resources[i].name == name)
      {
        resourcePath = (minified == true && (resources[i].minified != undefined)) ? resources[i].minified : resources[i].path;
        break;
      }
    }

    if(version != undefined)
    {
      resourcePath = resourcePath.replace(new RegExp("{{(\\s*)version(\\s*)}}",'gi'), version);
    }

    try{
      resourcePath = obj.path(resourcePath, project.path.base)
    }catch(err){
      log.error(["Could not resolve resource named "+name+" with version "+version+" at path"+resourcePath+"."]);
    };
    return resourcePath;
  },
  source: function(rootConfig, x, variables, projects_by_name)
  {
    x = merge(true, x);
    if(Array.isArray(x.src))
    {
      var newSource = [];
      for(var i = 0; i < x.src.length; i++)
      {
        var y = x.src[i];
        if(typeof y == 'string')
        {
          newSource.push(y);
        }
        else
        {
          if(y.type == "resource" || y.type == "res")
          {
            var names = Array.isArray(y.names) ? y.names : [y.name];
            for(var j = 0; j < names.length; j++)
            {
              var z = obj.resource(y.project, names[j], y.version, (x.minified == true), variables, projects_by_name);
              if(z == undefined)
              {
                log.error("Resolved resource "+y.project+":"+y.name+" is undefined.");
              }
              newSource.push(z);
            }
          }
          else if(y.type == "variable" || y.type == "var")
          {
            var z = variables[y.name];
            if(Array.isArray(z))
            {
              newSource = newSource.concat(z);
            }
            else if(typeof y == 'string')
            {
              newSource.push(z);
            }
            else
            {
              log.error("Resolved variable "+y.name+" is not an array or string.");
            }
          }
          else if(y.type == "build")
          {
            newSource.push(obj.build(rootConfig, y.name, (x.minified == true)));
          }
          else
          {
            log.error("Unknown source type (\""+y.type+"\").  Can be either string, resource, variable, or build.");
          }
        }
      }
      log.debug(JSON.stringify(x.src));
      x.src = newSource.map(function(x, i, arr){return obj.path(x);});
      log.debug(JSON.stringify(x.src));
    }
    else
    {
      x.src = obj.path(x.src);
    }
    x.dest = obj.path(x.dest);
    return x;
  },
  plugin: function(pluginName, options)
  {
    var argv = options["argv"];
    var cwd = options["cwd"] || ".";
    var path_cache = options["path_cache"];
    var path_plugins = options["path_plugins"];

    if(typeof pluginName != "string")
    {
      var uri = pluginName.uri || pluginName.url;
      log.debug('Plugin: '+uri, argv);
      if(uri.startsWith("file://"))
      {
        pluginPath = obj.path(path.join(uri.slice(6), "config.yml"), cwd);
      }
      else if(uri.startsWith("https://") && uri.endsWith(".git"))
      {
        var branch = pluginName.branch || pluginName.version || "master";
        var targetFolder = obj.path(path.join(path_cache, "plugins", path.basename(uri.slice(7))));
        mkdirp.sync(path.dirname(obj.path(targetFolder, cwd)));
        //
        var cmd = ["git", "clone", "'"+uri+"'", "'"+path.basename(targetFolder)+"'"].join(" ");
        //execSync(cmd, {'cwd': path.dirname(targetFolder)});
        try { execSync(cmd, {'cwd': path.dirname(targetFolder), 'stdio': 'ignore'}); }
        catch(err) { log.debug(['Error on', cmd], argv); }
        var cmd = ["git", "checkout", branch].join(" ");
        try { execSync(cmd, {'cwd': targetFolder, 'stdio': 'ignore'}); }
        catch(err) { log.debug(['Error on', cmd], argv); }
        var cmd = ["git", "pull", 'origin', branch].join(" ");
        try { execSync(cmd, {'cwd': targetFolder, 'stdio': 'ignore'}); }
        catch(err) { log.debug(['Error on', cmd], argv); }
        pluginPath = obj.path(
          path.join(path_cache, "plugins", path.basename(uri.slice(7)), "config.yml"),
          cwd
        );
      }
      else
      {
        pluginPath = obj.path(path.join("plugins", uri, "config.yml"), cwd);
      }
    }
    else
    {
      log.debug('Plugin: '+pluginName, argv);
      var uri = pluginName;
      if(pluginName.startsWith("file://"))
      {
        pluginPath = obj.path(path.join(uri.slice(6), "config.yml"), cwd);
      }
      else if(pluginName.startsWith("https://") && pluginName.endsWith(".git"))
      {
        var branch = "master";
        var targetFolder = obj.path(path.join(path_cache, "plugins", path.basename(uri.slice(7))));
        mkdirp.sync(path.dirname(obj.path(targetFolder, cwd)));
        //
        var cmd = ["git", "clone", "'"+uri+"'", "'"+path.basename(targetFolder)+"'"].join(" ");
        //execSync(cmd, {'cwd': path.dirname(targetFolder)});
        try { execSync(cmd, {'cwd': path.dirname(targetFolder), 'stdio': 'ignore'}); }
        catch(err) { log.debug(['Error on', cmd], argv); }
        var cmd = ["git", "checkout", branch].join(" ");
        try { execSync(cmd, {'cwd': targetFolder, 'stdio': 'ignore'}); }
        catch(err) { log.debug(['Error on', cmd], argv); }
        var cmd = ["git", "pull", 'origin', branch].join(" ");
        try { execSync(cmd, {'cwd': targetFolder, 'stdio': 'ignore'}); }
        catch(err) { log.debug(['Error on', cmd], argv); }
        pluginPath = obj.path(
          path.join(path_cache, "plugins", path.basename(uri.slice(7)), "config.yml"),
          cwd
        );
      }
      else
      {
        pluginPath = obj.path(path.join(path_plugins, uri, "config.yml"), cwd);
      }
    }

    return pluginPath;
  }
};

module.exports = obj;
