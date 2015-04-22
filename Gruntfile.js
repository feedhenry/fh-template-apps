var _ = require('underscore');
var path = require('path');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["tmp", "dist"],
    copy: {
      main: {
        expand: true,
        src: ['global.json', 'global-forms.json'],
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
    clone: ["tmp/global.json", 'tmp/global-forms.json'],
    download: ["tmp/global.json", 'tmp/global-forms.json'],
    format: ["global.json", 'global-forms.json']
  });

  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-curl');

  function walkObjects(obj, cb) {
    if (_.isArray(obj)) {
      _.each(obj, function (innerObj) {
        walkObjects(innerObj, cb);
      })
    } else {
      if (_.has(obj, 'projectTemplates')) {
        walkObjects(obj.projectTemplates, cb);
      }
      if (_.has(obj, 'appTemplates')) {
        walkObjects(obj.appTemplates, cb);
      }
      if (_.has(obj, 'connectorTemplates')) {
        walkObjects(obj.connectorTemplates, cb);
      }
      if (_.has(obj, 'id')) {
        cb(obj);
      }
    }
  }

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

    walkObjects(globalJson.show, function (obj) {
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
    grunt.file.write(filepath, JSON.stringify(globalJson, null, '  '));
  }

  function cloneAppTemplates(filepath) {
    grunt.config.set('gitclone', {});

    var globalJson = grunt.file.readJSON(filepath);

    walkObjects(globalJson.show, function (obj) {
      prefix = 'gitclone.' + obj.id + '.options';
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

  grunt.registerMultiTask('download', 'Download static files', function () {
    grunt.task.requires('copy');
    this.filesSrc.forEach(function (filepath) {
      downloadStaticFiles(filepath);
    });
  });

  grunt.registerMultiTask('format', 'Correctly format json config files', function () {
    this.filesSrc.forEach(function (filepath) {
      var globalJson = grunt.file.readJSON(filepath);
      grunt.file.write(filepath, JSON.stringify(globalJson, null, '  '));
    });
  });

  grunt.registerTask('archive', ['clean', 'copy', 'clone', 'download', 'compress']);
  grunt.registerTask('default', ['archive']);

};