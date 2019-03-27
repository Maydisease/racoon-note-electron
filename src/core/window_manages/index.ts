import {MasterWindow}   from './master.window';
import {SignWindow}     from "./sign.window";
import {SearchWindow}   from "./search.window";
import {AttachedWindow} from './attached.window';
import {StatusWindow}   from './status.window';

const WindowManages = {
    master  : MasterWindow,
    sign    : SignWindow,
    search  : SearchWindow,
    attached: AttachedWindow,
    status  : StatusWindow
};

export {WindowManages}

