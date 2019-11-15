declare var global: any;

const NetworkLogService = (path: string, startTime: number, params = {}, status: boolean = true, isCache: boolean = false) => {
    if (global) {
        const networkMonitorWin = global.browserWindowList['networkMonitor'];
        const body              = {
            path,
            params,
            startTime,
            endTime: new Date().getTime(),
            status,
            isCache
        };
        networkMonitorWin.webContents.send('httpLogs', body);
    }
};


export {NetworkLogService};
