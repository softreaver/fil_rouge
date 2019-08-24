'use strict';

const gulp                  = require('gulp');
const mergeStream           = require('merge-stream');
const cmd                   = require('child_process');

// Gulp plugins list
var plugins = {};
plugins.sass                = require('gulp-sass');
plugins.cssbeautify         = require('gulp-cssbeautify');
plugins.csso                = require('gulp-csso');
plugins.ts                  = require('gulp-typescript');
plugins.rename              = require('gulp-rename');
plugins.minimify            = require('gulp-minify');

// Paths
const SASS_SOURCES_CHAT     = 'game_chat/scss/*.scss';
const SASS_SOURCES_CLIENT   = 'game_client/src/Views/scss/*.scss';
const SASS_DEST_CHAT        = 'game_chat/css/';
const SASS_DEST_CLIENT      = 'game_client/dist/css/';
const TS_SOURCES_CHAT       = 'game_chat/src/**/*.ts';
const TS_SOURCES_CLIENT     = 'game_client/src/**/*.ts';
const TS_SOURCES_NODE       = 'game_node.js/src/**/*.ts';
const TS_DEST_CHAT          = 'game_chat/dist/js/';
const TS_DEST_CLIENT        = 'game_client/dist/js/';
const TS_DEST_NODE          = 'game_node.js/dist/js/';

const SASS_SOURCES          = [
    SASS_SOURCES_CHAT,
    SASS_SOURCES_CLIENT
];
const SASS_DEST             = [
    SASS_DEST_CHAT,
    SASS_DEST_CLIENT
];
const TS_SOURCES            = [
    TS_SOURCES_CHAT,
    TS_SOURCES_CLIENT,
    TS_SOURCES_NODE
];
const TS_DEST               = [
    TS_DEST_CHAT,
    TS_DEST_CLIENT,
    TS_DEST_NODE
];

// TypeScript compiler options
const REMOVE_COMMENTS       = true;
const ES_VERSION            = 'ES6';

function sass () {
    let stream = mergeStream();

    SASS_SOURCES.forEach(function (sassSource, index) {
        stream.add(
            gulp.src(sassSource)
                .pipe(plugins.sass().on('error', plugins.sass.logError))
                .pipe(plugins.cssbeautify({indent: '    '}))
                .pipe(gulp.dest(SASS_DEST[index]))
        );
    });

    return stream.isEmpty() ? '' : stream;
}

function min_css () {
    let stream = mergeStream();
        SASS_DEST.forEach(function (sassSource, index) {
            stream.add(
                gulp.src(sassSource + '/*.css')
                    .pipe(plugins.csso())
                    .pipe(gulp.dest(SASS_DEST[index]))
            );
    });
}

function sass_watch () {
    gulp.watch(SASS_SOURCES, sass);
}

function ts () {
    let stream = mergeStream();
    TS_SOURCES.forEach(function (tsSource, index) {
        stream.add(
            gulp.src(tsSource)
                .pipe(plugins.ts({
                    removeComments: REMOVE_COMMENTS,
                    target: ES_VERSION
                }))
                .pipe(gulp.dest(TS_DEST[index]))
        );
    });
    
    return stream.isEmpty() ? '' : stream;
}

function min_js () {
    let stream = mergeStream();
    TS_DEST.forEach(function (tsSource, index) {
        stream.add(
            gulp.src(tsSource + '/*.js')
                .pipe(plugins.minimify({ignoreFiles: ['.combo.js', '-min.js']}))
                .pipe(plugins.rename(function (path) {
                    path.basename += "-min";
                    path.extname = ".js";
                }))
                .pipe(gulp.dest(TS_DEST[index]))
        );
    });
    
    return stream.isEmpty() ? '' : stream;
}

function ts_watch () {
    gulp.watch(TS_SOURCES, ts);
}

function generate_doc (cb) {
    return cmd.exec('jsdoc $(find -name "*.ts") -d doc/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

gulp.task(sass);
gulp.task(min_css);
gulp.task(sass_watch);
gulp.task(ts);
gulp.task(min_js);
gulp.task(ts_watch);
gulp.task(generate_doc);

gulp.task('prod', gulp.series(sass, min_css, ts, min_js));
