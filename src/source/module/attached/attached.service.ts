import url                    from 'url';
import path                   from 'path';
import {config}               from "../../config";
import {utils}                from "../../utils";
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

    public privateProtocol: PrivateProtocol | undefined;
    public fileType: string | undefined;
    public filePath: string | undefined;
    public userPrivateSpace: string | undefined;
    public localAttachedBasePath: string | undefined;
    public localAttachedPath: string;
    public remoteAttachedBasePath: string | undefined;
    public remoteAttachedPath: string | undefined;

    constructor() {
        this.localAttachedPath = '';
    }

    public async adapter(privateProtocolRequest: PrivateProtocolRequest) {

        const defaultImage          = path.join(config.ROOT_PATH, `statics/images/default_image.png`);
        this.userPrivateSpace       = global.privateSpace;
        this.localAttachedBasePath  = path.join(config.ROOT_PATH, `attached_files/${this.userPrivateSpace}`);
        this.remoteAttachedBasePath = `${config.SERVER.ATTACHED_FILES.HOST}:${config.SERVER.ATTACHED_FILES.PORT}/attached_files/${this.userPrivateSpace}`;

        this.privateProtocol = {
            headers : privateProtocolRequest.headers,
            method  : privateProtocolRequest.method,
            referrer: privateProtocolRequest.referrer,
            url     : privateProtocolRequest.url,
        };

        const urlObj  = url.parse(this.privateProtocol.url);
        this.fileType = urlObj.host;
        this.filePath = urlObj.path;

        this.localAttachedPath = path.join(this.localAttachedBasePath, `${<string>this.fileType}/${this.filePath}`);

        let newProtocolRequest = {
            url      : '',
            method   : 'GET',
            sessionId: null
        };

        if (await utils.getFilePathStat(this.localAttachedPath)) {
            newProtocolRequest.url = this.localAttachedPath;
        } else {
            this.remoteAttachedPath = `${<string>this.remoteAttachedBasePath}/img${<string>this.filePath}`;
            const networkStatus     = await systeminformation.inetChecksite(this.remoteAttachedPath);

            switch (networkStatus.status) {
                case 200:
                    newProtocolRequest.url = this.remoteAttachedPath;
                    break;
                case 404:
                    newProtocolRequest['url'] = `file://${defaultImage}`;
                    break;
            }
        }
        return newProtocolRequest

    }

}

export default AttachedService;
