import {ArticleModel} from './article.model';

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
        return await this.articleModel.getArticle(id);
    }

    // 更新文章详情
    public async updateArticle(id: number, params: ArticleUpdateParams) {
        return await this.articleModel.updateArticle(id, params);
    }

    // 添加文章
    public async addArticle(params: ArticleAddParams) {
        return await this.articleModel.addArticle(params);
    }

}

export default articleService;
