require('@jxa/global-type')
const { run } = require('@jxa/run')

module.exports = {
  fromFrontMost: () => run(fromFrontMost),
  fromSafari: () => run(fromSafari)
}

function fromFrontMost() {
  const app = Application.currentApplication()
  app.includeStandardAdditions = true

  const frontMostAppName = Application('System Events').applicationProcesses.where({ frontmost: true }).name()[0]
  const frontMostApp = Application(frontMostAppName)

  const chromiumVariants = ['Google Chrome', 'Chromium', 'Opera', 'Vivaldi', 'Brave Browser', 'Microsoft Edge']
  const webkitVariants = ['Safari', 'Webkit']

  let title
  let url
  if (chromiumVariants.some(name => frontMostAppName.startsWith(name))) {
    title = frontMostApp.windows[0].activeTab.name()
    url = frontMostApp.windows[0].activeTab.url()
  } else if (webkitVariants.some(name => frontMostAppName.startsWith(name))) {
    title = frontMostApp.windows[0].currentTab.name()
    url = frontMostApp.windows[0].currentTab.url()
  }

  frontMostApp.activate()
  delay(0.2)
  Application('System Events').keystroke('c', { using: 'command down' })
  delay(0.2)
  const copiedContent = app.theClipboard()

  return { title, url, copiedContent }
}

function fromSafari() {
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
}
