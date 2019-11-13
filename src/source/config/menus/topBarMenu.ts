// import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

declare var global: any;
export const topBarMenuTemplateConf: any = [
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
                label      : 'super search',
                accelerator: 'CmdOrCtrl+Shift+F',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_SHIFT_F');
                }
            },
            {
                label      : 'undo',
                accelerator: 'CmdOrCtrl+Z',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_Z');
                }
            },
            {
                label      : 'redo',
                accelerator: 'CmdOrCtrl+Shift+Z',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_SHIFT_Z');
                }
            },
            {
                label      : 'search',
                accelerator: 'CmdOrCtrl+F',
                click      : () => {
                    const masterWin = global.browserWindowList['master'];
                    masterWin.webContents.send('windowKeyboard', 'CMD_OR_CTRL_F');
                }
            },
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'delete'},
            {role: 'selectall'}
        ],
    }
];
