const { ipcMain } = require('electron')
const readItem = require('./read-item')

module.exports = function initIpc() {
    ipcMain.handle('new-item', (e, url) => {
        return readItem(url)
    })
}