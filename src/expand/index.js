/**
 * Functions to expand relative paths, templates, etc.
 * @namespace expand
 */

var merge = require('merge');

var obj =
{
  /**
   * Wrapper around [expand-home-dir](https://www.npmjs.com/package/expand-home-dir) package
   * @function home
   * @memberof expand
   */
  "home": require('expand-home-dir'),
  /**
   * Expands relative links in a dashboard template to schema templates.  For
   * instance `template: css` is replaced with a reusable object
   * @function schema
   * @memberof expand
   */
  "schema": function(curr, schema_templates)
  {
    // Expand/Unfurl 1 Level
    for(var i = 0; i < curr.schema.fields.length; i++)
    {
      var f = curr.schema.fields[i];
      if(typeof f == "string")
      {
        curr.schema.fields[i] = schema_templates[f];
      }
      else if(f.template != undefined)
      {
        curr.schema.fields[i] = merge(schema_templates[f.template], f.overrides);
      }
    }

    // Navigate down into schema
    for(var i = 0; i < curr.schema.fields.length; i++)
    {
      var f = curr.schema.fields[i];
      if(f.type == "object" || f.type == "objectarray")
      {
        curr.schema.fields[i] = obj.schema(f, schema_templates);
      }
    }

    return curr;
  }
};

module.exports = obj;
