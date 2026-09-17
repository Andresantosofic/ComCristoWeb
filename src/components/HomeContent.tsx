import { useEffect, useState } from 'react'

import {
  Bell,
  Heart,
  Share2,
  BookOpen,
  ChevronRight,
  User,
  X,
  Check,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import './HomeContent.css'

import {
  observarConfiguracoes,
  observarBranding,
  observarVersiculoInicial,
  observarConteudoDiario,
  observarDevocionalInicial,
  observarAvisos,
  type ConfiguracoesFirebase,
  type BrandingFirebase,
  type VersiculoFirebase,
  type DevocionalFirebase,
  type AvisoFirebase,
} from '../services/homeFirebase'

type Sentimento =
  | 'mal'
  | 'regular'
  | 'bem'
  | 'otimo'
  | ''

type RespostaSentimento = {
  titulo: string
  mensagem: string
  referencia: string
}

type Aviso = AvisoFirebase & {
  lido: boolean
}

type HomeBibleFavorite = {
  id: string
  version: 'ACF' | 'TB'
  book: string
  chapter: number
  verse: number
  text: string
  color: 'yellow' | null
  createdAt: number
}

function HomeContent() {
  const navigate = useNavigate()

  /* =========================================
     FIREBASE
  ========================================= */

  const [
    configuracoesFirebase,
    setConfiguracoesFirebase,
  ] = useState<ConfiguracoesFirebase>({})

  const [branding, setBranding] =
    useState<BrandingFirebase>({
      ativo: false,
      tipo: '',
      logoUrl: '',
      videoUrl: '',
      loop: false,
    })

  const [
    versiculoFirebase,
    setVersiculoFirebase,
  ] = useState<VersiculoFirebase>({})

  const [
    devocionalFirebase,
    setDevocionalFirebase,
  ] = useState<DevocionalFirebase>({})

  const [
    conteudoDiario,
    setConteudoDiario,
  ] = useState<{
    versiculoDoDia?: {
      texto?: string
      referencia?: string
    }
    devocional?: {
      tema?: string
      versiculo?: string
      referencia?: string
    }
  }>({})

  const [
    brandingVideoErro,
    setBrandingVideoErro,
  ] = useState(false)

  const [fotoPerfil, setFotoPerfil] =
  useState<string | null>(() => {
    return localStorage.getItem(
      'comcristo_foto_perfil',
    )
  })

  /* =========================================
     DATA ATUAL
  ========================================= */

  const obterDataHoje = () => {
  const agora = new Date()

  const mes = String(
    agora.getMonth() + 1,
  ).padStart(2, '0')

  const dia = String(
    agora.getDate(),
  ).padStart(2, '0')

  return `${mes}-${dia}`
}

const [dataHoje, setDataHoje] = useState(
  obterDataHoje,
)

useEffect(() => {
  function atualizarData() {
    const novaData = obterDataHoje()

    setDataHoje((dataAtual) => {
      return dataAtual === novaData
        ? dataAtual
        : novaData
    })
  }

  const intervalo = window.setInterval(
    atualizarData,
    60 * 1000,
  )

  return () => {
    window.clearInterval(intervalo)
  }
}, [])

  /* =========================================
     OBSERVADORES FIREBASE
  ========================================= */

useEffect(() => {
  function atualizarPerfil() {
    setFotoPerfil(
      localStorage.getItem(
        'comcristo_foto_perfil',
      ),
    )

    const nomeSalvo = localStorage.getItem(
  'comcristo_nome_usuario',
)

setNomeUsuario(
  !nomeSalvo
    ? 'Filho(a) de Deus'
    : nomeSalvo,
)
  }

  window.addEventListener(
    'comcristo:perfil-atualizado',
    atualizarPerfil,
  )

  window.addEventListener(
    'storage',
    atualizarPerfil,
  )

  return () => {
    window.removeEventListener(
      'comcristo:perfil-atualizado',
      atualizarPerfil,
    )

    window.removeEventListener(
      'storage',
      atualizarPerfil,
    )
  }
}, [])

  useEffect(() => {
    const unsubscribeConfiguracoes =
      observarConfiguracoes(
        (dados) => {
  setConfiguracoesFirebase(dados)
},
        (erro) => {
          console.error(
            'Erro ao observar configurações:',
            erro,
          )
        },
      )

    const unsubscribeBranding =
      observarBranding(
        (dados) => {
          setBranding(dados)
          setBrandingVideoErro(false)
        },
        (erro) => {
          console.error(
            'Erro ao observar branding:',
            erro,
          )
        },
      )

    const unsubscribeVersiculoInicial =
      observarVersiculoInicial(
        setVersiculoFirebase,
        (erro) => {
          console.error(
            'Erro ao observar versículo inicial:',
            erro,
          )
        },
      )

    const unsubscribeDevocionalInicial =
      observarDevocionalInicial(
        setDevocionalFirebase,
        (erro) => {
          console.error(
            'Erro ao observar devocional inicial:',
            erro,
          )
        },
      )

    return () => {
      unsubscribeConfiguracoes()
      unsubscribeBranding()
      unsubscribeVersiculoInicial()
      unsubscribeDevocionalInicial()
    }
  }, [])

  /* =========================================
     CONTEÚDO DIÁRIO
  ========================================= */

  useEffect(() => {
    const unsubscribe =
      observarConteudoDiario(
        dataHoje,
        setConteudoDiario,
        (erro) => {
          console.error(
            'Erro ao observar conteúdo diário:',
            erro,
          )
        },
      )

    return () => unsubscribe()
  }, [dataHoje])

  /* =========================================
     SAUDAÇÃO
  ========================================= */

  const [horaAtual, setHoraAtual] =
  useState(() => new Date().getHours())

useEffect(() => {
  function atualizarHora() {
    setHoraAtual(new Date().getHours())
  }

  const intervalo = window.setInterval(
    atualizarHora,
    60 * 1000,
  )

  atualizarHora()

  return () => {
    window.clearInterval(intervalo)
  }
}, [])

  const saudacao =
    horaAtual >= 5 && horaAtual < 12
      ? configuracoesFirebase.saudacaoBomDia ||
        'Bom dia!'
      : horaAtual >= 12 && horaAtual < 18
        ? configuracoesFirebase.saudacaoBoaTarde ||
          'Boa tarde!'
        : configuracoesFirebase.saudacaoBoaNoite ||
          'Boa noite!'

  const fraseSaudacao =
    horaAtual >= 5 && horaAtual < 12
      ? configuracoesFirebase.fraseBomDia ||
        'Comece o dia na presença do Senhor.'
      : horaAtual >= 12 && horaAtual < 18
        ? configuracoesFirebase.fraseBoaTarde ||
          'Que Deus renove suas forças hoje.'
        : configuracoesFirebase.fraseBoaNoite ||
          'Entregue seu descanso nas mãos do Senhor.'

  /* =========================================
     VERSÍCULO DO DIA
  ========================================= */

  const versiculoInicialAtivo =
    versiculoFirebase.ativo === true

  const versiculoTexto =
    versiculoInicialAtivo &&
    versiculoFirebase.texto
      ? versiculoFirebase.texto
      : conteudoDiario.versiculoDoDia
          ?.texto ||
        'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.'

  const versiculoReferencia =
    versiculoInicialAtivo &&
    versiculoFirebase.referencia
      ? versiculoFirebase.referencia
      : conteudoDiario.versiculoDoDia
          ?.referencia ||
        'Salmos 37:5'

  /* =========================================
     DEVOCIONAL
  ========================================= */

  const devocionalInicialAtivo =
    devocionalFirebase.ativo === true

  const devocionalTema =
    devocionalInicialAtivo &&
    devocionalFirebase.tema
      ? devocionalFirebase.tema
      : conteudoDiario.devocional
          ?.tema ||
        'Um momento com Deus'

  const devocionalVersiculo =
    devocionalInicialAtivo &&
    devocionalFirebase.versiculo
      ? devocionalFirebase.versiculo
      : conteudoDiario.devocional
          ?.versiculo ||
        'Aproxime-se de Deus, e ele se aproximará de você.'

  const devocionalReferencia =
    devocionalInicialAtivo &&
    devocionalFirebase.referencia
      ? devocionalFirebase.referencia
      : conteudoDiario.devocional
          ?.referencia ||
        'Tiago 4:8'

  /* =========================================
     PERFIL
  ========================================= */

  const [nomeUsuario, setNomeUsuario] =
  useState<string>(() => {
    const nomeSalvo = localStorage.getItem(
      'comcristo_nome_usuario',
    )

    return !nomeSalvo
  ? 'Filho(a) de Deus'
  : nomeSalvo
  })

  /* =========================================
   SENTIMENTO
========================================= */

const [
  sentimentoDoDia,
  setSentimentoDoDia,
] = useState<Sentimento>(() => {
  try {
    const salvos =
      localStorage.getItem(
        'comcristo_sentimentos',
      )

    if (!salvos) return ''

    const dados =
      JSON.parse(salvos)

    return dados?.[dataHoje] || ''

  } catch {
    return ''
  }
})

const [
  sentimentoSelecionado,
  setSentimentoSelecionado,
] = useState<Sentimento>(
  sentimentoDoDia,
)

useEffect(() => {
  try {
    const salvos =
      localStorage.getItem(
        'comcristo_sentimentos',
      )

    if (!salvos) {
      setSentimentoDoDia('')
      setSentimentoSelecionado('')
      return
    }

    const dados = JSON.parse(salvos)

    const sentimentoHoje =
      dados?.[dataHoje] || ''

    setSentimentoDoDia(
      sentimentoHoje,
    )

    setSentimentoSelecionado(
      sentimentoHoje,
    )
  } catch {
    setSentimentoDoDia('')
    setSentimentoSelecionado('')
  }
}, [dataHoje])

function selecionarSentimento(
  sentimento: Sentimento,
) {

  /*
   * Se já existe um sentimento registrado
   * para hoje, não permite alterar.
   */
  if (sentimentoDoDia) {
    return
  }

  try {

    const salvos =
      localStorage.getItem(
        'comcristo_sentimentos',
      )

    const dados =
      salvos
        ? JSON.parse(salvos)
        : {}

    dados[dataHoje] =
      sentimento

    localStorage.setItem(
      'comcristo_sentimentos',
      JSON.stringify(dados),
    )

    setSentimentoDoDia(
      sentimento,
    )

    setSentimentoSelecionado(
      sentimento,
    )

  } catch (erro) {

    console.error(
      'Erro ao salvar sentimento:',
      erro,
    )
  }
}

/*
 * Fecha somente a resposta visual.
 *
 * O sentimento continua registrado
 * para o dia atual.
 */
function limparSentimento() {
  setSentimentoSelecionado('')
}

const respostas: Record<
  Exclude<Sentimento, ''>,
  RespostaSentimento
> = {
  mal: {
    titulo:
      configuracoesFirebase.tituloMal ||
      'Deus está com você.',
    mensagem:
      configuracoesFirebase.mensagemMal ||
      'Mesmo em meio à dor, você não está sozinho. Entregue seu coração a Deus e confie nEle.',
    referencia: 'Salmos 34:18',
  },

  regular: {
    titulo:
      configuracoesFirebase.tituloRegular ||
      'Continue confiando em Deus.',
    mensagem:
      configuracoesFirebase.mensagemRegular ||
      'Nem todos os dias serão fáceis, mas Deus permanece ao seu lado em cada momento.',
    referencia: 'Isaías 41:10',
  },

  bem: {
    titulo:
      configuracoesFirebase.tituloBem ||
      'Que bom saber disso!',
    mensagem:
      configuracoesFirebase.mensagemBem ||
      'Agradeça a Deus pelo que você está vivendo e continue caminhando com Ele.',
    referencia: 'Salmos 118:24',
  },

  otimo: {
    titulo:
      configuracoesFirebase.tituloOtimo ||
      'Glória a Deus!',
    mensagem:
      configuracoesFirebase.mensagemOtimo ||
      'Celebre este momento e reconheça que toda boa dádiva vem do Senhor.',
    referencia: 'Tiago 1:17',
  },
}

const respostaAtual =
  sentimentoSelecionado
    ? respostas[
        sentimentoSelecionado
      ]
    : null

  /* =========================================
   FAVORITO DO VERSÍCULO
========================================= */

/*
 * Guarda os favoritos individualmente por referência.
 *
 * Exemplo:
 *
 * {
 *   "Salmos 37:5": true,
 *   "João 3:16": true
 * }
 */
const [
  versiculosFavoritados,
  setVersiculosFavoritados,
] = useState<Record<string, boolean>>(() => {

  try {

    const salvos =
      localStorage.getItem(
        'comcristo_versiculos_favoritados',
      )

    if (!salvos) {
      return {}
    }

    const dados =
      JSON.parse(salvos)

    if (
      dados &&
      typeof dados === 'object' &&
      !Array.isArray(dados)
    ) {
      return dados
    }

    return {}

  } catch {

    return {}
  }
})

/*
 * Verifica se o versículo que está sendo
 * exibido atualmente está favoritado.
 */
const versiculoFavoritado =
  Boolean(
    versiculosFavoritados[
      versiculoReferencia
    ],
  )

/*
 * Estado visual do compartilhamento.
 */
const [
  versiculoCompartilhado,
  setVersiculoCompartilhado,
] = useState(false)

/*
 * Adiciona ou remove o versículo atual
 * dos favoritos.
 */
function alternarFavoritoVersiculo() {
  setVersiculosFavoritados(
    (favoritosAtuais) => {
      const novoEstado =
        !favoritosAtuais[
          versiculoReferencia
        ]

      const novosFavoritos = {
        ...favoritosAtuais,
        [versiculoReferencia]:
          novoEstado,
      }

      if (!novoEstado) {
        delete novosFavoritos[
          versiculoReferencia
        ]
      }

      // Mantém o armazenamento antigo usado
      // pelo coração da Home
      localStorage.setItem(
        'comcristo_versiculos_favoritados',
        JSON.stringify(
          novosFavoritos,
        ),
      )

      // =====================================================
      // SINCRONIZA COM OS FAVORITOS DA BÍBLIA
      // =====================================================

      try {
        const correspondencia =
          versiculoReferencia
            .trim()
            .match(
              /^(.*)\s+(\d+):(\d+)$/,
            )

        if (correspondencia) {
          const livro =
            correspondencia[1].trim()

          const capitulo =
            Number(
              correspondencia[2],
            )

          const versiculo =
            Number(
              correspondencia[3],
            )

          const version = 'ACF'

          const id = [
            version,
            livro,
            capitulo,
            versiculo,
          ].join('_')

          // -------------------------------------------------
          // FAVORITOS
          // -------------------------------------------------

          let favoritosBiblia: HomeBibleFavorite[] = []

          try {
            const salvos =
              localStorage.getItem(
                'comcristo_biblia_favorites',
              )

            if (salvos) {
              const dados =
                JSON.parse(salvos)

              if (Array.isArray(dados)) {
                favoritosBiblia =
                  dados
              }
            }
          } catch {
            favoritosBiblia = []
          }

          if (novoEstado) {
            const jaExiste =
              favoritosBiblia.some(
                (favorito) =>
                  favorito.id === id,
              )

            if (!jaExiste) {
              favoritosBiblia = [
                {
                  id,
                  version,
                  book: livro,
                  chapter: capitulo,
                  verse: versiculo,
                  text: versiculoTexto,
                  color: 'yellow',
                  createdAt:
                    Date.now(),
                },
                ...favoritosBiblia,
              ]
            } else {
              // Garante que o favorito fique
              // associado à marcação amarela
              favoritosBiblia =
                favoritosBiblia.map(
                  (favorito) =>
                    favorito.id === id
                      ? {
                          ...favorito,
                          color: 'yellow',
                        }
                      : favorito,
                )
            }
          } else {
            favoritosBiblia =
              favoritosBiblia.filter(
                (favorito) =>
                  favorito.id !== id,
              )
          }

          localStorage.setItem(
            'comcristo_biblia_favorites',
            JSON.stringify(
              favoritosBiblia,
            ),
          )

          // -------------------------------------------------
          // DESTAQUE VISUAL DA BÍBLIA
          // -------------------------------------------------

          let destaques: Record<
            string,
            string
          > = {}

          try {
            const salvos =
              localStorage.getItem(
                'comcristo_biblia_highlights',
              )

            if (salvos) {
              const dados =
                JSON.parse(salvos)

              if (
                dados &&
                typeof dados ===
                  'object' &&
                !Array.isArray(dados)
              ) {
                destaques = dados
              }
            }
          } catch {
            destaques = {}
          }

          if (novoEstado) {
            // Favorito criado pela Home
            // recebe marcação amarela
            destaques[id] = 'yellow'
          } else {
            // Remove a marcação criada pelo favorito
            delete destaques[id]
          }

          localStorage.setItem(
            'comcristo_biblia_highlights',
            JSON.stringify(
              destaques,
            ),
          )

          // Atualiza a tela de Favoritos
          window.dispatchEvent(
            new Event(
              'comcristo:favoritos-atualizados',
            ),
          )
        }
      } catch {
        // ignora erros de sincronização
      }

      return novosFavoritos
    },
  )
}

useEffect(() => {
  function sincronizarFavoritosComBiblia() {
    try {
      const salvos =
        localStorage.getItem(
          'comcristo_biblia_favorites',
        )

      if (!salvos) {
        setVersiculosFavoritados({})
        return
      }

      const favoritosBiblia =
        JSON.parse(salvos)

      if (!Array.isArray(favoritosBiblia)) {
        setVersiculosFavoritados({})
        return
      }

      const favoritosHome: Record<
        string,
        boolean
      > = {}

      favoritosBiblia.forEach(
        (favorito) => {
          if (
            favorito &&
            favorito.book &&
            favorito.chapter &&
            favorito.verse
          ) {
            const referencia =
              `${favorito.book} ${favorito.chapter}:${favorito.verse}`

            favoritosHome[
              referencia
            ] = true
          }
        },
      )

      setVersiculosFavoritados(
        favoritosHome,
      )

      // Mantém também a estrutura antiga
      // sincronizada
      localStorage.setItem(
        'comcristo_versiculos_favoritados',
        JSON.stringify(
          favoritosHome,
        ),
      )
    } catch {
      // ignora erros de leitura
    }
  }

  window.addEventListener(
    'comcristo:favoritos-atualizados',
    sincronizarFavoritosComBiblia,
  )

  // Sincroniza também ao abrir a Home
  sincronizarFavoritosComBiblia()

  return () => {
    window.removeEventListener(
      'comcristo:favoritos-atualizados',
      sincronizarFavoritosComBiblia,
    )
  }
}, [])

async function gerarImagemVersiculo(): Promise<Blob | null> {
  try {
    const canvas = document.createElement('canvas')
    const contexto = canvas.getContext('2d')

if (!contexto) {
  return null
}

const ctx = contexto

    /*
     * =========================================================
     * CONFIGURAÇÃO DA ARTE
     * =========================================================
     */

    const largura = 1080
    const altura = 1350

    canvas.width = largura
    canvas.height = altura

    const margem = 90
    const larguraTexto = largura - margem * 2

    /*
     * =========================================================
     * FUNÇÃO PARA QUEBRAR TEXTO
     * =========================================================
     */

    function quebrarTexto(
      texto: string,
      maxWidth: number,
    ): string[] {
      const palavras = texto.trim().split(/\s+/)
      const linhas: string[] = []

      let linhaAtual = ''

      for (const palavra of palavras) {
        const teste = linhaAtual
          ? `${linhaAtual} ${palavra}`
          : palavra

        if (
          ctx.measureText(teste).width >
            maxWidth &&
          linhaAtual
        ) {
          linhas.push(linhaAtual)
          linhaAtual = palavra
        } else {
          linhaAtual = teste
        }
      }

      if (linhaAtual) {
        linhas.push(linhaAtual)
      }

      return linhas
    }

    /*
     * =========================================================
     * FUNÇÃO PARA DESENHAR TEXTO CENTRALIZADO
     * =========================================================
     */

    function desenharLinhas(
      linhas: string[],
      x: number,
      y: number,
      espacamento: number,
    ) {
      linhas.forEach(
        (linha, indice) => {
          ctx.fillText(
            linha,
            x,
            y + indice * espacamento,
          )
        },
      )
    }

    /*
     * =========================================================
     * FUNÇÃO PARA CARREGAR IMAGEM
     * =========================================================
     */

    async function carregarImagem(
      url: string,
    ): Promise<HTMLImageElement> {
      return await new Promise(
        (resolve, reject) => {
          const imagem =
            new Image()

          imagem.crossOrigin =
            'anonymous'

          imagem.onload = () =>
            resolve(imagem)

          imagem.onerror = () =>
            reject(
              new Error(
                'Não foi possível carregar a imagem.',
              ),
            )

          imagem.src = url
        },
      )
    }

    /*
     * =========================================================
     * FUNDO
     * =========================================================
     */

    const fundoUrl =
      configuracoesFirebase
        .compartilharVersiculoFundoUrl

    if (fundoUrl) {
      try {
        const fundo =
          await carregarImagem(
            fundoUrl,
          )

        const proporcaoFundo =
          fundo.width /
          fundo.height

        const proporcaoCanvas =
          largura / altura

        let desenhoLargura =
          largura

        let desenhoAltura =
          altura

        let desenhoX = 0
        let desenhoY = 0

        /*
         * Preenche toda a arte
         * mantendo proporção.
         */

        if (
          proporcaoFundo >
          proporcaoCanvas
        ) {
          desenhoAltura =
            altura

          desenhoLargura =
            altura *
            proporcaoFundo

          desenhoX =
            (largura -
              desenhoLargura) /
            2
        } else {
          desenhoLargura =
            largura

          desenhoAltura =
            largura /
            proporcaoFundo

          desenhoY =
            (altura -
              desenhoAltura) /
            2
        }

        ctx.drawImage(
          fundo,
          desenhoX,
          desenhoY,
          desenhoLargura,
          desenhoAltura,
        )
      } catch {
        /*
         * Se o fundo do Firebase
         * falhar, usa o fundo padrão.
         */

        ctx.fillStyle =
          '#042251'

        ctx.fillRect(
          0,
          0,
          largura,
          altura,
        )
      }
    } else {
      ctx.fillStyle =
        '#042251'

      ctx.fillRect(
        0,
        0,
        largura,
        altura,
      )
    }

    /*
     * =========================================================
     * SOBREPOSIÇÃO
     *
     * Ajuda a manter o texto
     * legível sobre qualquer fundo.
     * =========================================================
     */

    const gradiente =
      ctx.createLinearGradient(
        0,
        0,
        0,
        altura,
      )

    gradiente.addColorStop(
      0,
      'rgba(0,0,0,0.45)',
    )

    gradiente.addColorStop(
      0.5,
      'rgba(0,0,0,0.20)',
    )

    gradiente.addColorStop(
      1,
      'rgba(0,0,0,0.55)',
    )

    ctx.fillStyle =
      gradiente

    ctx.fillRect(
      0,
      0,
      largura,
      altura,
    )

    /*
     * =========================================================
     * CONFIGURAÇÕES
     * =========================================================
     */

    const titulo =
      configuracoesFirebase
        .compartilharVersiculoTitulo ||
      'Versículo do dia'

    const frase =
      configuracoesFirebase
        .compartilharVersiculoFrase ||
      ''

    /*
     * =========================================================
     * TÍTULO
     * =========================================================
     */

    ctx.textAlign =
      'center'

    ctx.textBaseline =
      'middle'

    ctx.fillStyle =
      '#FFFFFF'

    ctx.font =
      'bold 48px Arial'

    const linhasTitulo =
      quebrarTexto(
        titulo,
        larguraTexto,
      )

    desenharLinhas(
      linhasTitulo,
      largura / 2,
      150,
      58,
    )

    /*
     * =========================================================
     * VERSÍCULO
     * =========================================================
     */

    ctx.font =
      'italic 45px Arial'

    const linhasVersiculo =
      quebrarTexto(
        `“${versiculoTexto}”`,
        larguraTexto,
      )

    /*
     * Limita o tamanho máximo
     * caso o versículo seja muito grande.
     */

    const espacamentoVersiculo =
      68

    const alturaVersiculo =
      linhasVersiculo.length *
      espacamentoVersiculo

    let inicioVersiculo =
      altura / 2 -
      alturaVersiculo / 2

    /*
     * Garante que o versículo
     * não encoste no título.
     */

    const limiteSuperior =
      300

    if (
      inicioVersiculo <
      limiteSuperior
    ) {
      inicioVersiculo =
        limiteSuperior
    }

    desenharLinhas(
      linhasVersiculo,
      largura / 2,
      inicioVersiculo,
      espacamentoVersiculo,
    )

    /*
     * =========================================================
     * REFERÊNCIA
     * =========================================================
     */

    const posicaoReferencia =
      inicioVersiculo +
      alturaVersiculo +
      55

    ctx.font =
      'bold 38px Arial'

    ctx.fillText(
      versiculoReferencia,
      largura / 2,
      posicaoReferencia,
    )

    /*
     * =========================================================
     * FRASE DO FIREBASE
     * =========================================================
     */

    if (frase.trim()) {
      ctx.font =
        '32px Arial'

      const linhasFrase =
        quebrarTexto(
          frase,
          larguraTexto,
        )

      const espacamentoFrase =
        46

      const alturaFrase =
        linhasFrase.length *
        espacamentoFrase

      const inicioFrase =
        altura -
        220 -
        alturaFrase / 2

      desenharLinhas(
        linhasFrase,
        largura / 2,
        inicioFrase,
        espacamentoFrase,
      )
    }

    /*
     * =========================================================
     * MARCA
     * =========================================================
     */

    ctx.font =
      'bold 30px Arial'

    ctx.fillText(
      'Com Cristo',
      largura / 2,
      altura - 70,
    )

    /*
     * =========================================================
     * CONVERTE PARA PNG
     * =========================================================
     */

    return await new Promise(
      (resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob)
          },
          'image/png',
          1,
        )
      },
    )
  } catch (erro) {
    console.error(
      'Erro ao gerar imagem do versículo:',
      erro,
    )

    return null
  }
}

