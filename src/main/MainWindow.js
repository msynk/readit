const { BrowserWindow } = require("electron");
class MainWindow extends BrowserWindow {

    constructor(state, filePath, preloadFilePath) {
        super({
            x: state.x,
            y: state.y,
            width: state.width,
            height: state.height,
            minWidth: 350,
            maxWidth: 650,
            minHeight: 300,
            show: false,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                contextIsolation: false,
                preload: preloadFilePath,
            }
        })

        //this.webContents.openDevTools()

        this.webContents.on('will-navigate', (event, url) => {
            console.log('will-navigate', url)
            //console.log(event)
            event.preventDefault()
        })

        this.webContents.on('new-window', (event, url) => {
            console.log('new-window', url)
            //console.log(event)
            event.preventDefault()
        })

        this.loadFile(filePath)
    }
}

module.exports = MainWindow