// importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js')
// importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js')
importScripts('firebase-app.js')
importScripts('firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyBZbUv9ODxBBnqfmX-mfgfpXLumkrbIcRE',
  authDomain: 'order-server-hq.firebaseapp.com',
  projectId: 'order-server-hq',
  storageBucket: 'order-server-hq.appspot.com',
  messagingSenderId: '447391958873',
  appId: '1:447391958873:web:7b51db2ed1678a76a9ae48',
  measurementId: 'G-P03CP6L6HB',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(message => {
  self.registration.showNotification(message.notification.title, {
    body: message.notification.body,
  })
})
