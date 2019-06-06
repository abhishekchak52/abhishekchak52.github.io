const { watch, series, parallel, src, dest } = require('gulp');
const { exec } = require('child_process');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();


sass.compiler = require('node-sass');

var paths = {
	js: {
		src: 'assets/js/*.js',
		dest: './static/js/'
	},
	img: {
		src: './assets/img/**/*',
		dest: './static/img/'
	},
	css: {
		src: './assets/css/sass/**/*.scss',
		dest: './static/css/'
	},
	siteRoot: "_site"
}

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


function build_sass() {
	return src(paths.css.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(cleanCSS())
		.pipe(dest(paths.css.dest))
		.pipe(browserSync.stream());
}

function build_js(){
	return src(paths.js.src)
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(dest(paths.js.dest))
		.pipe(browserSync.stream());
}

function build_img() {
	return src(paths.img.src)
		.pipe(imagemin())
		.pipe(dest(paths.img.dest))
		.pipe(browserSync.stream());
}

function serve(){
	browserSync.init({
    	files: paths.siteRoot + '/**',
    	port: 4000,
        server: {
            baseDir: '_site'
        }
    });
    watch(paths.css.src, build_sass);
    watch(paths.js.src, build_js);
    watch(paths.img.src, build_img);
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
exports.serve = serve;
exports.default =  series(parallel(build_sass,build_js, build_img), build);

// gulp.task('default', ['browser-sync','watch']);
