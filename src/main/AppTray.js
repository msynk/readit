const { Tray, Menu, app, globalShortcut } = require('electron');
const windowStateKeeper = require('electron-window-state')
const LauncherWindow = require('./LauncherWindow')
const MainWindow = require('./MainWindow')
const googleSignIn = require('./google-oauth')
const updater = require('./updater')

let launcherWindow, mainWindow, stateKeeper, appIsQuiting
class AppTray extends Tray {
    static launcherWindow

    constructor(iconPath, launcherFilePath, indexFilePath, prelaodFilePath) {
        super(iconPath)

        launcherWindow = new LauncherWindow(launcherFilePath, prelaodFilePath)
        launcherWindow.webContents.openDevTools()
        AppTray.launcherWindow = launcherWindow

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
                { type: 'separator' },
                {
                    label: 'Google SignIn',
                    click: tryGoogleSignIn
                },
                { type: 'separator' },
                {
                    label: 'Check for updates',
                    click: updater.check
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    click: quitApp
                }
            ])
        ))
    }
}

function tryGoogleSignIn() {
    googleSignIn().then(data => {
        console.info(data)
    })
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

module.exports = {
    launcherWindow,
    mainWindow,
    AppTray
}