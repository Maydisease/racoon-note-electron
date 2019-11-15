import {MasterWindow}         from './master.window';
import {SignWindow}           from "./sign.window";
import {SearchWindow}         from "./search.window";
import {AttachedWindow}       from './attached.window';
import {StatusWindow}         from './status.window';
import {NetworkMonitorWindow} from './networkMonitor.window';
import {BootMonitorWindow}    from './bootMonitor.window';

const WindowManages = {
    master        : MasterWindow,
    sign          : SignWindow,
    search        : SearchWindow,
    attached      : AttachedWindow,
    status        : StatusWindow,
    networkMonitor: NetworkMonitorWindow,
    bootMonitor   : BootMonitorWindow
};

export {WindowManages}

