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

window.addEventListener('DOMContentLoaded', () => {
    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.version[type])
    }

    function replaceText(selector, text) {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }
})