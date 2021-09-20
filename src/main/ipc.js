const { ipcMain, clipboard } = require('electron')
const { keyTap } = require('robotjs')
const readItem = require('./read-item')
const { AppTray } = require('./AppTray')
const jxaSetData = require('./jxa/jxa-set-data')

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
        AppTray.launcherWindow.blur()
        AppTray.launcherWindow.hide()
        if (process.platform === 'darwin') {
            setTimeout(() => {
                jxaSetData.toActiveWindow(value)
            }, 100);
        } else {
            setTimeout(() => {
                const currentClipboardContent = clipboard.readText()
                clipboard.clear()
                clipboard.writeText(value)
                keyTap('v', 'control')
                setTimeout(() => {
                    clipboard.writeText(currentClipboardContent)
                }, 200)
            }, 200)
        }
    })
}