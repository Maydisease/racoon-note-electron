const gulp                       = require('gulp');
const path                       = require('path');
const chalk                      = require('chalk');
const del                        = require('del');
const fs                         = require('fs');
const gutil                      = require('gulp-util');
const electron_src_path          = path.join(__dirname);
const electron_dist_path         = path.join(electron_src_path, 'dist');
const electron_build_path        = path.join(electron_src_path, 'build');
const electron_html_path         = path.join(electron_src_path, 'src/html');
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
	.pipe(gulp.dest(path.join(electron_dist_path, '/node_modules/')));
	log(`${chalk.blue('copy electron note modules successfully !')}${chalk.green(new Date())}`);
	done();
});

gulp.task('copyElectronHtml', done => {
	gulp.src(path.join(electron_html_path, '**/*'))
	.on('error', function (err) {
		gutil.log(gutil.colors.red('[Error]'), err.toString());
	})
	.pipe(gulp.dest(path.join(electron_dist_path, '/html/')));
	log(`${chalk.blue('copy electron html successfully !')}${chalk.green(new Date())}`);
	done();
});

gulp.task('writeElectronRunPack', done => {
	const content = {
		main: './electron-start.js',
		devDependencies: {
			'@types/electron': '^1.6.10',
			'@types/sqlite3': '^3.1.3',
			'concurrently': '^4.1.0',
			'cross-env': '^5.2.0',
			'del': '^3.0.0',
			'electron': '^4.0.1',
			'electron-log': '^3.0.1',
			'gulp': '^4.0.0',
			'gulp-util': '^3.0.8'
		},
		dependencies: {
			'typeorm': '^0.2.12',
			'systeminformation': '^4.1.4'
		}
	};
	fs.writeFile(path.join(electron_dist_path, '/package.json'), JSON.stringify(content), () => {
		done();
	});
});

gulp.task('clear', gulp.parallel('clearElectronBuildDir', 'clearElectronDistDir'));
gulp.task('copyNodeModules', gulp.parallel('copyElectronNodeModules'));
gulp.task('copyHtml', gulp.parallel('copyElectronHtml'));
gulp.task('writePkg', gulp.parallel('writeElectronRunPack'));