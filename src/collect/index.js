/**
 * Contains basic functions to collect a list of files or objects
 * @namespace collect
 */

var obj = {
  "files": require("./files"),
  "files_all": function(pluginPath, plugin, aType)
  {
    var files = {};
    for(var i = 0; i < aType.length; i++)
    {
      files[aType[i]] = obj.files(pluginPath, plugin, aType[i]);
    }
    return files;
  },
  "objects": require("./objects")
};


module.exports = obj;
