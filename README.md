# grunt-restrict

> Run grunt tasks on subset of their src files.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-restrict --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-restrict');
```

## The "restrict" task

### Overview
This task is intended to be used in conjunction with other multiTasks. Lets say
you're running coffee task with config similar to

```javascript
// Setup your tasks as usual
grunt.initConfig({
  coffee: {
    expand: true,
    cwd: 'src',
    src: ['**/*.coffee'],
    dest: 'build',
    ext: '.js'
  },

  // (grunt-contrib-)watch task is optional
  watch: {
    coffee: {
      files: ['**/*.coffee'],
      tasks: ['restrict:coffee'],
    }
  }
})

// Use this if you use grunt-contrib-watch
require('grunt-restrict/tasks/restrict').registerHandlers(grunt);
```

And you want to run the coffee task only on `src/foo.coffee`. Then use

```shell
grunt restrict:coffee --file src/foo.coffee
```

### Options

Currently only the `--file` command line option is supported. If you need to
pass multiple files, use a comma, like

```shell
grunt restrict:coffee --file src/foo.coffee,src/bar.coffee
```

### Disclaimer

This is in early stages of development, and its only verified to work with
coffee grunt task. All multi tasks that support standart grunt file passing
should also work, given that all source files are specified in the gruntfile
for all target files.

For targets like requirejs and sass, where source files can include other
source files it won't work, but I'm accepting patches.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code using [Grunt](http://gruntjs.com/).

## Release History
* 0.2.0 Simple detection for source-only tasks, provide watch event handlers
* 0.1.1 Removed extra console.log
* 0.1.0 Initial commit