async function compartilharVersiculo() {
  try {
    /*
     * ---------------------------------------------------------
     * GERA A IMAGEM DO VERSÍCULO
     * ---------------------------------------------------------
     */

    const blob =
      await gerarImagemVersiculo()

    if (!blob) {
      console.error(
        'Não foi possível gerar a imagem do versículo.',
      )
      return
    }

    /*
     * ---------------------------------------------------------
     * TRANSFORMA O BLOB EM ARQUIVO
     * ---------------------------------------------------------
     */

    const arquivo =
      new File(
        [blob],
        'versiculo-com-cristo.png',
        {
          type: 'image/png',
        },
      )

    /*
     * ---------------------------------------------------------
     * COMPARTILHAMENTO NATIVO DA IMAGEM
     * ---------------------------------------------------------
     */

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [arquivo],
      })
    ) {
      await navigator.share({
        title:
          configuracoesFirebase
            .compartilharVersiculoTitulo ||
          'Versículo do dia',

        text: (() => {
  const mensagem =
    configuracoesFirebase
      .mensagemCompartilhamento ||
    'Compartilhe a Palavra de Deus.'

  const link =
    configuracoesFirebase
      .linkAplicativo

  if (link) {
    return `${mensagem}\n\n${link}`
  }

  return mensagem
})(),

        files: [arquivo],
      })

      setVersiculoCompartilhado(
        true,
      )

      setTimeout(() => {
        setVersiculoCompartilhado(
          false,
        )
      }, 2000)

      return
    }

    /*
     * ---------------------------------------------------------
     * FALLBACK
     *
     * Caso o navegador não suporte
     * compartilhamento de arquivos,
     * salva a imagem no dispositivo.
     * ---------------------------------------------------------
     */

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url
    link.download =
      'versiculo-com-cristo.png'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    setVersiculoCompartilhado(
      true,
    )

    setTimeout(() => {
      setVersiculoCompartilhado(
        false,
      )
    }, 2000)

  } catch (erro) {

    /*
     * O usuário pode simplesmente
     * cancelar o compartilhamento.
     */

    if (
      erro instanceof DOMException &&
      erro.name === 'AbortError'
    ) {
      return
    }

    console.error(
      'Erro ao compartilhar versículo:',
      erro,
    )
  }
}

  /* =========================================
     AVISOS — FIREBASE
  ========================================= */

  const [
  avisosAbertos,
  setAvisosAbertos,
] = useState(false)

