import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDFl7VkqkpT4M-QOCKqNGYJOwlqjOKhdzI',
  authDomain: 'com-cristo-app.firebaseapp.com',
  projectId: 'com-cristo-app',
  storageBucket: 'com-cristo-app.firebasestorage.app',
  messagingSenderId: '1040410576486',
  appId: '1:1040410576486:web:19a756938db88ec4250fa7',
  measurementId: 'G-Z5DKJ61N9E',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const storage = getStorage(app)

export const analyticsPromise =
  isAnalyticsSupported()
    .then((suportado) => {
      if (!suportado) {
        return null
      }

      return getAnalytics(app)
    })
    .catch((erro) => {
      console.error(
        'Firebase Analytics não disponível:',
        erro,
      )

      return null
    })

export default app