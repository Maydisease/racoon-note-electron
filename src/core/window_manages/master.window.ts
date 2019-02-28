import {ChromeExtensionsLoad} from "../../chrome_extensions";
import {BrowserWindow}        from 'electron';
import {config}               from "../../config";

declare var global: any;

export class MasterWindow {

    public win: BrowserWindow | null;
    public pageLoadURL: string;
    public onDevTools: boolean;
    public winHash: string;

    public option = {
        title          : 'note',
        width          : 1440,
        height         : 900,
        focusable      : true,
        show           : false,
        autoHideMenuBar: true,
        backgroundColor: '#1E2022',
        webPreferences : {
            webSecurity: true
        }
    };

    constructor(routePath: string | null = null, OnDevTools: boolean, Option: any = {}) {
        this.winHash     = 'master';
        this.win         = null;
        this.pageLoadURL = `${config.APP.HOST}:${config.APP.PORT}/${routePath ? routePath : ''}`;
        this.option      = {...this.option, ...Option};
        this.onDevTools  = OnDevTools;
        console.log(this.pageLoadURL);
    }

    public created(): BrowserWindow {

        this.win = new BrowserWindow(this.option);

        this.win.loadURL(`http://${this.pageLoadURL}`);

        this.win.once('ready-to-show', () => {
            (this.win as BrowserWindow).show();
            global.browserWindowList[this.winHash] = this.win;
            this.onDevTools && config.ENV === 'development' && (this.win as BrowserWindow).webContents.openDevTools() && ChromeExtensionsLoad();
        });

        this.win.on('close', (e) => {
            if (process.platform !== 'darwin') {
                this.destroy();
            }
        });

        return this.win;

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