// @ts-nocheck

const path = require('path');

const cwd  = process.cwd(),
      root = __dirname;

const buildDir    = 'build',
      cacheDir    = 'cache',
      coverageDir = 'coverage';

const tslint       = path.join(root, 'tslint.json'),
      buildPath    = path.join(cwd, buildDir),
      cachePath    = path.join(buildPath, cacheDir),
      coveragePath = path.join(buildPath, coverageDir);

const packagesDir = 'packages',
      libDir      = 'lib',
      testDir     = 'test',
      distDir     = 'dist';

const packages    = path.join(root, packagesDir),
      project     = function (name) {
          return path.join(packages, name)
      },
      tsconfig    = function (name) {
          return path.join(project(name), 'tsconfig.json')
      },
      packageJson = function (name) {
          return path.join(project(name), 'package.json')
      },
      cache       = function (name) {
          return path.join(cachePath, name);
      },
      coverage    = function (name) {
          return path.join(coveragePath, name);
      };

const glob                = function (glob) {
          return glob.replace(/\\/g, '/');
      },
      libRoot             = function (name) {
          return path.join(project(name), libDir);
      },
      lib                 = function (name) {
          return path.join(libRoot(name), '**', '*.ts');
      },
      libGlob             = function (name) {
          return glob(lib(name));
      },
      allLibGlob          = libGlob('*'),
      relativeLibGlob     = function (name) {
          return glob(path.relative(root, lib(name)));
      },
      relativeAllLibGlob  = relativeLibGlob('*'),
      test                = function (name) {
          return path.join(project(name), testDir, '**', '*.ts');
      },
      testGlob            = function (name) {
          return glob(test(name));
      },
      allTestGlob         = testGlob('*'),
      dist                = function (name) {
          return path.join(project(name), distDir);
      },
      allDist             = path.join(dist('*'), '**', '*'),
      allDistGlob         = glob(allDist),
      relativeAllDistGlob = glob(path.relative(root, allDist));

module.exports = {
    cwd,
    root,

    buildDir,
    cacheDir,
    coverageDir,

    tslint,
    buildPath,
    cachePath,
    coveragePath,

    packagesDir,
    libDir,
    testDir,
    distDir,

    packages,
    project,
    tsconfig,
    packageJson,
    cache,
    coverage,

    glob,
    libRoot,
    lib,
    libGlob,
    allLibGlob,
    relativeLibGlob,
    relativeAllLibGlob,
    test,
    testGlob,
    allTestGlob,
    dist,
    allDist,
    allDistGlob,
    relativeAllDistGlob,
};
