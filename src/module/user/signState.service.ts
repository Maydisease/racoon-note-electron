import {SignStateModel} from './signState.model';

declare var global: any;

class signStateService {

    public signStateModel: SignStateModel;

    constructor() {
        this.signStateModel = new SignStateModel();
    }

    public async getSignState() {
        return await this.signStateModel.getSignState();
    }

    public verifySignState() {
        return this.signStateModel.verifySignState();
    }

    public async putSignState(token: string, private_space: string): Promise<object> {

        if (await this.verifySignState() > 0) {
            await this.removeSignState();
        }

        global.privateSpace = private_space;
        global.isValidToken = true;
        const response: any = await this.signStateModel.putSignState(token, private_space);

        return response;
    }

    public async removeSignState() {
        return await this.signStateModel.removeSignState();
    }

}

export default signStateService;