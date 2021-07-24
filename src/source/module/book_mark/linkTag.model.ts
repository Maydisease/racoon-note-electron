import {Module} from '../module';
import {linkTagEntity} from '../../entity/linkTag.entity';
import {Connection, Like} from 'typeorm';
import {articleEntity} from '../../entity/article.entity'

class LinkTagModel extends Module {

	constructor() {
		super();
	}

	public async updateBookMarkTag(params: any[]) {


		console.log('updateBookMark:::', params);

		const connection: Connection = await this.$connection;
		return connection
			.createQueryBuilder()
			.insert()
			.into(linkTagEntity)
			.values(params)
			.execute();
	}

	public async removeAllBookMarkTag() {
		const connection: Connection = await this.$connection;
		return await connection.createQueryBuilder()
		                       .delete()
		                       .from(linkTagEntity)
		                       .where('id <> :id', {id: 0})
		                       .execute();
	}

	public async searchTag(keys: string) {
		console.log('keyskeys:', keys);
		const connection: Connection = await this.$connection;
		const where: any = {};
		where['name'] = Like(`%${keys}%`);
		const order: any = {};
		order['name'] = 'DESC';
		return connection.getRepository(linkTagEntity).find({where, order});
	}


}

export {LinkTagModel};
