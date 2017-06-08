var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	sass = require('gulp-sass'),
	cp = require('child_process'),
	util = require('gulp-util'),
	browserSync = require('browser-sync'),
	plumber = require('gulp-plumber'),
	prefix = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var paths = {
	sass: './assets/css/sass/**/*.scss',
	imgIn: './assets/img/**/*',
	css: './static/css/',
	imgOut: './static/img/',
	siteRoot: "_site"
}


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


gulp.task('jekyll-build',function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build','--incremental'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload({stream: true});
});

gulp.task('browser-sync', ['sass', 'js', 'images', 'jekyll-build'], function() {
    browserSync({
    	files: paths.siteRoot + '/**',
    	port: 4000,
        server: {
            baseDir: '_site'
        }
    });
});


gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(concat('main.css'))
        .pipe(cleancss())    
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp.dest('_site/static/css'));
});

gulp.task('images',function(){
	return gulp.src(paths.imgIn)
		.pipe(imagemin())
		.pipe(browserSync.reload({stream: true}))
		.pipe(gulp.dest(paths.imgOut))
        .pipe(gulp.dest('_site/static/img'));
});

gulp.task('js',function(){
	gulp.src('assets/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
	.pipe(browserSync.reload({stream: true}))
	.pipe(gulp.dest('static/js'))
    .pipe(gulp.dest('_site/static/js'));
});

gulp.task('watch', function () {
    gulp.watch('assets/css/sass/**/*.scss', ['sass']);
    gulp.watch('assets/js/*.js', ['js']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', 'physics/**/*', 'code/**/*', 'design/**/*', 'text/**/*' ], ['jekyll-rebuild']);
});


gulp.task('default',['browser-sync','watch']);
