self.addEventListener(
  'notificationclick',
  (event) => {
    event.notification.close()

    const url =
      event.notification?.data?.url ||
      '/'

    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (
            const client of clientList
          ) {
            if (
              'focus' in client
            ) {
              client.navigate(url)

              return client.focus()
            }
          }

          if (
            clients.openWindow
          ) {
            return clients.openWindow(
              url,
            )
          }

          return undefined
        }),
    )
  },
)

importScripts(
  'https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js',
)

importScripts(
  'https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js',
)

firebase.initializeApp({
  apiKey:
    'AIzaSyA_tHTdiiRYHi71kbUERtPt5FjjTzRU0g',

  authDomain:
    'com-cristo-app.firebaseapp.com',

  projectId:
    'com-cristo-app',

  storageBucket:
    'com-cristo-app.firebasestorage.app',

  messagingSenderId:
    '1040410576486',

  appId:
    '1:1040410576486:web:19a756938db88ec4250fa7',
})

const messaging =
  firebase.messaging()

/*
 * Mensagens enviadas pelo Firebase Console
 * normalmente possuem payload "notification".
 *
 * O FCM Web já trata a exibição dessas
 * notificações quando o site está em segundo
 * plano.
 *
 * Só criamos manualmente uma notificação
 * quando a mensagem é data-only.
 */
messaging.onBackgroundMessage(
  (payload) => {
    console.log(
      '[Com Cristo] FCM em segundo plano:',
      payload,
    )

    if (
      payload.notification
    ) {
      return
    }

    const data =
      payload.data || {}

    const titulo =
      data.title ||
      'Com Cristo'

    const corpo =
      data.body ||
      'Receba a Palavra de Deus todos os dias.'

    self.registration.showNotification(
      titulo,
      {
        body: corpo,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'comcristo-versiculo-diario',
        data: {
          url:
            data.url || '/',
        },
      },
    )
  },
)