import {ArticleModel}      from './article.model';
import {NetworkLogService} from "../../service";

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
        const response      = await this.articleModel.getUserAllArticleIds();
        if (response && response.length > 0) {
            response.forEach((item: any) => {
                ids.push(item.id);
            });
        }

        return ids;
    }

    public async addUserAllArticle(data: any[]) {
        const response = await this.articleModel.addMultipleArticle(data);
        return response;
    }

    public async cleanUserArticle() {
        const response = await this.articleModel.cleanUserArticle();
        console.log('cleanUserArticle', response);
        return response;
    }

}

export default articleService;
