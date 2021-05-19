const { BrowserWindow } = require('electron');

class LauncherWindow extends BrowserWindow {
    constructor(filePath) {
        super({
            width: 400,
            height: 300,
            frame: false,
            resizable: false,
            show: false,
            skipTaskbar: true,
            transparent: true,
            webPreferences: {
                backgroundThrottling: true
            }
        })

        //this.webContents.openDevTools()

        this.loadFile(filePath)
        this.on('blur', this.onBlur.bind(this))
    }

    onBlur() {
        this.hide();
    }
}

module.exports = LauncherWindow;