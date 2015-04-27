
'use strict';

module.exports = function(grunt) {

  var templateHelper = require('./lib/templateHelper').init(grunt);
  var _ = require('underscore');

  function cloneAppTemplates(filepath) {
    grunt.config.set('gitclone', {});

    var globalJson = grunt.file.readJSON(filepath);

    templateHelper.walkObjects(globalJson.show, function (obj) {
      var prefix = 'gitclone.' + obj.id + '.options';
      if (_.has(obj, 'repoUrl') && _.has(obj, 'repoBranch')) {
        grunt.config.set(prefix + '.directory', 'tmp/' + obj.id);
        grunt.config.set(prefix + '.repository', obj.repoUrl);
        grunt.config.set(prefix + '.branch', obj.repoBranch.split('/').pop());
        grunt.config.set(prefix + '.depth', 1);
      }
    });
    if (_.isEmpty(grunt.config.get('gitclone'))) {
      grunt.log.ok("No git apps defined in " + filepath);
    } else {
      grunt.task.run('gitclone')
    }
  }

  grunt.registerMultiTask('clone', 'Clone all defined app repos', function () {
    grunt.task.requires('copy');
    this.filesSrc.forEach(function (filepath) {
      cloneAppTemplates(filepath);
    });
  });

};