import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class userSettingEntity extends BaseEntity {

    constructor() {
        super();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', nullable: true})
    user_options!: string;

}
