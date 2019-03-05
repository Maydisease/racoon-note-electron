import url      from 'url';
import path     from 'path';
import {config} from "../../config";
import {utils}  from "../../utils";

declare var global: any;

interface PrivateProtocolRequest {
    headers: string,
    Accept: string,
    'User-Agent': string,
    method: string,
    referrer: string,
    url: string,
}

interface PrivateProtocol {
    headers: string,
    accept: string,
    userAgent: string,
    method: string,
    referrer: string,
    url: string,
}

class AttachedService {

    public privateProtocol: PrivateProtocol | undefined;
    public fileType: string | undefined;
    public filePath: string | undefined;
    public userPrivateSpace: string;
    public localAttachedBasePath: string;
    public localAttachedPath: string | undefined;
    public remoteAttachedBasePath: string;
    public remoteAttachedPath: string | undefined;

    constructor() {
        this.userPrivateSpace       = global.privateSpace;
        this.localAttachedBasePath  = path.join(config.ROOT_PATH, `attached/${this.userPrivateSpace}`);
        this.remoteAttachedBasePath = `${config.SERVER.HOST}:${config.SERVER.PORT}/attached`;
    }

    public privateSpace() {

    }

    public async adapter(privateProtocolRequest: PrivateProtocolRequest) {

        this.privateProtocol = {
            headers  : privateProtocolRequest.headers,
            accept   : privateProtocolRequest.Accept,
            userAgent: privateProtocolRequest['User-Agent'],
            method   : privateProtocolRequest.method,
            referrer : privateProtocolRequest.referrer,
            url      : privateProtocolRequest.url
        };

        const urlObj  = url.parse(this.privateProtocol.url);
        this.fileType = urlObj.host;
        this.filePath = urlObj.path;

        this.localAttachedPath = path.join(this.localAttachedBasePath, `${<string>this.fileType}/${this.filePath}`);

        let newProtocolRequest = {
            url   : '',
            method: 'GET'
        };

        if (await utils.getFilePathStat(this.localAttachedPath)) {
            newProtocolRequest.url = this.localAttachedPath
        } else {
            this.remoteAttachedPath = `${<string>this.remoteAttachedBasePath}/${this.userPrivateSpace}/${<string>this.fileType}${<string>this.filePath}`;
            newProtocolRequest.url  = this.remoteAttachedPath;
            // utils.dirExists(path.join(this.localAttachedBasePath, `${<string>this.fileType}`));
        }

        return newProtocolRequest

    }

}

export default AttachedService;