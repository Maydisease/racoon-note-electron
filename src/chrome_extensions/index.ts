import {config}        from "../config";
import path            from "path";
import os              from "os";
import fs              from "fs";
import {BrowserWindow} from "electron";

const ChromeExtensionsLoad = () => {
    // TODO https://electronjs.org/docs/tutorial/devtools-extension
    // TODO https://github.com/zalmoxisus/redux-devtools-extension/issues/126
    if (config.ENV !== 'development') {
        return false;
    }
    const ReduxDevTools = path.join(os.homedir(), config.CHROME_EXTENSIONS.ReduxDevTools);
    if (fs.existsSync(ReduxDevTools)) {
        BrowserWindow.addDevToolsExtension(ReduxDevTools)
    }
};

export {ChromeExtensionsLoad}