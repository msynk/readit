const { ipcMain } = require('electron')
const readItem = require('./read-item')
const { launcherWindow } = require('./AppTray')
const setData = require('./jxa/set-data')

module.exports = function initIpc() {
    ipcMain.handle('new-item', (e, url) => {
        return readItem(url)
    })

    ipcMain.on('paste', (e, value) => {
        if (process.platform === 'darwin') {
            setTimeout(() => {
                setData.toActiveWindow(value)
            }, 200);
            launcherWindow.hide()
        }
    })
}