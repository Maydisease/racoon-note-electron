import {SignStateModel}    from './signState.model';
import {NetworkLogService} from "../../service";

declare var global: any;

class signStateService {

    public signStateModel: SignStateModel;

    constructor() {
        this.signStateModel = new SignStateModel();
    }

    public async getSignState() {
        const response = await this.signStateModel.getSignState();
        return response
    }

    public async verifySignState() {
        const time     = new Date().getTime();
        const response = await this.signStateModel.verifySignState();
        NetworkLogService('/user/verifySignState', time, {}, true, true);
        return response;
    }

    public async putSignState(token: string, private_space: string): Promise<object> {

        if (await this.verifySignState() > 0) {
            await this.removeSignState();
        }

        global.privateSpace = private_space;
        global.isValidToken = true;
        const time          = new Date().getTime();
        const response: any = await this.signStateModel.putSignState(token, private_space);
        NetworkLogService('/user/putSignState', time, {token, privateSpace: private_space}, true, true);
        return response;
    }

    public async removeSignState() {
        const time     = new Date().getTime();
        const response = await this.signStateModel.removeSignState();
        NetworkLogService('/user/removeSignState', time, {}, true, true);
        return response
    }

}

export default signStateService;
