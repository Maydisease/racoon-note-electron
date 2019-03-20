import {config}        from "../../config";
import {BrowserWindow} from "electron";

const createdWindow = (options: object, renderAddress: string) => {

    let windowProcess: BrowserWindow | null = null;

    windowProcess = new BrowserWindow(options);
    switch (config.ENV) {
        case 'development':
            windowProcess.loadURL(`http://${renderAddress}`);
            break;
        default:
            windowProcess.loadFile(`file://${renderAddress}`);
            break;
    }

    windowProcess.once('ready-to-show', () => {
        (<any>windowProcess).show();
        // (<any>windowProcess).webContents.openDevTools();
    });

    windowProcess.on('closed', () => {
        console.log('close');
    });

    return windowProcess;
};

export {
    createdWindow
}