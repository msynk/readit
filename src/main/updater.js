const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false

module.exports = {
    init: init,
    check: autoUpdater.checkForUpdates.bind(autoUpdater)
}

function init() {
    autoUpdater.on('update-available', () => {
        const options = {
            type: 'info',
            title: 'Update available',
            message: 'A new version is avilable. do you want to update now?',
            buttons: ['Yes', 'No']
        }
        dialog.showMessageBox(options).then(({ response }) => {
            if (response === 0) {
                autoUpdater.downloadUpdate()
            }
        })

    })

    autoUpdater.on('update-downloaded', () => {
        const options = {
            type: 'info',
            title: 'Update ready',
            message: 'Install new update and restart now?',
            buttons: ['Yes', 'No']
        }
        dialog.showMessageBox(options).then(({ response }) => {
            if (response === 0) {
                autoUpdater.quitAndInstall(false, true)
            }
        })
    })

}