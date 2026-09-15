import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

export type AvisoFirebase = {
  id: string
  titulo: string
  mensagem: string
  data: string
  tag: string
  ativo: boolean
  ordem: number
  imagem: string
  icone: string
  cor: string
  botaoTexto: string
  botaoLink: string
}

/* =========================================================
   TIPOS
========================================================= */

export type ConfiguracoesFirebase = {
  tituloVersiculo?: string
  tituloSentimentos?: string
  textoBotaoDevocional?: string

  tituloOfertas?: string
  descricaoOfertas?: string

  tituloBiblia?: string
  descricaoBiblia?: string

  saudacaoBomDia?: string
  fraseBomDia?: string

  saudacaoBoaTarde?: string
  fraseBoaTarde?: string

  saudacaoBoaNoite?: string
  fraseBoaNoite?: string

  sentimentoMal?: string
  sentimentoRegular?: string
  sentimentoBem?: string
  sentimentoOtimo?: string

  tituloMal?: string
  mensagemMal?: string

  tituloRegular?: string
  mensagemRegular?: string

  tituloBem?: string
  mensagemBem?: string

  tituloOtimo?: string
  mensagemOtimo?: string

  compartilharVersiculoFundoUrl?: string
  compartilharVersiculoTitulo?: string
  compartilharVersiculoFrase?: string

  mensagemCompartilhamento?: string
  linkAplicativo?: string
  mensagemCompartilhamentoDevocional?: string
}

export type BrandingFirebase = {
  ativo: boolean
  tipo: string
  logoUrl: string
  videoUrl: string
  loop: boolean
}

export type VersiculoFirebase = {
  ativo?: boolean
  texto?: string
  referencia?: string
  livro?: string
  capitulo?: number
  versiculo?: number

  versiculoDoDia?: {
    texto?: string
    referencia?: string
  }
}

export type DevocionalFirebase = {
  ativo?: boolean
  tema?: string
  versiculo?: string
  referencia?: string
}

export type ConteudoDiarioFirebase = {
  versiculoDoDia?: {
    texto?: string
    referencia?: string
  }

  devocional?: {
    tema?: string
    versiculo?: string
    referencia?: string
  }
}

/* =========================================================
   CONFIGURAÇÕES
   configuracoes/app
========================================================= */

export function observarConfiguracoes(
  onUpdate: (dados: ConfiguracoesFirebase) => void,
  onError: (erro: Error) => void,
): Unsubscribe {
  const referencia = doc(
    db,
    'configuracoes',
    'app',
  )

  return onSnapshot(
    referencia,
    (documento) => {
      if (!documento.exists()) {
        onUpdate({})
        return
      }

      const dados = documento.data()

      const sentimentoMal =
        typeof dados.sentimentoMal === 'string'
          ? dados.sentimentoMal
          : undefined

      const sentimentoRegular =
        typeof dados.sentimentoRegular === 'string'
          ? dados.sentimentoRegular
          : undefined

      const sentimentoBem =
        typeof dados.sentimentoBem === 'string'
          ? dados.sentimentoBem
          : typeof dados.senimentoBem === 'string'
            ? dados.senimentoBem
            : undefined

      const sentimentoOtimo =
        typeof dados.sentimentoOtimo === 'string'
          ? dados.sentimentoOtimo
          : typeof dados.senimentoOtimo === 'string'
            ? dados.senimentoOtimo
            : undefined

      onUpdate({
        ...dados,
        sentimentoMal,
        sentimentoRegular,
        sentimentoBem,
        sentimentoOtimo,
      })
    },
    (erro) => {
      onError(erro)
    },
  )
}

/* =========================================================
   AVISOS
   avisos
========================================================= */

export function observarAvisos(
  onUpdate: (avisos: AvisoFirebase[]) => void,
  onError: (erro: Error) => void,
): Unsubscribe {
  const consulta = query(
    collection(db, 'avisos'),
    orderBy('ordem'),
  )

  return onSnapshot(
    consulta,
    (snapshot) => {
      const avisos = snapshot.docs
        .map((documento) => {
          const dados = documento.data()

          return {
            id: documento.id,

            titulo:
              typeof dados.titulo === 'string'
                ? dados.titulo
                : '',

            mensagem:
              typeof dados.mensagem === 'string'
                ? dados.mensagem
                : '',

            data:
              typeof dados.data === 'string'
                ? dados.data
                : '',

            tag:
              typeof dados.tag === 'string'
                ? dados.tag
                : '',

            ativo:
              dados.ativo !== false,

            ordem:
              typeof dados.ordem === 'number'
                ? dados.ordem
                : 0,

            imagem:
              typeof dados.imagem === 'string'
                ? dados.imagem
                : '',

            icone:
              typeof dados.icone === 'string'
                ? dados.icone
                : '',

            cor:
              typeof dados.cor === 'string'
                ? dados.cor
                : '',

            botaoTexto:
              typeof dados.botaoTexto === 'string'
                ? dados.botaoTexto
                : '',

            botaoLink:
              typeof dados.botaoLink === 'string'
                ? dados.botaoLink
                : '',
          }
        })
        .filter((aviso) => aviso.ativo)

      onUpdate(avisos)
    },
    onError,
  )
}

