import {Http}   from './http.service';
import {config} from '../../config'

export class CurrentWindow {

    public remoteAddress: string;
    public moduleName: string;
    public actionName: string;
    public params: string;

    constructor(moduleName: string, actionName: string, params: any) {

        this.moduleName    = moduleName;
        this.actionName    = actionName;
        this.params        = params;
        this.remoteAddress = `${config.SERVER.HOST}:${config.SERVER.PORT == 80 || config.SERVER.PORT == 443 ? '' : config.SERVER.PORT}`;

    }

    async send() {
        const url = `${this.remoteAddress}/${this.moduleName}/${this.actionName}`;
        return await new Http(url, this.params).POST();
    }
}