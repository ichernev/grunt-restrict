'use strict';

var grunt = require('grunt');

exports.plain_task = {
  all_files_created: function(test) {
    test.expect(1);
    test.deepEqual(grunt.file.expand('tmp/*.js'), [], "foo.js doesn't match any files");
    test.done();
  }
};
