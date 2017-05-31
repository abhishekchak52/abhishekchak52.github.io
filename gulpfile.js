var gulp = require('gulp'),
	imagemin = require('gulp-imagemin')
	sass = require('gulp-sass'),
	cp = require('child_process'),
	util = require('gulp-util');

var paths = {
	sass: './assets/css/sass/*',
	imgIn: './assets/img/*',
	css: './static/css/',
	imgOut: './static/img/'
}


gulp.task('jekyll', function(){
	var jekyll = cp.spawn('jekyll',['serve',
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

gulp.task('styles', function(){
	return gulp.src(paths.sass)
	.pipe(sass({
      // includePaths: require('node-neat').with('other/path', 'another/path') 
      // - or - 
      includePaths: require('node-neat').includePaths
    }))
	.pipe(gulp.dest(paths.css));

});

gulp.task('images',function(){
	gulp.src(paths.imgIn)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.imgOut));
});

gulp.task('watch',function(){
	gulp.watch(paths.sass,['styles']);
	gulp.watch(paths.imgIn,['images']);
});

gulp.task('default',['images','styles','jekyll','watch']);
