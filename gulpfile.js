const { watch, series, parallel, src, dest } = require('gulp');
const { exec } = require('child_process');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');


sass.compiler = require('node-sass');

var paths = {
	sass: './assets/css/sass/**/*.scss',
	imgIn: './assets/img/**/*',
	css: '_site/static/css/',
	imgOut: '_site/static/img/',
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

function clean(cb) {
  // body omitted
  cb();
}

function build() {
  // body omitted
  return exec('bundler exec jekyll build --incremental');
}



exports.build = build;
exports.build_sass = build_sass;
exports.default = function() {
	watch(paths.siteRoot, build);// series(clean, build));
};

// gulp.task('default', ['browser-sync','watch']);
