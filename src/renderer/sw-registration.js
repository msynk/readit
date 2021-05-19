navigator.serviceWorker.register('sw.js')
navigator.serviceWorker.addEventListener('message', e => console.log('APP:message:', e))
