/**
 * Created by Miro on 17.11.2014.
 */
var gulp = require('gulp'),
    del = require('del'),
    bundle = require('gulp-bundle-assets'),
    inject = require('gulp-inject'),
    karma = require('gulp-karma'),
    liveReload = require('gulp-livereload');

function extractEnvironment(){
    return process.argv.indexOf('--prod') !== -1 ? 'prod' : 'dev';
}

// Bundle files
gulp.task('bundle', ['clean'], function() {
    var path = extractEnvironment();

    process.env.NODE_ENV = path === 'prod' ? 'production' : 'staging';

    return gulp.src('./bundle.config.js')
        .pipe(bundle({quietMode: true}))
        .pipe(gulp.dest('./bin/' + path));
});

// Deploy files
gulp.task('deploy', ['bundle'], function () {
    var path = extractEnvironment(),
        target = gulp.src('./bin/' + path + '/index.html'),
        sources = gulp.src(['./bin/' + path + '/*.js', './bin/' + path + '/*.css'], {read: false}),
        partials = gulp.src('./app/views/templates/*.html');

    return target
        .pipe(inject(sources, {relative: true}))
        .pipe(inject(partials, {
            starttag: '<!-- inject:template -->',
            transform: function (filepath, file) {
                var id = file.path.slice(file.base.length).replace(".html","");
                return '<script type="text/tmpl" id="' + id + '_template">' +
                    file.contents.toString('utf8') +
                '</script>';
            }
        }))
        .pipe(gulp.dest('./bin/' + path));
});

//Test
gulp.task('karma', function() {
    // Be sure to return the stream
    return gulp.src([])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});
gulp.task('karma:watch', function() {
    gulp.src([])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        }));
});

// Watch files
gulp.task('watch', function() {
    liveReload.listen();
    gulp.watch('./app/**', ['deploy']);
});

// Delete all files from public folder
gulp.task('clean:all', function (cb) {
    del([
        'bin/**'
    ], cb);
});
gulp.task('clean', function (cb) {
    del([
        'bin/' + extractEnvironment() +  '/**'
    ], cb);
});

gulp.task('default', ['clean:all']);