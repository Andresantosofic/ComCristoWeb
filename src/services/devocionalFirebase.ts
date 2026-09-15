import {
  doc,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

export type DevocionalFirebase = {
  id: string
  tema: string
  versiculo: string
  referencia: string
  estudo: string
  reflexao: string
}

export type ConfiguracaoDevocional = {
  ativo?: boolean

  tituloTelaDevocional?: string
  tituloTemaDevocional?: string
  tituloEstudo?: string
  tituloReflexao?: string

  textoFinalizarLeitura?: string
  textoLeituraConcluida?: string
  textoCompartilharDevocional?: string

  corFundo?: string
  corTituloTela?: string
  corStreak?: string

  corCardTema?: string
  corTituloTema?: string
  corTema?: string
  corVersiculo?: string
  corReferencia?: string
  corDivisorTema?: string

  corCardEstudo?: string
  corIconeEstudo?: string
  corTituloEstudo?: string
  corTextoEstudo?: string

  corCardReflexao?: string
  corIconeReflexao?: string
  corTituloReflexao?: string
  corTextoReflexao?: string

  corBotaoFinalizar?: string
  corTextoBotaoFinalizar?: string

  corBotaoCompartilhar?: string
  corTextoBotaoCompartilhar?: string
}

function converterDevocional(
  dados: Record<string, unknown>,
): DevocionalFirebase {
  return {
    id:
      typeof dados.id === 'string'
        ? dados.id
        : '',

    tema:
      typeof dados.tema === 'string'
        ? dados.tema
        : '',

    versiculo:
      typeof dados.versiculo === 'string'
        ? dados.versiculo
        : '',

    referencia:
      typeof dados.referencia === 'string'
        ? dados.referencia
        : '',

    estudo:
      typeof dados.estudo === 'string'
        ? dados.estudo
        : '',

    reflexao:
      typeof dados.reflexao === 'string'
        ? dados.reflexao
        : '',
  }
}

/**
 * Observa:
 * configuracoes/devocional
 *
 * Igual ao FirebaseManager do Android.
 */
export function observarConfiguracaoDevocional(
  onUpdate: (
    dados: ConfiguracaoDevocional,
  ) => void,

  onError: (
    erro: Error,
  ) => void,
) {
  return onSnapshot(
    doc(
      db,
      'configuracoes',
      'devocional',
    ),

    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate({})
        return
      }

      onUpdate(
        snapshot.data() as ConfiguracaoDevocional,
      )
    },

    (erro) => {
      onError(erro)
    },
  )
}

/**
 * Observa:
 * devocional_inicial/atual
 *
 * O documento só será utilizado
 * quando:
 * ativo == true
 * e data == data selecionada.
 */
export function observarDevocionalInicial(
  data: string,

  onUpdate: (
    devocional:
      | DevocionalFirebase
      | null,
  ) => void,

  onError: (
    erro: Error,
  ) => void,
) {
  return onSnapshot(
    doc(
      db,
      'devocional_inicial',
      'atual',
    ),

    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate(null)
        return
      }

      const dados =
        snapshot.data()

      const ativo =
        dados.ativo === true

      const dataFirestore =
        typeof dados.data === 'string'
          ? dados.data
          : ''

      if (
        !ativo ||
        dataFirestore !== data
      ) {
        onUpdate(null)
        return
      }

      onUpdate(
        converterDevocional(dados),
      )
    },

    (erro) => {
      onError(erro)
    },
  )
}

/**
 * Observa:
 * conteudo_diario/{MM-dd}
 *
 * Dentro do documento:
 * devocional
 * ├── id
 * ├── tema
 * ├── versiculo
 * ├── referencia
 * ├── estudo
 * └── reflexao
 */
export function observarDevocionalDoDia(
  data: string,

  onUpdate: (
    devocional:
      | DevocionalFirebase
      | null,
  ) => void,

  onError: (
    erro: Error,
  ) => void,
) {
  return onSnapshot(
    doc(
      db,
      'conteudo_diario',
      data,
    ),

    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate(null)
        return
      }

      const dados =
        snapshot.data()

      const devocional =
        dados.devocional

      if (
        !devocional ||
        typeof devocional !== 'object'
      ) {
        onUpdate(null)
        return
      }

      onUpdate(
        converterDevocional(
          devocional as Record<
            string,
            unknown
          >,
        ),
      )
    },

    (erro) => {
      onError(erro)
    },
  )
}