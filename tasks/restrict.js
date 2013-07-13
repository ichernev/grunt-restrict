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

module.exports = function(grunt) {
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
      console.log("restricted " + util.inspect(restricted, {showHidden: true, depth: null}));
      targets.forEach(function(target) {
        files = grunt.task.normalizeMultiTaskFiles(
            grunt.config([task, target]), task);
        files = _.select(files, function(file) {
          return _.any(file.src, function(f) {
            return f in restricted;
          });
        });
        config = grunt.config([task, target]);
        old_configs[task + ":" + target] = _.extend({}, grunt.config.getRaw([task, target]));
        delete config.src;
        delete config.dest;
        config.files = files;
        grunt.config([task, target], config);
      });
    }
    grunt.task.run(_(targets).map(function(target) {
      return "" + task + ":" + target;
    }).concat(['restrict:_restore']));
  });
};
