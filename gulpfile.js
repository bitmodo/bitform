// @ts-nocheck

const { src, dest, parallel, series, watch } = require('gulp');
const sourcemap                              = require('gulp-sourcemaps');
const eslint                                 = require('gulp-eslint');
const ts                                     = require('gulp-typescript');

const jest = require('@jest/core');

const fs   = require('fs');
const del  = require('del');
const path = require('path');

/**
 * @param {string} string
 * @returns {string}
 */
function capitalize(string) {
    return `${string.substr(0, 1).toUpperCase()}${string.substr(1)}`;
}

function isValid(project) {
    let projectDir = path.join(__dirname, 'packages', project);

    return fs.statSync(projectDir).isDirectory()
           && fs.existsSync(path.join(projectDir, 'tsconfig.json'))
           && fs.existsSync(path.join(projectDir, 'package.json'));
}

function generateJestFunction(name, coverage) {
    return function () {
        let projects = [];
        for (let project of fs.readdirSync(path.join(__dirname, 'packages'))) {
            if (isValid(project)) {
                projects.push(path.join(__dirname, 'packages', project));
            }
        }

        let cacheDir    = path.join(process.cwd(), 'build', 'cache');
        let coverageDir = path.join(process.cwd(), 'build', 'coverage');

        return jest.runCLI(Object.assign({
            cache:           true,
            cacheDirectory:  name === '*' ? cacheDir : path.join(cacheDir, name),
            displayName:     {
                color: 'blue',
                name:  name === '*' ? 'all' : name,
            },
            passWithNoTests: true,
            preset:          'ts-jest',
            projects:        projects,
            reporters:       [[path.join(__dirname, 'jest-reporter.js'), { output: !coverage }]],
            silent:          true,
            testMatch:       ['<rootDir>/test/**/*.ts'],
        }, coverage ? {
            collectCoverage:     true,
            collectCoverageFrom: ['<rootDir>/lib/**/*'],
            coverage:            true,
            coverageDirectory:   name === '*' ? coverageDir : path.join(coverageDir, name),
            coverageReporters:   ['json', 'lcov', 'clover'],
        } : {}), projects);
    };
}

// Task functions

function addBuildTask(name) {
    const fn = function () {
        const project = ts.createProject(path.join(__dirname, 'packages', name, 'tsconfig.json'));

        return project.src()
                      .pipe(sourcemap.init({ loadMaps: true }))
                      .pipe(project())
                      .pipe(sourcemap.write())
                      .pipe(dest(path.join(__dirname, 'packages', name, 'dist')));
    };

    let taskName   = `build${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `build:${name}`;
    fn.description = `Build the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addWatchTask(name, build) {
    const fn = function () {
        return watch(path.join(__dirname, 'packages', name, 'lib', '**', '*'), build);
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
        const project = ts.createProject(path.join(__dirname, 'packages', name, 'tsconfig.json'));

        return project.src()
                      .pipe(eslint())
                      .pipe(eslint.format())
                      .pipe(eslint.failAfterError());
    };

    let taskName   = `lint${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `lint:${name}`;
    fn.description = `Lint the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addTestTask(name) {
    const fn = generateJestFunction(name, false);

    let taskName   = `test${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `test:${name}`;
    fn.description = `Test the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addCoverageTask(name) {
    const fn = generateJestFunction(name, true);

    let taskName   = `coverage${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `coverage:${name}`;
    fn.description = `Get the code coverage for the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addCleanTask(name) {
    const fn = function () {
        return parallel(
            del(path.join(__dirname, 'packages', name, 'dist')),
            del(path.join(process.cwd(), 'build', 'cache', name)),
            del(path.join(process.cwd(), 'build', 'coverage', name)),
        );
    };

    let taskName   = `clean${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `clean:${name}`;
    fn.description = `Clean out the build products for ${name}`;

    exports[taskName] = fn;

    return fn;
}

// Setup functions

let projectWatches   = [];
let projectLints     = [];
let projectCoverages = [];
let projectTests     = [];
let projectCleans    = [];

function setupProject(projectBuilds, project) {
    let buildTask    = addBuildTask(project);
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

    return [projectBuilds];
}

function setupProjects(projects) {
    let projectBuilds = [];

    for (let project of projects) {
        if (Array.isArray(project)) {
            let buildTasks = [];

            for (let proj of project) {
                [buildTasks] = setupProject(buildTasks, proj);
            }

            projectBuilds = projectBuilds.concat(parallel(buildTasks));
        } else {
            [projectBuilds] = setupProject(projectBuilds, project);
        }
    }

    const buildFn       = series(projectBuilds);
    buildFn.name        = 'build';
    buildFn.displayName = 'build';
    buildFn.description = 'Build all of the projects';
    exports.build       = buildFn;

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

    const coverageFn       = generateJestFunction('*', true);
    coverageFn.name        = 'coverage';
    coverageFn.displayName = 'coverage';
    coverageFn.description = 'Get the code coverage for all of the projects';
    exports.coverage       = coverageFn;

    const testFn       = generateJestFunction('*', false);
    testFn.name        = 'test';
    testFn.displayName = 'test';
    testFn.description = 'Test all of the projects';
    exports.test       = testFn;

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

function deepCheck(projects, project) {
    for (let proj of projects) {
        if (Array.isArray(proj)) {
            if (deepCheck(proj, project)) return true;
        } else if (proj === project) return true;
    }

    return false;
}

let projects = [['util'], ['component', 'provider', 'routing-path'], ['component-parser', 'component-renderer', 'layout', 'routing'], ['page'], ['module']];
let extras   = [];
for (let project of fs.readdirSync(path.join(__dirname, 'packages'))) {
    if (isValid(project)) {
        if (!deepCheck(projects, project))
            extras.push(project);
    }
}

projects.push(extras);
exports.default = setupProjects(projects);
