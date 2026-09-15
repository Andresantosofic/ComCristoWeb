import {
  ArrowLeft,
  BookOpen,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import './Favoritos.css'

type BibleVersion = 'ACF' | 'TB'

type HighlightColor =
  | 'yellow'
  | 'green'
  | 'blue'
  | 'cyan'
  | 'pink'
  | 'purple'

type BibleFavorite = {
  id: string
  version: BibleVersion
  book: string
  chapter: number
  verse: number
  text: string
  color: HighlightColor | null
  createdAt: number
}

type Highlights = Record<
  string,
  HighlightColor
>

type FiltroCor =
  | 'all'
  | HighlightColor

type GrupoFavorito = {
  id: string
  version: BibleVersion
  book: string
  chapter: number
  verses: BibleFavorite[]
  color: HighlightColor | null
}

const FAVORITOS_KEY =
  'comcristo_biblia_favorites'

const HIGHLIGHTS_KEY =
  'comcristo_biblia_highlights'

const CORES: {
  id: HighlightColor
  nome: string
}[] = [
  {
    id: 'yellow',
    nome: 'Amarelo',
  },
  {
    id: 'green',
    nome: 'Verde',
  },
  {
    id: 'blue',
    nome: 'Azul',
  },
  {
    id: 'cyan',
    nome: 'Ciano',
  },
  {
    id: 'pink',
    nome: 'Rosa',
  },
  {
    id: 'purple',
    nome: 'Roxo',
  },
]

function ehCorValida(
  valor: unknown,
): valor is HighlightColor {
  return (
    valor === 'yellow' ||
    valor === 'green' ||
    valor === 'blue' ||
    valor === 'cyan' ||
    valor === 'pink' ||
    valor === 'purple'
  )
}

function lerFavoritos(): BibleFavorite[] {
  try {
    const salvo =
      localStorage.getItem(
        FAVORITOS_KEY,
      )

    if (!salvo) {
      return []
    }

    const dados = JSON.parse(
      salvo,
    )

    if (!Array.isArray(dados)) {
      return []
    }

    return dados
      .filter(
        (item) =>
          item &&
          typeof item === 'object',
      )
      .map(
        (item) => ({
          id: String(
            item.id ?? '',
          ),
          version:
  item.version === 'TB'
    ? ('TB' as BibleVersion)
    : ('ACF' as BibleVersion),
          book: String(
            item.book ?? '',
          ),
          chapter: Number(
            item.chapter ?? 0,
          ),
          verse: Number(
            item.verse ?? 0,
          ),
          text: String(
            item.text ?? '',
          ),
          color: ehCorValida(
  item.color,
)
  ? item.color
  : null,
          createdAt: Number(
            item.createdAt ??
              Date.now(),
          ),
        }),
      )
      .filter(
        (item) =>
          item.id &&
          item.book &&
          item.chapter > 0 &&
          item.verse > 0,
      )
  } catch (error) {
    console.error(
      'Erro ao carregar favoritos:',
      error,
    )

    return []
  }
}
function lerDestaques(): Highlights {
  try {
    const salvo =
      localStorage.getItem(
        HIGHLIGHTS_KEY,
      )

    if (!salvo) {
      return {}
    }

    const dados = JSON.parse(
      salvo,
    )

    if (
      !dados ||
      typeof dados !== 'object' ||
      Array.isArray(dados)
    ) {
      return {}
    }

    const resultado: Highlights = {}

    Object.entries(
      dados as Record<
        string,
        unknown
      >,
    ).forEach(
      ([key, value]) => {
        if (ehCorValida(value)) {
          resultado[key] = value
        }
      },
    )

    return resultado
  } catch (error) {
    console.error(
      'Erro ao carregar destaques:',
      error,
    )

    return {}
  }
}

function obterChaveVersiculo(
  favorito: BibleFavorite,
): string {
  return [
    favorito.version,
    favorito.book,
    favorito.chapter,
    favorito.verse,
  ].join('_')
}

function nomeVersao(
  version: BibleVersion,
): string {
  return version === 'TB'
    ? 'TB'
    : 'ACF'
}

function nomeCor(
  color: HighlightColor | null,
): string {
  if (!color) {
    return 'Sem marcação'
  }

  return (
    CORES.find(
      (item) =>
        item.id === color,
    )?.nome ?? 'Sem marcação'
  )
}

function Favoritos() {
  const navigate =
    useNavigate()

  const [
    favoritos,
    setFavoritos,
  ] = useState<
    BibleFavorite[]
  >(() =>
    lerFavoritos(),
  )

  const [
    highlights,
    setHighlights,
  ] = useState<Highlights>(
    () => lerDestaques(),
  )

  const [
    busca,
    setBusca,
  ] = useState('')

  const [
    filtroCor,
    setFiltroCor,
  ] = useState<FiltroCor>(
    'all',
  )

  const [
    grupoSelecionado,
    setGrupoSelecionado,
  ] =
    useState<GrupoFavorito | null>(
      null,
    )

  /*
   * Mantém a tela sincronizada
   * com a Leitura.tsx.
   */
  useEffect(() => {
    const atualizar =
      () => {
        setFavoritos(
          lerFavoritos(),
        )

        setHighlights(
          lerDestaques(),
        )
      }

    window.addEventListener(
      'storage',
      atualizar,
    )

    window.addEventListener(
      'comcristo:favoritos-atualizados',
      atualizar,
    )

    window.addEventListener(
      'comcristo:destaques-atualizados',
      atualizar,
    )

    return () => {
      window.removeEventListener(
        'storage',
        atualizar,
      )

      window.removeEventListener(
        'comcristo:favoritos-atualizados',
        atualizar,
      )

      window.removeEventListener(
        'comcristo:destaques-atualizados',
        atualizar,
      )
    }
  }, [])

  /*
   * A cor do próprio favorito é
   * a fonte principal.
   *
   * O highlights continua como
   * fallback para favoritos antigos.
   */
  const favoritosComCor =
    useMemo(() => {
      return favoritos.map(
        (favorito) => {
          const chave =
            obterChaveVersiculo(
              favorito,
            )

          return {
            favorito,
            color:
              favorito.color ??
              highlights[chave] ??
              null,
          }
        },
      )
    }, [
      favoritos,
      highlights,
    ])

  /*
   * Aplica busca + filtro de cor.
   */
  const favoritosFiltrados =
    useMemo(() => {
      const termo =
        busca
          .trim()
          .toLocaleLowerCase()

      return favoritosComCor.filter(
        ({
          favorito,
          color,
        }) => {
          const correspondeBusca =
            !termo ||
            favorito.book
              .toLocaleLowerCase()
              .includes(termo) ||
            favorito.text
              .toLocaleLowerCase()
              .includes(termo) ||
            `${favorito.chapter}:${favorito.verse}`
              .includes(termo)

          const correspondeCor =
            filtroCor === 'all' ||
            color === filtroCor

          return (
            correspondeBusca &&
            correspondeCor
          )
        },
      )
    }, [
      favoritosComCor,
      busca,
      filtroCor,
    ])

  /*
   * Agrupa versículos consecutivos
   * do mesmo livro, capítulo e versão.
   */
  const grupos =
    useMemo(() => {
      const ordenados =
        [...favoritosFiltrados]
          .sort(
            (a, b) => {
              if (
                a.favorito.version !==
                b.favorito.version
              ) {
                return a.favorito.version.localeCompare(
                  b.favorito.version,
                )
              }

              if (
                a.favorito.book !==
                b.favorito.book
              ) {
                return a.favorito.book.localeCompare(
                  b.favorito.book,
                )
              }

              if (
                a.favorito.chapter !==
                b.favorito.chapter
              ) {
                return (
                  a.favorito.chapter -
                  b.favorito.chapter
                )
              }

              return (
                a.favorito.verse -
                b.favorito.verse
              )
            },
          )

      const resultado: GrupoFavorito[] =
        []

      ordenados.forEach(
        ({
          favorito,
          color,
        }) => {
          const ultimo =
            resultado[
              resultado.length - 1
            ]

          const ultimoVersiculo =
            ultimo?.verses[
              ultimo.verses.length - 1
            ]

          const podeAgrupar =
            ultimo &&
            ultimo.version ===
              favorito.version &&
            ultimo.book ===
              favorito.book &&
            ultimo.chapter ===
              favorito.chapter &&
            ultimoVersiculo &&
            ultimoVersiculo.verse +
              1 ===
              favorito.verse

          if (podeAgrupar) {
            ultimo.verses.push(
              favorito,
            )

            /*
             * Se o grupo ainda não
             * possui cor, utiliza a
             * primeira cor encontrada.
             */
            if (
              ultimo.color ===
                null &&
              color !== null
            ) {
              ultimo.color =
                color
            }

            return
          }

          resultado.push({
            id: `${favorito.version}_${favorito.book}_${favorito.chapter}_${favorito.verse}`,
            version:
              favorito.version,
            book: favorito.book,
            chapter:
              favorito.chapter,
            verses: [
              favorito,
            ],
            color,
          })
        },
      )

      return resultado
    }, [
      favoritosFiltrados,
    ])

  /*
   * Remove todos os versículos
   * pertencentes ao grupo.
   *
   * Também remove as respectivas
   * marcações de cor.
   */
  function removerGrupo(
    grupo: GrupoFavorito,
  ) {
    const ids = new Set(
      grupo.verses.map(
        (item) => item.id,
      ),
    )

    const novosFavoritos =
      favoritos.filter(
        (item) =>
          !ids.has(item.id),
      )

    const novosHighlights = {
      ...highlights,
    }

    grupo.verses.forEach(
      (favorito) => {
        const chave =
          obterChaveVersiculo(
            favorito,
          )

        delete novosHighlights[
          chave
        ]
      },
    )

    setFavoritos(
      novosFavoritos,
    )

    setHighlights(
      novosHighlights,
    )

    localStorage.setItem(
      FAVORITOS_KEY,
      JSON.stringify(
        novosFavoritos,
      ),
    )

    localStorage.setItem(
      HIGHLIGHTS_KEY,
      JSON.stringify(
        novosHighlights,
      ),
    )

    window.dispatchEvent(
      new CustomEvent(
        'comcristo:favoritos-atualizados',
      ),
    )

    window.dispatchEvent(
      new CustomEvent(
        'comcristo:destaques-atualizados',
      ),
    )

    setGrupoSelecionado(
      null,
    )
  }
    function abrirNaBiblia(
    grupo: GrupoFavorito,
  ) {
    const primeiro =
      grupo.verses[0]

    if (!primeiro) {
      return
    }

    const params =
      new URLSearchParams()

    /*
     * Esses são os nomes dos parâmetros
     * utilizados pela Leitura.tsx.
     */
    params.set(
      'livro',
      primeiro.book,
    )

    params.set(
      'capitulo',
      String(
        primeiro.chapter,
      ),
    )

    params.set(
      'versiculo',
      String(
        primeiro.verse,
      ),
    )

    params.set(
      'versao',
      primeiro.version,
    )

    setGrupoSelecionado(
      null,
    )

    navigate(
      `/biblia/leitura?${params.toString()}`,
    )
  }

  function fecharBottomSheet() {
    setGrupoSelecionado(
      null,
    )
  }

  function renderReferencia(
    grupo: GrupoFavorito,
  ) {
    const primeiro =
      grupo.verses[0]

    const ultimo =
      grupo.verses[
        grupo.verses.length - 1
      ]

    if (
      grupo.verses.length === 1
    ) {
      return `${grupo.book} ${grupo.chapter}:${primeiro.verse}`
    }

    return `${grupo.book} ${grupo.chapter}:${primeiro.verse}-${ultimo.verse}`
  }

  return (
    <div className="favoritos-page">

      <header className="favoritos-header">

        <button
          type="button"
          className="favoritos-back"
          aria-label="Voltar"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft
            size={22}
          />
        </button>

        <div className="favoritos-header-icon">
          <BookOpen
            size={26}
          />
        </div>

        <div className="favoritos-header-info">
          <h1>
            Versículos Favoritos
          </h1>

          <span>
            {favoritos.length}{' '}
            {favoritos.length ===
            1
              ? 'versículo salvo'
              : 'versículos salvos'}
          </span>
        </div>

      </header>

      <div className="favoritos-search">

        <Search
          size={20}
        />

        <input
          type="text"
          value={busca}
          onChange={(event) =>
            setBusca(
              event.target.value,
            )
          }
          placeholder="Buscar versículo..."
          aria-label="Buscar versículo"
        />

        {busca && (
          <button
            type="button"
            className="favoritos-search-clear"
            aria-label="Limpar busca"
            onClick={() =>
              setBusca('')
            }
          >
            <X
              size={17}
            />
          </button>
        )}

      </div>

      <div className="favoritos-filtros-cores">

        <button
          type="button"
          className={
            filtroCor === 'all'
              ? 'favoritos-filtro active'
              : 'favoritos-filtro'
          }
          onClick={() =>
            setFiltroCor('all')
          }
        >
          Todos
        </button>

        {CORES.map(
          (cor) => (
            <button
              key={cor.id}
              type="button"
              className={
                filtroCor ===
                cor.id
                  ? `favoritos-filtro favoritos-filtro-${cor.id} active`
                  : `favoritos-filtro favoritos-filtro-${cor.id}`
              }
              onClick={() =>
                setFiltroCor(
                  cor.id,
                )
              }
            >
              <span />

              {cor.nome}
            </button>
          ),
        )}

      </div>

      <main className="favoritos-content">

        {favoritos.length ===
          0 ? (
          <div className="favoritos-empty">

            <div className="favoritos-empty-icon">
              <BookOpen
                size={32}
              />
            </div>

            <h2>
              Nenhum versículo salvo
            </h2>

            <p>
              Os versículos que você
              marcar como favoritos
              aparecerão aqui.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/biblia')
              }
            >
              <BookOpen
                size={18}
              />

              ABRIR BÍBLIA
            </button>

          </div>
        ) : grupos.length ===
          0 ? (
          <div className="favoritos-empty">

            <div className="favoritos-empty-icon">
              <Search
                size={32}
              />
            </div>

            <h2>
              Nenhum resultado
            </h2>

            <p>
              Não encontramos
              versículos para os
              filtros selecionados.
            </p>

            <button
              type="button"
              onClick={() => {
                setBusca('')
                setFiltroCor(
                  'all',
                )
              }}
            >
              LIMPAR FILTROS
            </button>

          </div>
        ) : (
          <div className="favoritos-list">

            {grupos.map(
              (grupo) => (
                <button
                  key={grupo.id}
                  type="button"
                  className={`favoritos-card ${
                    grupo.color
                      ? `favoritos-card-${grupo.color}`
                      : ''
                  }`}
                  onClick={() =>
                    setGrupoSelecionado(
                      grupo,
                    )
                  }
                >

                  <div className="favoritos-card-top">

                    <div className="favoritos-reference">
                      {renderReferencia(
                        grupo,
                      )}
                    </div>

                    <div className="favoritos-version">
                      {nomeVersao(
                        grupo.version,
                      )}
                    </div>

                  </div>

                  <p className="favoritos-card-text">
                    {grupo.verses
                      .map(
                        (item) =>
                          item.text,
                      )
                      .join(' ')}
                  </p>

                  <div className="favoritos-card-bottom">

                    <span>
                      {grupo.verses.length}{' '}
                      {grupo.verses
                        .length === 1
                        ? 'versículo'
                        : 'versículos'}
                    </span>

                    {grupo.color && (
                      <span
                        className={`favoritos-card-color favoritos-card-color-${grupo.color}`}
                        title={nomeCor(
                          grupo.color,
                        )}
                      />
                    )}

                  </div>

                </button>
              ),
            )}

          </div>
        )}

      </main>
            {grupoSelecionado && (
        <div
          className="favoritos-sheet-overlay"
          onClick={
            fecharBottomSheet
          }
        >
          <section
            className="favoritos-bottom-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Versículo favorito"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="favoritos-sheet-handle" />

            <div className="favoritos-sheet-header">

              <div>

                <span className="favoritos-sheet-version">
                  {nomeVersao(
                    grupoSelecionado.version,
                  )}
                </span>

                <h2>
                  {renderReferencia(
                    grupoSelecionado,
                  )}
                </h2>

              </div>

              <button
                type="button"
                className="favoritos-sheet-close"
                aria-label="Fechar"
                onClick={
                  fecharBottomSheet
                }
              >
                <X
                  size={21}
                />
              </button>

            </div>

            {grupoSelecionado.color && (
              <div className="favoritos-sheet-color-info">

                <span
                  className={`favoritos-sheet-color-dot favoritos-sheet-color-${grupoSelecionado.color}`}
                />

                <span>
                  {nomeCor(
                    grupoSelecionado.color,
                  )}
                </span>

              </div>
            )}

            <div className="favoritos-sheet-text">

              {grupoSelecionado.verses.map(
                (versiculo) => (
                  <p
                    key={
                      versiculo.id
                    }
                  >
                    <strong>
                      {
                        versiculo.verse
                      }
                    </strong>{' '}
                    {
                      versiculo.text
                    }
                  </p>
                ),
              )}

            </div>

            <div className="favoritos-sheet-actions">

              <button
                type="button"
                className="favoritos-button-primary"
                onClick={() =>
                  abrirNaBiblia(
                    grupoSelecionado,
                  )
                }
              >
                <BookOpen
                  size={19}
                />

                ABRIR NA BÍBLIA
              </button>

              <button
                type="button"
                className="favoritos-button-danger"
                onClick={() =>
                  removerGrupo(
                    grupoSelecionado,
                  )
                }
              >
                <Trash2
                  size={19}
                />

                REMOVER MARCAÇÃO
              </button>

            </div>

          </section>
        </div>
      )}

    </div>
  )
}

export default Favoritos