const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const readItem = require('./read-item')
const appMenu = require('./menu')

ipcMain.handle('new-item', (e, url) => {
    return readItem(url);
});

app.on('ready', createWindow);
app.on('window-all-closed', e => {
    if (process.platform != 'darwin') app.quit();
})
app.on('activate', e => {
    if (mainWindow == null) createWindow();
});

let mainWindow;

function createWindow() {
    const state = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 650
    });

    mainWindow = new BrowserWindow({
        x: state.x, y: state.y,
        width: state.width, height: state.height,
        minWidth: 350, maxWidth: 650, minHeight: 300,
        webPreferences: {
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    appMenu(mainWindow.webContents)

    mainWindow.loadFile('renderer/index.html');

    state.manage(mainWindow);

    mainWindow.on('closed', e => {
        mainWindow = null;
    });
}