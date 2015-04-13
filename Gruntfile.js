var _ = require('underscore');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["tmp", "dist"],
    copy: {
      main: {
        expand: true,
        src: ['screenshots/**', 'global.json', 'global-forms.json'],
        dest: 'tmp/'}
    },
    compress: {
      main: {
        options: {
          archive: 'dist/fh-template-apps-<%= pkg.version %>.tar.gz',
          mode: 'tgz'
        },
        expand: true,
        cwd: 'tmp/',
        src: ['**/*']
      }
    },
    clone: ["global.json", 'global-forms.json']
  });

  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');

  function cloneAppTemplates(filepath) {
    grunt.config.set('gitclone', {});
    var globalJson = grunt.file.readJSON(filepath);
    var appTemplates = globalJson.show.appTemplates;

    _.each(globalJson.show.projectTemplates, function (projTemplate) {
      _.each(projTemplate.appTemplates, function (appTemplate) {
        if (appTemplate.repoUrl !== undefined) {
          appTemplates.push(appTemplate);
        }
      });
    });

    _.each(globalJson.show.connectorTemplates, function (connectorTemplates) {
      _.each(connectorTemplates.appTemplates, function (appTemplate) {
        if (appTemplate.repoUrl !== undefined) {
          appTemplates.push(appTemplate);
        }
      });
    });

    _.each(appTemplates, function (appTemplate) {
      prefix = 'gitclone.' + appTemplate.id + '.options';
      grunt.config.set(prefix + '.directory', 'tmp/' + appTemplate.id);
      grunt.config.set(prefix + '.repository', appTemplate.repoUrl);
      grunt.config.set(prefix + '.branch', appTemplate.repoBranch.split('/').pop());
      grunt.config.set(prefix + '.depth', 1);
    });

    var totalRepos = _.keys(grunt.config.get('gitclone')).length;
    if (totalRepos > 0) {
      grunt.log.ok('Cloning ' + totalRepos + ' ' + grunt.util.pluralize(totalRepos, 'repo/repos') + ' from ' + appTemplates.length + ' ' + grunt.util.pluralize(appTemplates.length, 'app/apps') + ' defined in ' + filepath);
      grunt.task.run('gitclone')
    } else {
      grunt.log.ok('No apps defined in ' + filepath);
    }
  }

  grunt.registerMultiTask('clone', 'Clone all defined app repos', function () {
    this.filesSrc.forEach(function (filepath) {
      cloneAppTemplates(filepath);
    });
  });

  grunt.registerTask('archive', ['clean', 'clone', 'copy', 'compress']);
  grunt.registerTask('default', ['archive']);

};