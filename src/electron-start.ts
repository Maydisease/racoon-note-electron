import {app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, protocol, Tray, session}         from 'electron';
import {ClientCache, CurrentWindow, ServerProxy, ServerProxyUpload, GetUrlHeader, SystemBootLog} from './source/service';
import {config}                                                                                  from './source/config';
import {createdWindow}                                                                           from './source/core/service/createdWindow.service';
import {WindowManages}                                                                           from "./source/core/window_manages";
import {topBarMenuTemplateConf}                                                                  from "./source/config/menus/topBarMenu";
import {trayMenuTemplateConf}                                                                    from "./source/config/menus/trayMenu";
import path                                                                                      from "path";
import fs                                                                                        from "fs";
import * as systeminformation                                                                    from 'systeminformation';

console.log(process.versions);

protocol.registerSchemesAsPrivileged([
    {
        scheme    : 'racoon',
        privileges:
            {
                standard           : true,
                bypassCSP          : true,
                corsEnabled        : true,
                allowServiceWorkers: true,
                supportFetchAPI    : true,
            }
    },
    {
        scheme    : 'resource',
        privileges:
            {
                standard           : true,
                bypassCSP          : true,
                corsEnabled        : true,
                allowServiceWorkers: true,
                supportFetchAPI    : true,
            }
    }
]);

declare var global: {
    isValidToken: boolean,
    privateSpace: string,
    browserWindowList: {
        [key: string]: BrowserWindow
    }
    isTrueClose: boolean,
    service: any,
    systemBoot: {
        logs: any[]
    }
};

global.isValidToken      = false;
global.privateSpace      = '';
global.browserWindowList = {};
global.isTrueClose       = false;
global.systemBoot        = {
    logs: [
        {name: 'boot start...', time: new Date().getTime()}
    ]
};

ipcMain.on('getBrowserWindowList', (event: any) => {
    event.returnValue = global.browserWindowList;
});

let masterWindow: BrowserWindow | null;
let signWindow: BrowserWindow | null;
let statusWindow: BrowserWindow | null;
let networkMonitorWindow: BrowserWindow | null;
let UserOptionsWindow: BrowserWindow | null;
let bootMonitorWindow: BrowserWindow | null;
let topBarMenu: Menu;
let tray: Tray;
let trayMenu: Menu;

// 禁用硬件加速
app.disableHardwareAcceleration();
app.disableDomainBlockingFor3DAPIs();
// 单个实例锁
const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//     app.quit();
// }
app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (masterWindow) {
        if (masterWindow.isMinimized()) {
            masterWindow.restore();
        }
        masterWindow.focus()
    }
});

