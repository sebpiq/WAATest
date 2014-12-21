var path = require('path')
  , async = require('async')
  , fse = require('fs-extra')
  , gulp = require('gulp')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')

var browserifyTests = function(dir, done) {
  return browserify({ entries: path.join(dir, 'index.js'), debug: true })
    .bundle()
    .pipe(source('test-build.js'))
    .pipe(gulp.dest(dir))
    .on('error', done)
    .on('finish', done)
}

exports.scaffold = function(dir, done) {
  var templatesDir = path.resolve(__dirname, '..', 'templates')
    , assetsOrigDir = path.resolve(__dirname, '..', 'assets')
    , assetsDestDir = path.join(dir, 'assets')
  async.series([
    fse.ensureDir.bind(fse, dir),
    fse.ensureDir.bind(fse, assetsDestDir),
    fse.copy.bind(fse, path.join(templatesDir, 'index.html'), path.join(dir, 'index.html')),
    fse.copy.bind(fse, path.join(assetsOrigDir, 'mocha.css'), path.join(assetsDestDir, 'mocha.css')),
    fse.copy.bind(fse, path.join(assetsOrigDir, 'mocha.js'), path.join(assetsDestDir, 'mocha.js'))
  ], done)
} 