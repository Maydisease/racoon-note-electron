type LogType = 'sync' | 'async';

interface Log {
    name: string,
    time: number,
    type: LogType
}

class SystemBootLogService {

    public logs: Log[];

    constructor() {
        this.logs = [];
    }

    public put(name: string, type: LogType = 'sync') {
        const time     = new Date().getTime();
        const log: Log = {
            name,
            time,
            type,
        };
        this.logs.push(log);
    }

    public get() {
        return this.logs
    }
}

export const SystemBootLog = new SystemBootLogService();
