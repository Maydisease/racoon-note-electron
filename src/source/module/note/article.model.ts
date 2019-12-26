import {Module}           from '../module';
import {articleEntity}    from '../../entity/article.entity';
import {Connection, Like} from 'typeorm';

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

class ArticleModel extends Module {

    constructor() {
        super();
    }

    public async getArticle(id: number) {
        const connection: Connection = await this.$connection;
        return await connection.getRepository(articleEntity).findOne(
            {
                where: [{id}],
                order: {
                    id: "DESC"
                }
            }
        );
    }

    // 更新文章数据到tableNoteArticle表
    public async addArticle(params: object) {

        const connection: Connection = await this.$connection;

        return connection
            .createQueryBuilder()
            .insert()
            .into(articleEntity)
            .values([params])
            .execute();
    }

    // 更新文章数据到tableNoteArticle表
    public async updateArticle(id: number, params: ArticleUpdateParams) {

        const connection: Connection = await this.$connection;

        const setBody: any = {
            cid       : params.cid,
            updateTime: params.updateTime
        };

        if (params.lock === 1 || params.lock === 0) {
            setBody.lock = params.lock
        }

        if (params.title) {
            setBody.title = params.title;
        }

        if (params.markdown_content) {
            setBody.markdown_content = params.markdown_content;
        }

        if (params.markdown_content) {
            setBody.html_content = params.html_content;
        }

        if (params.description) {
            setBody.description = params.description;
        }

        return connection
            .createQueryBuilder()
            .update(articleEntity)
            .set(setBody)
            .where('id = :id', {id})
            .execute();
    }

    public async getUserAllArticleIds() {
        const connection: Connection = await this.$connection;
        return await connection.getRepository(articleEntity).find(
            {
                select: ['id'],
                where : [{disable: 0}]
            }
        );
    }

    public async addMultipleArticle(data: any[]) {
        const connection: Connection = await this.$connection;

        return connection
            .createQueryBuilder()
            .insert()
            .into(articleEntity)
            .values(data)
            .execute();
    }

    public async cleanUserArticle() {
        const connection: Connection = await this.$connection;
        return await connection.createQueryBuilder()
                               .delete()
                               .from(articleEntity)
                               .where('id <> :id', {id: 0})
                               .execute();
    }

    public async searchArticle(keys: string, typeName: string, disable: number, lock: number) {
        const connection: Connection = await this.$connection;

        const where: any = {
            disable,
            lock
        };

        where[typeName] = Like(`%${keys}%`);

        const order: any = {};
        order[typeName]  = 'DESC';
        return connection.getRepository(articleEntity).find({where, order});
    }

}

export {ArticleModel};
