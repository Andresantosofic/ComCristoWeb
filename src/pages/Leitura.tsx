import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Highlighter,
  MessageCircle,
  Pencil,
  Plus,
  Save,
  Share2,
  StickyNote,
  Trash2,
  X,
} from 'lucide-react'

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import './Leitura.css'


/* ============================================================
   TIPOS
============================================================ */

type BibleVersion = 'ACF' | 'TB'

type BibleBook = {
  nome: string
  capitulos: Record<string, string[]>
}

type BibleData = Record<string, BibleBook>

type SelectedVerse = {
  book: string
  chapter: number
  verse: number
  text: string
}

type HighlightColor =
  | 'yellow'
  | 'green'
  | 'blue'
  | 'cyan'
  | 'pink'
  | 'purple'

type Highlights =
  Record<string, HighlightColor>

/*
 * CORREÇÃO:
 *
 * No Android, quando o usuário marca um versículo
 * com uma cor, esse versículo passa a fazer parte
 * dos "Versículos Favoritos".
 *
 * Por isso o favorito precisa guardar também
 * a cor da marcação.
 */
type BibleFavorite = {
  id: string
  version: BibleVersion
  book: string
  chapter: number
  verse: number
  text: string
  color: HighlightColor
  createdAt: number
}

type BibleNote = {
  id: string
  text: string
  version?: BibleVersion
  book: string
  chapter: number
  verse?: number
  createdAt: number
  updatedAt: number
}

type NoteTarget = {
  version: BibleVersion
  book: string
  chapter: number
  verse?: number
  verseText?: string
}

/* ============================================================
   ARQUIVOS
============================================================ */

const VERSION_FILES: Record<
  BibleVersion,
  string
> = {
  ACF: '/data/biblias/ACF_OFICIAL.json',
  TB: '/data/biblias/TB.json',
}

/* ============================================================
   CONSTANTES
============================================================ */

/*
 * CORREÇÃO:
 * Android trabalha com fonte mínima de 14.
 */
const FONTE_MINIMA = 14
const FONTE_MAXIMA = 32
const FONTE_PADRAO = 16

/* ============================================================
   FUNÇÕES AUXILIARES
============================================================ */

function normalizarBusca(
  value: string,
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase()
    .trim()
}

function lerLocalStorage<T>(
  chave: string,
  fallback: T,
): T {
  try {
    const salvo =
      localStorage.getItem(chave)

    if (!salvo) {
      return fallback
    }

    return JSON.parse(
      salvo,
    ) as T
  } catch {
    return fallback
  }
}

function obterFonteSalva(): number {
  try {
    const salvo = Number(
      localStorage.getItem(
        'comcristo_tamanho_fonte',
      ),
    )

    if (
      Number.isFinite(salvo) &&
      salvo >= FONTE_MINIMA &&
      salvo <= FONTE_MAXIMA
    ) {
      return salvo
    }
  } catch {
    // ignora
  }

  return FONTE_PADRAO
}

function obterLivro(
  bible: BibleData,
  nome: string,
): BibleBook | undefined {
  const alvo =
    normalizarBusca(nome)

  return Object.values(
    bible,
  ).find(
    (livro) =>
      normalizarBusca(
        livro.nome,
      ) === alvo,
  )
}

function obterCapitulos(
  livro: BibleBook | undefined,
): number[] {
  if (!livro) {
    return []
  }

  return Object.keys(
    livro.capitulos ?? {},
  )
    .map(Number)
    .filter(
      (numero) =>
        Number.isFinite(
          numero,
        ),
    )
    .sort(
      (a, b) => a - b,
    )
}

function obterChaveVersiculo(
  version: BibleVersion,
  verse: SelectedVerse,
): string {
  return [
    version,
    verse.book,
    verse.chapter,
    verse.verse,
  ].join('_')
}

/* ============================================================
   COMPONENTE
============================================================ */

