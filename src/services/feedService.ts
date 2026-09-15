import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

export type TipoMidia = 'imagem' | 'video' | 'youtube'

export type Publicacao = {
  id: string
  autor: string
  legenda: string
  tipo: TipoMidia
  urlMidia: string
  dataPublicacao: Date
}

function converterTipoMidia(valor: unknown): TipoMidia {
  if (valor === 'video') {
    return 'video'
  }

  if (valor === 'youtube') {
    return 'youtube'
  }

  return 'imagem'
}

function converterData(valor: unknown): Date {
  if (valor instanceof Timestamp) {
    return valor.toDate()
  }

  if (valor instanceof Date) {
    return valor
  }

  return new Date(0)
}

export function observarFeed(
  callback: (publicacoes: Publicacao[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const referencia = collection(db, 'feed')

  const consulta = query(
    referencia,
    orderBy('dataPublicacao', 'desc'),
  )

  return onSnapshot(
    consulta,
    (snapshot) => {
      const publicacoes: Publicacao[] =
        snapshot.docs.map((documento) => {
          const dados = documento.data()

          return {
            id: documento.id,

            autor:
              typeof dados.autor === 'string' &&
              dados.autor.trim()
                ? dados.autor
                : 'ComCristo',

            legenda:
              typeof dados.legenda === 'string'
                ? dados.legenda
                : '',

            tipo: converterTipoMidia(
              dados.tipo,
            ),

            urlMidia:
              typeof dados.urlMidia === 'string'
                ? dados.urlMidia.trim()
                : '',

            dataPublicacao:
              converterData(
                dados.dataPublicacao,
              ),
          }
        })

      callback(publicacoes)
    },
    (error) => {
      console.error(
        'Erro ao observar o Feed:',
        error,
      )

      onError?.(error)
    },
  )
}