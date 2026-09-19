import {
  getMessaging,
  getToken,
} from 'firebase/messaging'

import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'
import app from '../firebase/firebase'

const VAPID_KEY =
  'BB1Ub2GyqMduQLkEJbMHqzm01oZxijKN03frUTIizcp4nGASizsRUESFYm2GiTiOkAe1H_qttzcLGcUlc_KSMXM'

const WEB_FCM_TOKEN_KEY =
  'comcristo_web_fcm_token'

export async function registrarNotificacaoWeb(): Promise<void> {
  console.log(
    '[FCM WEB] Iniciando registro...',
  )

  try {
    // =====================================================
    // VERIFICAÇÕES
    // =====================================================

    if (!('Notification' in window)) {
      console.warn(
        '[FCM WEB] Este navegador não suporta notificações.',
      )

      return
    }

    if (!('serviceWorker' in navigator)) {
      console.warn(
        '[FCM WEB] Este navegador não suporta Service Worker.',
      )

      return
    }

    // =====================================================
    // PERMISSÃO
    // =====================================================

    console.log(
      '[FCM WEB] Permissão atual:',
      Notification.permission,
    )

    const permissao =
      await Notification.requestPermission()

    console.log(
      '[FCM WEB] Permissão após solicitação:',
      permissao,
    )

    if (permissao !== 'granted') {
      console.warn(
        '[FCM WEB] Permissão não concedida.',
      )

      return
    }

    // =====================================================
    // SERVICE WORKER
    // =====================================================

    console.log(
      '[FCM WEB] Registrando Service Worker...',
    )

    await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
    )

    const registro =
      await navigator.serviceWorker.ready

    console.log(
      '[FCM WEB] Service Worker ativo.',
    )

    // =====================================================
    // FIREBASE MESSAGING
    // =====================================================

    const messaging = getMessaging(app)

    console.log(
      '[FCM WEB] Obtendo token FCM...',
    )

    const token = await getToken(
      messaging,
      {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registro,
      },
    )

    console.log(
      '[FCM WEB] Token obtido:',
      token
        ? `${token.substring(0, 20)}...`
        : null,
    )

    if (!token) {
      console.warn(
        '[FCM WEB] Firebase não retornou um token Web.',
      )

      return
    }

    // =====================================================
    // VERIFICA TOKEN SALVO LOCALMENTE
    // =====================================================

    const tokenSalvo =
      localStorage.getItem(
        WEB_FCM_TOKEN_KEY,
      )

    const referencia = doc(
      db,
      'tokens_web',
      token,
    )

    // =====================================================
    // PRIMEIRO REGISTRO
    // =====================================================

    if (tokenSalvo !== token) {
      await setDoc(
        referencia,
        {
          token,
          plataforma: 'web',
          ativo: true,
          dataCadastro: serverTimestamp(),
          ultimoAcesso: serverTimestamp(),
        },
      )

      localStorage.setItem(
        WEB_FCM_TOKEN_KEY,
        token,
      )

      console.log(
        '[FCM WEB] NOVO TOKEN WEB REGISTRADO COM SUCESSO!',
      )

      return
    }

    // =====================================================
    // TOKEN JÁ REGISTRADO
    // =====================================================

    await updateDoc(
      referencia,
      {
        ativo: true,
        ultimoAcesso: serverTimestamp(),
      },
    )

    console.log(
      '[FCM WEB] TOKEN WEB ATUALIZADO COM SUCESSO!',
    )
  } catch (erro) {
    console.error(
      '[FCM WEB] ERRO COMPLETO:',
      erro,
    )
  }
}