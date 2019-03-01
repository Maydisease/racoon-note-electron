import path      from "path";
import basicConf from "./basic.conf";

export default {
    'ENV'   : 'production',
    'APP'   : {
        'HOST': 'http://note-web.wunao.net',
        'PORT': '80'
    },
    'DB'    : {
        'TYPE': 'sqlite',
        'PATH': path.join(basicConf.ROOT_PATH, 'databases/localCache.db')
    },
    'SERVER': {
        'HOST': 'http://note-server.wunao.net',
        'PORT': '80'
    }
}