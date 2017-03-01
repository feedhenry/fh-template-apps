
'use strict';

module.exports = function(grunt) {

  var templateHelper = require('./lib/templateHelper').init(grunt);
  var _ = require('underscore');

  function branchAppTemplates(filepath, branch) {
    grunt.config.set('gitcheckout', {});

    var globalJson = grunt.file.readJSON(filepath);

    templateHelper.walkObjects(globalJson.show, function (obj) {
      var prefix = 'gitcheckout.' + obj.id + '.options';
      if (_.has(obj, 'repoUrl') && _.has(obj, 'repoBranch')) {
        grunt.config.set(prefix + '.branch', branch);
        grunt.config.set(prefix + '.create', true);
        grunt.config.set(prefix + '.cwd', 'tmp/' + obj.id);
      }
    });
    if (_.isEmpty(grunt.config.get('gitcheckout'))) {
      grunt.log.ok("No git apps defined in " + filepath);
    } else {
      grunt.task.run('gitcheckout')
    }
  }

  grunt.registerMultiTask('branch', 'Create a branch on all defined app repos', function () {
    var branch = grunt.option('git-branch');
    this.filesSrc.forEach(function (filepath) {
      branchAppTemplates(filepath, branch);
    });
  });

};
