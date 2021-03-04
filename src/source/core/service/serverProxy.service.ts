import {Http}              from './http.service';
import {config}            from '../../config';
import {NetworkLogService} from './networkLog.service';

declare var global: any;

export class ServerProxy {

    public remoteAddress: string;
    public moduleName: string;
    public actionName: string;
    public params: object | undefined;

    constructor(moduleName: string, actionName: string, params: object | undefined = {}) {

        this.moduleName    = moduleName;
        this.actionName    = actionName;
        this.params        = params;
        this.remoteAddress = `${config.SERVER.HOST}:${config.SERVER.PORT == 80 || config.SERVER.PORT == 443 ? '' : config.SERVER.PORT}`;

    }

    async send() {
        const path      = `/${this.moduleName}/${this.actionName}`;
        const url       = `${this.remoteAddress}${path}`;
        const startTime = new Date().getTime();

        console.log(url);

        return await new Http(url, this.params)
            .POST()
            .then((response: any) => {
                console.log(response);
                NetworkLogService(path, startTime, this.params, true);
                return response;
            })
            .catch((err: Error) => {
                console.log(err);
                NetworkLogService(path, startTime, this.params, false);
                return {result: 1, err}
            })
    }
}