/* =========================================================
   BRANDING
   configuracoes/branding
========================================================= */

export function observarBranding(
  onUpdate: (dados: BrandingFirebase) => void,
  onError: (erro: Error) => void,
): Unsubscribe {
  const referencia = doc(
    db,
    'configuracoes',
    'branding',
  )

  return onSnapshot(
    referencia,
    (documento) => {
      if (documento.exists()) {
        const dados =
          documento.data()

        onUpdate({
          ativo:
            dados.ativo === true,

          tipo:
            typeof dados.tipo === 'string'
              ? dados.tipo
              : '',

          logoUrl:
            typeof dados.logoUrl === 'string'
              ? dados.logoUrl
              : '',

          videoUrl:
            typeof dados.videoUrl === 'string'
              ? dados.videoUrl
              : '',

          loop:
            dados.loop === true,
        })
      } else {
        onUpdate({
          ativo: false,
          tipo: '',
          logoUrl: '',
          videoUrl: '',
          loop: false,
        })
      }
    },
    (erro) => {
      onError(erro)
    },
  )
}

/* =========================================================
   VERSÍCULO INICIAL
   versiculo_inicial/atual
========================================================= */

export function observarVersiculoInicial(
  onUpdate: (dados: VersiculoFirebase) => void,
  onError: (erro: Error) => void,
): Unsubscribe {
  const referencia = doc(
    db,
    'versiculo_inicial',
    'atual',
  )

  return onSnapshot(
    referencia,
    (documento) => {
      if (documento.exists()) {
        onUpdate(
          documento.data() as VersiculoFirebase,
        )
      } else {
        onUpdate({})
      }
    },
    (erro) => {
      onError(erro)
    },
  )
}

/* =========================================================
   DEVOCIONAL INICIAL
   devocional_inicial/atual
========================================================= */

export function observarDevocionalInicial(
  onUpdate: (dados: DevocionalFirebase) => void,
  onError: (erro: Error) => void,
): Unsubscribe {
  const referencia = doc(
    db,
    'devocional_inicial',
    'atual',
  )

  return onSnapshot(
    referencia,
    (documento) => {
      if (documento.exists()) {
        onUpdate(
          documento.data() as DevocionalFirebase,
        )
      } else {
        onUpdate({})
      }
    },
    (erro) => {
      onError(erro)
    },
  )
}

/* =========================================================
   CONTEÚDO DIÁRIO
   conteudo_diario/MM-dd
========================================================= */

export function observarConteudoDiario(
  data: string,
  onUpdate: (
    dados: ConteudoDiarioFirebase,
  ) => void,
  onError: (erro: Error) => void,
): Unsubscribe {
  const referencia = doc(
    db,
    'conteudo_diario',
    data,
  )

  return onSnapshot(
    referencia,
    (documento) => {
      if (documento.exists()) {
        onUpdate(
          documento.data() as ConteudoDiarioFirebase,
        )
      } else {
        onUpdate({})
      }
    },
    (erro) => {
      onError(erro)
    },
  )
}

/* =========================================================
   APENAS DEVOCIONAL DIÁRIO
   Mantém a mesma lógica do Android:
   pega o campo "devocional" dentro de
   conteudo_diario/MM-dd
========================================================= */

export function observarDevocionalDiario(
  data: string,
  onUpdate: (
    dados: DevocionalFirebase,
  ) => void,
  onError: (erro: Error) => void,
): Unsubscribe {
  const referencia = doc(
    db,
    'conteudo_diario',
    data,
  )

  return onSnapshot(
    referencia,
    (documento) => {
      if (!documento.exists()) {
        onUpdate({})
        return
      }

      const dados =
        documento.data()

      const devocional =
        dados.devocional

      if (
        devocional &&
        typeof devocional === 'object'
      ) {
        onUpdate(
          devocional as DevocionalFirebase,
        )
      } else {
        onUpdate({})
      }
    },
    (erro) => {
      onError(erro)
    },
  )
}