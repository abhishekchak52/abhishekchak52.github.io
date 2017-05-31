var gulp = require('gulp'),
	imagemin = require('gulp-imagemin')
	sass = require('gulp-sass'),
	cp = require('child_process'),
	util = require('gulp-util'),
	browsersync = require('browser-sync').create(),
	plumber = require('gulp-plumber');

var paths = {
	sass: './assets/css/sass/**/*.scss',
	imgIn: './assets/img/*',
	css: './static/css/',
	imgOut: './static/img/',
	siteRoot: "_site"
}


gulp.task('serve',function(){
	// browsersync.init({
	// 	files: [paths.siteRoot + '/**'],
	// 	port: 4000,
	// 	server: {
	// 		baseDir: paths.siteRoot
	// 	}
	// });
	gulp.watch(paths.sass,['styles']);
	gulp.watch(paths.imgIn,['images']);
	// gulp.watch('.',['jekyll']);

});


gulp.task('styles', function(){
	return gulp.src(paths.sass)
	.pipe(plumber())
	.pipe(sass({includePaths: require('node-neat').includePaths}))
	.pipe(gulp.dest(paths.css))
	.pipe(browsersync.reload({stream: true}));

});

gulp.task('images',function(){
	return gulp.src(paths.imgIn)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.imgOut))
		.pipe(browsersync.reload({stream: true}));
});



gulp.task('jekyll', function(){
	return cp.spawn('jekyll',['serve',
							'--watch',
							'--incremental',
							]);
	var jekyllLogger = function(buffer){
		buffer.toString()
			  .split(/\n/)
			  .forEach(function(message){util.log('jekyll: ' + message)});
	jekyll.stdout.on('data',jekyllLogger);
	jekyll.stderr.on('data',jekyllLogger);
	};
});



gulp.task('default',['images','styles','jekyll','serve']);