const [
  avisos,
  setAvisos,
] = useState<Aviso[]>([])

/*
 * IDs dos avisos que o usuário já leu.
 *
 * Eles ficam salvos no navegador para que
 * continuem lidos mesmo depois de atualizar
 * ou fechar e abrir a página.
 */
const [
  avisosLidos,
  setAvisosLidos,
] = useState<string[]>(() => {
  try {
    const salvos =
      localStorage.getItem(
        'comcristo_avisos_lidos',
      )

    if (!salvos) {
      return []
    }

    const dados =
      JSON.parse(salvos)

    return Array.isArray(dados)
      ? dados
      : []

  } catch {
    return []
  }
})

  useEffect(() => {
  const unsubscribe =
    observarAvisos(
      (avisosFirebase) => {

        setAvisos(
          avisosFirebase.map(
            (aviso) => ({
              ...aviso,

              /*
               * O aviso será considerado lido
               * se o ID estiver salvo no localStorage.
               */
              lido:
                avisosLidos.includes(
                  aviso.id,
                ),
            }),
          ),
        )
      },

      (erro) => {
        console.error(
          'Erro ao observar avisos:',
          erro,
        )
      },
    )

  return () => unsubscribe()

}, [avisosLidos])

  const quantidadeAvisosNaoLidos =
    avisos.filter(
      (aviso) => !aviso.lido,
    ).length

  function abrirAvisos() {
    setAvisosAbertos(true)
  }

  function fecharAvisos() {
    setAvisosAbertos(false)
  }

  function marcarAvisoComoLido(
  id: string,
) {

  setAvisosLidos(
    (idsAtuais) => {

      /*
       * Se já estiver lido,
       * não fazemos nada.
       */
      if (
        idsAtuais.includes(id)
      ) {
        return idsAtuais
      }

      const novosIds = [
        ...idsAtuais,
        id,
      ]

      /*
       * Salva permanentemente no navegador.
       */
      localStorage.setItem(
        'comcristo_avisos_lidos',
        JSON.stringify(
          novosIds,
        ),
      )

      return novosIds
    },
  )

  /*
   * Atualiza imediatamente a interface,
   * sem precisar esperar o listener.
   */
  setAvisos(
    (avisosAtuais) =>
      avisosAtuais.map(
        (aviso) =>
          aviso.id === id
            ? {
                ...aviso,
                lido: true,
              }
            : aviso,
      ),
  )
}

  function marcarTodosComoLidos() {

  setAvisosLidos(
    (idsAtuais) => {

      const novosIds = Array.from(
        new Set([
          ...idsAtuais,
          ...avisos.map(
            (aviso) =>
              aviso.id,
          ),
        ]),
      )

      localStorage.setItem(
        'comcristo_avisos_lidos',
        JSON.stringify(
          novosIds,
        ),
      )

      return novosIds
    },
  )

  /*
   * Atualiza imediatamente a interface.
   */
  setAvisos(
    (avisosAtuais) =>
      avisosAtuais.map(
        (aviso) => ({
          ...aviso,
          lido: true,
        }),
      ),
  )
}

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="home-content">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="home-header">

        <div className="home-branding">

          {branding.ativo &&
          branding.tipo.toLowerCase() ===
            'video' &&
          branding.videoUrl &&
          !brandingVideoErro ? (
            <video
              key={branding.videoUrl}
              src={branding.videoUrl}
              className="home-logo-video"
              autoPlay
              muted
              loop={branding.loop}
              playsInline
              preload="auto"
              onError={() =>
                setBrandingVideoErro(
                  true,
                )
              }
            />
          ) : branding.ativo &&
            branding.tipo.toLowerCase() ===
              'imagem' &&
            branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt="Com Cristo"
              className="home-logo"
              onError={(event) => {
                event.currentTarget.src =
                  '/images/logo_app.png'
              }}
            />
          ) : (
            <img
              src="/images/logo_app.png"
              alt="Com Cristo - Devocional diário"
              className="home-logo"
            />
          )}

        </div>

        <div className="home-header-spacer" />

        <button
          className="header-icon-button"
          aria-label="Avisos"
          type="button"
          onClick={abrirAvisos}
        >
          <Bell size={25} />

          {quantidadeAvisosNaoLidos >
            0 && (
            <span className="notification-dot" />
          )}
        </button>

        <button
  className="profile-button"
  aria-label="Perfil"
  type="button"
  onClick={() =>
    navigate('/perfil')
  }
