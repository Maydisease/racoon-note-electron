import {Connection, createConnection} from "typeorm";
import {config}                       from "../config";
import {SignStateEntity}              from '../entity/signState.entity';
import {articleEntity}                from '../entity/article.entity';

const connection: any = createConnection({
    type       : "sqlite",
    name       : 'main',
    database   : config.DB.PATH,
    entities   : [SignStateEntity, articleEntity],
    synchronize: true,
    logging    : config.ENV === 'development'
});

class Module {

    public $connection: Connection;

    constructor() {
        this.$connection = connection;
    }

}

export {Module};
