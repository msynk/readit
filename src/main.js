const path = require('path')
const initApp = require('./main/init-app')
const initIpc = require('./main/ipc')

const launcherFilePath = path.join(__dirname, 'renderer', 'launcher.html')
const indexFilePath = path.join(__dirname, 'renderer', 'index.html')
const prelaodFilePath = path.join(__dirname, 'preload.js')

const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
const trayIconPath = path.join(__dirname, 'main', 'icons', iconName)

initApp(trayIconPath, launcherFilePath, indexFilePath, prelaodFilePath)
initIpc()