const { ipcMain, clipboard } = require('electron')
const readItem = require('./read-item')
const { AppTray } = require('./AppTray')
const setData = require('./jxa/set-data')

module.exports = {
    init
}

function init() {
    ipcMain.handle('new-item', (e, url) => {
        return readItem(url)
    })

    ipcMain.on('paste', (e, value) => {
        console.log('paste: ', value)
        clipboard.writeText(value)
        AppTray.launcherWindow.hide()
        if (process.platform === 'darwin') {
            setTimeout(() => {
                setData.toActiveWindow(value)
            }, 100);
        }
    })
}