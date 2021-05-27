const { BrowserWindow } = require('electron');

class LauncherWindow extends BrowserWindow {
    constructor(filePath, preloadFilePath) {
        super({
            width: 400,
            height: 300,
            frame: false,
            resizable: false,
            show: false,
            skipTaskbar: true,
            transparent: true,
            webPreferences: {
                backgroundThrottling: true,
                contextIsolation: false,
                preload: preloadFilePath
            }
        })

        //this.webContents.openDevTools()

        // this.webContents.on('before-input-event', (event, input) => {
        //     if (input.key.toLowerCase() === 'escape') {
        //         this.hide()
        //     }
        // })

        this.loadFile(filePath)
        this.on('blur', this.hide())
        
        if (process.platform === 'darwin') {
            this.on('hide', e => {
                app.hide()
            })
        }
    }
}

module.exports = LauncherWindow;