/**
 * Resolve symbolic links to builds, relative paths, etc.
 * @namespace resolve
 */

var merge = require('merge');
var expandHomeDir = require('expand-home-dir');
var log = require("geodash-build-log");

var obj =
{
  "build": require("./build"),
  "path": require("./path"),
  "resource": function(project, name, version, minified, variables, projects_by_name)
  {
    var resourcePath = undefined;
    if(projects_by_name[project]['resources'] == undefined)
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
  "source": function(rootConfig, x, variables, projects_by_name)
  {
    log.debug(["\n","resolve("+JSON.stringify(x.name)+")"]);
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
  }
};

module.exports = obj;
