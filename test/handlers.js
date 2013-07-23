'use strict';

var grunt = require('grunt');
var restrict = require('../tasks/restrict');
var EventEmitter = require('events').EventEmitter;

exports.registerHandlers = {
  "watch event adds --file on first change": function(test) {
    test.expect(2);

    var gruntStub = {
      event: new EventEmitter()
    }, config = function(path, val) {
      test.deepEqual(path, ['watch', 'options', 'cliArgs']);
      test.deepEqual(val, ['--file', 'foo.js']);
      test.done();
    };
    config.get = function() {
      return null;
    };
    gruntStub.config = config;

    restrict.registerHandlers(gruntStub);
    gruntStub.event.emit('watch', 'change', 'foo.js');
  },

  "watch event appends to --file additional changes": function(test) {
    test.expect(2);

    var gruntStub = {
      event: new EventEmitter()
    }, config = function(path, val) {
      test.deepEqual(path, ['watch', 'options', 'cliArgs']);
      test.deepEqual(val, ['--file', 'foo.js,bar.js']);
      test.done();
    };
    config.get = function() {
      return ['--file', 'foo.js'];
    };
    gruntStub.config = config;

    restrict.registerHandlers(gruntStub);
    gruntStub.event.emit('watch', 'change', 'bar.js');
  },

  "watch-post-run clears cliArgs": function(test) {
    test.expect(2);

    var gruntStub = {
      event: new EventEmitter(),
      config: function(path, val) {
        test.deepEqual(path, ['watch', 'options', 'cliArgs']);
        test.equal(val, null);
        test.done();
      }
    };

    restrict.registerHandlers(gruntStub);
    gruntStub.event.emit('watch-post-run');
  }
};
