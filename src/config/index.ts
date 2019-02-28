import development from './development.conf';
import production  from './production.conf';
import basic from './basic.conf';

export const config = Object.assign(basic, process.env.NODE_ENV === 'development' ? development : production);