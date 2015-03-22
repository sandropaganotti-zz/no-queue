module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        sass: {
            options: {
                sourceMap: true,
                includePaths: [
                    'node_modules/materialize-css/sass/'
                ]
            },
            dist: {
                files: {
                    'app/css/app.css': 'source/scss/app.scss'
                }
            }
        },
        
        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'app/js/app.js': [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/materialize-css/dist/js/materialize.js',
                        '.tmp/js/template.js',
                        'source/js/push.js',
                        'source/js/no-queue.js',
                        'source/js/app.js'
                    ]
                }   
            },
            sw: {
                files: {
                    'app/push-sw.js': [
                        'source/js/push-sw.js'    
                    ]
                }
            }
        },
        
        copy: {
            dist: {
                expand: true, 
                cwd:  'node_modules/materialize-css/dist/', 
                src:  'font/**', 
                dest: 'app'
            }
        },
        
        dot: {
            dist: {
                options: {
                    variable : 'tmpl',
                    root     : 'source/template'
                },                
                src: 'source/template/*.dot',
                dest: '.tmp/js/template.js'
            }
        },
        
        watch: {
            js: {
                files: ['source/js/*.js','source/template/*.dot'],
                tasks: ['dot','uglify:dist']
            },
            css: {
                files: ['source/scss/*.scss'],
                tasks: ['sass']
            }
        }

    });

    grunt.registerTask('default', ['copy', 'uglify:sw', 'watch']);
};

