const { watch, series, parallel, src, dest } = require('gulp');
const { exec } = require('child_process');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const server = require('browser-sync').create();

sass.compiler = require('node-sass');

var paths = {
	js: {
		src: 'assets/js/*.js',
		dest: './static/js/',
	},
	img: {
		src: './assets/img/**/*',
		dest: './static/img/'
	},
	css: {
		src: './assets/css/sass/**/*.scss',
		dest: './static/css/'
	},
	site:{
		root: "_site",
		js: "./_site/static/js/",
		img: "./_site/static/img/",
		css: "_site/static/css/"
	}
}

function build_sass() {
	return src(paths.css.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(cleanCSS())
		.pipe(dest(paths.css.dest))
		.pipe(dest(paths.site.css))
		.pipe(server.stream());
}

function build_js(){
	return src(paths.js.src)
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(dest(paths.js.dest))
		.pipe(dest(paths.site.js))
		.pipe(server.stream());
}

function build_img() {
	return src(paths.img.src)
		.pipe(imagemin())
		.pipe(dest(paths.img.dest))
		.pipe(dest(paths.site.img))
		.pipe(server.stream());
}

function serve(){
	server.init({
    	files: paths.site.root + '/**',
    	port: 4000,
    	notify: false,
        server: {
            baseDir: paths.site.root
        }
    });
	watch(paths.css.src, build_sass);
	watch(paths.js.src, series(build_js));
	watch(paths.img.src, series(build_img));
}

function build() {
  return exec('bundler exec jekyll build --incremental');
}

exports.serve = serve;
exports.build = series(parallel(build_sass,build_js, build_img), build);
exports.default = serve
