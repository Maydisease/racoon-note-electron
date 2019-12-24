import {app, BrowserWindow, BrowserWindowConstructorOptions} from 'electron';
import {config}                                              from "../../config";
import {ChromeExtensionsLoad}                                from "../../chrome_extensions";

declare var global: any;

export class MasterWindow {

    public win: BrowserWindow | null;
    public pageLoadURL: string;
    public onDevTools: boolean;
    public winHash: string;

    public option: BrowserWindowConstructorOptions = {
        title          : 'note',
        width          : 1440,
        height         : 900,
        minWidth       : 960,
        minHeight      : 600,
        focusable      : true,
        show           : false,
        autoHideMenuBar: true,
        resizable      : true,
        backgroundColor: '#1E2022',
        webPreferences : {
            nodeIntegration        : true,
            nodeIntegrationInWorker: true,
            webSecurity            : true
        }
    };

    constructor(routePath: string | null = null, OnDevTools: boolean, Option: BrowserWindowConstructorOptions = {}) {
        const time       = new Date().getTime();
        this.winHash     = 'master';
        this.win         = null;
        this.pageLoadURL = `${config.APP.HOST}:${config.APP.PORT}/${routePath ? routePath : ''}?time=${time}`;
        this.option      = {...this.option, ...Option};
        this.onDevTools  = OnDevTools;
    }

    public created(): Promise<BrowserWindow | null> {

        return new Promise((resolve, reject) => {

            this.win = new BrowserWindow(this.option);

            this.win.loadURL(this.pageLoadURL);
            this.win.once('ready-to-show', () => {
                (this.win as BrowserWindow).show();
                global.browserWindowList[this.winHash] = this.win;
                this.onDevTools && config.ENV === 'development' && (this.win as BrowserWindow).webContents.openDevTools() && ChromeExtensionsLoad();
                resolve(this.win);
            });

            this.win.on('close', (e) => {
                if (!global.isTrueClose) {
                    (this.win as BrowserWindow).hide();
                    e.preventDefault();
                } else {
                    app.exit();
                }
            });

        });
    }

    public getWin() {

    }

    public destroy() {
        delete global.browserWindowList[this.winHash];

        (this.win as BrowserWindow).destroy();
        this.win = null;
    }

}
