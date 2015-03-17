// =======================
// export config
// =======================

module.exports = function (config) {

	config.set({
		plugins : ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage'],
		// base path, that will be used to resolve files and exclude
		basePath: '.',

		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'app/scripts/polyfills/*.js',
			'app/scripts/missing.js',
			'app/configuration/*.js',
			'app/scripts/*Model.js',
			'app/scripts/*Ctrl.js',
			'app/scripts/app.js',
			'app/tests/*.js'
		],

		// list of files to exclude
		exclude: [],

		// test results reporter to use
		// CLI --reporters progress
		reporters: ['progress', 'coverage'],


		preprocessors: {
			'app/configuration/*.js': 'coverage',
			'app/scripts/**/*.js': 'coverage'
		},

		coverageReporter: {
			type: 'html',
			dir: "doc/karma-coverage"
		},

		// web server port
		port: 8181,

		// cli runner port
		runnerPort: 9100,
		colors: true,
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		// CLI --browsers Chrome,Firefox,Safari
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 30000, // change from 5 to 10 second for IE :(

		singleRun: true
	});
};