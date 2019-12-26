import {ArticleModel}      from './article.model';
import {NetworkLogService} from "../../service";
import {utils}             from "../../utils";

interface ArticleUpdateParams {
    _id?: number,
    id?: number,
    title?: string;
    uid?: string;
    cid?: number;
    lock?: number;
    markdown_content?: string;
    html_content?: string;
    description?: string;
    updateTime?: string;
}

interface ArticleAddParams {
    _id?: number,
    id?: number,
    title?: string;
    uid?: string;
    cid?: number;
    lock?: number;
    markdown_content?: string;
    html_content?: string;
    description?: string;
    updateTime?: string;
}

class articleService {

    public articleModel: ArticleModel;

    constructor() {
        this.articleModel = new ArticleModel();
    }

    // 获取文章详情
    public async getArticle(id: number) {
        const time     = new Date().getTime();
        const response = await this.articleModel.getArticle(id);
        NetworkLogService('/note/getArticle', time, {id}, true, true);
        return response
    }

    // 更新文章详情
    public async updateArticle(id: number, params: ArticleUpdateParams) {
        const time     = new Date().getTime();
        const response = await this.articleModel.updateArticle(id, params);
        NetworkLogService('/note/updateArticle', time, {id, ...params}, true, true);
        return response
    }

    // 添加文章
    public async addArticle(params: ArticleAddParams) {
        const time     = new Date().getTime();
        const response = await this.articleModel.addArticle(params);
        NetworkLogService('/note/addArticle', time, params, true, true);
        return response;
    }

    public async getUserAllArticleIds(): Promise<number[]> {
        const ids: number[] = [];
        const time          = new Date().getTime();
        const response      = await this.articleModel.getUserAllArticleIds();
        if (response && response.length > 0) {
            response.forEach((item: any) => {
                ids.push(item.id);
            });
        }
        NetworkLogService('/note/getUserAllArticleIds', time, {}, true, true);
        return ids;
    }

    public async addUserAllArticle(data: any[]) {
        const time     = new Date().getTime();
        const response = await this.articleModel.addMultipleArticle(data);
        NetworkLogService('/note/addUserAllArticle', time, {}, true, true);
        return response;
    }

    public async cleanUserArticle() {
        const time     = new Date().getTime();
        const response = await this.articleModel.cleanUserArticle();
        NetworkLogService('/note/cleanUserArticle', time, {}, true, true);
        return response;
    }

    public async searchArticle(params: any) {
        const time = new Date().getTime();
        // keys: string, type: string, disable: number, lock: number

        const keys    = params.keys || '';
        let type      = params.type;
        let typeName  = type === 0 ? 'title' : 'markdown_content';
        const disable = 0;
        const lock    = 0;

        const searchData = await this.articleModel.searchArticle(keys, typeName, disable, lock);

        searchData.forEach((item: any, index: number) => {
            const keysLengthMax = 20;
            let htmlContent     = utils.removeHtmlTag((searchData[index] as any).html_content);
            const startIndex    = htmlContent.indexOf(params.keys);

            if (startIndex > keysLengthMax) {
                htmlContent = htmlContent.substring(startIndex - keysLengthMax, startIndex + params.keys.length + keysLengthMax);
            } else {
                htmlContent = htmlContent.substring(0, startIndex + params.keys.length + keysLengthMax);
            }

            const maxLength                            = 50;
            let des                                    = item.html_content ? utils.removeHtmlTag(item.html_content) : '';
            des                                        = des.length > maxLength ? des.substring(0, maxLength) + '...' : des;
            (searchData[index] as any).description     = des;
            (searchData[index] as any).keysDescription = htmlContent;
        });

        NetworkLogService('/note/searchArticle', time, {}, true, true);
        return searchData;
    }

}

export default articleService;
