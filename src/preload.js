const fs = require('fs')
const path = require('path')
const { ipcRenderer, shell } = require('electron')

window.electronProxy = {
    ipc: ipcRenderer,
    readFile: (filename, fn) => {
        return fs.readFile(path.join(__dirname, 'renderer', filename), fn)
    },
    shell: shell
}