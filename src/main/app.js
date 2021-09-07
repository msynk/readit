const { app } = require('electron')
const { AppTray } = require('./AppTray')
const updater = require('./updater')

let tray

module.exports = {
    initApp,
    quitApp
}

function initApp(trayIconPath, launcherFilePath, indexFilePath, prelaodFilePath, fcmFilePath, fcmPrelaodFilePath, pushyFilePath, pushyPrelaodFilePath) {
    app.on('ready', ready)

    // app.on('window-all-closed', e => {
    //     if (process.platform != 'darwin') app.quit()
    // })

    app.on('activate', e => {
        if (tray == null) ready()
    })

    function ready() {
        tray = new AppTray(trayIconPath, launcherFilePath, indexFilePath, prelaodFilePath, fcmFilePath, fcmPrelaodFilePath, pushyFilePath, pushyPrelaodFilePath)

        updater.init()
        setTimeout(updater.check, 1000);
    }
}

function quitApp() {
    tray?.quit()
}