/**
 * Wrapper function to publish files to S3 / Cloudfront
 *
 * @function s3
 * @param {(Object)} options - An object containing options src, prefix, etc.
 * @return a Gulp callback
 * @memberof publish
 */

var gulp = require('gulp');
var log = require("geodash-build-log");
var path = require("path");

var s3 = require('gulp-s3-upload')({});

module.exports = function(options)
{
  var src = options.src;
  var prefix = options.prefix;
  var accessKeyId = options.accessKeyId;
  var secretAccessKey = options.secretAccessKey;
  var bucket = options.bucket;
  var region = options.region;

  var acl = options.acl || 'public-read';

  return gulp
    .src(src, {base: './'})
    .pipe(s3({Bucket: bucket, ACL: acl, keyTransform: function(x){
      var s3_path = path.join(prefix, path.basename(x));
      log.info(["-- uploading "+x+" to "+s3_path+"."]);
      return s3_path;
    }},
    {
      maxRetries: 1,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
      httpOptions : {
        timeout: 60000
      }
    }));
};
