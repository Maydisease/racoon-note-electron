import {SettingModel}      from './setting.model';
import ArticleService      from '../note/article.service';
import {NetworkLogService} from "../../service";

declare var global: any;

class signStateService {

    public settingModel: SettingModel;
    public articleService: ArticleService;

    constructor() {
        this.settingModel   = new SettingModel();
        this.articleService = new ArticleService();
    }

    public async getSetting() {
        const response = await this.settingModel.getSetting();
        return response
    }

    public async updateSetting(userOptionsJsonString: string) {
        const response = await this.settingModel.updateSetting(userOptionsJsonString);
        return response
    }

}

export default signStateService;
