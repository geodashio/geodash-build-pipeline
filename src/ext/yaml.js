 /**
  * Function to simplify loading a native Javascript object from a YAML file.
  *
  * @function yaml
  * @memberof ext
  * @param {(Object)} module - A Javascript module
  * @param {(string)} filename - The filename of the file to load
  *
  * @example <caption>Basic</caption>
  * var geodash = require("geodash-build-pipeline");
  * require.extensions.yaml = geodash.ext.yaml;
  * var obj = require("./obj.yml");
  */

var fs = require('fs');
var gutil = require('gulp-util');
var yaml = require("yamljs");

module.exports = function (module, filename)
{
  try {
    module.exports = yaml.parse(fs.readFileSync(filename, 'utf8'));
  }
  catch(err)
  {
    if(argv.debug)
    {
      gutil.log(gutil.colors.magenta('Could not open yaml file '+filename));
    }
    module.exports = null;
  }
};
