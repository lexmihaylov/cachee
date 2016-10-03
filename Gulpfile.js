var gulp = require("gulp");
var concat = require("gulp-concat");
var umd = require("gulp-umd");
var uglify = require("gulp-uglifyjs");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var shell = require("gulp-shell");
var readFile = require("fs").readFileSync;

gulp.task('default', [
    'bundle',
    'minify',
    'jsdoc2markdown',
    'readme.md'
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

gulp.task('jsdoc2markdown',['bundle'] , shell.task([
    'node_modules/.bin/jsdoc2md ./cachee.js > API.md'
]));

gulp.task('readme.md', ['jsdoc2markdown'], function() {
    return gulp.src('templates/readme.template').
        pipe(replace('{{API-DOCS}}', readFile('API.md').toString())).
        pipe(rename('README.md')).
        pipe(gulp.dest('./'));
});


gulp.task('test', shell.task([
    'node-qunit-phantomjs tests/tests.html'
]));