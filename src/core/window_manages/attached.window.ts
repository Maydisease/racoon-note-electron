import {ChromeExtensionsLoad} from "../../chrome_extensions";
import {BrowserWindow}        from 'electron';
import {config}               from "../../config";

declare var global: any;

export class AttachedWindow {

    public win: BrowserWindow | null;
    public pageLoadURL: string;
    public onDevTools: boolean;
    public winHash: string;

    public option = {
        title          : 'Attached',
        minimizable    : false,
        maximizable    : false,
        // minWidth       : 500,
        // minHeight      : 328,
        width          : 1024,
        height         : 768,
        // maxWidth       : 750,
        // maxHeight      : 500,
        show           : false,
        closable       : false,
        fullscreenable : false,
        resizable      : true,
        autoHideMenuBar: true,
        parent         : (global.browserWindowList as any)['master'],
        backgroundColor: '#1E2022',
        webPreferences : {
            webSecurity: true
        }
    };

    constructor(OnDevTools: boolean, Option: any = {}) {
        this.winHash     = 'attached';
        this.win         = null;
        this.pageLoadURL = `${config.APP.HOST}:${config.APP.PORT}/attached`;
        this.option      = {...this.option, ...Option};
        this.onDevTools  = OnDevTools;
    }

    public created(): BrowserWindow | void {

        if (!global.browserWindowList[this.winHash]) {

            this.win = new BrowserWindow(this.option);

            this.win.loadURL(this.pageLoadURL);

            this.win.once('ready-to-show', () => {
                (this.win as BrowserWindow).show();
                this.onDevTools && config.ENV === 'development' && (this.win as BrowserWindow).webContents.openDevTools() && ChromeExtensionsLoad();
            });

            this.win.on('close', (e) => {
                this.destroy();
            });

            global.browserWindowList[this.winHash] = this.win;

            return this.win;
        }

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