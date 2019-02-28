import {SignStateModel} from './signState.model';

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

    public async putSignState(token: string): Promise<object> {

        let response: any = '';

        if (await this.verifySignState() > 0) {
            await this.removeSignState();
            response = await this.signStateModel.putSignState(token);
        } else {
            response = await this.signStateModel.putSignState(token);
        }

        return response;
    }

    public async removeSignState() {
        return await this.signStateModel.removeSignState();
    }

}

export default signStateService;