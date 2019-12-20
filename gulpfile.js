'use strict';

const gulp = require('gulp');
const mergeStream = require('merge-stream');
const cmd = require('child_process');
const fs = require('fs');

// Gulp plugins list
var plugins = {};
plugins.sass = require('gulp-sass');
plugins.cssbeautify = require('gulp-cssbeautify');
plugins.csso = require('gulp-csso');
plugins.ts = require('gulp-typescript');
plugins.rename = require('gulp-rename');
plugins.minimify = require('gulp-minify');
plugins.readFile = require('read-vinyl-file-stream');
plugins.source = require('vinyl-source-stream');
plugins.path = require('path');

// Paths
const TMP_COMPIL_PATH = './test_fmk';   // The path where compiled files are stored before they go into the dist folder
const SASS_SOURCES_CHAT = 'game_chat/scss/*.scss';
const SASS_SOURCES_CLIENT = 'game_client/src/Views/scss/*.scss';
const SASS_DEST_CHAT = 'game_chat/css/';
const SASS_DEST_CLIENT = 'game_client/dist/css/';
const TS_SOURCES_CHAT = 'game_chat/src/**/*.ts';
const TS_SOURCES_CLIENT = 'game_client/src/**/*.ts';
const TS_SOURCES_NODE = 'game_node.js/src/**/*.ts';
const TS_DEST_CHAT = 'game_chat/dist/js/';
const TS_DEST_CLIENT = 'game_client/dist/js/';
const TS_DEST_NODE = 'game_node.js/dist/js/';

const SASS_SOURCES = [
    SASS_SOURCES_CHAT,
    SASS_SOURCES_CLIENT
];
const SASS_DEST = [
    SASS_DEST_CHAT,
    SASS_DEST_CLIENT
];
const TS_SOURCES = [
    TS_SOURCES_CHAT,
    TS_SOURCES_CLIENT,
    TS_SOURCES_NODE
];
const TS_DEST = [
    TS_DEST_CHAT,
    TS_DEST_CLIENT,
    TS_DEST_NODE
];

const GLOBAL_FILE_NAME = 'GlobalTest';
const FACTORY_FILE_NAME = 'FactoryTest';

// TypeScript compiler options
const REMOVE_COMMENTS = true;
const ES_VERSION = 'ES6';

// Shared buffer
var buffer = {};

function sass() {
    let stream = mergeStream();

    SASS_SOURCES.forEach(function (sassSource, index) {
        stream.add(
            gulp.src(sassSource)
                .pipe(plugins.sass().on('error', plugins.sass.logError))
                .pipe(plugins.cssbeautify({ indent: '    ' }))
                .pipe(gulp.dest(SASS_DEST[index]))
        );
    });

    return stream.isEmpty() ? '' : stream;
}

function min_css() {
    let stream = mergeStream();
    SASS_DEST.forEach(function (sassSource, index) {
        stream.add(
            gulp.src(sassSource + '/*.css')
                .pipe(plugins.csso())
                .pipe(gulp.dest(SASS_DEST[index]))
        );
    });
}

function sass_watch() {
    gulp.watch(SASS_SOURCES, sass);
}

