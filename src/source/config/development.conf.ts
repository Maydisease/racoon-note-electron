import path      from 'path';
import basicConf from './basic.conf';

export default {
    'ENV'   : 'development',
    'APP'   : {
        'HOST': 'http://localhost',
        'PORT': '3000'
    },
    'DB'    : {
        'TYPE': 'sqlite',
        'PATH': path.join(basicConf.ROOT_PATH, 'databases', 'localdb.db')
    },
    'SERVER': {
        'HOST': 'http://localhost',
        'PORT': '4001',
        'ATTACHED_FILES': {
            'HOST': 'http://localhost',
            'PORT': '4001',
        }
    },
    'CHROME_EXTENSIONS': {
        'ReduxDevTools' : '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0'
    }
}
