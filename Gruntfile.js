/*
 * grunt-restrict
 * https://github.com/ichernev/grunt-restrict
 *
 * Copyright (c) 2013 Iskren Chernev
 * Licensed under the Apache-2.0 license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    task: {
      single_src_single_dest: {
        src: ['test/fixtures/first.js'],
        dest: 'tmp/single_src_single_dest.js'
      },
      multi_src_single_dest: {
        src: ['test/fixtures/first.js', 'test/fixtures/second.js'],
        dest: 'tmp/multi_src_single_dest.js'
      },
      files_hash: {
        files: {
          'tmp/files_hash_first.js': 'test/fixtures/first.js',
          'tmp/files_hash_second.js': 'test/fixtures/second.js'
        }
      },
      files_array: {
        files: [
          {'tmp/files_array_first.js': 'test/fixtures/first.js'},
          {dest: 'tmp/files_array_second.js', src: 'test/fixtures/second.js'}
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      plain_task: ['test/plain_task_test.js'],
      unit: ['test/handlers.js'],
      restrict_task_nofile_test: ['test/restrict_task_nofile_test.js'],
      restrict_task_firstfile_test: ['test/restrict_task_firstfile_test.js'],
      restrict_task_firstsecondfile_test: ['test/restrict_task_firstsecondfile_test.js'],
      restrict_task_files_hash_nofile_test: ['test/restrict_task_files_hash_nofile_test.js'],
      restrict_task_nomatch_test: ['test/restrict_task_nomatch_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', [
    'clean',
    'option:file',
    'task',
    'nodeunit:plain_task',

    'clean',
    'option:file',
    'restrict:task',
    'nodeunit:restrict_task_nofile_test',

    'clean',
    'option:file:test/fixtures/first.js',
    'restrict:task',
    'nodeunit:restrict_task_firstfile_test',

    'clean',
    'option:file:test/fixtures/first.js,test/fixtures/second.js',
    'restrict:task',
    'nodeunit:restrict_task_firstsecondfile_test',

    'clean',
    'option:file',
    'restrict:task:files_hash',
    'nodeunit:restrict_task_files_hash_nofile_test',

    'clean',
    'option:file:test/fixtures/f.js',
    'restrict:task',
    'nodeunit:restrict_task_nomatch_test',

    'nodeunit:unit',
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);


  grunt.registerMultiTask('task', 'A sample task for testing restrict', function() {
    this.files.forEach(function(file) {
      grunt.file.write(file.dest, 'OK\n');
    });
  });

  grunt.registerTask('option', 'set values in grunt.config', function(key, value) {
    console.log("setting " + key + " to " + value);
    grunt.option(key, value);
  });
};
