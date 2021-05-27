const { BrowserWindow, app } = require('electron');
const getData = require('./jxa/get-data')

class LauncherWindow extends BrowserWindow {
    constructor(filePath, preloadFilePath) {
        super({
            width: 800,
            height: 400,
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
        this.on('blur', () => this.hide())

        if (process.platform === 'darwin') {
            this.on('hide', e => {
                app.hide()
            })
        }
    }

    show() {
        if (process.platform === 'darwin') {
            getData.fromFrontMost().then(({ title, url, copiedContent }) => {
                this.webContents.send('front-most-app-data', title, url, copiedContent)
                super.show()
            })
        } else {
            super.show()
        }
    }
}

module.exports = LauncherWindow;