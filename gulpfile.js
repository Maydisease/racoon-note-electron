const gulp                       = require('gulp');
const path                       = require('path');
const chalk                      = require('chalk');
const del                        = require('del');
const fs                         = require('fs');
const gutil                      = require('gulp-util');
const electron_src_path          = path.join(__dirname);
const electron_dist_path         = path.join(electron_src_path, 'dist');
const electron_build_path        = path.join(electron_src_path, 'build');
const electron_resource_path     = path.join(electron_build_path, 'note-win32-x64/resources/app');
const electron_node_modules_path = path.join(electron_src_path, 'node_modules');
const log                        = console.log;

gulp.task('clearElectronBuildDir', done => {
	del([path.join(electron_build_path, '**/*')]).then(paths => {
		log(`${chalk.blue('clear electron build successfully ! ')}${chalk.green(new Date())}`);
		done();
	});
});

gulp.task('clearElectronDistDir', done => {
	del([path.join(electron_dist_path, '**/*')]).then(paths => {
		log(`${chalk.blue('clear electron build successfully ! ')}${chalk.green(new Date())}`);
		done();
	});
});

gulp.task('copyElectronNodeModules', done => {
	gulp.src(path.join(electron_node_modules_path, '**/*'))
	.on('error', function (err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	})
	.pipe(gulp.dest(path.join(electron_resource_path, '/node_modules/')));
	log(`${chalk.blue('build statics successfully !')}${chalk.green(new Date())}`);
	done();
});

gulp.task('writeElectronRunPack', done => {
	const content = {main: './electron-start.js'};
	fs.writeFile(path.join(electron_dist_path, '/package.json'), JSON.stringify(content), () => {
		done();
	});
});

gulp.task('clear', gulp.parallel('clearElectronBuildDir', 'clearElectronDistDir'));
gulp.task('copyNodeModules', gulp.parallel('copyElectronNodeModules'));
gulp.task('writePkg', gulp.parallel('writeElectronRunPack'));