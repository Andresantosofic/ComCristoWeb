import {
  useEffect,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Lightbulb,
  MessageCircleHeart,
  Share2,
} from 'lucide-react'

import {
  observarConfiguracaoDevocional,
  observarDevocionalInicial,
  observarDevocionalDoDia,
  type ConfiguracaoDevocional,
  type DevocionalFirebase,
} from '../services/devocionalFirebase'

import './Devocional.css'


type DiaDevocional = {
  data: Date
  dia: string
  numero: number
  mes: string
}

const CONFIG_PADRAO: ConfiguracaoDevocional = {
  tituloTelaDevocional:
    'Devocional do Dia',

  tituloTemaDevocional:
    'TEMA DO DEVOCIONAL',

  tituloEstudo:
    'Entendendo a Palavra',

  tituloReflexao:
    'Para Refletir',

  textoFinalizarLeitura:
    'FINALIZAR LEITURA',

  textoLeituraConcluida:
    '✔ LEITURA CONCLUÍDA',

  textoCompartilharDevocional:
    'COMPARTILHAR DEVOCIONAL',

  corFundo:
    '#FFFFFF',

  corTituloTela:
    '#1A2240',

  corStreak:
    '#5E6A82',

  corCardTema:
    '#1A2240',

  corTituloTema:
    '#FFFFFF',

  corTema:
    '#FFFFFF',

  corVersiculo:
    '#FFFFFF',

  corReferencia:
    '#FFFFFF',

  corDivisorTema:
    '#FFFFFF',

  corCardEstudo:
    '#F5F7FA',

  corIconeEstudo:
    '#1A2240',

  corTituloEstudo:
    '#1A2240',

  corTextoEstudo:
    '#2A3342',

  corCardReflexao:
    '#F5F7FA',

  corIconeReflexao:
    '#1A2240',

  corTituloReflexao:
    '#1A2240',

  corTextoReflexao:
    '#2A3342',

  corBotaoFinalizar:
    '#5AA8F0',

  corTextoBotaoFinalizar:
    '#FFFFFF',

  corBotaoCompartilhar:
    '#E6F1F8',

  corTextoBotaoCompartilhar:
    '#1A2240',
}

function obterDataHoje(): Date {
  const agora = new Date()

  return new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
  )
}

function obterDataFirebase(
  data: Date,
): string {
  const mes =
    String(
      data.getMonth() + 1,
    ).padStart(2, '0')

  const dia =
    String(
      data.getDate(),
    ).padStart(2, '0')

  return `${mes}-${dia}`
}

function obterChaveData(
  data: Date,
): string {
  return obterDataFirebase(data)
}

function mesmoDia(
  data1: Date,
  data2: Date,
): boolean {
  return (
    data1.getFullYear() ===
      data2.getFullYear() &&
    data1.getMonth() ===
      data2.getMonth() &&
    data1.getDate() ===
      data2.getDate()
  )
}

function normalizarTexto(
  texto: string,
): string {
  return texto
    .replace(/\\n/g, '\n')
    .trim()
}

