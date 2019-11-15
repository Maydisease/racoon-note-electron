import {Http}              from './http.service';
import {config}            from '../../config';
import fs                  from 'fs';
import {NetworkLogService} from "./networkLog.service";

export class ServerProxyUpload {

    public remoteAddress: string;
    public moduleName: string;
    public actionName: string;
    public params: Object | undefined;
    public headers: object | undefined;

    constructor(moduleName: string, actionName: string, params: any = {}, headers: object | undefined = {}) {

        let newParams: Object = {};
        const fileBuffer      = fs.readFileSync(params.path);

        if (fileBuffer) {
            newParams = {name: params.name, type: params.type, size: params.size, buffer: fileBuffer};
        }

        this.moduleName    = moduleName;
        this.actionName    = actionName;
        this.params        = newParams;
        this.headers       = headers;
        this.remoteAddress = `${config.SERVER.HOST}:${config.SERVER.PORT == 80 || config.SERVER.PORT == 443 ? '' : config.SERVER.PORT}`;

    }

    async send() {
        const path = `/${this.moduleName}/${this.actionName}`;
        const url  = `${this.remoteAddress}${path}`;
        const time = new Date().getTime();

        // NetworkLogService
        return await new Http(url, this.params, this.headers)
            .POST()
            .then((response: any) => {
                NetworkLogService(path, time, this.params, true);
                return response
            })
            .catch((err: Error) => {
                NetworkLogService(path, time, this.params, false);
                return {result: 1, err};
            })
    }
}
