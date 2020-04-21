// @ts-nocheck

// Gulp functions
const { src, dest, parallel, series, watch, lastRun } = require('gulp');

// Utility Gulp modules
const through = require('through2');
const gulpIf  = require('gulp-if');

// Compilation Gulp plugins
const sourcemap = require('gulp-sourcemaps');
const ts        = require('gulp-typescript');
const terser    = require('gulp-terser');

// Check Gulp plugins
const mocha      = require('gulp-mocha');
const tslint     = require('gulp-tslint');
const { Linter } = require('tslint');

// Utility modules
const fs       = require('fs');
const del      = require('del');
const path     = require('path');
const { fork } = require('child_process');

// Settings
const paths = require('./paths');

/**
 * @param {string} string
 * @returns {string}
 */
function capitalize(string) {
    return `${string.substr(0, 1).toUpperCase()}${string.substr(1)}`;
}

function isValid(project) {
    return fs.statSync(paths.project(project)).isDirectory()
           && fs.existsSync(paths.packageJson(project));
}

const prefix = '@bitform/';

function fixPrefix(pkg) {
    if (pkg.startsWith(prefix))
        return pkg.substr(prefix.length);

    return pkg;
}

function isJavaScript(file) {
    return file.extname === '.js';
}

function flatten(array, result) {
    for (const element of array) {
        if (Array.isArray(element)) {
            flatten(element, result);
        } else {
            result.push(element);
        }
    }
}

function flat(array) {
    let result = [];
    flatten(array, result);
    return result;
}

// Function generators

function generateBuildFunction(displayName, projects) {
    let globs = [];
    for (let project of projects) {
        globs.push(paths.libGlob(project));
    }

    return function () {
        const project = ts.createProject(paths.tsconfig, { skipLibCheck: true });

        return src(globs, { since: lastRun(displayName), base: paths.root })
            .pipe(sourcemap.init({ loadMaps: true }))
            .pipe(project())
            .pipe(gulpIf(isJavaScript, terser({
                compress: {
                    ecma:   2018,
                    module: true,
                },
                mangle:   {
                    module: true,
                },
                ecma:     2018,
                module:   true,
            })))
            .pipe(through.obj(function (file, _, cb) {
                file.path = file.path.split(path.sep).map(part => part === 'lib' ? 'dist' : part).join(path.sep);

                cb(null, file);
            }))
            .pipe(gulpIf(isJavaScript, sourcemap.mapSources(function (sourcePath, file) {
                if (sourcePath.endsWith('.ts')) {
                    return path.relative(path.dirname(file.relative), sourcePath);
                }

                return sourcePath;
            })))
            .pipe(gulpIf(isJavaScript, sourcemap.write('.')))
            .pipe(dest(paths.root));
    };
}

function generateMochaFunction(name) {
    return function () {
        // noinspection JSValidateTypes
        process.env.TS_NODE_PROJECT = paths.tsconfig;

        return src(paths.testGlob(name))
            .pipe(mocha());
    };
}

function generateNycFunction(name) {
    return function (cb) {
        let nycBin   = path.join(require.resolve('nyc'), '..', require('nyc/package.json').bin.nyc);
        let mochaBin = path.join(require.resolve('mocha'), '..', 'bin', 'mocha');

        let nycArgs = [
            '--all',
            '--cache',
            `--include='${name === '*' ? paths.relativeAllLibGlob : paths.relativeLibGlob(name)}'`,
            '--reporter=clover', '--reporter=lcov', '--reporter=text-summary',
            `--report-dir='${name === '*' ? paths.coveragePath : paths.coverage(name)}'`,
            `--cache-dir='${name === '*' ? paths.cachePath : paths.cache(name)}'`,
            `--temp-dir='${paths.buildPath}'`,
            `--cwd='${paths.root}'`,
            '--require=ts-node/register',
        ];
        let args    = [`${mochaBin}`, `'${name === '*' ? paths.allTestGlob : paths.testGlob(name)}'`];

        let child = fork(nycBin, nycArgs.concat(args), {
            cwd:      paths.cwd,
            detached: false,
            env:      {
                ...process.env,
                TS_NODE_PROJECT: paths.tsconfig,
            },
        });

        child.on('error', (e) => {
            cb(e);
        });

        child.on('close', (code) => {
            if (code) {
                cb(new Error('Error running code coverage'));
            } else {
                cb();
            }
        });
    };
}

// Task functions

