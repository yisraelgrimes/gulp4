// Gulp4

const browserSync = require('browser-sync').create()
const gulp        = require('gulp')
const notify      = require('gulp-notify')
const plumber     = require('gulp-plumber')
const prefix      = require('gulp-autoprefixer')
const sass        = require('gulp-sass')
const sourcemaps  = require('gulp-sourcemaps')


// -------------------------------------
// Configuration
// -------------------------------------

// BrowserSync URL
const localhostUrl = 'localhost:6969'

// Paths
const pth = {
	srcAll   : './src/styles/**/*.+(sass|scss)',
	src      : './src/styles/*.sass',
	dest     : './build/css',
	viewsAll : './build/**/*.html'
}

// Sass Auto-Prefixer
const prefixOpts = [
	'last 2 versions',
	'ie >= 9',
	'and_chr >= 2.3'
]

// Sass Style Options
const sassOpts = {
	errLogToConsole: true,
	outputStyle: 'expanded',
	sourceComments: 'true',
	indentType: 'tab',
	indentWidth: '1',
}

// Error message
const onError = function (err) {
notify.onError({
		title   : 'Gulp',
		subtitle: 'Failure!',
		message : 'Error: <%= error.message %>',
		sound   : 'Beep'
})(err)

this.emit('end')
}


// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('styles', () => {
	const stream = gulp
		.src([pth.src])
		.pipe(sourcemaps.init())
			.pipe(plumber({errorHandler: onError}))
			.pipe(sass(sassOpts).on('error', sass.logError))
			.pipe(prefix(prefixOpts))
		.pipe(sourcemaps.write())

		return stream
			.pipe(gulp.dest(pth.dest))
			.pipe(browserSync.stream())
})


gulp.task('watch', function () {
	browserSync.init({
		proxy: localhostUrl,
		open: false,
	});
	gulp.watch(pth.srcAll, gulp.series('styles'))
	gulp.watch(pth.viewsAll).on('change', browserSync.reload)
})


gulp.task('default', gulp.series('styles', 'watch'))
