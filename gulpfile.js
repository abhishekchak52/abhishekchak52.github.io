const { watch, series, parallel, src, dest } = require('gulp');
const { exec } = require('child_process');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');


sass.compiler = require('node-sass');

var paths = {
	jsIn: 'assets/js/*.js',
	sass: './assets/css/sass/**/*.scss',
	imgIn: './assets/img/**/*',
	css: '_site/static/css/',
	imgOut: '_site/static/img/',
	jsOut: '_site/static/js/',
	siteRoot: "_site"
}

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


function build_sass() {
	return src(paths.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(cleanCSS())
		.pipe(dest(paths.css));

}

function build_js(){
	return src(paths.jsIn)
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(dest(paths.jsOut));
}

function clean(cb) {
  // body omitted
  cb();
}

function build() {
  // body omitted
  return exec('bundler exec jekyll build --incremental');
}



exports.build = build;
exports.build_js = build_js;
exports.build_sass = build_sass;
exports.default =  series(build, parallel(build_sass,build_js));

// gulp.task('default', ['browser-sync','watch']);
