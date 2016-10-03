var gulp = require("gulp");
var concat = require("gulp-concat");
var umd = require("gulp-umd");
var exec = require("child_process").execSync;

gulp.task('default', [
    'bundle',
    'jsdoc2markdown'
]);

gulp.task('bundle', function() {
    return gulp.src([
        'src/cachee.js',
        'src/request.js',
        'src/resource.js',
        'src/dom-parse.js'
    ]).
    pipe(concat('cachee.js')).
    pipe(umd({
        exports: function() {
            return 'cachee';
        },
        namespace: function() {
            return 'cachee';
        }
    })).
    pipe(gulp.dest('./'));
});

gulp.task('jsdoc2markdown',['bundle'] , function() {
    exec('node_modules/.bin/jsdoc2md ./cachee.js > API.md');
});