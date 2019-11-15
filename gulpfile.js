const gulp = require('gulp');
const path = require('path');

const del                        = require('del');
const fs                         = require('fs');
const package                    = require('./package.json');
const gutil                      = require('gulp-util');
const electron_src_path          = path.join(__dirname);
const electron_dist_path         = path.join(electron_src_path, 'dist');
const electron_build_path        = path.join(electron_src_path, 'build');
const electron_html_path         = path.join(electron_src_path, 'src/source/html');
const electron_statics_path      = path.join(electron_src_path, 'src/source/statics');
const electron_node_modules_path = path.join(electron_src_path, 'node_moduleselectron_html_path');
const log                        = console.log;

gulp.task('clearElectronBuildDir', done => {
	del([path.join(electron_build_path, '**/*')]).then(paths => {
		log(`clear electron build successfully ! `);
		done();
	});
});

gulp.task('clearElectronDistDir', done => {
	del([path.join(electron_dist_path, '**/*')]).then(paths => {
		log(`clear electron build successfully ! `);
		done();
	});
});

gulp.task('copyElectronNodeModules', done => {
	gulp.src(path.join(electron_node_modules_path, '**/*'))
	.on('error', function (err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	})
	.pipe(gulp.dest(path.join(electron_dist_path, '/node_modules/')));
	log(`copy electron note modules successfully !`);
	done();
});

gulp.task('copyElectronHtml', done => {
	gulp.src(path.join(electron_html_path, '/**/*'))
	.on('error', function (err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	})
	.pipe(gulp.dest(path.join(electron_dist_path, '/source/html/')));
	log(`copy electron html successfully !`);
	done();
});

gulp.task('copyElectronStatics', done => {
	gulp.src(path.join(electron_statics_path, '/**/*'))
	.on('error', function (err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	})
	.pipe(gulp.dest(path.join(electron_dist_path, '/source/statics/')));
	log(`copy electron statics successfully !`);
	done();
});

gulp.task('writeElectronRunPack', done => {
	const content = {
		main: 'electron-start.js',
		author: 'medivh',
		version: '1.0.1',
		description: 'A powerful and simple note based on markdown soft.',
		name: package.name,
		dependencies: package.dependencies
	};
	fs.writeFile(path.join(electron_dist_path, '/package.json'), JSON.stringify(content), () => {
		done();
	});
});

gulp.task('clear', gulp.parallel('clearElectronBuildDir', 'clearElectronDistDir'));
gulp.task('copyNodeModules', gulp.parallel('copyElectronNodeModules'));
gulp.task('copyHtml', gulp.parallel('copyElectronHtml'));
gulp.task('copyStatics', gulp.parallel('copyElectronStatics'));
gulp.task('writePkg', gulp.parallel('writeElectronRunPack'));
