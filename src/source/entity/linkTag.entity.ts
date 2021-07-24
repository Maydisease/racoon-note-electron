import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class linkTagEntity extends BaseEntity {

    constructor() {
        super();
    }

    // 缓存Id
    @PrimaryGeneratedColumn()
    _id!: number;

    // 文章Id
    @Column({type: 'int', precision: 11})
    id!: number;

    // 标签名称
    @Column('varchar')
    name!: string;

    // 用户Id
    @Column({type: 'varchar', length: 13})
    uid!: string;

    // 更新时间
    @Column({type: 'int', precision: 13})
    updateTime!: number;

    // 初次写入时间
    @Column({type: 'int', precision: 13})
    inputTime!: number;

}
