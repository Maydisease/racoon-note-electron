declare var global: any;
import {ChromeExtensionsLoad} from "../../chrome_extensions";
import {BrowserWindow}        from 'electron';
import {config}               from "../../config";

export class SignWindow {

    public win: BrowserWindow | null;
    public pageLoadURL: string;
    public onDevTools: boolean;
    public winHash: string;
    public parentWin: BrowserWindow;

    public option = {
        title          : 'SignIn&SignUp',
        minimizable    : false,
        maximizable    : false,
        width          : 340,
        height         : 380,
        minWidth       : 340,
        minHeight      : 380,
        closable       : false,
        show           : false,
        fullscreenable : false,
        resizable      : config.ENV === 'development',
        autoHideMenuBar: true,
        parent         : global.browserWindowList['master'],
        backgroundColor: '#1E2022',
        webPreferences : {
            nodeIntegration        : true,
            nodeIntegrationInWorker: true,
            webSecurity            : true
        }
    };

    constructor(OnDevTools: boolean, parentWin: BrowserWindow, Option: any = {}) {
        const time       = new Date().getTime();
        this.winHash     = 'sign';
        this.win         = null;
        this.parentWin   = parentWin;
        this.pageLoadURL = `${config.APP.HOST}:${config.APP.PORT}/sign_in?time=${time}`;
        this.option      = {...this.option, ...Option};
        this.onDevTools  = OnDevTools;
    }

    public created(): BrowserWindow {
        this.option.parent = this.parentWin;
        this.win           = new BrowserWindow(this.option);

        this.win.loadURL(this.pageLoadURL);

        this.win.once('ready-to-show', () => {
            (this.win as BrowserWindow).show();
            global.browserWindowList[this.winHash] = this.win;
            this.onDevTools && config.ENV === 'development' && (this.win as BrowserWindow).webContents.openDevTools() && ChromeExtensionsLoad();
        });

        const position = this.win.getPosition();
        this.win.setPosition(position[0] + 400, position[1] - 50);

        this.win.on('close', (e) => {
            this.destroy();
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
