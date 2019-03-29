import {app} from 'electron'

declare var global: {
    isValidToken: boolean,
    privateSpace: string,
    browserWindowList: any
    isTrueClose: boolean,
    service: any
};

import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

export const trayMenuTemplateConf: MenuItemConstructorOptions[] = [
    {
        label: 'show',
        click: () => {
            global.browserWindowList['master'].show();
        }
    },
    {
        label: 'exit',
        click: () => {
            app.exit();
        }
    }
];