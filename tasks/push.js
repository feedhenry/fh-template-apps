
'use strict';

module.exports = function(grunt) {

  var templateHelper = require('./lib/templateHelper').init(grunt);
  var _ = require('underscore');

  function pushAppTemplates(filepath, branch) {
    grunt.config.set('gitpush', {});

    var globalJson = grunt.file.readJSON(filepath);

    templateHelper.walkObjects(globalJson.show, function (obj) {
      var prefix = 'gitpush.' + obj.id + '.options';
      if (_.has(obj, 'repoUrl') && _.has(obj, 'repoBranch')) {
        grunt.config.set(prefix + '.branch', branch);
        grunt.config.set(prefix + '.tags', true);
        grunt.config.set(prefix + '.cwd', 'tmp/' + obj.id);
      }
    });
    if (_.isEmpty(grunt.config.get('gitpush'))) {
      grunt.log.ok("No git apps defined in " + filepath);
    } else {
      grunt.task.run('gitpush');
    }
  }

  grunt.registerMultiTask('push', 'Push branch and tags on all defined app repos', function () {
    var branch = grunt.option('git-branch') || null;
    this.filesSrc.forEach(function (filepath) {
      pushAppTemplates(filepath, branch);
    });
  });

};
