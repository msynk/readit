const path = require('path')
const app = require('./main/app')
const ipc = require('./main/ipc')

const launcherFilePath = path.join(__dirname, 'renderer', 'launcher/launcher.html')
const indexFilePath = path.join(__dirname, 'renderer', 'index/index.html')
const prelaodFilePath = path.join(__dirname, 'preload.js')

const trayIconPath = path.join(__dirname, 'main', 'icons', 'tray-icon.png')

const fcmFilePath = path.join(__dirname, 'renderer', 'fcm/fcm.html')
const fcmPrelaodFilePath = path.join(__dirname, 'fcm-preload.js')

const pushyFilePath = path.join(__dirname, 'renderer', 'pushy/pushy.html')
const pushyPrelaodFilePath = path.join(__dirname, 'pushy-preload.js')

app.init(trayIconPath, launcherFilePath, indexFilePath, prelaodFilePath, fcmFilePath, fcmPrelaodFilePath, pushyFilePath, pushyPrelaodFilePath)
ipc.init()