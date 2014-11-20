module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower_concat: {
            prod: {
                dependencies: {
                    'angular': 'jquery'
                },
                dest: 'static/build/bower.min.js',
                exclude : ['font-awesome']
                , callback: function(mainFiles, component) {
                    return grunt.util._.map(mainFiles, function(filepath) {
                        // Use minified files if available
                        var min = filepath.replace(/\.js$/, '.min.js');
                        return grunt.file.exists(min) ? min : filepath;
                    });
                }


            },
            dev: {
                dependencies: {
                    'angular': 'jquery'
                },
                dest: 'static/build/bower.js',
                exclude : ['font-awesome']
            }

        },

        less: {
            development: {
                options: {
                    paths: ["assets/css"]
                },
                files: {
                    "static/build/dev.css" : "static/css/dev.less"
                }
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    "static/build/prod.css" : "static/css/style.less"
                }
            }
        },
        watch: {
            files: "./static/css/*",
            tasks: ["less"]
        },
        mainFiles: {
            'font-awesome': ''
         },
        uglify: {
            options: {
                mangle: false
            },
            build: {
                src: ['static/js/app/*.js', 'static/js/app/services/*.js', 'static/js/app/directives/*.js', 'static/js/app/controllers/*.js'],
                dest: 'static/build/app.min.js'
            }
        },
        processhtml : {
            deploy: {
                options: {
                    process: true
                },
                files: {
                    'static/build/index.html': ['static/html/main.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-concat');
    // Default task(s).
    grunt.registerTask('default', ['bower_concat', "uglify", "less", "processhtml"]);

};