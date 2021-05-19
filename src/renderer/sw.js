self.addEventListener('install', e => {
    console.log('SW:install:', e)
    self.skipWaiting()
})
self.addEventListener('activate', e => console.log('SW:activate:', e))

self.addEventListener('message', e => {
    console.log('SW:message:', e)
    const { type, payload } = e.data
    if (type === 'broadcast') {
        self.clients.matchAll({ includeUncontrolled: true, type: 'window', }).then(function (clients) {
            console.log('clients:', clients);
            (clients || []).forEach(function (cl) {
                console.log('cl:', cl)
                console.log('e.source.id == cl.id :', e.source.id == cl.id)
                cl.postMessage(payload)
            })
        })
    }
})