
'use strict';

module.exports = function(grunt) {

  var templateHelper = require('./lib/templateHelper').init(grunt);
  var _ = require('underscore');

  function updateGitRefs(filepath, gitRef) {
    var globalJson = grunt.file.readJSON(filepath);

    templateHelper.walkObjects(globalJson.show, function (obj) {
      if (_.has(obj, 'repoUrl') && _.has(obj, 'repoBranch')) {
        obj.repoBranch = gitRef
      }
    });

    grunt.file.write(filepath, JSON.stringify(globalJson, null, '  ') + '\n');
  }

  grunt.registerMultiTask('gitrefs', 'Update files for a release', function () {
    var ref = grunt.option('git-ref');

    this.filesSrc.forEach(function (filepath) {
      updateGitRefs(filepath, ref);
    });
  });

};
