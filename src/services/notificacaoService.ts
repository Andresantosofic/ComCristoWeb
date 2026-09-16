import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

import {
  getToken,
  onMessage,
} from 'firebase/messaging'

import {
  db,
  messagingPromise,
} from '../firebase/firebase'

const VAPID_KEY =
  'BB1Ub2GyqMduQLkEJbMHqzm01oZxijKN03frUTIizcp4nGASizsRUESFYm2GiTiOkAe1H_qttzcLGcUlc_KSMXM'

const STORAGE_TOKEN =
  'comcristo_fcm_token'

const COLLECTION =
  'notificacoes_dispositivos'

const STORAGE_ORIGIN =
  'comcristo_fcm_origin'

async function criarIdDoToken(
  token: string,
): Promise<string> {
  const dados =
    new TextEncoder().encode(token)

  const hash =
    await crypto.subtle.digest(
      'SHA-256',
      dados,
    )

  return Array.from(
    new Uint8Array(hash),
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
}

function estaNoIOS() {
  return (
    /iPad|iPhone|iPod/.test(
      navigator.userAgent,
    ) ||
    (
      navigator.platform ===
        'MacIntel' &&
      navigator.maxTouchPoints > 1
    )
  )
}

function estaComoWebAppIOS() {
  if (!estaNoIOS()) {
    return true
  }

  const standalone =
    (
      navigator as Navigator & {
        standalone?: boolean
      }
    ).standalone === true

  const displayModeStandalone =
    window.matchMedia(
      '(display-mode: standalone)',
    ).matches

  return (
    standalone ||
    displayModeStandalone
  )
}

async function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error(
      'Este navegador não suporta Service Worker.',
    )
  }

  const registro =
    await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      {
        scope: '/',
      },
    )

  await registro.update()

  const registroAtivo =
    await navigator.serviceWorker.ready

  if (!registroAtivo.active) {
    throw new Error(
      'O Service Worker de notificações não está ativo.',
    )
  }

  return registroAtivo
}

export async function ativarNotificacoes(
  horario: string,
) {
  if (!window.isSecureContext) {
    throw new Error(
      'As notificações exigem uma conexão HTTPS segura.',
    )
  }

  if (!('Notification' in window)) {
    throw new Error(
      'Este navegador não suporta notificações.',
    )
  }

  if (!estaComoWebAppIOS()) {
    throw new Error(
      'No iPhone, primeiro adicione o Com Cristo à Tela de Início e abra o aplicativo pelo ícone.',
    )
  }

  let permissao =
    Notification.permission

  if (permissao === 'denied') {
    throw new Error(
      'As notificações estão bloqueadas para este site. Abra as configurações de notificações do navegador e permita-as.',
    )
  }

  if (permissao !== 'granted') {
    permissao =
      await Notification.requestPermission()
  }

  if (permissao !== 'granted') {
    throw new Error(
      'A permissão para notificações não foi concedida.',
    )
  }

  const messaging =
    await messagingPromise

  if (!messaging) {
    throw new Error(
      'Este navegador não suporta Firebase Cloud Messaging.',
    )
  }

  const serviceWorkerRegistration =
    await registrarServiceWorker()

  if (!serviceWorkerRegistration.active) {
    throw new Error(
      'O Service Worker de notificações não está ativo.',
    )
  }

  const originAtual =
    window.location.origin

  /*
   * O token FCM é associado à inscrição
   * de Push da origem atual.
   *
   * Como estamos usando Quick Tunnel,
   * a origem pode mudar.
   *
   * Se a origem mudou, descartamos o
   * token salvo anteriormente e pedimos
   * ao Firebase o token correspondente
   * à origem atual.
   */
  const originAnterior =
    localStorage.getItem(
      STORAGE_ORIGIN,
    )

  if (
    originAnterior &&
    originAnterior !== originAtual
  ) {
    localStorage.removeItem(
      STORAGE_TOKEN,
    )
  }

  let token: string

  try {
    token = await getToken(
      messaging,
      {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration,
      },
    )
  } catch (erro) {
    console.error(
      'Erro ao obter token FCM:',
      erro,
    )

    throw new Error(
      erro instanceof Error
        ? `Não foi possível registrar este dispositivo no Firebase: ${erro.message}`
        : 'Não foi possível registrar este dispositivo no Firebase.',
    )
  }

  if (!token) {
    throw new Error(
      'O Firebase não retornou um token FCM.',
    )
  }

  const id =
    await criarIdDoToken(token)

  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone

  await setDoc(
    doc(
      db,
      COLLECTION,
      id,
    ),
    {
      token,
      ativo: true,
      horario,
      timezone,
      plataforma: estaNoIOS()
        ? 'ios'
        : 'web',
      origem: originAtual,
      atualizadoEm:
        serverTimestamp(),
    },
    {
      merge: true,
    },
  )

  localStorage.setItem(
    STORAGE_TOKEN,
    token,
  )

  localStorage.setItem(
    STORAGE_ORIGIN,
    originAtual,
  )

  console.log(
    'FCM registrado com sucesso.',
    {
      token,
      origem: originAtual,
      plataforma: estaNoIOS()
        ? 'ios'
        : 'web',
    },
  )

  return token
}

