import fs from 'fs';
import path from 'path';
import {config} from '../../config';

function ServiceList(dirPath: string, filesList: any = {}) {
	const files = fs.readdirSync(dirPath);
	files.forEach((item, index) => {
		const stat = fs.statSync(path.join(dirPath, item));
		if (stat.isDirectory()) {
			//递归读取文件
			ServiceList(path.join(`${dirPath}${item}`), filesList);
		} else {
			if (item.indexOf('.service.') > 0) {
				const filesPath = path.join(dirPath, item);
				const service = (require(filesPath) as any).default;
				let key = filesPath.replace(config.MODULE_PATH, '');
				key = path.join('/', key.substring(0, key.indexOf('.service.')));
				filesList[key] = service;
			}
		}
	});
	return filesList;
}

let service = ServiceList(config.MODULE_PATH);

const ClientCache = (servicePath: string) => {
	console.log('service::', service);
	const Fn = service[path.join(servicePath)];
	try {
		return new Fn();
	} catch (e) {
		console.log(e);
	}
};

export default ClientCache;
