const { BrowserWindow } = require('electron');

let offscreenWindow;

function readItem(url) {
    return new Promise((res, rej) => {
        try {
            getUrlContent(url, res);
        } catch (e) {
            rej(e);
        }
    });
}

function getUrlContent(url, resolve) {
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });

    offscreenWindow.loadURL(url);
    offscreenWindow.webContents.on('did-finish-load', e => {
        const title = offscreenWindow.getTitle();
        offscreenWindow.webContents.capturePage().then(image => {
            const screenshot = image.toDataURL();
            resolve({ title, screenshot, url });
        });
        offscreenWindow.close();
        offscreenWindow = null;
    });
}

module.exports = readItem;