>
  {fotoPerfil ? (
    <img
      src={fotoPerfil}
      alt="Foto do perfil"
      className="home-profile-image"
    />
  ) : (
    <User size={25} />
  )}
</button>

      </header>

      {/* =========================================
          BANNER PRINCIPAL
      ========================================= */}

      <section className="home-banner">

        <img
          src="/images/banner_home.jpg"
          alt="Banner Com Cristo"
          className="home-banner-image"
        />

        <div className="home-banner-overlay" />

        <div className="home-banner-content">

          <span className="home-greeting">
            {saudacao}
          </span>

          <strong className="home-user-name">
            Olá, {nomeUsuario}
          </strong>

          <span className="home-greeting-subtitle">
            {fraseSaudacao}
          </span>

        </div>

      </section>

      {/* =========================================
          VERSÍCULO DO DIA
      ========================================= */}

      <section className="home-verse-card">

        <div className="verse-header">

          <div className="verse-title-group">

            <div className="verse-icon">
              <BookOpen size={22} />
            </div>

            <strong>
              {configuracoesFirebase.tituloVersiculo ||
                'Versículo do dia'}
            </strong>

          </div>

          <span className="verse-quotes">
            ❞
          </span>

        </div>

        <p className="home-verse-text">
          "{versiculoTexto}"
        </p>

        <div className="verse-footer">

          <strong className="home-verse-reference">
            {versiculoReferencia}
          </strong>

          <div className="verse-actions">

            <button
              type="button"
              aria-label={
                versiculoFavoritado
                  ? 'Remover versículo dos favoritos'
                  : 'Favoritar versículo'
              }
              className={
                versiculoFavoritado
                  ? 'verse-action-active'
                  : ''
              }
              onClick={
                alternarFavoritoVersiculo
              }
            >
              <Heart
                size={20}
                fill={
                  versiculoFavoritado
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>

            <button
              type="button"
              aria-label="Compartilhar versículo"
              className={
                versiculoCompartilhado
                  ? 'verse-action-active'
                  : ''
              }
              onClick={
                compartilharVersiculo
              }
            >
              <Share2 size={20} />
            </button>

          </div>

        </div>

        {versiculoCompartilhado && (
          <div className="verse-share-feedback">
            Versículo pronto para compartilhar!
          </div>
        )}

      </section>
            {/* =========================================
          SENTIMENTOS
      ========================================= */}

      <section className="home-feelings-section">

        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              Como você está?
            </span>

            <h2>
              {configuracoesFirebase.tituloSentimentos ||
                'Como você está se sentindo hoje?'}
            </h2>
          </div>
        </div>

        <div className="feelings-grid">

          <button
            type="button"
            className={`feeling-button feeling-mal ${
              sentimentoSelecionado === 'mal'
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              selecionarSentimento('mal')
            }
          >
            <span className="feeling-emoji">
              😔
            </span>

            <span>
              {configuracoesFirebase.sentimentoMal ||
                'Mal'}
            </span>
          </button>

          <button
            type="button"
            className={`feeling-button feeling-regular ${
              sentimentoSelecionado === 'regular'
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              selecionarSentimento(
                'regular',
              )
            }
          >
            <span className="feeling-emoji">
              😐
            </span>

            <span>
              {configuracoesFirebase.sentimentoRegular ||
                'Regular'}
            </span>
          </button>

          <button
            type="button"
            className={`feeling-button feeling-bem ${
              sentimentoSelecionado === 'bem'
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              selecionarSentimento('bem')
            }
          >
            <span className="feeling-emoji">
              🙂
            </span>

            <span>
              {configuracoesFirebase.sentimentoBem ||
                'Bem'}
            </span>
          </button>

          <button
            type="button"
            className={`feeling-button feeling-otimo ${
              sentimentoSelecionado === 'otimo'
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              selecionarSentimento('otimo')
            }
          >
            <span className="feeling-emoji">
              😄
            </span>

            <span>
              {configuracoesFirebase.sentimentoOtimo ||
                'Ótimo'}
            </span>
          </button>

        </div>

        {respostaAtual && (
          <div className="feeling-response">

            <button
              type="button"
              className="feeling-response-close"
              aria-label="Fechar"
              onClick={limparSentimento}
            >
              <X size={18} />
            </button>

            <span className="feeling-response-label">
              Uma palavra para você
            </span>

            <h3>
              {respostaAtual.titulo}
            </h3>

            <p>
              {respostaAtual.mensagem}
            </p>

            <strong>
              {respostaAtual.referencia}
            </strong>

          </div>
        )}

      </section>

      {/* =========================================
    DEVOCIONAL
========================================= */}

<section className="devotional-card">

  <img
    src="/images/devocional_bg.jpg"
    alt=""
    className="devotional-background"
  />

  <div className="devotional-overlay" />

  <div className="devotional-content">

    <strong className="devotional-title">
      Devocional de hoje
    </strong>

    <h2>
      {devocionalTema}
    </h2>

    <p>
      "{devocionalVersiculo}"
    </p>

    <strong className="devotional-reference">
      {devocionalReferencia}
    </strong>

    <button
      className="devotional-button"
      type="button"
      onClick={() =>
        navigate('/devocional')
      }
    >
      {configuracoesFirebase.textoBotaoDevocional ||
        'LER DEVOCIONAL'}

      <ChevronRight size={17} />
    </button>

  </div>

</section>

      {/* =========================================
    BÍBLIA
========================================= */}

<section
  className="home-dark-card"
  onClick={() =>
    navigate('/biblia')
  }
  onKeyDown={(event) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      navigate('/biblia')
    }
  }}
  role="button"
  tabIndex={0}
>

  <div className="dark-card-icon">
    <BookOpen size={30} />
  </div>

  <div className="dark-card-text">

    <h2>
  {configuracoesFirebase.tituloBiblia ||
    'Bíblia Sagrada'}
</h2>

    <p>
      {configuracoesFirebase.descricaoBiblia ||
        'Leia a Palavra de Deus.'}
    </p>

  </div>

  <ChevronRight size={24} />

</section>

      {/* =========================================
    OFERTAS
========================================= */}

<section
  className="home-offers-card"
  onClick={() =>
    navigate('/ofertas')
  }
  onKeyDown={(event) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      navigate('/ofertas')
    }
  }}
  role="button"
  tabIndex={0}
