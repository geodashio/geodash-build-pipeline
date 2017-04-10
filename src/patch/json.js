var fs = require('fs');
var load = require("../load");

module.exports = function(options)
{
  var src = options.src;
  var cwd = options.cwd || ".";
  var path = options.path;
  var value = options.value;

  var obj = load.file(src, cwd);

  var keyChain = Array.isArray(path) ? path : path.split(".");
  var target = obj;
  for(var i = 0; i < keyChain.length -1 ; i++)
  {
    var newKey = keyChain[i];
    if(!(newKey in target))
    {
      target[newKey] = {};
    }
    target = target[newKey];
  }
  target[keyChain[keyChain.length-1]] = value;

  var text = JSON.stringify(obj);

  fs.writeFileSync(src, text, undefined);
};
