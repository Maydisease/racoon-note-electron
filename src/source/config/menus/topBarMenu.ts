// import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import {app} from 'electron'

declare var global: any;
export const topBarMenuTemplateConf: any = [
    {
        label  : '',
        submenu: [
            {
                label: 'About Racoon',
                role : 'about'
            },
            {type: 'separator'},
            {
                label: 'Preferences',
            },
            {type: 'separator'},
            {
                label: 'Exit Racoon',
                click: () => {
                    app.exit();
                }
            }
        ]
    },
    {
        label  : 'Edit',
        submenu: [
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {
                label      : 'Save',
                accelerator: 'CmdOrCtrl+S',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    if (masterWin.isFocused()) {
                        masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_S');
                    }
                }
            },
        ]
    },
    {
        label  : 'Search',
        submenu: [
            {
                label      : 'Search',
                accelerator: 'CmdOrCtrl+F',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_F');
                }
            },
            {
                label      : 'Advanced Search',
                accelerator: 'CmdOrCtrl+Shift+F',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_SHIFT_F');
                }
            },
        ]
    },
    {
        label  : 'View',
        submenu: [
            {
                label      : 'Edit Model',
                accelerator: 'CmdOrCtrl+E',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    if (masterWin.isFocused()) {
                        masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_E');
                    }
                }
            },
            {
                label      : 'Full Model',
                accelerator: 'CmdOrCtrl+W',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    if (masterWin.isFocused()) {
                        masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_W');
                    }
                }
            },
        ]
    }
];
