import url                    from 'url';
import path                   from 'path';
import fs                     from 'fs';
import request                from 'request';
import {config}               from "../../config";
import {utils}                from "../../utils";
import {NetworkLogService}    from "../../service";
import * as systeminformation from "systeminformation";

declare var global: any;

interface PrivateProtocolRequest {
    headers: string,
    method: string,
    referrer: string,
    url: string,
    path?: string
}

interface PrivateProtocol {
    headers: string,
    method: string,
    referrer: string,
    url: string,
    path?: string
}

class AttachedService {

    public enableCache: boolean;
    public privateProtocol: PrivateProtocol | undefined;
    public fileType: string | undefined;
    public filePathname: string | undefined;
    public fileHref: string | undefined;
    public userPrivateSpace: string | undefined;
    public remoteAttachedBasePath: string;
    public remoteAttachedFile: string | undefined;
    public cacheAttachedPath: string;

    constructor() {
        this.enableCache            = true;
        this.cacheAttachedPath      = '';
        this.remoteAttachedBasePath = '';
    }

    public saveCache(remoteAttachedFile: string, pathname: string) {
        return new Promise(async (resolve) => {
            if (remoteAttachedFile && pathname) {
                this.cacheAttachedPath = path.join(config.CACHE_PATH, `attached/${this.userPrivateSpace}/img`);
                if (!await utils.getFilePathStat(this.cacheAttachedPath)) {
                    await utils.dirExists(this.cacheAttachedPath);
                }
                const imageDist = path.join(this.cacheAttachedPath, pathname);
                const response  = request(remoteAttachedFile).pipe(fs.createWriteStream(imageDist));
                response.on('finish', () => resolve());
            }
        });
    }

    public async adapter(privateProtocolRequest: PrivateProtocolRequest) {

        this.privateProtocol = {
            headers : privateProtocolRequest.headers,
            method  : privateProtocolRequest.method,
            referrer: privateProtocolRequest.referrer,
            url     : privateProtocolRequest.url
        };

        const urlObj      = url.parse(this.privateProtocol.url);
        this.fileType     = urlObj.host || '';
        this.filePathname = urlObj.pathname || '';
        this.fileHref     = urlObj.href || '';

        let newProtocolRequest = {
            path     : '',
            method   : 'GET',
            sessionId: null
        };

        const defaultImage          = path.join(config.STATICS_PATH, `images/default_image.png`);
        this.userPrivateSpace       = global.privateSpace;
        this.remoteAttachedBasePath = `${config.SERVER.ATTACHED_FILES.HOST}:${config.SERVER.ATTACHED_FILES.PORT}/attached_files/${this.userPrivateSpace}`;
        this.remoteAttachedFile     = `${this.remoteAttachedBasePath}/img${this.filePathname}`;
        this.cacheAttachedPath      = path.join(config.CACHE_PATH, `attached/${this.userPrivateSpace}/img`);
        const cacheFileAddress      = path.join(this.cacheAttachedPath, this.filePathname);
        const time                  = new Date().getTime();

        // 如果有本地有该附件的缓存的话
        if (this.enableCache && await utils.getFilePathStat(cacheFileAddress)) {
            newProtocolRequest.path = path.normalize(cacheFileAddress);
            NetworkLogService(this.filePathname, time, {}, true, true)
        }
        // 如果本地没有该附件的缓存的话
        else {
            const networkStatus = await systeminformation.inetChecksite(this.remoteAttachedFile);
            switch (networkStatus.status) {
                case 200:
                    await this.saveCache(this.remoteAttachedFile, this.filePathname);
                    // 将远程地址设置为url并返回
                    newProtocolRequest.path = path.normalize(cacheFileAddress);
                    // 将远程附件写入至附件缓存
                    NetworkLogService(this.filePathname, time, {}, true, false);
                    break;
                case 404:
                    // 如果图片不存在的话，使用默认图
                    newProtocolRequest.path = path.normalize(defaultImage);
                    break;
            }
        }

        return newProtocolRequest;

    }

}

export default AttachedService;