function ts() {
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

function min_js() {
    let stream = mergeStream();
    TS_DEST.forEach(function (tsSource, index) {
        stream.add(
            gulp.src(tsSource + '/*.js')
                .pipe(plugins.minimify({ ignoreFiles: ['.combo.js', '-min.js'] }))
                .pipe(plugins.rename(function (path) {
                    path.basename += "-min";
                    path.extname = ".js";
                }))
                .pipe(gulp.dest(TS_DEST[index]))
        );
    });

    return stream.isEmpty() ? '' : stream;
}

function ts_watch() {
    gulp.watch(TS_SOURCES, ts);
}

function generate_doc(cb) {
    return cmd.exec('jsdoc $(find -name "*.ts") -d doc/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

function generate_global() {
    buffer.tags = [];

    console.log('Generating Global file...');

    let gulpStream = gulp.src('./game_node.js/src/global.json')
        .pipe(plugins.readFile(function (content, file, stream, cb) {
            let generatedContent = '"use strict";\n\nexport abstract class Global {\n';
            try {
                buffer.globalConfig = JSON.parse(content);
                for (let entity in buffer.globalConfig) {
                    let rValue;
                    switch (buffer.globalConfig[entity].type) {
                        case "node.js":
                            let sources = buffer.globalConfig[entity].source.split('.');
                            let source = sources.shift();
                            let additionalSources = (sources.length > 0) ?
                                `.${sources.join('.')}` :
                                '';
                            rValue = `require('${source}')${additionalSources}`;
                            break;
                        case "json":
                            rValue = fs.readFileSync('./game_node.js/src/' + buffer.globalConfig[entity].source);
                            //Check JSON format
                            JSON.parse(rValue);
                            rValue = `JSON.parse('${ String(rValue).replace(/(\n|\r\n)/g, '') }')`;
                            break;
                        case "value":
                            rValue = buffer.globalConfig[entity].source;
                            if (typeof rValue === 'string') {
                                rValue = `"${rValue}"`;
                            }
                            break;
                        default:
                            throw new Error(`the type ${buffer.globalConfig[entity].type} does not exist for the entity ${entity}`);
                    }
                    generatedContent += `\tpublic static readonly ${entity} = ${rValue};\n`;
                }

                generatedContent += '}\n';
            } catch (error) {
                throw new Error(`An error occurs while parsing global.json file : ${(error.message || error)}`)
            }
            cb(null, generatedContent);
        }))
        .pipe(plugins.rename(function (path) {
            path.basename = GLOBAL_FILE_NAME;
            path.extname = ".ts";
        }))
        .pipe(gulp.dest(TMP_COMPIL_PATH));

    console.log('End of Global generation');
    return gulpStream;
}

function extract_entities() {
    console.log('Searching entities definition...');
    // Extracts wiring symbols and corresponding class name
    let symbolsExtarctorRegex = new RegExp(/\*\s*?§(.+?)(?:\r\n|\n)+(?:.*\/)(?:\r\n|\n)(?:\w+\s+)*class\s+(\w+)/, 'g');

    buffer.entities = {};

    let gulpStream = gulp.src('./game_node.js/src/**/*.ts')
        .pipe(plugins.readFile(function (content, file, stream, cb) {
            let match;
            while (match = symbolsExtarctorRegex.exec(content)) {
                let entityExtracted = match[1].replace(/\s/g, '');
                // Entities must be unique
                if (buffer.entities[entityExtracted]) {
                    throw new Error(`Error in the file ${_extractFileNameFromFD(file)} ! The entity ${match[1]} already exists in the file ${buffer.entities[match[1]].fileName}`);
                }
                buffer.entities[entityExtracted] = {
                    className: match[2],
                    fileName: _extractFileNameFromFD(file),
                    fullPath: file.history.toString()
                };
            }
            cb();
        }));

    console.log('End of entities definition research');
    return gulpStream;
}

function generate_factory() {
    console.log('Start Factory generation...');
    let stream = plugins.source(FACTORY_FILE_NAME + '.ts');
    let generatedContent = '"use strict";\n\n';

    // Import all needed entities
    for (let entity in buffer.entities) {
        generatedContent += `import { ${buffer.entities[entity].className} } from "./${buffer.entities[entity].fileName.replace(/(\..*)$/, '')}";\n`;
    }
    generatedContent += '\nexport abstract class Factory {\n';
    // Create getters
    for (let entity in buffer.entities) {
        // Clean entityName by removing @ and ! characters
        let entityName = _cleanUpEntityName(entity);
        generatedContent += `\tpublic static get${entityName} () {\n`;

        // If entity is a singleton use getInstance() method instead of constructor
        if (_isSingleton(entity)) {
            generatedContent += `\t\treturn ${buffer.entities[entity].className}.getInstance();\n`;
        } else {
            generatedContent += `\t\treturn new ${buffer.entities[entity].className}();\n`;
        }
        generatedContent += `\t}\n`;
    }
    generatedContent += '}\n';

    stream.end(generatedContent);
    stream.pipe(gulp.dest(TMP_COMPIL_PATH));

    console.log('End of Factory generation');
    return stream;
}

function _isSingleton(entityName) {
    // If entity has exclamation point in the name it is a singleton
    let exclamCheck = new RegExp(/!/);
    let ret = false;
    if (exclamCheck.exec(entityName)) {
        ret = true;
    }
    return ret;
}

function _cleanUpEntityName(entityName) {
    entityName = entityName.replace('@', '');
    entityName = entityName.replace('!', '');

    return entityName;
}

function inject_entities() {
    console.log('Start entities injections...');
    // Search for injection symbols
    let injectionSymbolsRegex = new RegExp(/class.*\{.*\*\s*?§(.+?)(?:\r\n|\n)+(?:.*\/).*?(\w+)(?:;|$)/, 'gsm');
    let constructorInjectionRegex = new RegExp(/.+?=\s*(?:\/\*\*\s*§(.+?)\*\/)+/, 'g');

    buffer.injections = {};

    let gulpStream = gulp.src('./game_node.js/src/**/*.ts')
        .pipe(plugins.readFile(function (content, file, stream, cb) {
            let match;
            let newContent = content;
            let mustImportFactory = false;
            let mustImportGlobal = false;

            console.log(`${_extractFileNameFromFD(file)} treated ...`);

            while (match = injectionSymbolsRegex.exec(content)) {
                mustImportFactory = true;
                newContent = _editClassAttribute(buffer, newContent, match, file);
            }
            while (match = constructorInjectionRegex.exec(content)) {
                mustImportFactory = true;
                newContent = _editConstructorParams(buffer, newContent, match, file);
            }

            // Inject Factory import if needed
            if (mustImportFactory) {
                let fileName = _extractFileNameFromFD(file);
                let pathToFactory = fileName.replace(/\/\w+\//g, '/../')
                    .replace(/\/\w+\.\w+$/, '/Factory')
                    .replace(/^\//, '');
                let factoryImportStr = 'import { Factory } from "' + pathToFactory + '";';

                if (/"use strict"/.exec(newContent)) {
                    newContent = newContent.replace(/"use strict";?/, `"use strict";\n${factoryImportStr}\n`);
                } else {
                    newContent = `${factoryImportStr}\n\n${newContent}`;
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
                    newContent = newContent.replace(/"use strict";?/, `"use strict";\n${globalImportStr}\n`);
                } else {
                    newContent = `${globalImportStr}\n\n${newContent}`;
                }
            }
            if (!mustImportFactory && !mustImportGlobal) {
                console.log('Nothing to do for this file');
            }

            console.log('\n');

            cb(null, newContent);
        }))
        .pipe(gulp.dest(TMP_COMPIL_PATH));

    console.log('End of entities injections.');
    return gulpStream;
}

function _extractFileNameFromFD(fd) {
    return fd.history.toString().substring(fd._base.length);
}

function _editClassAttribute(sharedBuffer, newContent, match, file) {
    let entityToInject = match[1].replace(/\s/g, '');
    let variableToInit = match[2];

    // Entities must exists
    if (!sharedBuffer.entities[entityToInject]) {
        throw new Error(`Error in the file ${_extractFileNameFromFD(file)} ! The entity ${entityToInject} does not exist !`);
    }
    let tail = '';
    let indexOf = variableToInit.indexOf(';');
    if (indexOf !== -1) {
        tail = variableToInit.substring(indexOf);
    }
    let newValue = variableToInit;
    if (indexOf !== -1) { newValue = newValue.replace(/;/g, ''); }
    newValue += ` = Factory.get${entityToInject.replace(/@/g, '')}()` + tail;
    newContent = newContent.replace(variableToInit, newValue);

    console.log(`==>> ${entityToInject} was injected in the class`);

    return newContent;
}

function _editConstructorParams(sharedBuffer, newContent, match, file) {
    let entityToInject = match[1].replace(/\s/g, '');
    // Entities must exists
    if (!sharedBuffer.entities[entityToInject]) {
        throw new Error(`Error in the file ${_extractFileNameFromFD(file)} ! The entity ${entityToInject} does not exist !`);
    }

    let newValue = ` = Factory.get${entityToInject.replace(/@/g, '')}()`;
    newContent = newContent.replace(/\/\*\*\s*§\s*@?\s*\w+\s*\*\//g, newValue);

    console.log(`==>> ${entityToInject} was injected in the constructor`);

    return newContent;
}

function _cleanUpTmp(path) {
    path = path || TMP_COMPIL_PATH;
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = plugins.path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                _cleanUpTmp(curPath);
            } else { // delete file
                console.log('RM file ' + curPath)
                fs.unlinkSync(curPath);
            }
        });
        console.log('RM folder ' + path)
        fs.rmdirSync(path);
    }
}

gulp.task(sass);
gulp.task(min_css);
gulp.task(sass_watch);
gulp.task(ts);
gulp.task(min_js);
gulp.task(ts_watch);
gulp.task(generate_doc);
gulp.task(generate_global);
gulp.task(extract_entities);
gulp.task(generate_factory);
gulp.task(inject_entities);
gulp.task('bringme', gulp.series(function(done) {
        _cleanUpTmp();
        done();
    }, generate_global, extract_entities, generate_factory, inject_entities, function(done) {
        if (process.argv.includes('--no-clean')) {
            console.log('No cleaning (tempory file is ' + TMP_COMPIL_PATH + ')');
        } else {
            console.log('Cleaning up tempory files...');
            _cleanUpTmp();
        }
        done();   
    })
);
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
