/**
 * Created by Miro on 17.11.2014.
 */

var less = require('gulp-bundle-assets/node_modules/gulp-less'),
    lazyPipe = require('gulp-bundle-assets/node_modules/lazypipe'),
    gif = require('gulp-bundle-assets/node_modules/gulp-if');

function stringEndsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isLessFile(file) {
    return stringEndsWith(file.relative, 'less');
}

var styleTransforms = lazyPipe().pipe(function() {
        return gif(isLessFile, less());
    });

module.exports = {
    bundle: {
        bundle: {
            scripts: [
                './app/scripts/polyfills/*.js',
                './app/scripts/missing.js',
                './app/configuration/*.js',
                './app/scripts/*Model.js',
                './app/scripts/*Ctrl.js',
                './app/scripts/app.js'
            ],
            styles: [
                './app/styles/*.less',
                './app/styles/device_specific/*.less'
            ],
            options: {
                transforms: {
                    styles: styleTransforms
                },
                uglify: 'production',
                minCSS: 'production',
                rev: 'production'
            }
        }
    },
    copy: [
        {
            src: './app/styles/fonts/*.*',
            base: './app/styles/'
        },
        {
            src: './app/images/*.*',
            base: './app/'
        },
        {
            src: './app/views/*.*',
            base:'./app/views/'
        }
    ]
};