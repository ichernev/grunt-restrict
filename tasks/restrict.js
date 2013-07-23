/*
 * grunt-restrict
 * https://github.com/ichernev/grunt-restrict
 *
 * Copyright (c) 2013 Iskren Chernev
 * Licensed under the Apache-2.0 license.
 */

'use strict';

var util = require('util');
var isValidMultiTaskTarget = function(target) {
  return !/^_|^options$/.test(target);
};

var exported = function(grunt) {
  var _ = grunt.util._,
      old_configs = {};
  grunt.registerTask(
      'restrict',
      'execute a given task only on a subset of its files',
      function(task, target) {
    var config, file, files, restrict_to_files, restricted, targets, task_target;

    if (task === '_restore') {
      // Restore original config.
      for (task_target in old_configs) {
        config = old_configs[task_target];
        var task_target_parts = task_target.split(':');
        task = task_target_parts[0];
        target = task_target_parts[1];
        grunt.config([task, target], config);
      }
      old_configs = {};
      return;
    }
    if (!grunt.task._tasks[task].multi) {
      grunt.fail.fatal("restrict supports only multi tasks");
    }
    if (target != null) {
      targets = [target];
    } else {
      targets = _(Object.keys(grunt.config.getRaw(task) || {}))
          .filter(isValidMultiTaskTarget);
    }
    old_configs = {};
    if (grunt.option('file') != null) {
      restricted = {};
      (grunt.option('file') || '').split(',').forEach(function(file) {
        restricted[file] = true;
      });
      targets.forEach(function(target) {
        files = grunt.task.normalizeMultiTaskFiles(
            grunt.config([task, target]), task);
        config = grunt.config([task, target]);
        old_configs[task + ":" + target] = _.extend({}, grunt.config.getRaw([task, target]));
        // Check files format
        if (Array.isArray(config)) {
          // task: [list of files]
          // --> Change files. This task shouldn't have a destination.
          config = [].concat.apply([], _.map(files, function(file) {
            return _.filter(file.src, function(f) {
              return f in restricted;
            });
          }));
        } else {
          // task: {src: [...], dest: file, ...} OR {files: {...}, ...}
          // --> Change config.files (remove old .src & .dest)
          files = _.select(files, function(file) {
            return _.any(file.src, function(f) {
              return f in restricted;
            });
          });
          delete config.src;
          delete config.dest;
          config.files = files;
        }
        grunt.config([task, target], config);
      });
    }
    grunt.task.run(_(targets).map(function(target) {
      return "" + task + ":" + target;
    }).concat(['restrict:_restore']));
  });
};

exported.watchHandler = function(grunt) {
  return function(action, filepath) {
    var cliArgs = grunt.config.get(['watch', 'options', 'cliArgs']);
    if (cliArgs == null) {
      cliArgs = ['--file', filepath];
    } else {
      cliArgs[1] += ',' + filepath;
    }
    grunt.config(['watch', 'options', 'cliArgs'], cliArgs);
  };
};

exported.watchPostRunHandler = function(grunt) {
  return function() {
    grunt.config(['watch', 'options', 'cliArgs'], null);
  };
};

exported.registerHandlers = function(grunt) {
  grunt.event.on('watch', exported.watchHandler(grunt));
  grunt.event.on('watch-post-run', exported.watchPostRunHandler(grunt));
};

module.exports = exported;
