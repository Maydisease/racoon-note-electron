import {Connection, createConnection} from "typeorm";
import {config}                       from "../config";
import {SignStateEntity}              from '../entity/signState.entity';

const connection: any = createConnection({
    type       : "sqlite",
    name       : 'main',
    database   : config.DB.PATH,
    entities   : [SignStateEntity],
    synchronize: true,
    logging    : true
});

class Module {

    public $connection: Connection;

    constructor() {
        this.$connection = connection;
    }

}

export {Module};