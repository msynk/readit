const { Tray, Menu, app, globalShortcut, BrowserWindow } = require('electron');
const Pushy = require('pushy-electron')
const pushReceiver = require('electron-push-receiver')
const windowStateKeeper = require('electron-window-state')
const LauncherWindow = require('./LauncherWindow')
const MainWindow = require('./MainWindow')
const googleSignIn = require('./google-oauth')
const updater = require('./updater')
const menuTemplate = require('./menu-template')


let launcherWindow, mainWindow, fcmWindow, pushyWindow, stateKeeper, appIsQuiting
class AppTray extends Tray {
    static launcherWindow

    constructor(iconPath, launcherFilePath, indexFilePath, prelaodFilePath, fcmFilePath, fcmPrelaodFilePath, pushyFilePath, pushyPrelaodFilePath) {
        super(iconPath)

        const menu = Menu.buildFromTemplate(menuTemplate(this.webContents))
        Menu.setApplicationMenu(menu)

        launcherWindow = new LauncherWindow(launcherFilePath, prelaodFilePath)
        //launcherWindow.webContents.openDevTools()
        AppTray.launcherWindow = launcherWindow

        stateKeeper = windowStateKeeper({ defaultWidth: 500, defaultHeight: 500 })
        createMainWindow(indexFilePath, prelaodFilePath)

        createFcmWindow(fcmFilePath, fcmPrelaodFilePath)
        createPushyWindow(pushyFilePath, pushyPrelaodFilePath)

        // showFcmWindow()
        // showPushyWindow()

        showMainWindow()

        globalShortcut.register('Ctrl+Space', launcherWindow.show.bind(launcherWindow));
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
                    label: 'FCM',
                    click: showFcmWindow
                },
                {
                    label: 'Pushy',
                    click: showPushyWindow
                },
                { type: 'separator' },
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

    quit() {
        quitApp()
    }
}

function tryGoogleSignIn() {
    googleSignIn().then(data => {
        console.info(data)
    })
}

function quitApp() {
    appIsQuiting = true
    try {
        launcherWindow.close()
        mainWindow.close()
    } catch (error) {
        console.log(error)
    }
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

function showFcmWindow() {
    fcmWindow.show()
    fcmWindow.webContents.openDevTools()
}

function createFcmWindow(filePath, prelaodFilePath) {
    if (appIsQuiting) return
    fcmWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            contextIsolation: false,
            preload: prelaodFilePath
        }
    })
    fcmWindow.loadFile(filePath)
    pushReceiver.setup(fcmWindow.webContents)
    fcmWindow.on('closed', e => {
        fcmWindow = null
        createFcmWindow(filePath, prelaodFilePath)
    })
}

function showPushyWindow() {
    pushyWindow.show()
    pushyWindow.webContents.openDevTools()
}

function createPushyWindow(filePath, prelaodFilePath) {
    if (appIsQuiting) return
    pushyWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            contextIsolation: false,
            preload: prelaodFilePath
        }
    })
    pushyWindow.loadFile(filePath)

    pushyWindow.webContents.on('did-finish-load', () => {
        Pushy.listen();

        // Register device for push notifications
        Pushy.register({ appId: '611fb543cdb7b1744a3b5e8a' }).then((deviceToken) => {
            // Display an alert with device token
            console.log(deviceToken);
        }).catch((err) => {
            // Display error dialog
            Pushy.alert(pushyWindow, 'Pushy registration error: ' + err.message);
        });

        // Listen for push notifications
        Pushy.setNotificationListener((data) => {
            // Display an alert with the "message" payload value
            Pushy.alert(pushyWindow, 'Received notification: ' + data.message);
        });
    });

    pushyWindow.on('closed', e => {
        pushyWindow = null
        createPushyWindow(filePath, prelaodFilePath)
    })
}

module.exports = {
    launcherWindow,
    mainWindow,
    AppTray
}