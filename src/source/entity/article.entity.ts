import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class articleEntity extends BaseEntity {

    constructor() {
        super();
    }

    // 缓存Id
    @PrimaryGeneratedColumn()
    _id!: number;

    // 文章Id
    @Column({type: 'int', precision: 11})
    id!: number;

    // 文章标题
    @Column('varchar')
    title!: string;

    // 用户Id
    @Column({type: 'varchar', length: 13})
    uid!: string;

    // 栏目Id
    @Column({type: 'int', precision: 11})
    cid!: number;

    // markdown内容
    @Column({type: 'varchar', nullable: true})
    markdown_content!: string;

    // html内容
    @Column({type: 'varchar', nullable: true})
    html_content!: string;

    // 摘要
    @Column({type: 'varchar', nullable: true})
    description!: string;

    // 锁定
    @Column({type: 'int', default: 0})
    lock!: number;

    // 禁用
    @Column({type: 'int', default: 0})
    disable!: number;

    // 更新时间
    @Column({type: 'int', precision: 13})
    updateTime!: number;

    // 初次写入时间
    @Column({type: 'int', precision: 13})
    inputTime!: number;

}