export default function Leitura() {
  const navigate =
    useNavigate()

  const [
    searchParams,
  ] = useSearchParams()

  const livroParam =
    searchParams.get(
      'livro',
    ) ?? ''

  const capituloParam =
    Number(
      searchParams.get(
        'capitulo',
      ) ??
        searchParams.get(
          'chapter',
        ) ??
        1,
    )

  const versiculoParam =
    Number(
      searchParams.get(
        'versiculo',
      ) ??
        searchParams.get(
          'verse',
        ) ??
        0,
    )

  const versaoParam =
    searchParams.get(
      'versao',
    ) ??
    searchParams.get(
      'version',
    ) ??
    'ACF'

  const version: BibleVersion =
    versaoParam === 'TB'
      ? 'TB'
      : 'ACF'

  /* ==========================================================
     ESTADOS
  ========================================================== */

  const [
    bible,
    setBible,
  ] = useState<BibleData | null>(
    null,
  )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState(false)

  const [
    capitulo,
    setCapitulo,
  ] = useState(
    capituloParam > 0
      ? capituloParam
      : 1,
  )

  const [
    tamanhoFonte,
    setTamanhoFonte,
  ] = useState(
    obterFonteSalva,
  )

  const [
    aba,
    setAba,
  ] = useState<
    'biblia' | 'anotacoes'
  >('biblia')

  const [
    selectedVerse,
    setSelectedVerse,
  ] =
    useState<SelectedVerse | null>(
      null,
    )

  const [
    showVerseSheet,
    setShowVerseSheet,
  ] = useState(false)

  const [
    showFontSheet,
    setShowFontSheet,
  ] = useState(false)

  const [
    showVersionSheet,
    setShowVersionSheet,
  ] = useState(false)

  const [
    showHighlightColors,
    setShowHighlightColors,
  ] = useState(false)

  const [
    showShareOptions,
    setShowShareOptions,
  ] = useState(false)

  const [
    highlights,
    setHighlights,
  ] = useState<Highlights>(
    () =>
      lerLocalStorage(
        'comcristo_biblia_highlights',
        {},
      ),
  )

  /*
   * CORREÇÃO:
   *
   * Lê favoritos antigos e tenta recuperar
   * a cor através dos destaques existentes.
   *
   * Assim não quebramos os dados que o usuário
   * já possui no navegador.
   */
  const [
    favorites,
    setFavorites,
  ] = useState<BibleFavorite[]>(
    () => {
      const antigos =
        lerLocalStorage<
          Array<
            BibleFavorite & {
              color?: HighlightColor
            }
          >
        >(
          'comcristo_biblia_favorites',
          [],
        )

      const destaques =
        lerLocalStorage<Highlights>(
          'comcristo_biblia_highlights',
          {},
        )

      return antigos
        .map((item) => {
          /*
           * Favoritos novos já possuem color.
           *
           * Favoritos antigos não possuem.
           * Nesse caso tentamos encontrar a
           * mesma chave nos destaques.
           */
          const color =
            item.color ??
            destaques[item.id]

          if (!color) {
            return null
          }

          return {
            ...item,
            color,
          } as BibleFavorite
        })
        .filter(
          (
            item,
          ): item is BibleFavorite =>
            item !== null,
        )
    },
  )

  const [
    notes,
    setNotes,
  ] = useState<BibleNote[]>(
    () =>
      lerLocalStorage(
        'comcristo_biblia_notes',
        [],
      ),
  )

  const [
    editingNoteId,
    setEditingNoteId,
  ] = useState<
    string | null
  >(null)

  const [
    noteText,
    setNoteText,
  ] = useState('')

  const [
    noteTarget,
    setNoteTarget,
  ] = useState<NoteTarget | null>(
    null,
  )

  const [
    showSearch,
    setShowSearch,
  ] = useState(false)

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const verseRefs =
    useRef<
      Record<
        number,
        HTMLDivElement | null
      >
    >({})

  /* ==========================================================
     CARREGAR BÍBLIA
  ========================================================== */

  useEffect(() => {
    let cancelado = false

    async function carregarBiblia() {
      setLoading(true)
      setError(false)

      try {
        const resposta =
          await fetch(
            VERSION_FILES[
              version
            ],
          )

        if (!resposta.ok) {
          throw new Error(
            'Erro ao carregar Bíblia',
          )
        }

        const dados =
          (await resposta.json()) as BibleData

        if (cancelado) {
          return
        }

        setBible(dados)

        const livro =
          obterLivro(
            dados,
            livroParam,
          )

        if (!livro) {
          return
        }

        const capitulos =
          obterCapitulos(
            livro,
          )

        if (
          capitulos.includes(
            capituloParam,
          )
        ) {
          setCapitulo(
            capituloParam,
          )
        } else if (
          capitulos.length >
          0
        ) {
          setCapitulo(
            capitulos[0],
          )
        }
      } catch (erro) {
        console.error(
          'Erro ao carregar Bíblia:',
          erro,
        )

        if (!cancelado) {
          setBible(null)
          setError(true)
        }
      } finally {
        if (!cancelado) {
          setLoading(false)
        }
      }
    }

    carregarBiblia()

    return () => {
      cancelado = true
    }
  }, [
    version,
    livroParam,
    capituloParam,
  ])

  /* ==========================================================
     ATUALIZAR TAMANHO DA FONTE
  ========================================================== */

  useEffect(() => {
    function atualizarFonte(
      event: Event,
    ) {
      const evento =
        event as CustomEvent<{
          tamanho?: number
        }>

      const novo =
        Number(
          evento.detail?.tamanho,
        )

      if (
        Number.isFinite(novo) &&
        novo >= FONTE_MINIMA &&
        novo <= FONTE_MAXIMA
      ) {
        setTamanhoFonte(
          novo,
        )
      }
    }

    window.addEventListener(
      'comcristo:fonte-biblia',
      atualizarFonte,
    )

    return () => {
      window.removeEventListener(
        'comcristo:fonte-biblia',
        atualizarFonte,
      )
    }
  }, [])

  /* ==========================================================
     SALVAR DESTAQUES
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        'comcristo_biblia_highlights',
        JSON.stringify(
          highlights,
        ),
      )
    } catch {
      // ignora
    }
  }, [highlights])

  /* ==========================================================
     SALVAR FAVORITOS
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        'comcristo_biblia_favorites',
        JSON.stringify(
          favorites,
        ),
      )

      window.dispatchEvent(
        new Event(
          'comcristo:favoritos-atualizados',
        ),
      )
    } catch {
      // ignora
    }
  }, [favorites])

  /* ==========================================================
     SALVAR NOTAS
  ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        'comcristo_biblia_notes',
        JSON.stringify(
          notes,
        ),
      )
    } catch {
      // ignora
    }
  }, [notes])

  /* ==========================================================
     LIVRO ATUAL
  ========================================================== */

  const livroAtual =
    useMemo(() => {
      if (!bible) {
        return undefined
      }

      return obterLivro(
        bible,
        livroParam,
      )
    }, [
      bible,
      livroParam,
    ])

  const capitulosDisponiveis =
    useMemo(
      () =>
        obterCapitulos(
          livroAtual,
        ),
      [livroAtual],
    )

  const totalCapitulos =
    capitulosDisponiveis.length

  const versiculos =
    livroAtual?.capitulos[
      String(capitulo)
    ] ?? []

  /* ==========================================================
     NOTAS DO CAPÍTULO
  ========================================================== */

  const notasDoCapitulo =
    useMemo(
      () =>
        notes.filter(
          (note) =>
            normalizarBusca(
              note.book,
            ) ===
              normalizarBusca(
                livroParam,
              ) &&
            note.chapter ===
              capitulo,
        ),
      [
        notes,
        livroParam,
        capitulo,
      ],
    )

  /* ==========================================================
     BUSCA
  ========================================================== */

  const searchResults =
    useMemo(() => {
      const termo =
        normalizarBusca(
          searchQuery,
        )

      if (
        !termo ||
        !livroAtual
      ) {
        return []
      }

      return Object.entries(
        livroAtual.capitulos,
      ).flatMap(
        ([
          numeroCapitulo,
          textos,
        ]) =>
          textos.flatMap(
            (
              texto,
              index,
            ) =>
              normalizarBusca(
                texto,
              ).includes(
                termo,
              )
                ? [
                    {
                      book:
                        livroAtual.nome,
                      chapter:
                        Number(
                          numeroCapitulo,
                        ),
                      verse:
                        index + 1,
                      text:
                        texto,
                    },
                  ]
                : [],
          ),
      )
    }, [
      livroAtual,
      searchQuery,
    ])

  /* ==========================================================
     VERSÍCULO INICIAL
  ========================================================== */

  useEffect(() => {
    if (
      loading ||
      !versiculoParam ||
      versiculoParam <= 0 ||
      versiculos.length === 0
    ) {
      return
    }

    const timer =
      window.setTimeout(
        () => {
          const elemento =
            verseRefs.current[
              versiculoParam
            ]

          elemento?.scrollIntoView(
            {
              behavior:
                'smooth',
              block:
                'center',
            },
          )
        },
        250,
      )

    return () =>
      window.clearTimeout(
        timer,
      )
  }, [
    loading,
    versiculoParam,
    versiculos,
  ])

  /* ==========================================================
     FECHAR BOTTOM SHEET
  ========================================================== */

  function fecharVerseSheet() {
    setShowVerseSheet(
      false,
    )

    setShowHighlightColors(
      false,
    )

    setShowShareOptions(
      false,
    )

    setSelectedVerse(
      null,
    )
  }

  function fecharTudo() {
    fecharVerseSheet()

    setShowFontSheet(
      false,
    )

    setShowVersionSheet(
      false,
    )
  }

  /* ==========================================================
     VOLTAR
  ========================================================== */

  function voltar() {
    navigate(
      `/biblia/capitulos?livro=${encodeURIComponent(
        livroParam,
      )}&totalCapitulos=${totalCapitulos}&versao=${version}`,
    )
  }


  /* ==========================================================
     SELECIONAR VERSÍCULO
  ========================================================== */

  function selecionarVersiculo(
    numero: number,
    texto: string,
  ) {
    setSelectedVerse({
      book:
        livroAtual?.nome ??
        livroParam,
      chapter: capitulo,
      verse: numero,
      text: texto,
    })

    setShowHighlightColors(
      false,
    )

    setShowShareOptions(
      false,
    )

    setShowVerseSheet(
      true,
    )
  }
    /* ==========================================================
     FAVORITOS / MARCAÇÃO
     
     No Android, o versículo marcado com uma cor
     aparece automaticamente em "Versículos Favoritos".

     Portanto NÃO existe mais uma ação separada de
     "Favoritar" por estrela.
  ========================================================== */

  function getFavoriteId(
    verse: SelectedVerse,
  ): string {
    return [
      version,
      verse.book,
      verse.chapter,
      verse.verse,
    ].join('_')
  }

  function getFavorite(
    verse: SelectedVerse | null,
  ): BibleFavorite | undefined {
    if (!verse) {
      return undefined
    }

    const id =
      getFavoriteId(verse)

    return favorites.find(
      (favorite) =>
        favorite.id === id,
    )
  }

  function isFavorite(
    verse: SelectedVerse | null,
  ): boolean {
    return Boolean(
      getFavorite(verse),
    )
  }

  /* ==========================================================
     COR DO VERSÍCULO
  ========================================================== */

  function obterCorDoVersiculo(
    verse: SelectedVerse | null,
  ): HighlightColor | null {
    if (!verse) {
      return null
    }

    const favorito =
      getFavorite(verse)

    if (favorito?.color) {
      return favorito.color
    }

    const chave =
      obterChaveVersiculo(
        version,
        verse,
      )

    return (
      highlights[chave] ??
      null
    )
  }


  /* ==========================================================
     MARCAR VERSÍCULO
     
     CORREÇÃO PRINCIPAL:
     
     Escolher uma cor:
       1. salva o destaque visual;
       2. salva o versículo nos favoritos;
       3. salva a cor dentro do favorito.
     
     Isso deixa o comportamento igual ao Android.
  ========================================================== */

  function destacarVersiculo(
    color: HighlightColor,
  ) {
    if (!selectedVerse) {
      return
    }

    const id =
      getFavoriteId(
        selectedVerse,
      )

    const key =
      obterChaveVersiculo(
        version,
        selectedVerse,
      )

    const favoritoExistente =
      getFavorite(
        selectedVerse,
      )

    const favorito: BibleFavorite =
      {
        id,
        version,
        book:
          selectedVerse.book,
        chapter:
          selectedVerse.chapter,
        verse:
          selectedVerse.verse,
        text:
          selectedVerse.text,
        color,
        createdAt:
          favoritoExistente?.createdAt ??
          Date.now(),
      }

    /*
     * Adiciona ou atualiza o favorito.
     */
    setFavorites(
      (previous) => {
        const existe =
          previous.some(
            (item) =>
              item.id === id,
          )

        if (existe) {
          return previous.map(
            (item) =>
              item.id === id
                ? favorito
                : item,
          )
        }

        return [
          favorito,
          ...previous,
        ]
      },
    )

    /*
     * Mantém o destaque visual.
     */
    setHighlights(
      (previous) => ({
        ...previous,
        [key]: color,
      }),
    )

    /*
     * Atualiza as telas que escutam
     * as alterações dos favoritos/destaques.
     */
    window.dispatchEvent(
      new Event(
        'comcristo:favoritos-atualizados',
      ),
    )

    window.dispatchEvent(
      new Event(
        'comcristo:destaques-atualizados',
      ),
    )

    fecharVerseSheet()
  }

  /* ==========================================================
     REMOVER MARCAÇÃO
     
     CORREÇÃO:
     Remove tanto:
       - o destaque;
       - o favorito.
     
     Assim o versículo desaparece de Favoritos.
  ========================================================== */

  function removerDestaque() {
    if (!selectedVerse) {
      return
    }

    const id =
      getFavoriteId(
        selectedVerse,
      )

    const key =
      obterChaveVersiculo(
        version,
        selectedVerse,
      )

    /*
     * Remove dos favoritos.
     */
    setFavorites(
      (previous) =>
        previous.filter(
          (favorite) =>
            favorite.id !== id,
        ),
    )

    /*
     * Remove o destaque visual.
     */
    setHighlights(
      (previous) => {
        const novo = {
          ...previous,
        }

        delete novo[key]

        return novo
      },
    )

    window.dispatchEvent(
      new Event(
        'comcristo:favoritos-atualizados',
      ),
    )

    window.dispatchEvent(
      new Event(
        'comcristo:destaques-atualizados',
      ),
    )

    fecharVerseSheet()
  }

  /* ==========================================================
     TEXTO DO VERSÍCULO
  ========================================================== */

  function textoDoVersiculo(): string {
    if (!selectedVerse) {
      return ''
    }

    return `"${selectedVerse.text}" — ${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}`
  }

  /* ==========================================================
     COPIAR VERSÍCULO
  ========================================================== */

  async function copiarVersiculo() {
    if (!selectedVerse) {
      return
    }

    const texto =
      textoDoVersiculo()

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          texto,
        )

        fecharVerseSheet()
        return
      }
    } catch {
      // continua para fallback
    }

    try {
      const textarea =
        document.createElement(
          'textarea',
        )

      textarea.value = texto

      textarea.style.position =
        'fixed'

      textarea.style.left =
        '-9999px'

      textarea.style.top = '0'

      textarea.style.opacity =
        '0'

      document.body.appendChild(
        textarea,
      )

      textarea.focus()
      textarea.select()

      const sucesso =
        document.execCommand(
          'copy',
        )

      textarea.remove()

      if (sucesso) {
        fecharVerseSheet()
      }
    } catch (erro) {
      console.error(
        'Erro ao copiar:',
        erro,
      )
    }
  }

  /* ==========================================================
     COMPARTILHAR VERSÍCULO
  ========================================================== */

  async function compartilharVersiculo() {
    if (!selectedVerse) {
      return
    }

    const texto =
      textoDoVersiculo()

    try {
      if (
        navigator.share &&
        typeof navigator.share ===
          'function'
      ) {
        await navigator.share({
          title:
            'Versículo — Com Cristo',
          text: texto,
        })

        fecharVerseSheet()
        return
      }
    } catch (erro) {
      if (
        erro instanceof
          DOMException &&
        erro.name ===
          'AbortError'
      ) {
        return
      }
    }

    /*
     * Navegadores que não suportam
     * navigator.share recebem as
     * opções alternativas.
     */
    setShowShareOptions(
      true,
    )
  }

  /* ==========================================================
     WHATSAPP
  ========================================================== */

  function compartilharWhatsApp() {
    if (!selectedVerse) {
      return
    }

    const texto =
      encodeURIComponent(
        textoDoVersiculo(),
      )

    window.open(
      `https://wa.me/?text=${texto}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  /* ==========================================================
     NOTAS
  ========================================================== */

  function novaNota() {
    setEditingNoteId('new')

    setNoteText('')

    setNoteTarget({
      version,
      book:
        livroAtual?.nome ??
        livroParam,
      chapter: capitulo,
    })
  }

  function adicionarNotaDoVersiculo() {
    if (!selectedVerse) {
      return
    }

    setNoteTarget({
      version,
      book:
        selectedVerse.book,
      chapter:
        selectedVerse.chapter,
      verse:
        selectedVerse.verse,
      verseText:
        selectedVerse.text,
    })

    setEditingNoteId(
      'new',
    )

    setNoteText('')

    fecharVerseSheet()

    setAba(
      'anotacoes',
    )
  }

  function editarNota(
    nota: BibleNote,
  ) {
    setEditingNoteId(
      nota.id,
    )

    setNoteText(
      nota.text,
    )

    setNoteTarget({
      version:
        nota.version ??
        version,
      book:
        nota.book,
      chapter:
        nota.chapter,
      verse:
        nota.verse,
    })
  }

  function cancelarEdicaoNota() {
    setEditingNoteId(null)
    setNoteText('')
    setNoteTarget(null)
  }

  function salvarNota() {
    const texto =
      noteText.trim()

    if (!texto) {
      return
    }

    const agora =
      Date.now()

    if (
      editingNoteId ===
      'new'
    ) {
      const alvo =
        noteTarget ?? {
          version,
          book:
            livroAtual?.nome ??
            livroParam,
          chapter: capitulo,
        }

      const novaNota: BibleNote =
        {
          id:
            `${agora}-${Math.random()
              .toString(36)
              .slice(2)}`,
          text: texto,
          version:
            alvo.version,
          book:
            alvo.book,
          chapter:
            alvo.chapter,
          ...(alvo.verse
            ? {
                verse:
                  alvo.verse,
              }
            : {}),
          createdAt:
            agora,
          updatedAt:
            agora,
        }

      setNotes(
        (previous) => [
          novaNota,
          ...previous,
        ],
      )
    } else if (
      editingNoteId
    ) {
      setNotes(
        (previous) =>
          previous.map(
            (nota) =>
              nota.id ===
              editingNoteId
                ? {
                    ...nota,
                    text: texto,
                    updatedAt:
                      agora,
                  }
                : nota,
          ),
      )
    }

    cancelarEdicaoNota()
  }

  function excluirNota(
    id: string,
  ) {
    const confirmar =
      window.confirm(
        'Deseja excluir esta nota?',
      )

    if (!confirmar) {
      return
    }

    setNotes(
      (previous) =>
        previous.filter(
          (nota) =>
            nota.id !== id,
        ),
    )
  }

  /* ==========================================================
     TAMANHO DA FONTE
  ========================================================== */

  function alterarFonte(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const valor =
      Number(
        event.target.value,
      )

    const novoValor =
      Math.min(
        FONTE_MAXIMA,
        Math.max(
          FONTE_MINIMA,
          valor,
        ),
      )

    setTamanhoFonte(
      novoValor,
    )

    try {
      localStorage.setItem(
        'comcristo_tamanho_fonte',
        String(
          novoValor,
        ),
      )
    } catch {
      // ignora
    }

    window.dispatchEvent(
      new CustomEvent(
        'comcristo:fonte-biblia',
        {
          detail: {
            tamanho:
              novoValor,
          },
        },
      ),
    )
  }

  /* ==========================================================
     TROCAR VERSÃO
  ========================================================== */

  function selecionarVersao(
    novaVersao: BibleVersion,
  ) {
    fecharTudo()

    navigate(
      `/biblia/leitura?livro=${encodeURIComponent(
        livroParam,
      )}&capitulo=${capitulo}&versao=${novaVersao}`,
      {
        replace: true,
      },
    )
  }

  /* ==========================================================
     PESQUISA
  ========================================================== */

  function abrirBusca() {
    fecharTudo()

    setSearchQuery('')

    setShowSearch(true)
  }

  function fecharBusca() {
    setShowSearch(false)

    setSearchQuery('')
  }

  function abrirResultadoBusca(
    result: {
      book: string
      chapter: number
      verse: number
      text: string
    },
  ) {
    /*
     * Atualiza também a URL.
     *
     * Isso é importante para que o resultado
     * possa ser aberto diretamente em:
     *
     * /biblia/leitura?livro=...&capitulo=...&versiculo=...
     */
    navigate(
      `/biblia/leitura?livro=${encodeURIComponent(
        result.book,
      )}&capitulo=${result.chapter}&versiculo=${result.verse}&versao=${version}`,
      {
        replace: true,
      },
    )

    setCapitulo(
      result.chapter,
    )

    setShowSearch(false)

    setSearchQuery('')

    setTimeout(() => {
      const elemento =
        verseRefs.current[
          result.verse
        ]

      elemento?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

      selecionarVersiculo(
        result.verse,
        result.text,
      )
    }, 300)
  }

  /* ==========================================================
     VOLTAR AO TOPO
  ========================================================== */

  function voltarAoTopo() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /* ==========================================================
     ESTADOS DERIVADOS
  ========================================================== */

  const corSelecionada =
    obterCorDoVersiculo(
      selectedVerse,
    )

  const notaDoVersiculo =
    selectedVerse
      ? notes.find(
          (nota) =>
            (nota.version ??
              version) ===
              version &&
            normalizarBusca(
              nota.book,
            ) ===
              normalizarBusca(
                selectedVerse.book,
              ) &&
            nota.chapter ===
              selectedVerse.chapter &&
            nota.verse ===
              selectedVerse.verse,
        )
      : undefined

  const versiculoTemNota =
  Boolean(notaDoVersiculo)

  /* ==========================================================
     ABRIR VERSÍCULO PELO URL
  ========================================================== */

  useEffect(() => {
    if (
      versiculoParam <= 0 ||
      versiculoParam >
        versiculos.length
    ) {
      return
    }

    const elemento =
      verseRefs.current[
        versiculoParam
      ]

    if (!elemento) {
      return
    }

    const timer =
      window.setTimeout(() => {
        elemento.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 300)

    return () =>
      window.clearTimeout(
        timer,
      )
  }, [
    versiculoParam,
    capitulo,
    versiculos.length,
  ])
  
/* ==========================================================
   CARREGAMENTO
========================================================== */

  if (loading) {
    return (
      <main className="leitura-page">
        <div className="leitura-loading">
          <div className="leitura-loading-spinner" />

          <p>
            Carregando Bíblia...
          </p>
        </div>
      </main>
    )
  }

  if (
    error ||
    !bible ||
    !livroAtual
  ) {
    return (
      <main className="leitura-page">
        <div className="leitura-error">
          <h2>
            Não foi possível
            carregar a Bíblia.
          </h2>

          <p>
            Verifique se o livro
            e a versão selecionada
            estão disponíveis.
          </p>

          <button
            type="button"
            onClick={voltar}
            className="leitura-error-button"
          >
            VOLTAR
          </button>
        </div>
      </main>
    )
  }

  /* ==========================================================
     NAVEGAÇÃO
  ========================================================== */

  const podeIrAnterior =
    capitulo > 1

  const podeIrProximo =
    capitulo <
    totalCapitulos

  function irParaCapitulo(
    novoCapitulo: number,
  ) {
    if (
      novoCapitulo < 1 ||
      novoCapitulo >
        totalCapitulos
    ) {
      return
    }

    setCapitulo(
      novoCapitulo,
    )

    setAba('biblia')

    navigate(
      `/biblia/leitura?livro=${encodeURIComponent(
        livroParam,
      )}&capitulo=${novoCapitulo}&versao=${version}`,
      {
        replace: true,
      },
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="leitura-page">
      {/* ======================================================
          CABEÇALHO
      ====================================================== */}

      <header className="leitura-header">
        <button
          type="button"
          className="leitura-header-back"
          onClick={voltar}
          aria-label="Voltar"
        >
          <ArrowLeft
            size={24}
          />
        </button>

        <div className="leitura-header-titulo">
          <h1>
            {livroAtual.nome}
            {' • '}
            {capitulo}
          </h1>

          <span>
            Leitura Bíblica
          </span>
        </div>

        <button
          type="button"
          className="leitura-header-search"
          onClick={
            abrirBusca
          }
          aria-label="Pesquisar"
        >
          <MessageCircle
            size={22}
          />
        </button>
      </header>

      {/* ======================================================
          CARDS DE CONFIGURAÇÃO
      ====================================================== */}

      <section className="leitura-configuracoes">
        <button
          type="button"
          className="leitura-config-card"
          onClick={() =>
            setShowVersionSheet(
              true,
            )
          }
        >
          <div className="leitura-config-info">
            <span>
              Versão
            </span>

            <strong>
              {version}
            </strong>
          </div>

          <ChevronRight
            size={20}
          />
        </button>

        <button
          type="button"
          className="leitura-config-card"
          onClick={() =>
            setShowFontSheet(
              true,
            )
          }
        >
          <div className="leitura-config-info">
            <span>
              Tamanho da fonte
            </span>

            <strong>
              {tamanhoFonte}px
            </strong>
          </div>

          <ChevronRight
            size={20}
          />
        </button>
      </section>

      {/* ======================================================
          ABAS
      ====================================================== */}

      <div className="leitura-abas">
        <button
          type="button"
          className={
            aba === 'biblia'
              ? 'leitura-aba ativa'
              : 'leitura-aba'
          }
          onClick={() =>
            setAba(
              'biblia',
            )
          }
        >
          Bíblia
        </button>

        <button
          type="button"
          className={
            aba === 'anotacoes'
              ? 'leitura-aba ativa'
              : 'leitura-aba'
          }
          onClick={() =>
            setAba(
              'anotacoes',
            )
          }
        >
          Anotações
        </button>
      </div>

      {/* ======================================================
          ÁREA DE BUSCA
      ====================================================== */}

      {showSearch && (
        <section className="leitura-busca">
          <div className="leitura-busca-topo">
            <div>
              <h2>
                Buscar na Bíblia
              </h2>

              <span>
                Digite uma palavra
                ou frase
              </span>
            </div>

            <button
              type="button"
              onClick={
                fecharBusca
              }
              aria-label="Fechar busca"
            >
              <X
                size={21}
              />
            </button>
          </div>

          <div className="leitura-busca-input">
            <input
              type="search"
              value={
                searchQuery
              }
              onChange={(
                event,
              ) =>
                setSearchQuery(
                  event.target
                    .value,
                )
              }
              placeholder="Buscar..."
              autoFocus
            />
          </div>

          {searchQuery.trim() && (
            <div className="leitura-resultados-busca">
              {searchResults.length >
              0 ? (
                searchResults
                  .slice(
                    0,
                    50,
                  )
                  .map(
                    (
                      resultado,
                    ) => (
                      <button
                        key={`${resultado.chapter}-${resultado.verse}`}
                        type="button"
                        className="leitura-resultado-busca"
                        onClick={() =>
                          abrirResultadoBusca(
                            resultado,
                          )
                        }
                      >
                        <strong>
                          {
                            resultado.book
                          }{' '}
                          {
                            resultado.chapter
                          }
                          :
                          {
                            resultado.verse
                          }
                        </strong>

                        <p>
                          {
                            resultado.text
                          }
                        </p>
                      </button>
                    ),
                  )
              ) : (
                <div className="leitura-busca-vazia">
                  Nenhum resultado
                  encontrado.
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          ABA BÍBLIA
      ====================================================== */}

      {aba === 'biblia' && (
        <section className="leitura-conteudo">
          <div className="leitura-versiculos">
            {versiculos.map(
              (
                texto,
                index,
              ) => {
                const numero =
                  index + 1

                const chave =
                  obterChaveVersiculo(
                    version,
                    {
                      book:
                        livroAtual.nome,
                      chapter:
                        capitulo,
                      verse:
                        numero,
                      text:
                        texto,
                    },
                  )

                /*
                 * A cor visual vem dos destaques.
                 *
                 * Como a marcação agora sempre salva
                 * favorito + destaque, os dois ficam
                 * sincronizados.
                 */
                const cor =
                  highlights[
                    chave
                  ]

                const favorito =
                  favorites.find(
                    (item) =>
                      item.id ===
                      [
                        version,
                        livroAtual.nome,
                        capitulo,
                        numero,
                      ].join('_'),
                  )

                const corFinal =
                  favorito?.color ??
                  cor

                const marcado =
                  Boolean(
                    corFinal,
                  )

                return (
                  <div
                    key={`${livroAtual.nome}-${capitulo}-${numero}`}
                    ref={(element) => {
                      verseRefs.current[
                        numero
                      ] =
                        element
                    }}
                    className={[
                      'leitura-versiculo',
                      marcado
                        ? 'marcado'
                        : '',
                      corFinal
                        ? `leitura-versiculo-${corFinal}`
                        : '',
                    ]
                      .filter(
                        Boolean,
                      )
                      .join(' ')}
                  >
                    {/* ========================================
                        NÚMERO DO VERSÍCULO
                    ======================================== */}

                    <button
                      type="button"
                      className="leitura-versiculo-numero"
                      onClick={() =>
                        selecionarVersiculo(
                          numero,
                          texto,
                        )
                      }
                      aria-label={`Versículo ${numero}`}
                    >
                      {numero}
                    </button>

                    {/* ========================================
                        TEXTO DO VERSÍCULO
                    ======================================== */}

                    <button
                      type="button"
                      className="leitura-versiculo-texto"
                      onClick={() =>
                        selecionarVersiculo(
                          numero,
                          texto,
                        )
                      }
                      style={{
                        fontSize:
                          `${
                            tamanhoFonte +
                            1
                          }px`,
                        lineHeight:
                          1.25,
                      }}
                    >
                      {texto}
                    </button>

                    {/* ========================================
                        INDICADOR DE NOTA
                    ======================================== */}

                    {notes.some(
                      (nota) =>
                        (nota.version ??
                          version) ===
                          version &&
                        normalizarBusca(
                          nota.book,
                        ) ===
                          normalizarBusca(
                            livroAtual.nome,
                          ) &&
                        nota.chapter ===
                          capitulo &&
                        nota.verse ===
                          numero,
                    ) && (
                      <span
                        className="leitura-indicador-nota"
                        aria-label="Possui anotação"
                      >
                        <StickyNote
                          size={14}
                        />
                      </span>
                    )}
                  </div>
                )
              },
            )}
          </div>

          {/* ==================================================
              NAVEGAÇÃO ENTRE CAPÍTULOS
          ================================================== */}

          <div className="leitura-navegacao-capitulos">
            <button
              type="button"
              disabled={
                !podeIrAnterior
              }
              onClick={() =>
                irParaCapitulo(
                  capitulo -
                    1,
                )
              }
            >
              <ChevronLeft
                size={20}
              />

              <span>
                Anterior
              </span>
            </button>

            <div className="leitura-capitulo-atual">
              <strong>
                {capitulo}
              </strong>

              <span>
                de{' '}
                {
                  totalCapitulos
                }
              </span>
            </div>

            <button
              type="button"
              disabled={
                !podeIrProximo
              }
              onClick={() =>
                irParaCapitulo(
                  capitulo +
                    1,
                )
              }
            >
              <span>
                Próximo
              </span>

              <ChevronRight
                size={20}
              />
            </button>
          </div>
        </section>
      )}

      {/* ======================================================
          ABA ANOTAÇÕES
      ====================================================== */}

      {aba ===
        'anotacoes' && (
        <section className="leitura-anotacoes">
          <div className="leitura-anotacoes-topo">
            <div>
              <h2>
                Minhas anotações
              </h2>

              <p>
                Anotações feitas
                neste capítulo.
              </p>
            </div>

            <button
              type="button"
              onClick={
                novaNota
              }
              aria-label="Nova anotação"
            >
              <Plus
                size={21}
              />
            </button>
          </div>

          {notasDoCapitulo.length ===
          0 ? (
            <div className="leitura-anotacoes-vazio">
              <StickyNote
                size={42}
              />

              <h3>
                Nenhuma anotação
              </h3>

              <p>
                Você ainda não
                possui anotações
                neste capítulo.
              </p>

              <button
                type="button"
                onClick={
                  novaNota
                }
              >
                ADICIONAR ANOTAÇÃO
              </button>
            </div>
          ) : (
            <div className="leitura-anotacoes-lista">
              {notasDoCapitulo.map(
                (nota) => (
                  <article
                    key={
                      nota.id
                    }
                    className="leitura-nota-card"
                  >
                    <div className="leitura-nota-card-topo">
                      <div>
                        <strong>
                          {nota.book}{' '}
                          {
                            nota.chapter
                          }
                          {nota.verse
                            ? `:${nota.verse}`
                            : ''}
                        </strong>

                        {nota.version && (
                          <span>
                            {
                              nota.version
                            }
                          </span>
                        )}
                      </div>

                      <div className="leitura-nota-acoes">
                        <button
                          type="button"
                          onClick={() =>
                            editarNota(
                              nota,
                            )
                          }
                          aria-label="Editar nota"
                        >
                          <Pencil
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            excluirNota(
                              nota.id,
                            )
                          }
                          aria-label="Excluir nota"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="leitura-nota-texto">
                      {
                        nota.text
                      }
                    </p>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================================
          BOTTOM SHEET DO VERSÍCULO
      ====================================================== */}

      {showVerseSheet &&
        selectedVerse && (
          <div
            className="leitura-overlay"
            onClick={
              fecharVerseSheet
            }
          >
            <div
              className="leitura-bottom-sheet"
              onClick={(
                event,
              ) =>
                event.stopPropagation()
              }
            >
              <div className="leitura-sheet-handle" />

              <div className="leitura-sheet-header">
                <div>
                  <span>
                    {
                      selectedVerse.book
                    }{' '}
                    {
                      selectedVerse.chapter
                    }
                    :
                    {
                      selectedVerse.verse
                    }
                  </span>

                  <h2>
                    Marcar versículo
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    fecharVerseSheet
                  }
                  aria-label="Fechar"
                >
                  <X
                    size={21}
                  />
                </button>
              </div>

              {/* ============================================
                  TEXTO
              ============================================ */}

              <div className="leitura-sheet-versiculo">
                <div className="leitura-sheet-numero">
                  {
                    selectedVerse.verse
                  }
                </div>

                <p>
                  {
                    selectedVerse.text
                  }
                </p>
              </div>

              {/* ============================================
                  ESTADO DA MARCAÇÃO
              ============================================ */}

              {corSelecionada && (
                <div className="leitura-sheet-marcacao">
                  <span
                    className={`leitura-cor-indicador ${corSelecionada}`}
                  />

                  <span>
                    Versículo marcado
                  </span>
                </div>
              )}

              {/* ============================================
                  AÇÕES PRINCIPAIS
              ============================================ */}

              <div className="leitura-sheet-acoes">
                <button
                  type="button"
                  onClick={
                    copiarVersiculo
                  }
                >
                  <Copy
                    size={20}
                  />

                  <span>
                    Copiar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    compartilharVersiculo
                  }
                >
                  <Share2
                    size={20}
                  />

                  <span>
                    Compartilhar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    adicionarNotaDoVersiculo
                  }
                >
                  <StickyNote
                    size={20}
                  />

                  <span>
                    {versiculoTemNota
                      ? 'Editar nota'
                      : 'Adicionar nota'}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    showHighlightColors
                      ? 'ativo'
                      : ''
                  }
                  onClick={() =>
                    setShowHighlightColors(
                      (
                        anterior,
                      ) =>
                        !anterior,
                    )
                  }
                >
                  <Highlighter
                    size={20}
                  />

                  <span>
                    {isFavorite(
                      selectedVerse,
                    )
                      ? 'Alterar marcação'
                      : 'Marcar versículo'}
                  </span>
                </button>

                {isFavorite(
                  selectedVerse,
                ) && (
                  <button
                    type="button"
                    className="leitura-acao-remover"
                    onClick={
                      removerDestaque
                    }
                  >
                    <Trash2
                      size={20}
                    />

                    <span>
                      Remover marcação
                    </span>
                  </button>
                )}
              </div>

              {/* ============================================
                  CORES
              ============================================ */}

              {showHighlightColors && (
                <div className="leitura-escolha-cor">
                  <span>
                    Escolha uma cor
                  </span>

                  <div className="leitura-cores">
                    <button
                      type="button"
                      className={
                        corSelecionada ===
                        'yellow'
                          ? 'selecionada'
                          : ''
                      }
                      onClick={() =>
                        destacarVersiculo(
                          'yellow',
                        )
                      }
                      aria-label="Amarelo"
                    >
                      <span className="leitura-cor yellow" />
                    </button>

                    <button
                      type="button"
                      className={
                        corSelecionada ===
                        'green'
                          ? 'selecionada'
                          : ''
                      }
                      onClick={() =>
                        destacarVersiculo(
                          'green',
                        )
                      }
                      aria-label="Verde"
                    >
                      <span className="leitura-cor green" />
                    </button>

                    <button
                      type="button"
                      className={
                        corSelecionada ===
                        'blue'
                          ? 'selecionada'
                          : ''
                      }
                      onClick={() =>
                        destacarVersiculo(
                          'blue',
                        )
                      }
                      aria-label="Azul"
                    >
                      <span className="leitura-cor blue" />
                    </button>

                    <button
                      type="button"
                      className={
                        corSelecionada ===
                        'cyan'
                          ? 'selecionada'
                          : ''
                      }
                      onClick={() =>
                        destacarVersiculo(
                          'cyan',
                        )
                      }
                      aria-label="Ciano"
                    >
                      <span className="leitura-cor cyan" />
                    </button>

                    <button
                      type="button"
                      className={
                        corSelecionada ===
                        'pink'
                          ? 'selecionada'
                          : ''
                      }
                      onClick={() =>
                        destacarVersiculo(
                          'pink',
                        )
                      }
                      aria-label="Rosa"
                    >
                      <span className="leitura-cor pink" />
                    </button>

                    <button
                      type="button"
                      className={
                        corSelecionada ===
                        'purple'
                          ? 'selecionada'
                          : ''
                      }
                      onClick={() =>
                        destacarVersiculo(
                          'purple',
                        )
                      }
                      aria-label="Roxo"
                    >
                      <span className="leitura-cor purple" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================
                  OPÇÕES DE COMPARTILHAMENTO
              ============================================ */}

              {showShareOptions && (
                <div className="leitura-compartilhar-opcoes">
                  <button
                    type="button"
                    onClick={
                      compartilharWhatsApp
                    }
                  >
                    <MessageCircle
                      size={18}
                    />

                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await copiarVersiculo()
                    }}
                  >
                    <Copy
                      size={18}
                    />

                    Copiar texto
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
              {/* ======================================================
          BOTTOM SHEET — TAMANHO DA FONTE
      ====================================================== */}

      {showFontSheet && (
        <div
          className="leitura-overlay"
          onClick={() =>
            setShowFontSheet(false)
          }
        >
          <div
            className="leitura-bottom-sheet leitura-font-sheet"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="leitura-sheet-handle" />

            <div className="leitura-sheet-header">
              <div>
                <span>
                  Personalização
                </span>

                <h2>
                  Tamanho da fonte
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFontSheet(
                    false,
                  )
                }
                aria-label="Fechar"
              >
                <X
                  size={21}
                />
              </button>
            </div>

            {/* ================================================
                PRÉVIA DA FONTE
            ================================================= */}

            <div
              className="leitura-fonte-preview"
              style={{
                fontSize:
                  `${tamanhoFonte}px`,
                lineHeight: 1.25,
              }}
            >
              Porque Deus amou
              o mundo de tal
              maneira que deu
              o seu Filho
              unigênito.
            </div>

            {/* ================================================
                CONTROLE DA FONTE
            ================================================= */}

            <div className="leitura-fonte-controle">
              <span
                style={{
                  fontSize:
                    '14px',
                }}
              >
                A
              </span>

              <input
                type="range"
                min={
                  FONTE_MINIMA
                }
                max={
                  FONTE_MAXIMA
                }
                step="1"
                value={
                  tamanhoFonte
                }
                onChange={
                  alterarFonte
                }
                aria-label="Tamanho da fonte"
              />

              <span
                style={{
                  fontSize:
                    '28px',
                }}
              >
                A
              </span>
            </div>

            <div className="leitura-fonte-valor">
              {tamanhoFonte}px
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          BOTTOM SHEET — VERSÃO
      ====================================================== */}

      {showVersionSheet && (
        <div
          className="leitura-overlay"
          onClick={() =>
            setShowVersionSheet(
              false,
            )
          }
        >
          <div
            className="leitura-bottom-sheet"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="leitura-sheet-handle" />

            <div className="leitura-sheet-header">
              <div>
                <span>
                  Bíblia
                </span>

                <h2>
                  Escolha a versão
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowVersionSheet(
                    false,
                  )
                }
                aria-label="Fechar"
              >
                <X
                  size={21}
                />
              </button>
            </div>

            <div className="leitura-versoes">
              {/* ============================================
                  ACF
              ============================================= */}

              <button
                type="button"
                className={
                  version ===
                  'ACF'
                    ? 'selecionada'
                    : ''
                }
                onClick={() =>
                  selecionarVersao(
                    'ACF',
                  )
                }
              >
                <div>
                  <strong>
                    ACF
                  </strong>

                  <span>
                    Almeida Corrigida
                    e Fiel
                  </span>
                </div>

                {version ===
                  'ACF' && (
                  <span className="leitura-versao-check">
                    ✓
                  </span>
                )}
              </button>

              {/* ============================================
                  TB
              ============================================= */}

              <button
                type="button"
                className={
                  version ===
                  'TB'
                    ? 'selecionada'
                    : ''
                }
                onClick={() =>
                  selecionarVersao(
                    'TB',
                  )
                }
              >
                <div>
                  <strong>
                    TB
                  </strong>

                  <span>
                    Tradução Brasileira
                  </span>
                </div>

                {version ===
                  'TB' && (
                  <span className="leitura-versao-check">
                    ✓
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          BOTTOM SHEET — ANOTAÇÃO
      ====================================================== */}

      {noteTarget && (
        <div
          className="leitura-overlay"
          onClick={
            cancelarEdicaoNota
          }
        >
          <div
            className="leitura-bottom-sheet leitura-nota-sheet"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="leitura-sheet-handle" />

            <div className="leitura-sheet-header">
              <div>
                <span>
                  {noteTarget.book}{' '}
                  {
                    noteTarget.chapter
                  }

                  {noteTarget.verse
                    ? `:${noteTarget.verse}`
                    : ''}
                </span>

                <h2>
                  {editingNoteId ===
                  'new'
                    ? 'Adicionar anotação'
                    : 'Editar anotação'}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  cancelarEdicaoNota
                }
                aria-label="Fechar"
              >
                <X
                  size={21}
                />
              </button>
            </div>

            {/* ================================================
                VERSÍCULO DA NOTA
            ================================================= */}

            {noteTarget.verseText && (
              <div className="leitura-nota-referencia">
                <span>
                  {
                    noteTarget.verse
                  }
                </span>

                <p>
                  {
                    noteTarget.verseText
                  }
                </p>
              </div>
            )}

            {/* ================================================
                CAMPO DA NOTA
            ================================================= */}

            <textarea
              value={
                noteText
              }
              onChange={(event) =>
                setNoteText(
                  event.target
                    .value,
                )
              }
              placeholder="Digite sua anotação aqui..."
              rows={7}
              autoFocus
            />

            {/* ================================================
                SALVAR
            ================================================= */}

            <button
              type="button"
              className="leitura-salvar-nota"
              onClick={
                salvarNota
              }
              disabled={
                !noteText.trim()
              }
            >
              <Save
                size={19}
              />

              {editingNoteId ===
              'new'
                ? 'SALVAR ANOTAÇÃO'
                : 'SALVAR ALTERAÇÕES'}
            </button>

            {/* ================================================
                CANCELAR
            ================================================= */}

            <button
              type="button"
              className="leitura-cancelar-nota"
              onClick={
                cancelarEdicaoNota
              }
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
          BOTÃO VOLTAR AO TOPO
      ====================================================== */}

      <button
        type="button"
        className="leitura-voltar-topo"
        onClick={
          voltarAoTopo
        }
        aria-label="Voltar ao topo"
      >
        <ChevronLeft
          size={20}
          style={{
            transform:
              'rotate(90deg)',
          }}
        />
      </button>
    </main>
  )
}