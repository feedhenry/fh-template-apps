
'use strict';

module.exports = function(grunt) {

  var templateHelper = require('./lib/templateHelper').init(grunt);
  var _ = require('underscore');
  var path = require('path');

  function addDownload(id, type, obj) {
    var url = _.isString(obj) ? obj : obj.url;
    if (url.match(/^http/)) {
      var downloadDir = 'tmp/static/' + id;
      var staticPath = 'static/' + id + '/' + path.basename(url);
      var prefix = 'curl-dir.' + id;
      var curlCfg = _.isUndefined(grunt.config.get(prefix)) ? {"src": [], "dest": downloadDir} : grunt.config.get(prefix);
      curlCfg.src.push(url);
      grunt.config.set(prefix, curlCfg);
      url = '/fhtemplateapps/' + staticPath;
    } else {
      grunt.verbose.write("Skipping " + url);
    }
    return _.isString(obj) ? url : {url: url};
  }

  function downloadStaticFiles(filepath) {
    grunt.config.set('curl-dir', {});

    var globalJson = grunt.file.readJSON(filepath);

    templateHelper.walkObjects(globalJson.show, function (obj) {
      _.each(['docs', 'screenshots', 'image'], function (key) {
        if (_.has(obj, key)) {
          var val = obj[key];
          if (_.isArray(val)) {
            var newArray = [];
            _.each(val, function (innerObj) {
              newArray.push(addDownload(obj.id, key, innerObj));
            });
            obj[key] = newArray;
          } else {
            obj[key] = addDownload(obj.id, key, val);
          }
        }
      });
    });
    if (_.isEmpty(grunt.config.get('curl-dir'))) {
      grunt.log.ok("No downloads defined in " + filepath);
    } else {
      grunt.task.run('curl-dir')
    }
    grunt.file.write(filepath, JSON.stringify(globalJson, null, '  ') + '\n');
  }

  grunt.registerMultiTask('download', 'Download static files', function () {
    grunt.task.requires('copy');
    this.filesSrc.forEach(function (filepath) {
      downloadStaticFiles(filepath);
    });
  });

};