function addBuildTask(name, projects) {
    const displayName = `build:${name}`;

    const fn = generateBuildFunction(displayName, projects);

    let taskName   = `build${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = displayName;
    fn.description = `Build the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addWatchTask(name, build) {
    const fn = function () {
        return watch(paths.libGlob(name), build);
    };

    let taskName   = `watch${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `watch:${name}`;
    fn.description = `Watch the ${name} project and rebuild when there are changes`;

    exports[taskName] = fn;

    return fn;
}

function addLintTask(name) {
    const fn = function () {
        const program = Linter.createProgram(paths.tsconfig, paths.project(name));

        return src(paths.libGlob(name))
            .pipe(tslint({
                fix:           false,
                configuration: paths.tslint,
                program:       program,
            }))
            .pipe(tslint.report({
                allowWarnings: true,
            }));
    };

    let taskName   = `lint${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `lint:${name}`;
    fn.description = `Lint the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addTestTask(name) {
    const fn = generateMochaFunction(name);

    let taskName   = `test${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `test:${name}`;
    fn.description = `Test the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addCoverageTask(name) {
    const fn = generateNycFunction(name);

    let taskName   = `coverage${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `coverage:${name}`;
    fn.description = `Get the code coverage for the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addCleanTask(name) {
    function cleanTask(dir, path) {
        const fn = function () {
            return del(path);
        }

        let taskName   = `clean${capitalize(name)}${capitalize(dir)}`;
        fn.name        = taskName;
        fn.displayName = `clean:${name}:${dir}`;
        fn.description = `Clean out the ${dir} directory for ${name}`;

        exports[taskName] = fn;

        return fn;
    }

    const fn = parallel(
        cleanTask('dist', paths.dist(name)),
        cleanTask('cache', paths.cache(name)),
        cleanTask('coverage', paths.coverage(name)),
    );

    let taskName   = `clean${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `clean:${name}`;
    fn.description = `Clean out the build products for ${name}`;

    exports[taskName] = fn;

    return fn;
}

// Setup functions

let projectBuilds    = [];
let projectWatches   = [];
let projectLints     = [];
let projectCoverages = [];
let projectTests     = [];
let projectCleans    = [];

function setupProject(project) {
    let buildTask    = addBuildTask(project, [project]);
    let watchTask    = addWatchTask(project, buildTask);
    let lintTask     = addLintTask(project);
    let coverageTask = addCoverageTask(project);
    let testTask     = addTestTask(project);
    let cleanTask    = addCleanTask(project);

    projectBuilds.push(buildTask);
    projectWatches.push(watchTask);
    projectLints.push(lintTask);
    projectCoverages.push(coverageTask);
    projectTests.push(testTask);
    projectCleans.push(cleanTask);

    const fn         = series(buildTask, lintTask, testTask, coverageTask);
    fn.name          = project;
    fn.displayName   = project;
    fn.description   = `Build and test the ${project} project`;
    exports[project] = fn;
}

function setupProjects(projects) {
    let buildTasks = [];
    let groupNum   = 0;

    for (const project of projects) {
        if (Array.isArray(project)) {
            for (const proj of project) {
                setupProject(proj);
            }

            const phase       = `phase${groupNum++}`;
            const displayName = `build:${phase}`;
            const fn          = generateBuildFunction(displayName, project);

            fn.name        = phase;
            fn.displayName = displayName;
            fn.description = `Build group ${groupNum - 1} projects`;

            exports[phase] = fn;

            buildTasks.push(fn);
        } else {
            setupProject(project);
        }
    }

    const buildFn       = series(buildTasks);
    buildFn.name        = 'build';
    buildFn.displayName = 'build';
    buildFn.description = 'Build all of the projects';
    exports.build       = buildFn;

    const buildAllFn       = parallel(projectBuilds);
    buildAllFn.name        = 'buildAll';
    buildAllFn.displayName = 'build:all';
    buildAllFn.description = 'Build all of the projects in parallel without checking dependencies';
    exports.buildAll       = buildAllFn;

    const watchFn       = series(exports.build, parallel(projectWatches));
    watchFn.name        = 'watch';
    watchFn.displayName = 'watch';
    watchFn.description = 'Build all of the projects then watch them and rebuild when they have changes';
    exports.watch       = watchFn;

    const lintFn       = parallel(projectLints);
    lintFn.name        = 'lint';
    lintFn.displayName = 'lint';
    lintFn.description = 'Lint all of the projects';
    exports.lint       = lintFn;

    const testFn       = generateMochaFunction('*');
    testFn.name        = 'test';
    testFn.displayName = 'test';
    testFn.description = 'Test all of the projects';
    exports.test       = testFn;

    const coverageFn       = generateNycFunction('*');
    coverageFn.name        = 'coverage';
    coverageFn.displayName = 'coverage';
    coverageFn.description = 'Get the code coverage for all of the projects';
    exports.coverage       = coverageFn;

    const cleanFn       = parallel(projectCleans);
    cleanFn.name        = 'clean';
    cleanFn.displayName = 'clean';
    cleanFn.description = 'Clean all of the build products in the projects';
    exports.clean       = cleanFn;

    const fn       = series(exports.build, exports.lint, exports.test, exports.coverage);
    fn.name        = 'default';
    fn.displayName = 'default';
    fn.description = 'Build, lint, and test all of the projects';
    return fn;
}

// Setup all of the tasks

let deps     = {};
let packages = fs.readdirSync(paths.packages).filter(isValid);
for (let pkg of packages) {
    // noinspection JSUnresolvedVariable
    deps[pkg] = Object.keys(require(paths.packageJson(pkg)).dependencies)
                      .map(fixPrefix);
}

for (let [name, dependencies] of Object.entries(deps)) {
    deps[name] = dependencies.filter((dep) => Object.keys(deps).includes(dep));
}

let projects = [];
let group    = Object.entries(deps)
                     .filter(([_, dependencies]) => dependencies.length === 0)
                     .map(([name, _]) => name);

while (group.length > 0) {
    projects.push(group);

    for (let name of group) {
        delete deps[name];
    }

    group = Object.entries(deps)
                  .filter(([_, dependencies]) => dependencies.every((dep) => flat(projects).includes(dep)))
                  .map(([name, _]) => name);
}

exports.default = setupProjects(projects);
