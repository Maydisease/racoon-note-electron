import {Module}            from '../module';
import {userSettingEntity} from '../../entity/userSetting.entity';
import {SignStateEntity}   from "../../entity/signState.entity";

class SettingModel extends Module {

    constructor() {
        super();
    }

    public async getSetting() {
        return 'xxxx'
    }

    public async updateSetting(userOptionsJsonString: string) {
        const connection = await this.$connection;
        return await connection
            .getRepository(userSettingEntity)
            .createQueryBuilder()
            .insert()
            .into(userSettingEntity)
            .values([
                {user_options: userOptionsJsonString}
            ])
            .execute();
    }

}

export {SettingModel};
