
'use strict';

module.exports = function(grunt) {

  var templateHelper = require('./lib/templateHelper').init(grunt);
  var _ = require('underscore');

  function cloneAppTemplates(filepath, cloneDepth) {
    grunt.config.set('gitclone', {});

    var globalJson = grunt.file.readJSON(filepath);

    templateHelper.walkObjects(globalJson.show, function (obj) {
      var prefix = 'gitclone.' + obj.id + '.options';
      if (_.has(obj, 'repoUrl') && _.has(obj, 'repoBranch')) {
        var repoUrl = obj.repoUrl.replace('git://github.com/','git@github.com:');
        grunt.config.set(prefix + '.directory', 'tmp/' + obj.id);
        grunt.config.set(prefix + '.repository', repoUrl);
        grunt.config.set(prefix + '.branch', obj.repoBranch.split('/').pop());
        grunt.config.set(prefix + '.depth', cloneDepth);
      }
    });
    if (_.isEmpty(grunt.config.get('gitclone'))) {
      grunt.log.ok("No git apps defined in " + filepath);
    } else {
      grunt.task.run('gitclone')
    }
  }

  grunt.registerMultiTask('clone', 'Clone all defined app repos', function () {
    var cloneDepth = grunt.option('clone-depth') || 1;
    this.filesSrc.forEach(function (filepath) {
      cloneAppTemplates(filepath, cloneDepth);
    });
  });

};