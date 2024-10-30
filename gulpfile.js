const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const paths = {
	root: './assets',
	styles: {
		src: './assets/sass/*.scss',
		dest: './dist/css',
	},
	scripts: {
		src: './assets/js/*.js',
		dest: './dist/js'
	},
	webpack_scripts: {
		src: './assets/js/*.js',
		dest: './dist/js'
	},
	// images: {
	// 	src: './images/**/*.{jpg,jpeg,png,svg,gif}',
	// 	dest: './dist/images',
	// },
};

function styles() {
	return gulp
		.src(paths.styles.src, { sourcemaps: true })
		.pipe(
			plumber({
				errorHandler: notify.onError('<%= error.message %>'),
			}),
		)
		.pipe(
			sass({
				outputStyle: 'expanded',
			}),
		)
		.pipe(gulp.dest(paths.styles.dest));
}

function webpack_scripts() {
	return gulp
		.src(paths.webpack_scripts.src)
		.pipe(
			plumber({
				errorHandler: notify.onError('<%= error.message %>'),
			})
		)
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(uglify())
		.pipe(gulp.dest(paths.webpack_scripts.dest));
}

function scripts() {
	return gulp
		.src([paths.scripts.src, '!assets/js/index.js'])
		.pipe(
			plumber({
				errorHandler: notify.onError('<%= error.message %>'),
			})
		)
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest));
}

function watchFiles() {
	gulp.watch(paths.styles.src).on('change', gulp.series(styles));
	gulp.watch(paths.scripts.src).on('change', gulp.series(scripts));
	gulp.watch(paths.scripts.src).on('change', gulp.series(webpack_scripts));
}

gulp.task('default', gulp.series(gulp.parallel(watchFiles)));
