'use strict';

var grunt = require('grunt');

exports.plain_task = {
  all_files_created: function(test) {
    test.expect(1);
    test.deepEqual(grunt.file.expand('tmp/*.js').sort(),
                   ['tmp/files_array_first.js',
                    'tmp/files_array_second.js',
                    'tmp/files_hash_first.js',
                    'tmp/files_hash_second.js',
                    'tmp/multi_src_single_dest.js',
                    'tmp/single_src_single_dest.js'
                   ].sort());
    test.done();
  }
};
