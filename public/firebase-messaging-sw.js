self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim()
  )
})

self.addEventListener('notificationclick', (event) => {
  console.log('[Com Cristo] Clique na notificação.')

  event.notification.close()

  const url = new URL(
    event.notification?.data?.url || '/',
    self.location.origin
  ).href

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(url)
            return client.focus()
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url)
        }

        return undefined
      })
  )
})

try {
  importScripts(
    'https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js'
  )

  importScripts(
    'https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js'
  )

  firebase.initializeApp({
    apiKey: 'AIzaSyA_tHTdiiRYHi71kbUERtPt5FjjTzRU0g',
    authDomain: 'com-cristo-app.firebaseapp.com',
    projectId: 'com-cristo-app',
    storageBucket: 'com-cristo-app.firebasestorage.app',
    messagingSenderId: '1040410576486',
    appId: '1:1040410576486:web:19a756938db88ec4250fa7',
  })

  const messaging = firebase.messaging()

  console.log(
    '[Com Cristo] Firebase Messaging inicializado.'
  )

  messaging.onBackgroundMessage((payload) => {
    console.log(
      '[Com Cristo] FCM recebido em segundo plano:',
      payload
    )
  })

  console.log(
    '[Com Cristo] Service Worker carregado.'
  )
} catch (error) {
  console.error(
    '[Com Cristo] ERRO ao inicializar Firebase Messaging:',
    error
  )
}