>

  <div className="dark-card-icon">

    <Heart
      size={30}
      fill="currentColor"
    />

  </div>

  <div className="dark-card-text">


    <h2>
      {configuracoesFirebase.tituloOfertas ||
        'Ofertas'}
    </h2>

    <p>
      {configuracoesFirebase.descricaoOfertas ||
        'Faça a diferença na vida de alguém.'}
    </p>

  </div>

  <ChevronRight size={24} />

</section>

      {/* =========================================
          ESPAÇO FINAL
      ========================================= */}

      <div className="home-bottom-space" />

      {/* =========================================
          PAINEL DE AVISOS
      ========================================= */}

      {avisosAbertos && (
        <div
          className="notifications-overlay"
          onClick={fecharAvisos}
        >

          <aside
            className="notifications-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="notifications-header">

              <div>
                <span className="notifications-eyebrow">
                  Com Cristo
                </span>

                <h2>
                  Avisos
                </h2>
              </div>

              <button
                type="button"
                className="notifications-close"
                aria-label="Fechar avisos"
                onClick={fecharAvisos}
              >
                <X size={22} />
              </button>

            </div>

            {avisos.length > 0 && (
              <button
                type="button"
                className="notifications-read-all"
                onClick={
                  marcarTodosComoLidos
                }
              >
                <Check size={16} />

                <span>
                  Marcar todos como lidos
                </span>
              </button>
            )}

            <div className="notifications-list">

  {avisos.length === 0 ? (
    <div className="notifications-empty">

      <Bell size={34} />

      <h3>
        Nenhum aviso
      </h3>

      <p>
        No momento não há novos avisos para você.
      </p>

    </div>
  ) : (
    avisos.map((aviso) => (

      <article
        key={aviso.id}
        className={`notification-item ${
          aviso.lido ? 'read' : 'unread'
        }`}
        onClick={() =>
          marcarAvisoComoLido(aviso.id)
        }
      >


        {/* BANNER COMPLETO */}

{aviso.imagem && (
  <div className="notification-banner-wrapper">
    <img
      src={aviso.imagem}
      alt=""
      className="notification-banner"
    />
  </div>
)}

{/* CONTEÚDO */}

<div className="notification-content">

  <div className="notification-top">

    {aviso.tag && (
      <span className="notification-tag">
        {aviso.tag}
      </span>
    )}

    {!aviso.lido && (
      <span className="notification-new">
        Novo
      </span>
    )}

  </div>

  <div className="notification-title-row">

    <h3>
      {aviso.titulo}
    </h3>

    {!aviso.lido && (
      <span className="notification-unread-dot" />
    )}

  </div>

  {aviso.mensagem && (
  <div className="notification-message">
    {aviso.mensagem}
  </div>
)}

  {aviso.data && (
    <time className="notification-date">
      {aviso.data}
    </time>
  )}

  {aviso.botaoTexto && aviso.botaoLink && (
    <a
      href={aviso.botaoLink}
      target="_blank"
      rel="noreferrer"
      className="notification-button"
      onClick={(event) => {
        event.stopPropagation()
        marcarAvisoComoLido(aviso.id)
      }}
    >
      <span>
        {aviso.botaoTexto}
      </span>

      <ChevronRight size={17} />
    </a>
  )}

</div>

      </article>

    ))
  )}

</div>

          </aside>

        </div>
      )}

    </main>
  )
}

export default HomeContent