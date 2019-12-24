import {ChromeExtensionsLoad} from "../../chrome_extensions";
import {BrowserWindow, BrowserWindowConstructorOptions}        from 'electron';
import {config}               from "../../config";
import path                   from "path";

declare var global: any;

export class BootMonitorWindow {

    public win: BrowserWindow | null;
    public onDevTools: boolean;
    public winHash: string;

    public option: BrowserWindowConstructorOptions = {
        title          : 'boot monitor',
        minimizable    : false,
        maximizable    : false,
        minWidth       : 460,
        minHeight      : 300,
        width          : 460,
        height         : 300,
        maxWidth       : 460,
        maxHeight      : 300,
        show           : false,
        closable       : true,
        fullscreenable : false,
        resizable      : config.ENV === 'development',
        autoHideMenuBar: true,
        modal          : true,
        parent         : (global.browserWindowList as any)['master'],
        backgroundColor: '#1E2022',
        webPreferences : {
            nodeIntegration        : true,
            nodeIntegrationInWorker: true,
            webSecurity            : true
        }
    };

    constructor(OnDevTools: boolean, Option: BrowserWindowConstructorOptions = {}) {
        this.winHash    = 'bootMonitor';
        this.win        = null;
        this.option     = {...this.option, ...Option};
        this.onDevTools = OnDevTools;
    }

    public created(): Promise<BrowserWindow | null> {

        return new Promise((resolve: any, reject: any) => {
            if (!global.browserWindowList[this.winHash]) {

                this.win = new BrowserWindow(this.option);

                this.win.loadFile(path.join(config.HTML_PATH, './monitor/boot/index.html'));

                this.win.once('ready-to-show', () => {
                    (this.win as BrowserWindow).hide();
                    (this.win as BrowserWindow).setAlwaysOnTop(true);
                    resolve(this.win);
                    this.onDevTools && config.ENV === 'development' && (this.win as BrowserWindow).webContents.openDevTools() && ChromeExtensionsLoad();
                });

                this.win.on('close', (e) => {
                    (this.win as BrowserWindow).hide();
                    e.preventDefault();
                });

                global.browserWindowList[this.winHash] = this.win;
            }
        });

    }

    public getWin(): BrowserWindow | null {
        return this.win;
    }

    public destroy() {
        delete global.browserWindowList[this.winHash];
        (this.win as BrowserWindow).destroy();
        this.win = null;
    }

}
