
'use strict';

module.exports = function(grunt) {

  var templateHelper = require('./lib/templateHelper').init(grunt);
  var _ = require('underscore');

  function tagAppTemplates(filepath, tag) {
    grunt.config.set('gittag', {});

    var globalJson = grunt.file.readJSON(filepath);

    templateHelper.walkObjects(globalJson.show, function (obj) {
      var prefix = 'gittag.' + obj.id + '.options';
      if (_.has(obj, 'repoUrl') && _.has(obj, 'repoBranch')) {
        grunt.config.set(prefix + '.tag', tag);
        grunt.config.set(prefix + '.cwd', 'tmp/' + obj.id);
      }
    });
    if (_.isEmpty(grunt.config.get('gittag'))) {
      grunt.log.ok("No git apps defined in " + filepath);
    } else {
      grunt.task.run('gittag')
    }
  }

  grunt.registerMultiTask('tag', 'Tag all defined app repos', function () {
    var tag = grunt.option('git-tag');
    this.filesSrc.forEach(function (filepath) {
      tagAppTemplates(filepath, tag);
    });
  });

};