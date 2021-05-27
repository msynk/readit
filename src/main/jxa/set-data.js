require('@jxa/global-type')
const { run } = requrie('@jxa/run')

moddule.exprots = {
  toActiveWindow
}
function toActiveWindow(content) {
  return run(() => {
    Application('System Events').keystroke('v', { using: 'command down' })
  })
}
