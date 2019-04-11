import {app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, protocol, Tray} from 'electron';
import {ClientCache, CurrentWindow, ServerProxy, ServerProxyUpload}             from './source/service';
import {config}                                                                 from './source/config';
import {createdWindow}                                                          from './source/core/service/createdWindow.service';
import {WindowManages}          from "./source/core/window_manages";
import {topBarMenuTemplateConf} from "./source/config/menus/topBarMenu";
import {trayMenuTemplateConf}   from "./source/config/menus/trayMenu";
import path                     from "path";
import fs                       from "fs";
import * as systeminformation   from 'systeminformation';

protocol.registerStandardSchemes(['racoon']);

declare var global: {
    isValidToken: boolean,
    privateSpace: string,
    browserWindowList: any
    isTrueClose: boolean,
    service: any
};


global.isValidToken      = false;
global.privateSpace      = '';
global.browserWindowList = {};
global.isTrueClose       = false;

ipcMain.on('getBrowserWindowList', (event: any) => {
    event.returnValue = global.browserWindowList;
});

let masterWindow: BrowserWindow;
let signWindow: BrowserWindow;
let statusWindow: BrowserWindow;
let topBarMenu: Menu;
let tray: Tray;
let trayMenu: Menu;

// 禁用硬件加速
app.disableHardwareAcceleration();
app.disableDomainBlockingFor3DAPIs();
// 单个实例锁
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
}
app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (masterWindow) {
        if (masterWindow.isMinimized()) {
            masterWindow.restore();
        }
        masterWindow.focus()
    }
});

const appReadyInit = async () => {

    const networkStatus = await systeminformation.inetChecksite(`${config.SERVER.HOST}:${config.SERVER.PORT}`);

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

    const localCacheSignStateInfo = await ClientCache('/user/signState').getSignState();
    if (localCacheSignStateInfo && localCacheSignStateInfo.token && localCacheSignStateInfo.token !== '') {
        const validToken    = await new ServerProxy('User', 'verifySignState').send();
        global.isValidToken = validToken.result === 0;
        global.privateSpace = localCacheSignStateInfo.private_space;
    } else {
        global.isValidToken = false;
    }

    if (!global.isValidToken) {
        masterWindow = new WindowManages.master(null, true).created();
        signWindow   = new WindowManages.sign(true, masterWindow).created();
    } else {
        masterWindow = new WindowManages.master('note', true).created();
    }

    Menu.setApplicationMenu(null);
    topBarMenu = Menu.buildFromTemplate(topBarMenuTemplateConf);
    Menu.setApplicationMenu(topBarMenu);

    tray     = new Tray((nativeImage as any).createFromDataURL(config.ICONS['16x16'].source));
    trayMenu = Menu.buildFromTemplate(trayMenuTemplateConf);
    tray.setContextMenu(trayMenu);
    tray.on('double-click', () => {
        global.service.browserWindowList()['master'].show();
        global.service.browserWindowList()['master'].focus();
    });

    // 注册私有协议
    protocol.registerHttpProtocol('racoon', async (protocolRequest, callback) => {
        const newProtocolRequest = await ClientCache('/attached/attached').adapter(protocolRequest);
        callback(newProtocolRequest)
    });
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
    SelectFiles      : (parentWin: BrowserWindow, options: object) => {
        return new Promise((resolve, reject) => {
            const parentWin = global.browserWindowList['master'];
            dialog.showOpenDialog(parentWin, options, (files: string[]) => {
                if (files) {
                    const data: any = [];
                    files.forEach(async (file: string, index: number) => {
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
    }
};