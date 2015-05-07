
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["tmp", "dist"],
    copy: {
      main: {
        expand: true,
        src: ['global.json', 'global-forms.json', 'CHANGELOG.md'],
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
        src: ['**/*', '**/.*']
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
  grunt.loadTasks('tasks');

  grunt.registerMultiTask('format', 'Correctly format json config files', function () {
    this.filesSrc.forEach(function (filepath) {
      var globalJson = grunt.file.readJSON(filepath);
      grunt.file.write(filepath, JSON.stringify(globalJson, null, '  '));
    });
  });

  grunt.registerTask('archive', ['clean', 'copy', 'clone', 'download', 'compress']);
  grunt.registerTask('default', ['archive']);

};