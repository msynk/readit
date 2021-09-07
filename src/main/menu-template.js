const { shell, clipboard } = require('electron')
const googleSignIn = require('./google-oauth')
// const { quitApp } = require('./app')

module.exports = mainWinContents => {
    const template = [{
        label: 'Items',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    // try { quitApp() } catch (error) { console.log(error) }
                }
            }]
    }, {
        label: 'Items',
        submenu: [
            {
                label: 'Add Item',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    mainWinContents.send('menu-add-item')
                }
            }, {
                label: 'Open Item',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    mainWinContents.send('menu-open-item')
                }
            }, {
                label: 'Delete Item',
                accelerator: 'CmdOrCtrl+D',
                click: () => {
                    mainWinContents.send('menu-delete-item')
                }
            }, {
                label: 'Open In Browser',
                accelerator: 'CmdOrCtrl+Shift+O',
                click: () => {
                    mainWinContents.send('menu-open-browser-item')
                }
            }, {
                label: 'Search Items',
                accelerator: 'CmdOrCtrl+F',
                click: () => {
                    mainWinContents.send('menu-search-item')
                }
            }
        ]
    }, {
        role: 'editMenu'
    }, {
        role: 'windowMenu'
    }, {
        role: 'help',
        submenu: [{
            label: 'Learn more',
            click: () => {
                shell.openExternal('https://electronjs.org')
            }
        }, {
            label: 'Google SignIn',
            click: () => {
                googleSignIn().then(tokens => {
                    mainWinContents.send('menu-google-signin', tokens)
                })
            }
        }, {
            label: 'Request Permission',
            click: () => {
                console.log('norification permission:', Notification.permission)
                if (!("Notification" in window)) {
                    return console.log("This browser does not support desktop notification");
                }
                Notification.requestPermission().then(function (permission) {
                    if (permission === "granted") {
                        var notification = new Notification("Hi there!");
                    } else {
                        console.log('permission denied:', permission)
                    }
                });
            }
        }]
    }]

    if (process.platform === 'darwin') template.unshift({ role: 'appMenu' })

    if (process.env.NODE_ENV !== 'production') {
        template.push({
            label: 'Develop',
            submenu: [{
                label: 'Copy Text',
                click: () => {
                    clipboard.writeText('hello world')
                    //clipboard.writeHTML('<h1>hello world!</h1>')
                }
            }, {
                label: 'Copy Html',
                click: () => {
                    //clipboard.writeText('hello world')
                    clipboard.writeHTML('<h1>hello world!</h1>')
                }
            }, {
                label: 'Copy All',
                click: () => {
                    //clipboard.writeText('hello world')
                    clipboard.write({
                        text: 'hello world!',
                        html: '<h1>hello world!</h1>'
                    })
                }
            },
            { role: 'reload' },
            { role: 'toggleDevTools' }
            ]
        });
    }

    return template;
}