import path      from "path";
import basicConf from "./basic.conf";

export default {
    'ENV'   : 'production',
    'APP'   : {
        'HOST': '172.81.225.130',
        'PORT': '5101'
    },
    'DB'    : {
        'TYPE': 'sqlite',
        'PATH': path.join(basicConf.ROOT_PATH, 'databases/localCache.db')
    },
    'SERVER': {
        'HOST': 'http://localhost',
        'PORT': '4001'
    }
}