const appReadyInit = async () => {

    // 注册私有协议
    protocol.registerFileProtocol('racoon', async (protocolRequest, callback) => {
        const newProtocolRequest = await ClientCache('/attached/attached').adapter(protocolRequest);
        callback(newProtocolRequest)
    });

    // 注册私有协议
    // protocol.registerFileProtocol('resource', async (protocolRequest, callback) => {
    //     callback({path: '/racoon/electron/src/main.6d62cbbc.js'});
    // });

    SystemBootLog.put('app ready init...');
    bootMonitorWindow = await new WindowManages.bootMonitor(true).created();
    SystemBootLog.put('create boot monitor window...');
    networkMonitorWindow = await new WindowManages.networkMonitor(true).created();
    SystemBootLog.put('create netWork monitor window...');

    // 监听 networkPing 事件
    if (networkMonitorWindow) {
        ipcMain.on('networkPing', async (event) => {
            const address  = `${config.SERVER.HOST}`;
            const response = await systeminformation.inetChecksite(address);
            event.reply('networkPingReply', response.ms);
        });
    }

    // 获取当前网络状态
    const networkStatus = await systeminformation.inetChecksite(`${config.SERVER.HOST}:${config.SERVER.PORT}`);
    SystemBootLog.put('test network state...');

    if (networkStatus.status !== 200) {
        if (statusWindow && statusWindow.isVisible()) {
            statusWindow.focus();
        } else {
            statusWindow = new WindowManages.status(null, true).created();
        }
        return false;
    } else {
        if (statusWindow) {
            statusWindow.destroy();
        }
    }

    // 判断当前登陆状态
    const localCacheSignStateInfo = await ClientCache('/user/signState').getSignState();
    SystemBootLog.put('check local sign state...');
    if (localCacheSignStateInfo && localCacheSignStateInfo.token && localCacheSignStateInfo.token !== '') {
        const validToken = await new ServerProxy('User', 'verifySignState').send();
        SystemBootLog.put('check remote sign state...');
        global.isValidToken = validToken.result === 0;
        global.privateSpace = localCacheSignStateInfo.private_space;
    } else {
        global.isValidToken = false;
    }

    // 如果验证没有通过
    if (!global.isValidToken) {
        // 创建主窗口
        masterWindow = await new WindowManages.master(null, true).created();
        SystemBootLog.put('create master default window...');
        // 创建登陆窗口
        signWindow = await new WindowManages.sign(true, masterWindow as BrowserWindow).created();
        SystemBootLog.put('create sign window...');
    }
    // 如果验证通过了
    else {
        masterWindow = await new WindowManages.master('note', true).created();
        SystemBootLog.put('create master note window...');
    }

    // 置空topMenu
    Menu.setApplicationMenu(null);
    // 构建topMenu
    topBarMenu = Menu.buildFromTemplate(topBarMenuTemplateConf);
    // 设置topMenu
    Menu.setApplicationMenu(topBarMenu);

    // 创建托盘
    tray     = new Tray((nativeImage as any).createFromDataURL(config.ICONS['16x16'].source));
    trayMenu = Menu.buildFromTemplate(trayMenuTemplateConf);
    tray.setContextMenu(trayMenu);
    tray.on('double-click', () => {
        global.service.browserWindowList()['master'].show();
        global.service.browserWindowList()['master'].focus();
    });

    const bootMonitorWin = global.browserWindowList['bootMonitor'];
    bootMonitorWin.webContents.send('bootLogs', SystemBootLog.get());

};

app.on('ready', async () => {
    await appReadyInit();
});

// 所有窗口被关闭后
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // app.quit();
    }
});

// 在app退出之前
app.on('before-quit', () => {
    global.isTrueClose = true;
});

// 当app在dock栏上点击被激活后
app.on('activate', async (event: any, isShow: any) => {
    if (global.service.browserWindowList()['master']) {
        (global.service.browserWindowList()['master'] as BrowserWindow).show();
    }
    if (global.service.browserWindowList()['status']) {
        (global.service.browserWindowList()['status'] as BrowserWindow).show();
    }
});

global.service = {
    GetUrlHeader,
    appReadyInit,
    ServerProxy,
    ServerProxyUpload,
    CurrentWindow,
    browserWindowList: () => global.browserWindowList,
    ClientCache,
    WindowManages,
    Config           : config,
    CreatedWindow    : createdWindow,
    Process          : {
        platform: process.platform
    },
    RenderToRender   : {
        emit: (eventName: string, params: any = {}) => {
            const emitAuthor    = params.emitAuthor;
            const arr           = eventName.split('@');
            const targetWinHash = arr[0];
            const newEventName  = arr[1];
            const masterWin     = global.browserWindowList[targetWinHash];
            masterWin.webContents.send(`${emitAuthor}@${newEventName}`, params);
        }
    },
    DestroyTargetWin : (winHash: string) => {
        (global.browserWindowList[winHash] as BrowserWindow).destroy();
        delete global.browserWindowList[winHash];
    },
    AppReset         : () => {
        app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])});
        app.exit(0);
    },
    SignOut          : async () => {
        const validToken = await ClientCache('/user/signState').removeSignState();
        if (typeof validToken.raw === 'object' && validToken.raw.length === 0) {
            global.service.AppReset();
        }
    },

    SelectFiles: (parentWin: BrowserWindow, options: object) => {
        return new Promise((resolve, reject) => {
            const parentWin = global.browserWindowList['master'];
            dialog.showOpenDialog(parentWin, options).then((response) => {
                const {filePaths} = response;
                if (filePaths) {
                    const data: any = [];
                    filePaths.forEach(async (file: string, index: number) => {
                        const filePostfix    = path.extname(file);
                        const fileName       = path.basename(file);
                        const stat: fs.Stats = fs.statSync(file);
                        if (stat) {
                            data.push({name: fileName, type: filePostfix, size: stat.size, path: file});
                        }
                    });
                    resolve(data);
                } else {
                    resolve();
                }
            });
        });
    },

    localDbCache: {}
};
