var gulp = require("gulp");
var concat = require("gulp-concat");
var umd = require("gulp-umd");
var uglify = require("gulp-uglifyjs");
var rename = require("gulp-rename");
var exec = require("child_process").execSync;

gulp.task('default', [
    'bundle',
    'minify',
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

gulp.task('minify',['bundle'] , function() {
    return gulp.src('cachee.js').
        pipe(rename('cachee.min.js')).
        pipe(uglify()).
        pipe(gulp.dest('./'));
});

gulp.task('jsdoc2markdown',['bundle'] , function() {
    exec('node_modules/.bin/jsdoc2md ./cachee.js > API.md');
});

gulp.task('test', function() {
    console.log('No unit tests yet.');
});