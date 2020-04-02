// @ts-nocheck

const { src, dest, parallel, series, watch } = require('gulp');
const sourcemap                              = require('gulp-sourcemaps');
const eslint                                 = require('gulp-eslint');
const ts                                     = require('gulp-typescript');

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

// Task functions

function addBuildTask(name) {
    const fn = function () {
        const project = ts.createProject(path.join('packages', name, 'tsconfig.json'));

        return project.src()
                      .pipe(sourcemap.init({ loadMaps: true }))
                      .pipe(project())
                      .pipe(sourcemap.write())
                      .pipe(dest(path.join('packages', name, 'dist')));
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
        return watch(`packages/${name}/lib/**/*`, build);
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
        const project = ts.createProject(path.join('packages', name, 'tsconfig.json'));

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
    const fn = function () {
        return src(path.join('packages', name, 'test', '**', '*'));
    }

    let taskName   = `test${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `test:${name}`;
    fn.description = `Test the ${name} project`;

    exports[taskName] = fn;

    return fn;
}

function addCleanTask(name) {
    const fn = function () {
        return del(path.join('packages', name, 'dist'));
    };

    let taskName   = `clean${capitalize(name)}`;
    fn.name        = taskName;
    fn.displayName = `clean:${name}`;
    fn.description = `Clean out the build products for ${name}`;

    exports[taskName] = fn;

    return fn;
}

// Setup functions

function setupProject(projectBuilds, projectWatches, projectLints, projectTests, projectCleans, project) {
    let buildTask = addBuildTask(project);
    let watchTask = addWatchTask(project, buildTask);
    let lintTask  = addLintTask(project);
    let testTask  = addTestTask(project);
    let cleanTask = addCleanTask(project);

    projectBuilds  = projectBuilds.concat(buildTask);
    projectWatches = projectWatches.concat(watchTask);
    projectLints   = projectLints.concat(lintTask);
    projectTests   = projectTests.concat(testTask);
    projectCleans  = projectCleans.concat(cleanTask);

    const fn         = series(buildTask, testTask);
    fn.name          = project;
    fn.displayName   = project;
    fn.description   = `Build and test the ${project} project`;
    exports[project] = fn;

    return [projectBuilds, projectWatches, projectLints, projectTests, projectCleans];
}

function setupProjects(projects) {
    let projectBuilds  = [];
    let projectWatches = [];
    let projectLints   = [];
    let projectTests   = [];
    let projectCleans  = [];

    for (let project of projects) {
        if (Array.isArray(project)) {
            let buildTasks = [];
            let testTasks  = [];

            for (let proj of project) {
                [buildTasks, projectWatches, projectLints, testTasks, projectCleans] = setupProject(buildTasks, projectWatches, projectLints, testTasks, projectCleans, proj);
            }

            projectBuilds = projectBuilds.concat(parallel(buildTasks));
            projectTests  = projectTests.concat(parallel(testTasks));
        } else {
            [projectBuilds, projectWatches, projectLints, projectTests, projectCleans] = setupProject(projectBuilds, projectWatches, projectLints, projectTests, projectCleans, project);
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

    const testFn       = series(projectTests);
    testFn.name        = 'test';
    testFn.displayName = 'test';
    testFn.description = 'Test all of the projects';
    exports.test       = testFn;

    const cleanFn       = parallel(projectCleans);
    cleanFn.name        = 'clean';
    cleanFn.displayName = 'clean';
    cleanFn.description = 'Clean all of the build products in the projects';
    exports.clean       = cleanFn;

    const fn       = series(exports.build, exports.lint, exports.test);
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

let projects = [['component', 'module', 'routing'], ['component-parser', 'component-renderer', 'page']];
for (let project of fs.readdirSync('packages')) {
    if (fs.statSync(path.join('packages', project)).isDirectory() && fs.existsSync(path.join('packages', project, 'tsconfig.json'))) {
        if (!deepCheck(projects, project))
            projects = projects.concat(project);
    }
}

exports.default = setupProjects(projects);
