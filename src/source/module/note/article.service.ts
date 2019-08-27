import {ArticleModel} from './article.model';

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
    public async updateArticle(id: number, params: object) {
        return await this.articleModel.updateArticle(id, params);
    }

    // 添加文章
    public async addArticle(params: object) {
        return await this.articleModel.addArticle(params);
    }

}

export default articleService;
