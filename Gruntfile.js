module.exports = function (grunt) {

	// Project configuration ---------------------------------------------------
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		bower: {
			install: {
				options: {
					targetDir: '<%= pkg.directories.src.lib %>',
					layout: 'byComponent',
					install: true,
					verbose: false,
					cleanTargetDir: false,
					cleanBowerDir: false,
					bowerOptions: {}
				}
			}
		},
		concat: {
			css: {
				files: [
					{
						src: ['<%= pkg.directories.src.lib %>/*/*.css', '<%= pkg.directories.src.css %>/*.css'],
						dest: '<%= pkg.directories.dist.css %>/<%= pkg.fileNames.css %>.css'
					}
				]
			},
			js: {
				options: {
					separator: ';'
				},
				files: [
					{
						src: ['<%= pkg.directories.src.lib %>/*/*.js', '<%= pkg.directories.src.js %>/*.js'],
						dest: '<%= pkg.directories.dist.js %>/<%= pkg.fileNames.js %>.js'
					}
				]
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.title %> <%= grunt.template.today("yyyy-mm-dd") %> version: <%= pkg.version %> */\n'
			},
			dist: {
				src: '<%= pkg.directories.dist.js %>/<%= pkg.fileNames.js %>.js',
				dest: '<%= pkg.directories.dist.js %>/<%= pkg.fileNames.js %>.min.js'

			}
		},
		cssmin: {
			minify: {
				src: '<%= pkg.directories.dist.css %>/<%= pkg.fileNames.css %>.css',
				dest: '<%= pkg.directories.dist.css %>/<%= pkg.fileNames.css %>.min.css'
			}
		},
		copy: {
			dist: {
				files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.src.js %>',
                        src: ['**'],
                        dest: '<%= pkg.directories.dist.js %>'
                    },
					{
						expand: true,
						cwd: '<%= pkg.directories.src.lib %>',
						src: ['**'],
						dest: '<%= pkg.directories.dist.lib %>'
					},
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.src.css %>',
                        src: ['**'],
                        dest: '<%= pkg.directories.dist.css %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.src.html %>',
                        src: [ '*.html' ],
                        dest: '<%= pkg.directories.dist.html %>'
                    }
				]
			},
			deploy: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.directories.dist.js %>',
						src: ['**'],
						dest: '<%= pkg.directories.deploy.js %>'
					},
					{
						expand: true,
						cwd: '<%= pkg.directories.dist.lib %>',
						src: ['**'],
						dest: '<%= pkg.directories.deploy.lib %>'
					},
					{
						expand: true,
						cwd: '<%= pkg.directories.dist.css %>',
						src: ['**'],
						dest: '<%= pkg.directories.deploy.css %>'
					},
					{
						expand: true,
						cwd: '<%= pkg.directories.dist.images %>',
						src: ['**'],
						dest: '<%= pkg.directories.deploy.images %>'
					},
					{
						expand: true,
						cwd: '<%= pkg.directories.dist.html %>',
						src: [ '*.html' ],
						dest: '<%= pkg.directories.deploy.html %>'
					}
				]
			},
            demo: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.dist.js %>',
                        src: ['**'],
                        dest: '<%= pkg.directories.demo.js %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.dist.lib %>',
                        src: ['**'],
                        dest: '<%= pkg.directories.demo.lib %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.dist.css %>',
                        src: ['**'],
                        dest: '<%= pkg.directories.demo.css %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.src.images %>',
                        src: ['**'],
                        dest: '<%= pkg.directories.demo.images %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.templates %>',
                        src: ['README.html'],
                        dest: './'
                    },
                    {
                        expand: true,
                        src: ['LICENCE.txt'],
                        dest: '<%= pkg.directories.demo.root %>'
                    }
                ]
            }
		},
        markdown: {
            readme: {
                files: [
                    {
                        expand: true,
                        src: 'README.md',
                        dest: '<%= pkg.directories.templates %>',
                        ext: '.html'
                    }
                ],
                options: {
                    template: '<%= pkg.directories.templates %>/md-blank.html'
                }
            }
        },
        includes: {
            demo: {
                options: {
                    includePath: '<%= pkg.directories.templates %>'
                },
                files: [
                    {
                        cwd: '<%= pkg.directories.src.root %>',
                        src: 'demo.html', // Source files
                        dest: '<%= pkg.directories.demo.root %>/index.html' // Destination file
                    }
                ]
            }
        },
		watch: {
			js: {
				files: ['<%= pkg.directories.src.js %>/**/*.js' ],
				tasks: [ 'jshint' ],
				options: {
					debounceDelay: 250
				}
			},
			css: {
				files: ['<%= pkg.directories.src.css %>/**/*.css'],
				tasks: [ 'csslint' ],
				options: {
					debounceDelay: 250
				}
			},
			html: {
				files: ['<%= pkg.directories.src.root %>/**/*.html', '*.html', '<%= pkg.directories.templates %>/**/*.html', '<%= pkg.directories.test %>/**/*.html'],
				tasks: [ 'htmlhint' ],
				options: {
					debounceDelay: 250
				}
			},
			json: {
				files: '*.json',
				tasks: [ 'jsonlint' ],
				options: {
					debounceDelay: 250
				}
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: false,
				browser: true,
				globals: {
					jQuery: true
				}
			},
			files: {
				src: ['<%= pkg.directories.src.js %>/**/*.js']
			}
		},
		csslint: {
			options: {
				'important': false,
				'adjoining-classes': false,
				'known-properties': true,
				'box-sizing': false,
				'box-model': true,
				'overqualified-elements': true,
				'display-property-grouping': true,
				'bulletproof-font-face': true,
				'compatible-vendor-prefixes': true,
				'regex-selectors': true,
				'errors': true,
				'duplicate-background-images': true,
				'duplicate-properties': true,
				'empty-rules': true,
				'selector-max-approaching': true,
				'gradients': true,
				'fallback-colors': true,
				'font-sizes': true,
				'font-faces': true,
				'floats': true,
				'star-property-hack': true,
				'outline-none': true,
				'import': true,
				'ids': false,
				'underscore-property-hack': true,
				'rules-count': true,
				'qualified-headings': true,
				'selector-max': true,
				'shorthand': true,
				'text-indent': true,
				'unique-headings': true,
				'universal-selector': false,
				'unqualified-attributes': true,
				'vendor-prefix': true,
				'zero-units': true
				},
			strict: {
				options: {
					import: 2
				},
				src: ['<%= pkg.directories.src.css %>/**/*.css']
			},
			lax: {
      			options: {
      				import: false
      			},
      			src: ['<%= pkg.directories.src.css %>/**/*.css']
			}
		},
		htmlhint: {
			options: {
				'tag-pair': true
			},
			src: {
      			src: [ '<%= pkg.directories.src.root %>/*.html' ]
			},
			templates: {
				src: ['<%= pkg.directories.templates %>/**/*.html']
			},
			test: {
				src: ['<%= pkg.directories.test %>/**/*.html']
			},
			root: {
				src: [ '*.html' ]
			}
		},
		jsonlint: {
			root: {
				src: [ '*.json' ]
			}
		},
		shell: {
			watch: {
				command: 'start grunt watch',
				options: {
				async: true
				}
			}
		},
		modernizr: {
			dist: {
				// [REQUIRED] Path to the build you're using for development.
				"devFile": "remote",

				// [REQUIRED] Path to save out the built file.
				"outputFile": "<%= pkg.directories.src.lib %>/modernizr/modernizr-custom.js",

				// Based on default settings on http://modernizr.com/download/
				"extra": {
					"shiv": true,
					"printshiv": false,
					"load": true,
					"mq": true,
					"cssclasses": true
				},

				// Based on default settings on http://modernizr.com/download/
				"extensibility": {
					"addtest": false,
					"prefixed": false,
					"teststyles": true,
					"testprops": true,
					"testallprops": true,
					"hasevents": false,
					"prefixes": true,
					"domprefixes": true
				},

				// By default, source is uglified before saving
				"uglify": true,

				// Define any tests you want to implicitly include.
				"tests": [],

				// By default, this task will crawl your project for references to Modernizr tests.
				// Set to false to disable.
				"parseFiles": true,

				// When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
				// You can override this by defining a "files" array below.
				// "files" : {
				// "src": []
				// },

				// When parseFiles = true, matchCommunityTests = true will attempt to
				// match user-contributed tests.
				"matchCommunityTests": false,

				// Have custom Modernizr tests? Add paths to their location here.
				"customTests": []
			}
		},
        bump: {
            options: {
                files: [
                    'package.json',
                    'bower.json',
                    //'<%= pkg.directories.src.css %>/<%= pkg.fileNames.css %>.css',
                    '<%= pkg.directories.src.js %>/<%= pkg.fileNames.js %>.js',
                    //'<%= pkg.directories.dist.css %>/<%= pkg.fileNames.css %>.css',
                    '<%= pkg.directories.dist.js %>/<%= pkg.fileNames.js %>.js',
                    //'<%= pkg.directories.dist.css %>/<%= pkg.fileNames.css %>.min.css',
                    '<%= pkg.directories.dist.js %>/<%= pkg.fileNames.js %>.min.js',
                    //'<%= pkg.directories.demo.css %>/<%= pkg.fileNames.css %>.css',
                    '<%= pkg.directories.demo.js %>/<%= pkg.fileNames.js %>.js',
                    //'<%= pkg.directories.demo.css %>/<%= pkg.fileNames.css %>.min.css',
                    '<%= pkg.directories.demo.js %>/<%= pkg.fileNames.js %>.min.js',
                    '<%= pkg.directories.demo.root %>/index.html',
                    '<%= pkg.directories.templates %>/README.html',
                    'README.md',
                    'README.html'],
                commitFiles: [
                    'package.json',
                    'bower.json',
                    //'<%= pkg.directories.src.css %>/<%= pkg.fileNames.css %>.css',
                    '<%= pkg.directories.src.js %>/<%= pkg.fileNames.js %>.js',
                    //'<%= pkg.directories.dist.css %>/<%= pkg.fileNames.css %>.css',
                    '<%= pkg.directories.dist.js %>/<%= pkg.fileNames.js %>.js',
                    //'<%= pkg.directories.dist.css %>/<%= pkg.fileNames.css %>.min.css',
                    '<%= pkg.directories.dist.js %>/<%= pkg.fileNames.js %>.min.js',
                    //'<%= pkg.directories.demo.css %>/<%= pkg.fileNames.css %>.css',
                    '<%= pkg.directories.demo.js %>/<%= pkg.fileNames.js %>.js',
                    //'<%= pkg.directories.demo.css %>/<%= pkg.fileNames.css %>.min.css',
                    '<%= pkg.directories.demo.js %>/<%= pkg.fileNames.js %>.min.js',
                    '<%= pkg.directories.demo.root %>/index.html',
                    '<%= pkg.directories.templates %>/README.html',
                    'README.md',
                    'README.html'],
                push: false
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '<%= pkg.directories.src.root %>/*.html',
                        '<%= pkg.directories.src.js %>/*.js',
                        '<%= pkg.directories.src.css %>/*.css',
                        '<%= pkg.directories.src.lib %>/**/*',
                        '<%= pkg.directories.src.images %>/*'
                    ]
                },
                options: {
                    server: {
                        baseDir: '<%= pkg.directories.src.root %>',
                        index: '<%= pkg.fileNames.demo %>.html'
                    }
                }
            }
        }
	});
	// set the grunt force option
	grunt.option("force", true);

	// Load grunt tasksfrom NPM packages
	require( 'load-grunt-tasks' )( grunt );

	// Default task(s)
	grunt.registerTask( 'setup', [ 'bower', 'modernizr' ] );
	grunt.registerTask( 'lint', [ 'jshint', 'csslint:lax', 'htmlhint', 'jsonlint' ] );
	grunt.registerTask( 'concatenate', [ 'concat:js', 'concat:css' ] );
	grunt.registerTask( 'minify', [ 'uglify', 'cssmin' ] );
	grunt.registerTask( 'build', [ 'modernizr', 'copy:dist', 'minify' ] );
    grunt.registerTask( 'demo', [ 'build', 'markdown:readme', 'includes:demo', 'copy:demo' ] );
	grunt.registerTask( 'deploy', [ 'build', 'copy:deploy' ] );
	grunt.registerTask( 'default', [ 'shell:watch', 'lint' ] );

};
