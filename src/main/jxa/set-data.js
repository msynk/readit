require('@jxa/global-type')
const { run } = require('@jxa/run')

module.exports = {
  toActiveWindow
}
function toActiveWindow(content) {
  return run(() => {
    Application('System Events').keystroke('v', { using: 'command down' })
  })
}