function Devocional() {
  const navigate = useNavigate()

  /*
   * ============================================================
   * DATA
   * ============================================================
   */

  const [hoje, setHoje] =
    useState<Date>(() => obterDataHoje())

  const [dataSelecionada, setDataSelecionada] =
    useState<Date>(() => obterDataHoje())

  /*
   * ============================================================
   * FIREBASE
   * ============================================================
   */

  const [
    configuracao,
    setConfiguracao,
  ] = useState<ConfiguracaoDevocional>(
    CONFIG_PADRAO,
  )

  const [
    devocional,
    setDevocional,
  ] = useState<
    DevocionalFirebase | null
  >(null)

  const [
    carregando,
    setCarregando,
  ] = useState(true)

  const [
    erroFirebase,
    setErroFirebase,
  ] = useState(false)

  /*
   * ============================================================
   * COMPARTILHAMENTO
   * ============================================================
   */

  const [
    compartilhado,
    setCompartilhado,
  ] = useState(false)

  /*
   * ============================================================
   * LEITURAS CONCLUÍDAS
   * ============================================================
   */

  const [
    diasConcluidos,
    setDiasConcluidos,
  ] = useState<string[]>(() => {
    try {
      const dados =
        localStorage.getItem(
          'comcristo_devocionais_concluidos',
        )

      if (!dados) {
        return []
      }

      const lista =
        JSON.parse(dados)

      return Array.isArray(lista)
        ? lista
        : []
    } catch {
      return []
    }
  })

  /*
   * ============================================================
   * ATUALIZAÇÃO DA DATA
   * ============================================================
   */

  useEffect(() => {
    const intervalo =
      window.setInterval(() => {
        const novaData =
          obterDataHoje()

        setHoje((anterior) => {
          if (
            anterior.getTime() ===
            novaData.getTime()
          ) {
            return anterior
          }

          return novaData
        })
      }, 60_000)

    return () => {
      window.clearInterval(
        intervalo,
      )
    }
  }, [])

  /*
   * ============================================================
   * VIRADA DO DIA
   * ============================================================
   */

  useEffect(() => {
    setDataSelecionada(
      (anterior) => {
        if (mesmoDia(anterior, hoje)) {
          return anterior
        }

        return hoje
      },
    )
  }, [hoje])

  /*
   * ============================================================
   * TOPO
   * ============================================================
   */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [dataSelecionada])

  /*
   * ============================================================
   * CONFIGURAÇÃO
   *
   * configuracoes/devocional
   * ============================================================
   */

  useEffect(() => {
    const unsubscribe =
      observarConfiguracaoDevocional(
        (dados) => {
          if (dados.ativo !== true) {
            setConfiguracao(
              CONFIG_PADRAO,
            )

            return
          }

          setConfiguracao({
            ...CONFIG_PADRAO,
            ...dados,
          })
        },

        () => {
          setConfiguracao(
            CONFIG_PADRAO,
          )
        },
      )

    return () => {
      unsubscribe()
    }
  }, [])

  /*
   * ============================================================
   * CARREGAR DEVOCIONAL
   *
   * 1. devocional_inicial/atual
   * 2. conteudo_diario/MM-dd
   * ============================================================
   */

  useEffect(() => {
    let unsubscribeInicial:
      | (() => void)
      | null = null

    let unsubscribeDiario:
      | (() => void)
      | null = null

    let diarioAtivo = false

    setCarregando(true)
    setErroFirebase(false)
    setDevocional(null)

    const data =
      obterDataFirebase(
        dataSelecionada,
      )

    const observarDiario = () => {
      if (diarioAtivo) {
        return
      }

      diarioAtivo = true

      unsubscribeDiario =
        observarDevocionalDoDia(
          data,

          (dados) => {
            setCarregando(false)
            setErroFirebase(false)

            setDevocional(
              dados,
            )
          },

          () => {
            setCarregando(false)
            setErroFirebase(true)
            setDevocional(null)
          },
        )
    }

    unsubscribeInicial =
      observarDevocionalInicial(
        data,

        (dados) => {
          if (dados) {
            setCarregando(false)
            setErroFirebase(false)

            setDevocional(
              dados,
            )

            if (unsubscribeDiario) {
              unsubscribeDiario()

              unsubscribeDiario =
                null
            }

            diarioAtivo = false

            return
          }

          observarDiario()
        },

        () => {
          observarDiario()
        },
      )

    return () => {
      if (unsubscribeInicial) {
        unsubscribeInicial()
      }

      if (unsubscribeDiario) {
        unsubscribeDiario()
      }
    }
  }, [dataSelecionada])

  /*
   * ============================================================
   * FINALIZAR LEITURA
   * ============================================================
   */

  const finalizarLeitura = () => {
    const chave =
      obterChaveData(
        dataSelecionada,
      )

    setDiasConcluidos(
      (anteriores) => {
        if (
          anteriores.includes(
            chave,
          )
        ) {
          return anteriores
        }

        const atualizados = [
          ...anteriores,
          chave,
        ]

        localStorage.setItem(
          'comcristo_devocionais_concluidos',
          JSON.stringify(
            atualizados,
          ),
        )

        return atualizados
      },
    )
  }

  const leituraConcluida =
    diasConcluidos.includes(
      obterChaveData(
        dataSelecionada,
      ),
    )

  /*
   * ============================================================
   * SEQUÊNCIA
   *
   * Calcula quantos dias consecutivos
   * foram concluídos até hoje.
   * ============================================================
   */

  const calcularSequencia = (): number => {
    let sequencia = 0

    const data = new Date(hoje)

    while (true) {
      const chave =
        obterChaveData(data)

      if (
        !diasConcluidos.includes(
          chave,
        )
      ) {
        break
      }

      sequencia++

      data.setDate(
        data.getDate() - 1,
      )
    }

    return sequencia
  }

  const sequencia =
    calcularSequencia()

  /*
   * ============================================================
   * SEMANA
   * ============================================================
   */

  const dias: DiaDevocional[] =
    Array.from(
      {
        length: 7,
      },
      (_, index) => {
        const data =
          new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate() -
              (6 - index),
          )

        const nomesDias = [
          'Dom',
          'Seg',
          'Ter',
          'Qua',
          'Qui',
          'Sex',
          'Sáb',
        ]

        const nomesMeses = [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez',
        ]

        return {
          data,
          dia: nomesDias[
            data.getDay()
          ],
          numero:
            data.getDate(),
          mes: nomesMeses[
            data.getMonth()
          ],
        }
      },
    )

  /*
   * ============================================================
   * DATA COMPLETA
   * ============================================================
   */

  const diaEhHoje =
    mesmoDia(
      dataSelecionada,
      hoje,
    )

  const formatarDataCompleta = (
    data: Date,
  ) => {
    return data.toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    )
  }

  /*
   * ============================================================
   * COMPARTILHAR
   * ============================================================
   */

  const compartilharDevocional =
    async () => {
      if (!devocional) {
        return
      }

      const titulo =
        devocional.tema ||
        'Devocional do Dia'

      const texto =
        `${devocional.tema}

“${devocional.versiculo}”

${devocional.referencia}

${configuracao.tituloEstudo || 'Entendendo a Palavra'}

${normalizarTexto(devocional.estudo)}

${configuracao.tituloReflexao || 'Para Refletir'}

${normalizarTexto(devocional.reflexao)}

Com Cristo 🤍`

      try {
        if (
          navigator.share
        ) {
          await navigator.share({
            title: titulo,
            text: texto,
          })

          return
        }

        await navigator.clipboard.writeText(
          texto,
        )

        setCompartilhado(true)

        window.setTimeout(
          () => {
            setCompartilhado(false)
          },
          2500,
        )
      } catch (error) {
        if (
          error instanceof Error &&
          error.name ===
            'AbortError'
        ) {
          return
        }

        try {
          await navigator.clipboard.writeText(
            texto,
          )

          setCompartilhado(true)

          window.setTimeout(
            () => {
              setCompartilhado(false)
            },
            2500,
          )
        } catch {
          alert(
            'Não foi possível compartilhar o devocional.',
          )
        }
      }
    }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main
      className="devocional-page"
      style={{
        background:
          configuracao.corFundo,
        color:
          configuracao.corTextoEstudo,
      }}
    >
      {/* ======================================================
          CABEÇALHO
          ====================================================== */}

      <header className="devocional-header">
        <button
          type="button"
          className="devocional-back-button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          <ArrowLeft
            size={22}
          />
        </button>

        <div className="devocional-header-title">
          <span
            style={{
              color:
                configuracao.corTituloTela,
            }}
          >
            COM CRISTO
          </span>

          <h1
            style={{
              color:
                configuracao.corTituloTela,
            }}
          >
            {
              configuracao.tituloTelaDevocional
            }
          </h1>
        </div>

        <button
          type="button"
          className="devocional-share-button"
          onClick={
            compartilharDevocional
          }
          aria-label="Compartilhar devocional"
          disabled={
            !devocional ||
            carregando
          }
        >
          {compartilhado ? (
            <Check
              size={21}
            />
          ) : (
            <Share2
              size={21}
            />
          )}
        </button>
      </header>

      <section className="devocional-content">
        {/* ==================================================
            TÍTULO / SEQUÊNCIA
            ================================================== */}

        <div className="devocional-title-area">
          <h2
            style={{
              color:
                configuracao.corTituloTela,
            }}
          >
            {
              configuracao.tituloTelaDevocional
            }
          </h2>

          <div
            className="devocional-streak"
            style={{
              color:
                configuracao.corStreak,
            }}
          >
            🔥 Sequência:{' '}
            {sequencia} dias
          </div>
        </div>

        {/* ==================================================
            DATA
            ================================================== */}

        <div className="devocional-date">
          <CalendarDays
            size={17}
          />

          <span>
            {diaEhHoje
              ? 'Devocional de hoje'
              : `Devocional de ${formatarDataCompleta(
                  dataSelecionada,
                )}`}
          </span>
        </div>

        {/* ==================================================
            SEMANA
            ================================================== */}

        <div className="devocional-week">
          {dias.map(
            (dia) => {
              const selecionado =
                mesmoDia(
                  dia.data,
                  dataSelecionada,
                )

              const concluido =
                diasConcluidos.includes(
                  obterChaveData(
                    dia.data,
                  ),
                )

              const futuro =
                dia.data > hoje

              return (
                <button
                  key={dia.data.toISOString()}
                  type="button"
                  className={`devocional-day ${
                    selecionado
                      ? 'devocional-day-selected'
                      : ''
                  } ${
                    concluido
                      ? 'devocional-day-completed'
                      : ''
                  } ${
                    futuro
                      ? 'devocional-day-disabled'
                      : ''
                  }`}
                  disabled={
                    futuro
                  }
                  onClick={() =>
                    setDataSelecionada(
                      dia.data,
                    )
                  }
                >
                  <span className="devocional-day-name">
                    {dia.dia}
                  </span>

                  {concluido ? (
                    <span className="devocional-day-check">
                      <Check
                        size={17}
                        strokeWidth={
                          3
                        }
                      />
                    </span>
                  ) : (
                    <span className="devocional-day-number">
                      {dia.numero}
                    </span>
                  )}

                  <span className="devocional-day-month">
                    {dia.mes}
                  </span>
                </button>
              )
            },
          )}
        </div>

        {/* ==================================================
            CARREGANDO
            ================================================== */}

        {carregando && (
          <div
            className="devocional-main-card"
            style={{
              padding:
                '48px 24px',
              textAlign:
                'center',
            }}
          >
            <p>
              Carregando
              devocional...
            </p>
          </div>
        )}

        {/* ==================================================
            ERRO
            ================================================== */}

        {!carregando &&
          erroFirebase &&
          !devocional && (
            <div
              className="devocional-main-card devocional-empty"
            >
              <BookOpen
                size={32}
              />

              <p>
                Não foi possível
                carregar o
                devocional.
              </p>

              <span>
                Verifique sua
                conexão e tente
                novamente.
              </span>
            </div>
          )}

        {/* ==================================================
            SEM CONTEÚDO
            ================================================== */}

        {!carregando &&
          !erroFirebase &&
          !devocional && (
            <div
              className="devocional-main-card devocional-empty"
            >
              <BookOpen
                size={32}
              />

              <p>
                Não foi possível
                encontrar o
                devocional desta
                data.
              </p>
            </div>
          )}

        {/* ==================================================
            DEVOCIONAL
            ================================================== */}

        {!carregando &&
          devocional && (
            <article className="devocional-main-card">
              {/* ============================================
                  TEMA + VERSÍCULO
                  ============================================ */}

              <div
                className="devocional-theme"
                style={{
                  background:
                    configuracao.corCardTema,
                }}
              >
                <span
                  style={{
                    color:
                      configuracao.corTituloTema,
                  }}
                >
                  {
                    configuracao.tituloTemaDevocional
                  }
                </span>

                <h2
                  style={{
                    color:
                      configuracao.corTema,
                  }}
                >
                  {
                    devocional.tema
                  }
                </h2>

                <div
                  className="devocional-theme-divider"
                  style={{
                    background:
                      configuracao.corDivisorTema,
                  }}
                />

                <p
                  className="devocional-theme-verse"
                  style={{
                    color:
                      configuracao.corVersiculo,
                  }}
                >
                  {
                    devocional.versiculo
                  }
                </p>

                <strong
                  className="devocional-theme-reference"
                  style={{
                    color:
                      configuracao.corReferencia,
                  }}
                >
                  {
                    devocional.referencia
                  }
                </strong>
              </div>

              {/* ============================================
                  ESTUDO
                  ============================================ */}

              <div
                className="devocional-section"
                style={{
                  background:
                    configuracao.corCardEstudo,
                }}
              >
                <div
                  className="devocional-section-icon"
                  style={{
                    background:
                      configuracao.corIconeEstudo,
                    color:
                      '#FFFFFF',
                  }}
                >
                  <Lightbulb
                    size={30}
                  />
                </div>

                <div className="devocional-section-content">
                  <h3
                    style={{
                      color:
                        configuracao.corTituloEstudo,
                    }}
                  >
                    {
                      configuracao.tituloEstudo
                    }
                  </h3>

                  <div className="devocional-text">
                    {normalizarTexto(
                      devocional.estudo,
                    )
                      .split(
                        /\n\s*\n/,
                      )
                      .map(
                        (
                          paragrafo,
                          index,
                        ) => (
                          <p
                            key={
                              index
                            }
                            style={{
                              color:
                                configuracao.corTextoEstudo,
                            }}
                          >
                            {
                              paragrafo.trim()
                            }
                          </p>
                        ),
                      )}
                  </div>
                </div>
              </div>

              {/* ============================================
                  REFLEXÃO
                  ============================================ */}

              <div
                className="devocional-section"
                style={{
                  background:
                    configuracao.corCardReflexao,
                }}
              >
                <div
                  className="devocional-section-icon"
                  style={{
                    background:
                      configuracao.corIconeReflexao,
                    color:
                      '#FFFFFF',
                  }}
                >
                  <MessageCircleHeart
                    size={30}
                  />
                </div>

                <div className="devocional-section-content">
                  <h3
                    style={{
                      color:
                        configuracao.corTituloReflexao,
                    }}
                  >
                    {
                      configuracao.tituloReflexao
                    }
                  </h3>

                  <div className="devocional-text">
                    {normalizarTexto(
                      devocional.reflexao,
                    )
                      .split(
                        /\n\s*\n/,
                      )
                      .map(
                        (
                          paragrafo,
                          index,
                        ) => (
                          <p
                            key={
                              index
                            }
                            style={{
                              color:
                                configuracao.corTextoReflexao,
                            }}
                          >
                            {
                              paragrafo.trim()
                            }
                          </p>
                        ),
                      )}
                  </div>
                </div>
              </div>

              {/* ============================================
                  FINALIZAR
                  ============================================ */}

              <div className="devocional-finish">
                <button
                  type="button"
                  className={`devocional-finish-button ${
                    leituraConcluida
                      ? 'devocional-finish-completed'
                      : ''
                  }`}
                  onClick={
                    finalizarLeitura
                  }
                  disabled={
                    leituraConcluida
                  }
                  style={
                    leituraConcluida
                      ? undefined
                      : {
                          background:
                            configuracao.corBotaoFinalizar,
                          color:
                            configuracao.corTextoBotaoFinalizar,
                        }
                  }
                >
                  <CheckCircle2
                    size={20}
                  />

                  <span>
                    {leituraConcluida
                      ? configuracao.textoLeituraConcluida
                      : configuracao.textoFinalizarLeitura}
                  </span>
                </button>

                {/* ==========================================
                    COMPARTILHAR
                    ========================================== */}

                {leituraConcluida && (
                  <button
                    type="button"
                    className="devocional-finish-button devocional-share-finish-button"
                    onClick={
                      compartilharDevocional
                    }
                    style={{
                      background:
                        configuracao.corBotaoCompartilhar,
                      color:
                        configuracao.corTextoBotaoCompartilhar,
                    }}
                  >
                    <Share2
                      size={18}
                    />

                    <span>
                      {
                        configuracao.textoCompartilharDevocional
                      }
                    </span>
                  </button>
                )}
              </div>
            </article>
          )}
      </section>
    </main>
  )
}

export default Devocional