module.exports = function (grunt) {

	grunt.initConfig({
		uglify: {
			my_target: {
				files: {
					'es6-promise.js': ['js/lib/es6-promise.js', 'js/lib/es6-promise.js'],
					'gmaps.js': ['js/lib/gmaps.js', 'js/lib/gmaps.js'],
					'oauth2.js': ['js/lib/oauth2.js', 'js/lib/oauth2.js']
				}
			}
		},
		cssnano: {
			options: {
				sourcemap: true
			},
			dist: {
				files: {
					'css/normalize.css': 'css/normalize.css'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-cssnano');
	grunt.registerTask('default', ['cssnano', 'uglify']);
};
