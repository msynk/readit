const path = require('path')
const app = require('./main/app')
const ipc = require('./main/ipc')

const launcherFilePath = path.join(__dirname, 'renderer', 'launcher.html')
const indexFilePath = path.join(__dirname, 'renderer', 'index.html')
const prelaodFilePath = path.join(__dirname, 'preload.js')

const trayIconPath = path.join(__dirname, 'main', 'icons', 'tray-icon.png')

app.init(trayIconPath, launcherFilePath, indexFilePath, prelaodFilePath)
ipc.init()