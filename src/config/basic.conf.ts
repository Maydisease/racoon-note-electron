import path from 'path';

interface BasicConfInterface {
    ROOT_PATH: string,
    SERVICE_PATH: string
}

const basicConf: BasicConfInterface | any = {};

basicConf.ROOT_PATH    = path.join(__dirname, '..');
basicConf.SERVICE_PATH = path.join(basicConf.ROOT_PATH, 'service');
basicConf.MODULE_PATH  = path.join(basicConf.ROOT_PATH, 'module/');

export default basicConf