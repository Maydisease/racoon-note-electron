import {LinkTagModel} from './linkTag.model';
import {NetworkLogService} from '../../service';
import {utils} from '../../utils';

interface BookMarkTagUpdateParams {
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

class LinkTagService {

	public bookMarkModel: LinkTagModel;

	constructor() {
		this.bookMarkModel = new LinkTagModel();
	}

	// 更新文章详情
	public async updateBookMarkTag(params: BookMarkTagUpdateParams[]) {

		console.log('updateBookMark0:::', params);

		const time = new Date().getTime();
		const response = await this.bookMarkModel.updateBookMarkTag(params);
		NetworkLogService('/bookMark/updateBookMarkTag', time, {...params}, true, true);
		return response
	}

	// 更新文章详情
	public async removeAllBookMarkTag() {
		const time = new Date().getTime();
		const response = await this.bookMarkModel.removeAllBookMarkTag();
		NetworkLogService('/bookMark/removeAllBookMarkTag', time, {}, true, true);
		return response
	}

	// 搜索关键字
	public async searchTag(keys: string) {
		const time = new Date().getTime();
		const response = await this.bookMarkModel.searchTag(keys);
		NetworkLogService('/bookMark/searchTag', time, {}, true, true);
		return response
	}

}

export default LinkTagService;
