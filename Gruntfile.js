
/* eslint-disable no-unused-vars */

var grunt = require('grunt');
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');

module.exports = function () {
  var config = {
    pkg: grunt.file.readJSON('package.json')
  };

  /* -------------------------------------------- */
  /* rollup */

  config.rollup = {
    dist: {
      options: {
        format: 'iife',
        sourceMap: true,
        sourceMapFile: 'src/mumpitz.js',
        useStrict: true,
        plugins: function () {
          var arr = [];
          arr.push(babel({
            exclude: 'node_modules/**'
          }));
          return arr;
        }
      },
      files: [{
        dest: 'dist/mumpitz.js',
        src: 'src/mumpitz.js'
      }]
    }
  };

  /* -------------------------------------------- */
  /* concat */
  config.concat = {
    dist: {
      options: {
        separator: ';',
        sourceMap: true
      },
      src: [
        'node_modules/babel-polyfill/dist/polyfill.js',
        'dist/mumpitz.js'
      ],
      dest: 'dist/mumpitz.js'
    }
  };

  /* -------------------------------------------- */
  /* uglify */

  config.uglify = {
    dist: {
      options: {
        mangle: false,
        sourceMap: true
      },
      files: {
        'dist/mumpitz.min.js': ['dist/mumpitz.js']
      }
    }
  };

  /* -------------------------------------------- */
  /* compress */

  config.compress = {
    dist: {
      options: {
        mode: 'gzip'
      },
      expand: true,
      cwd: 'dist',
      src: [ '*.min.js' ],
      dest: 'dist',
      ext: '.min.js.gz'
    }
  };

  /* -------------------------------------------- */
  /* watch */

  config.watch = {
    scripts: {
      files: 'src/*.js',
      tasks: ['build-js'],
      options: {
        interrupt: true
      }
    }
  };

  /* -------------------------------------------- */

  grunt.initConfig(config);

  /* -------------------------------------------- */

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-rollup');

  grunt.registerTask('dist', ['rollup', 'concat', 'uglify', 'compress']);
  grunt.registerTask('default', ['dist']);
};
