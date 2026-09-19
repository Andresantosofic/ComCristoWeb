import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

const WEB_ID_KEY = 'comcristo_web_id'

function gerarIdWeb(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2)
  )
}

export async function registrarAcessoWeb(): Promise<void> {
  try {
    let idWeb = localStorage.getItem(WEB_ID_KEY)

    const primeiroAcesso = !idWeb

    if (!idWeb) {
      idWeb = gerarIdWeb()
      localStorage.setItem(WEB_ID_KEY, idWeb)
    }

    const referencia = doc(
      db,
      'acessos_web',
      idWeb,
    )

    if (primeiroAcesso) {
      await setDoc(referencia, {
        id: idWeb,
        plataforma: 'web',
        dataCadastro: serverTimestamp(),
        ultimoAcesso: serverTimestamp(),
      })

      console.log(
        'Acesso Web registrado com sucesso:',
        idWeb,
      )

      return
    }

    await setDoc(
      referencia,
      {
        ultimoAcesso: serverTimestamp(),
      },
      {
        merge: true,
      },
    )

    console.log(
      'Acesso Web atualizado:',
      idWeb,
    )
  } catch (erro) {
    console.error(
      'Erro ao registrar acesso Web:',
      erro,
    )
  }
}