const { BrowserWindow, app, clipboard } = require('electron')
const { keyTap } = require('robotjs')
const jxaGetData = require('./jxa/jxa-get-data')

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
            jxaGetData.fromFrontMost().then(({ title, url, copiedContent }) => {
                this.webContents.send('front-most-app-data', title, url, copiedContent)
                super.show()
            })
        } else {
            const currentClipboardContent = clipboard.readText()
            clipboard.clear()
            keyTap('c', 'control')
            setTimeout(() => {
                const copiedContent = clipboard.readText()
                clipboard.writeText(currentClipboardContent)
                this.webContents.send('front-most-app-data', '', '', copiedContent)
                super.show()
            }, 200)
        }
    }
}

module.exports = LauncherWindow;