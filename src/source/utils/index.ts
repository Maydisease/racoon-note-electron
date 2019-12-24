import {dirExists, getFilePathStat} from './files.utils';
import {getMD5}                     from './transform.utils';
import {removeHtmlTag}              from './removeHtmlTag.utils';

const utils = {
    getMD5,
    dirExists,
    removeHtmlTag,
    getFilePathStat
};

export {utils}
