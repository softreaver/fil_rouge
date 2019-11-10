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
plugins.readFile            = require('read-vinyl-file-stream');

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

// Shared buffer
var buffer = {};

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

function generate_global () {
    let symbolsExtarctorRegex = new RegExp(/\*\s*?(§.+?(?:\r\n|\n))/, 'g');
    buffer.tags = [];

    let gulpStream = gulp.src('./game_node.js/src/**/*.ts')
    .pipe(plugins.readFile(function (content, file, stream, cb) {
        let match;
        while (match = symbolsExtarctorRegex.exec(content)) {
            let pattern = match[1];
            buffer.tags.concat(match[1]);
            console.log(match[1]);
        }
        cb();
    }))
    .pipe(gulp.dest('./test_fmk'));

    return gulpStream;
}

function generate_factory () {
    // Extracts wiring symbol and corresponding class name
    let symbolsExtarctorRegex = new RegExp(/\*\s*?§(.+?)(?:\r\n|\n)+(?:.*\/)(?:\r\n|\n)(?:\w+\s+)*class\s+(\w+)/, 'g');
    buffer.entities = {};

    let gulpStream = gulp.src('./game_node.js/src/**/*.ts')
    .pipe(plugins.readFile(function (content, file, stream, cb) {
        let match;
        let newContent = "";
        while (match = symbolsExtarctorRegex.exec(content)) {
            // Entities must be unique
            if (buffer.entities[match[1]]) {
                throw new Error(`Error in the file ${ _extractFileNameFromFD(file) } ! The entity ${ match[1] } already exists in the file ${ buffer.entities[match[1]].fileName }`);
            }
            buffer.entities[match[1]] = {
                className: match[2],
                fileName: _extractFileNameFromFD(file),
                fullPath: file.history.toString()
            };

        }
        if (newContent.length > 0) {
            content = newContent;
        }
        cb();
    }))
    .pipe(function () {
        console.warn(arguments);
    });

    return gulpStream;
}

function inject_entities () {
    generate_factory();

    // Search for injection symbols
    let injectionSymbolsRegex = new RegExp(/class.*\{.*\*\s*?§(.+?)(?:\r\n|\n)+(?:.*\/).*?(\w+)(?:;|$)/, 'gsm');
    let constructorInjectionRegex = new RegExp(/.+?=\s*(\/\*\*\s*§.+?\*\/)+/, 'g');
    buffer.injections = {};

    let gulpStream = gulp.src('./game_node.js/src/**/*.ts')
    .pipe(plugins.readFile(function (content, file, stream, cb) {
        let match;
        let newContent = content;
        let mustImportFactory = false;

        console.log(`Treating ${ _extractFileNameFromFD(file) } ...`);

        while (match = injectionSymbolsRegex.exec(content)) {
            mustImportFactory = true;
            newContent = _editStream(buffer, newContent, match, file);
        }
        while (match = constructorInjectionRegex.exec(content)) {
            mustImportFactory = true;
            newContent = _editStream(buffer, newContent, match, file);
        }

        // Inject Factory import if needed
        if (mustImportFactory) {
            let fileName = _extractFileNameFromFD(file);
            let pathToFactory = fileName.replace(/\/\w+\//g, '/../')
                                        .replace(/\/\w+\.\w+$/, '/Factory')
                                        .replace(/^\//, '');
            let factoryImportStr = 'import { Factory } from "' + pathToFactory + '";';

            if (/"use strict"/.exec(newContent)) {
                newContent = newContent.replace(/"use strict";?/, `"use strict";\n${ factoryImportStr }\n`);
            } else {
                newContent = `${ factoryImportStr }\n\n${ newContent }`;
            }
        }
        // Inject Global if needed
        if (mustImportGlobal) {
            let fileName = _extractFileNameFromFD(file);
            let pathToGlobal = fileName.replace(/\/\w+\//g, '/../')
                                    .replace(/\/\w+\.\w+$/, '/Global')
                                    .replace(/^\//, '');
            let globalImportStr = 'import { Global } from "' + pathToFactory + '";';

            if (/"use strict"/.exec(newContent)) {
                newContent = newContent.replace(/"use strict";?/, `"use strict";\n${ globalImportStr }\n`);
            } else {
                newContent = `${ globalImportStr }\n\n${ newContent }`;
            }
        }
        if (!mustImportFactory && !mustImportGlobal) {
            console.log('Nothing to do for this file');
        }

        console.log('\n');

        cb(null, newContent);
    }))
    .pipe(gulp.dest('./test_fmk'));

    return gulpStream;
}

function compil() {
    generate_global();
    generate_factory();
    inject_entities();
}

function _extractFileNameFromFD (fd) {
    return fd.history.toString().substring(fd._base.length);
}

function _editStream (sharedBuffer, newContent, match, file) {
    let entityToInject = match[1];
    let variableToInit = match[2];
    // Entities must exists
    if (!sharedBuffer.entities[entityToInject]) {
        throw new Error(`Error in the file ${ _extractFileNameFromFD(file) } ! The entity ${ entityToInject } does not exist !`);
    }
    let tail = '';
    let indexOf = variableToInit.indexOf(';');
    if (indexOf !== -1) {
        tail = variableToInit.substring(indexOf);
    }
    let newValue = variableToInit;
    if (indexOf !== -1) { newValue = newValue.replace(/;/g, ''); }
    newValue += ` = Factory.get${ entityToInject.replace(/@/g, '') }()` + tail;
    newContent = newContent.replace(variableToInit, newValue);
    
    console.log(`${ entityToInject } was injected in the file` );

    return newContent;
}

gulp.task(sass);
gulp.task(min_css);
gulp.task(sass_watch);
gulp.task(ts);
gulp.task(min_js);
gulp.task(ts_watch);
gulp.task(generate_doc);
gulp.task(generate_global);
gulp.task(generate_factory);
gulp.task(inject_entities);
gulp.task(compil);

gulp.task('prod', gulp.series(sass, min_css, ts, min_js));


// ||||||||||||| Multi fichier : 

// var gulp = require('gulp');
// var plugins = require('gulp-load-plugins')();

// function getTask(task) {
//     return require('./gulp-tasks/' + task)(gulp, plugins);
// }

// gulp.task('scripts', getTask('scripts'));
// gulp.task('sass', getTask('sass'));

// gulp.task('default', ['scripts', 'sass'], function () {
//     gulp.watch('src/js/**/*.js', ['scripts']);
//     gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
// });
