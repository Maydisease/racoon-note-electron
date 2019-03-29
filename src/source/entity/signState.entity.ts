import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class SignStateEntity extends BaseEntity {

    constructor() {
        super();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', nullable: true})
    token!: string;

    @Column({type: 'varchar', nullable: true})
    private_space!: string

}