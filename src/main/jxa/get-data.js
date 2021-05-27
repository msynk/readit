require('@jxa/global-type')
const { run } = require('@jxa/run')

moddule.exprots = {
  fromSafari
}
function fromSafari() {
  return run(() => {
    const app = Application.currentApplication()
    app.includeStandardAdditions = true

    const safariApp = Application('Safari')

    const name = safariApp.windows[0].currentTab.name()
    const url = safariApp.windows[0].currentTab.url()

    safariApp.activate()
    delay(0.2)
    Application('System Events').keystroke('c', { using: 'command down' })
    delay(0.2)
    const copiedContent = app.theClipboard()

    return { name, url, copiedContent }
  })
}
