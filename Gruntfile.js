/// <binding BeforeBuild='babel, default' ProjectOpened='watch' />

// above are the task runner explorer bindings. It's unclear if that line is enough
// to generate the bindings on its own or if more needs to be done in Visual Studio
// when moving project to a new environment

/*
 * NOTE: There is a bug with the node version in later versions of Visual Studio
 * When running this gruntfile, if you get a syntax error when loading a trusted 
 * package (such as babel), where you know no syntax error exists, then there is
 * likely an error with visual studio. Go to Tools->Options->Projects and Solutions->Web Package Management
 * and make sure $(PATH) is before $(VSINSTALLDIR) or $(VSInstalledExternalTools)
 * For more info see: https://developercommunity.visualstudio.com/content/problem/311553/task-runner-cant-load-gruntfilejs.html
 */


module.exports = function (grunt) {

    // used to load all grunt tasks. Replaces loadNpmTask at the bottom
    require("load-grunt-tasks")(grunt);

    const sass = require('node-sass');

    //grunt config, top level is name of task from npm, children are names of tasks to run
    // children of that are options and files, standard grunt format
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bootstrapdir: "./wwwroot/lib/bootstrap-4.3.1/",
        cssdir: "./wwwroot/css/",
        stylesdir: "./Styles/",
        jsdir: "./scripts/",
        jsproddir: "./wwwroot/js/",

        // Compile all .scss files from Styles to wwwroot/css
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= stylesdir %>',
                    src: ['**/*.scss'],
                    dest: '<%= cssdir %>',
                    ext: '.css'
                }]
            }
        },

        // minify all already compiled css files 
        cssmin: {
            task: {
                files: [{
                    expand: true,
                    cwd: '<%= cssdir %>',
                    src: ['*.css', '!*min.css'],
                    dest: '<%= cssdir %>',
                    ext: '.min.css'
                }]
            }
        },


        // js linter & style checker
        jshint: {
            skyserverFiles: {
                files: {
                    src: [
                        '<%= jsdir %>**/*.js',
                        'Gruntfile.js'
                    ]
                }
            },

            options: {
                esversion: 6
            }
        },


        // recompiles sass files on the fly for development
        watch: {
            sassFiles: {
                files: ['<%= stylesdir %>**/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: 35730,
                    interrupt: true,
                    livereload: true
                }
            },
            jsFiles: {
                files: ['<%= jsdir %>**/*.js'],
                tasks: ['uglify'],
                options: {
                    livereload: 35731,
                    interrupt: true,
                    livereload: true
                }
            }
        },

        // transpiler for javascript for old browser compatibility (.eg. transpiles from ES6 to ES5)
        // 20190613 bsouter "babel.js" throwing an error. not sure how or where.
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            dist: {
                files: {
                    '<%= jsproddir %>ImagingQuery.js': '<%= jsdir %>ImagingQuery.js'
                }
            }
        },

        uglify: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: '<%= jsdir %>',
                    src: '**/*.js',
                    dest: '<%= jsproddir %>'
                }]
            }
        }
    });

    //replaced by load-grunt-tasks at the top
    // Removed jshint for now... too many errors
    grunt.registerTask('default', ['sass', 'babel', 'cssmin', 'uglify']);
};