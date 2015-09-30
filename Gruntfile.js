module.exports = function (grunt) {
  grunt.initConfig({
    shipit: {
      options: {
        workspace: '/tmp/railworld-www',
        deployTo: '~/apps/railworld-www',
        repositoryUrl: 'https://github.com/Neschur/railworld-www.git',
        ignores: ['.git', 'node_modules', 'public/maps'],
        keepReleases: 2,
        shallowClone: true
      },
      staging: {
        servers: 'deployer@siarhei.by'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shipit');
  grunt.loadNpmTasks('shipit-deploy');

  grunt.registerTask('pwd', function () {
    grunt.shipit.remote('pwd', this.async());
  });
};