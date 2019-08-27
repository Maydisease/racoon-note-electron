import {Module}          from '../module';
import {SignStateEntity} from '../../entity/signState.entity';

class SignStateModel extends Module {

    constructor() {
        super();
    }

    public async getSignState() {
        const connection = await this.$connection;
        return await connection
            .getRepository(SignStateEntity)
            .createQueryBuilder()
            .getOne();
    }

    public async verifySignState() {
        const connection = await this.$connection;
        return await connection
            .getRepository(SignStateEntity)
            .createQueryBuilder()
            .getCount();
    }

    public async putSignState(token: string, private_space: string) {
        const connection = await this.$connection;
        return await connection
            .getRepository(SignStateEntity)
            .createQueryBuilder()
            .insert()
            .into(SignStateEntity)
            .values([
                {token, private_space}
            ])
            .execute();
    }

    public async removeSignState() {
        const connection = await this.$connection;
        return await connection
            .createQueryBuilder()
            .delete()
            .from(SignStateEntity)
            .execute();
    }

}

export {SignStateModel};