export async function desativarNotificacoes() {
  const token =
    localStorage.getItem(
      STORAGE_TOKEN,
    )

  if (!token) {
    return
  }

  try {
    const id =
      await criarIdDoToken(token)

    await setDoc(
      doc(
        db,
        COLLECTION,
        id,
      ),
      {
        ativo: false,
        atualizadoEm:
          serverTimestamp(),
      },
      {
        merge: true,
      },
    )

    localStorage.removeItem(
      STORAGE_TOKEN,
    )
  } catch (erro) {
    console.error(
      'Erro ao desativar notificações:',
      erro,
    )
  }
}

export async function atualizarHorarioNotificacao(
  horario: string,
) {
  const token =
    localStorage.getItem(
      STORAGE_TOKEN,
    )

  if (!token) {
    return
  }

  try {
    const id =
      await criarIdDoToken(token)

    await setDoc(
      doc(
        db,
        COLLECTION,
        id,
      ),
      {
        horario,
        atualizadoEm:
          serverTimestamp(),
      },
      {
        merge: true,
      },
    )
  } catch (erro) {
    console.error(
      'Erro ao atualizar horário da notificação:',
      erro,
    )
  }
}

export async function iniciarNotificacoesEmPrimeiroPlano(
  onNotification?: (
    payload: unknown,
  ) => void,
) {
  const messaging =
    await messagingPromise

  if (!messaging) {
    return () => {}
  }

  return onMessage(
    messaging,
    (payload) => {
      console.log(
        'FCM recebido em primeiro plano:',
        payload,
      )

      if (onNotification) {
        onNotification(payload)
        return
      }

      const titulo =
        payload.notification?.title ||
        'Com Cristo'

      const corpo =
        payload.notification?.body ||
        'Receba a Palavra de Deus todos os dias.'

      if (
        'Notification' in window &&
        Notification.permission ===
          'granted'
      ) {
        void new Notification(
          titulo,
          {
            body: corpo,
            icon: '/images/logo_app.png',
          },
        )
      }
    },
  )
}

export function notificacoesEstaoRegistradas() {
  return Boolean(
    localStorage.getItem(
      STORAGE_TOKEN,
    ),
  )
}

/**
 * Diagnóstico do FCM.
 */
export async function diagnosticarNotificacoes() {
  const resultado: Record<
    string,
    unknown
  > = {}

  resultado.notificationPermission =
    'Notification' in window
      ? Notification.permission
      : 'unsupported'

  resultado.secureContext =
    window.isSecureContext

  resultado.origin =
    window.location.origin

  resultado.isIOS =
    estaNoIOS()

  resultado.isIOSWebApp =
    estaComoWebAppIOS()

  resultado.serviceWorkerSupported =
    'serviceWorker' in navigator

  try {
    const registrations =
      await navigator.serviceWorker.getRegistrations()

    resultado.serviceWorkers =
      registrations.map(
        (registration) => ({
          scope:
            registration.scope,
          active:
            Boolean(
              registration.active,
            ),
          installing:
            Boolean(
              registration.installing,
            ),
          waiting:
            Boolean(
              registration.waiting,
            ),
          scriptURL:
            registration.active
              ?.scriptURL ?? null,
        }),
      )
  } catch (erro) {
    resultado.serviceWorkerError =
      erro instanceof Error
        ? erro.message
        : String(erro)
  }

  try {
    const registration =
      await navigator.serviceWorker.getRegistration(
        '/',
      )

    resultado.firebaseServiceWorker = {
      existe: Boolean(
        registration,
      ),
      scope:
        registration?.scope ?? null,
      active:
        Boolean(
          registration?.active,
        ),
      scriptURL:
        registration?.active
          ?.scriptURL ?? null,
    }
  } catch (erro) {
    resultado.firebaseServiceWorkerError =
      erro instanceof Error
        ? erro.message
        : String(erro)
  }

  try {
    const messaging =
      await messagingPromise

    resultado.messaging =
      Boolean(messaging)
  } catch (erro) {
    resultado.messaging = false
    resultado.messagingError =
      erro instanceof Error
        ? erro.message
        : String(erro)
  }

  resultado.token =
    localStorage.getItem(
      STORAGE_TOKEN,
    )

  resultado.tokenOrigin =
    localStorage.getItem(
      STORAGE_ORIGIN,
    )

  resultado.userAgent =
    navigator.userAgent

  console.table(resultado)

  return resultado
}