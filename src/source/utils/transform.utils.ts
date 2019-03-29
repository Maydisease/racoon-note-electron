import * as crypto from "crypto";

const getMD5 = (content: any): string => {
    const md5    = crypto.createHash('md5');
    const md5Str = md5.update(content).digest('hex');
    return md5Str.substring(0);
};

export {getMD5}