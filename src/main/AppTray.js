const { Tray, Menu, app, globalShortcut } = require('electron');
const windowStateKeeper = require('electron-window-state')
const LauncherWindow = require('./LauncherWindow')
const MainWindow = require('./MainWindow')

let launcherWindow, mainWindow, stateKeeper, appIsQuiting

class AppTray extends Tray {
    constructor(iconPath, launcherFilePath, indexFilePath, prelaodFilePath) {
        super(iconPath)

        launcherWindow = new LauncherWindow(launcherFilePath)

        stateKeeper = windowStateKeeper({ defaultWidth: 500, defaultHeight: 500 })
        createMainWindow(indexFilePath, prelaodFilePath)

        globalShortcut.register('Alt+Space', launcherWindow.show.bind(launcherWindow));
        globalShortcut.register('Alt+Shift+Space', showMainWindow);

        this.setToolTip('Readit App')
        this.on('click', launcherWindow.show.bind(launcherWindow))
        this.on('right-click', () => this.popUpContextMenu(Menu.buildFromTemplate(
            [
                {
                    label: 'Open',
                    click: showMainWindow
                },
                {
                    label: 'Quit',
                    click: quitApp
                }
            ])
        ))
    }
}

function quitApp() {
    appIsQuiting = true
    launcherWindow.close()
    mainWindow.close()
    app.quit()
}

function showMainWindow() {
    mainWindow.show()
    stateKeeper.manage(mainWindow)
}

function createMainWindow(indexFilePath, prelaodFilePath) {
    if (appIsQuiting) return
    mainWindow = new MainWindow(stateKeeper, indexFilePath, prelaodFilePath)
    mainWindow.on('closed', e => {
        stateKeeper.unmanage(mainWindow)
        mainWindow = null
        createMainWindow(indexFilePath, prelaodFilePath)
    })
}

module.exports = AppTray;