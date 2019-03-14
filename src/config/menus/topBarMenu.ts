import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

declare var global: any;
export const topBarMenuTemplateConf: MenuItemConstructorOptions[] = [
    {
        label  : '',
        submenu: [
            {
                label      : 'save',
                accelerator: 'CmdOrCtrl+S',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    if (masterWin.isFocused()) {
                        masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_S');
                    }
                }
            },
            {
                label      : 'edit',
                accelerator: 'CmdOrCtrl+E',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    if (masterWin.isFocused()) {
                        masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_E');
                    }
                }
            },
            {
                label      : 'full display',
                accelerator: 'CmdOrCtrl+W',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    if (masterWin.isFocused()) {
                        masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_W');
                    }
                }
            },
            {
                label      : 'search',
                accelerator: 'CmdOrCtrl+Shift+F',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_SHIFT_F');
                }
            },
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'delete'},
            {role: 'selectall'}
        ],
    }
];
