importScripts(
  'https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js',
)

importScripts(
  'https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js',
)

firebase.initializeApp({
  apiKey: 'AIzaSyDFl7VkqkpT4-MQOCKqNGYJOwlqjOKhdzI',
  authDomain: 'com-cristo-app.firebaseapp.com',
  projectId: 'com-cristo-app',
  storageBucket: 'com-cristo-app.firebasestorage.app',
  messagingSenderId: '1040410576486',
  appId: '1:1040410576486:web:19a756938db88ec4250fa7',
  measurementId: 'G-Z5DKJ61N9E',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Mensagem recebida:',
    payload,
  )
})