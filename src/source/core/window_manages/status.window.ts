import {app, BrowserWindow, BrowserWindowConstructorOptions}   from 'electron';
import {config}               from "../../config";
import path                   from "path";
import {ChromeExtensionsLoad} from "../../chrome_extensions";

declare var global: any;

export class StatusWindow {

    public win: BrowserWindow | null;
    public pageLoadURL: string;
    public onDevTools: boolean;
    public winHash: string;

    public option: BrowserWindowConstructorOptions = {
        title          : 'status',
        width          : 400,
        height         : 230,
        focusable      : true,
        show           : false,
        autoHideMenuBar: true,
        resizable      : true,
        frame          : false,
        minimizable    : false,
        maximizable    : false,
        fullscreenable : false,
        titleBarStyle  : 'hiddenInset',
        backgroundColor: '#00000000',
        vibrancy       : 'ultra-dark',
        webPreferences : {
            nodeIntegration        : true,
            nodeIntegrationInWorker: true,
            webSecurity            : true,
            scrollBounce           : true
        }
    };

    constructor(routePath: string | null = null, OnDevTools: boolean, Option: BrowserWindowConstructorOptions = {}) {
        const time       = new Date().getTime();
        this.winHash     = 'status';
        this.win         = null;
        this.pageLoadURL = `${path.join(config.HTML_PATH, './status.html')}?time=${time}`;

        if (process.platform !== 'darwin') {
            delete this.option.frame;
            delete this.option.titleBarStyle;
            delete this.option.vibrancy;
            this.option.backgroundColor = '#1E2022';
        }

        this.option = {...this.option, ...Option};

        this.onDevTools = OnDevTools;
    }

    public created(): BrowserWindow {

        this.win = new BrowserWindow(this.option);

        this.win.loadFile(path.join(config.HTML_PATH, './status.html'));

        this.win.once('ready-to-show', () => {
            (this.win as BrowserWindow).show();
            global.browserWindowList[this.winHash] = this.win;
            // (this.win as BrowserWindow).webContents.openDevTools();
            this.onDevTools && config.ENV === 'development' && (this.win as BrowserWindow).webContents.openDevTools() && ChromeExtensionsLoad();
        });

        this.win.on('close', (e) => {
            console.log('close');
            app.exit();
        });

        return this.win;

    }

    public getWin() {

    }

    public destroy() {
        console.log('destroy');
        delete global.browserWindowList[this.winHash];
        (this.win as BrowserWindow).destroy();
        this.win = null;
    }

}
