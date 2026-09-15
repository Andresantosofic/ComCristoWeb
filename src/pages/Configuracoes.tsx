import {
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Minus,
  Plus,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'

import './Configuracoes.css'

import {
  ativarNotificacoes,
  desativarNotificacoes,
  atualizarHorarioNotificacao,
} from '../services/notificacaoService'

/* =========================================================
   CHAVES DO LOCALSTORAGE
   ========================================================= */

const STORAGE_FONTE =
  'comcristo_tamanho_fonte'

const STORAGE_NOTIFICACOES =
  'comcristo_notificacoes'

const STORAGE_HORARIO =
  'comcristo_horario_notificacao'

/* =========================================================
   LIMITES DA FONTE
   ========================================================= */

const FONTE_MINIMA = 14
const FONTE_MAXIMA = 32
const FONTE_PADRAO = 16

/* =========================================================
   PADRÕES DO ANDROID
   ========================================================= */

const NOTIFICACOES_PADRAO = false
const HORARIO_PADRAO = '08:00'

/* =========================================================
   FUNÇÕES PARA LOCALSTORAGE
   ========================================================= */

function lerNumero(
  chave: string,
  padrao: number,
) {
  try {
    const valor =
      localStorage.getItem(chave)

    if (!valor) {
      return padrao
    }

    const numero = Number(valor)

    if (
      !Number.isFinite(numero) ||
      numero < FONTE_MINIMA ||
      numero > FONTE_MAXIMA
    ) {
      return padrao
    }

    return numero
  } catch {
    return padrao
  }
}

function lerBoolean(
  chave: string,
  padrao: boolean,
) {
  try {
    const valor =
      localStorage.getItem(chave)

    if (valor === null) {
      return padrao
    }

    return valor === 'true'
  } catch {
    return padrao
  }
}

function lerString(
  chave: string,
  padrao: string,
) {
  try {
    return (
      localStorage.getItem(chave) ??
      padrao
    )
  } catch {
    return padrao
  }
}

/* =========================================================
   COMPONENTE
   ========================================================= */

export default function Configuracoes() {
  /* -----------------------------------------
     FONTE
     ----------------------------------------- */

  const [tamanhoFonte, setTamanhoFonte] =
    useState(() =>
      lerNumero(
        STORAGE_FONTE,
        FONTE_PADRAO,
      ),
    )

  /* -----------------------------------------
     NOTIFICAÇÕES
     ----------------------------------------- */

  const [
    notificacoesAtivas,
    setNotificacoesAtivas,
  ] = useState(() =>
    lerBoolean(
      STORAGE_NOTIFICACOES,
      NOTIFICACOES_PADRAO,
    ),
  )

  /* -----------------------------------------
     HORÁRIO
     ----------------------------------------- */

  const [
    horarioNotificacao,
    setHorarioNotificacao,
  ] = useState(() =>
    lerString(
      STORAGE_HORARIO,
      HORARIO_PADRAO,
    ),
  )

  /* =======================================================
     SALVAR E PROPAGAR FONTE
     ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_FONTE,
        String(tamanhoFonte),
      )
    } catch {
      // Ignora falha de armazenamento.
    }

    /*
     * A Bíblia Web já escuta este evento.
     */
    window.dispatchEvent(
      new CustomEvent(
        'comcristo:fonte-biblia',
        {
          detail: {
            tamanho: tamanhoFonte,
          },
        },
      ),
    )
  }, [tamanhoFonte])

  /* =======================================================
     ALTERAR FONTE
     ======================================================= */

  function diminuirFonte() {
    setTamanhoFonte(
      (valorAtual) =>
        Math.max(
          FONTE_MINIMA,
          valorAtual - 1,
        ),
    )
  }

  function aumentarFonte() {
    setTamanhoFonte(
      (valorAtual) =>
        Math.min(
          FONTE_MAXIMA,
          valorAtual + 1,
        ),
    )
  }

  /* =======================================================
     NOTIFICAÇÕES
     ======================================================= */

  async function alternarNotificacoes() {
  const novoEstado =
    !notificacoesAtivas

  if (novoEstado) {
    try {
      await ativarNotificacoes(
        horarioNotificacao,
      )

      setNotificacoesAtivas(true)

      localStorage.setItem(
        STORAGE_NOTIFICACOES,
        'true',
      )
    } catch (erro) {
      console.error(
        'Erro ao ativar notificações:',
        erro,
      )

      setNotificacoesAtivas(false)

      localStorage.setItem(
        STORAGE_NOTIFICACOES,
        'false',
      )

      const mensagem =
        erro instanceof Error
          ? erro.message
          : 'Não foi possível ativar as notificações.'

      window.alert(mensagem)
    }

    return
  }

  try {
    await desativarNotificacoes()
  } catch (erro) {
    console.error(
      'Erro ao desativar notificações:',
      erro,
    )
  }

  setNotificacoesAtivas(false)

  try {
    localStorage.setItem(
      STORAGE_NOTIFICACOES,
      'false',
    )
  } catch {
    // Ignora falha de armazenamento.
  }
}

  /* =======================================================
     HORÁRIO
     ======================================================= */

  async function alterarHorario(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const novoHorario =
    event.target.value

  if (!novoHorario) {
    return
  }

  setHorarioNotificacao(
    novoHorario,
  )

  try {
    localStorage.setItem(
      STORAGE_HORARIO,
      novoHorario,
    )
  } catch {
    // Ignora falha de armazenamento.
  }

  if (notificacoesAtivas) {
    try {
      await atualizarHorarioNotificacao(
        novoHorario,
      )
    } catch (erro) {
      console.error(
        'Erro ao atualizar horário da notificação:',
        erro,
      )
    }
  }
}

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="configuracoes-page">
      <div className="configuracoes-container">

        {/* =================================================
            CABEÇALHO
            ================================================= */}

        <header className="configuracoes-header">
          <h1>Configurações</h1>

          <p>
            Personalize sua experiência
            no aplicativo.
          </p>
        </header>

        {/* =================================================
            LEITURA BÍBLICA
            ================================================= */}

        <section className="config-card">

          <div className="config-section-header">

            <div className="config-icon config-icon-blue">
              <BookOpen
                size={21}
                strokeWidth={2}
              />
            </div>

            <div>
              <h2>
                Leitura bíblica
              </h2>

              <p>
                Ajuste o tamanho do texto
                da Bíblia.
              </p>
            </div>

          </div>

          <div className="config-divider" />

          {/* CONTROLE DA FONTE */}

          <div className="fonte-controle">

            <div className="fonte-label-row">

              <span>
                Tamanho da fonte
              </span>

              <strong>
                {tamanhoFonte}px
              </strong>

            </div>

            <div className="fonte-slider-row">

              <button
                type="button"
                className="fonte-button"
                onClick={diminuirFonte}
                disabled={
                  tamanhoFonte <=
                  FONTE_MINIMA
                }
                aria-label="Diminuir tamanho da fonte"
              >
                <Minus
                  size={17}
                  strokeWidth={2}
                />
              </button>

              <input
                type="range"
                min={FONTE_MINIMA}
                max={FONTE_MAXIMA}
                value={tamanhoFonte}
                onChange={(event) =>
                  setTamanhoFonte(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                className="fonte-range"
                aria-label="Tamanho da fonte"
              />

              <button
                type="button"
                className="fonte-button"
                onClick={aumentarFonte}
                disabled={
                  tamanhoFonte >=
                  FONTE_MAXIMA
                }
                aria-label="Aumentar tamanho da fonte"
              >
                <Plus
                  size={17}
                  strokeWidth={2}
                />
              </button>

            </div>

          </div>

          {/* PRÉ-VISUALIZAÇÃO */}

          <div className="fonte-preview">

            <span className="fonte-preview-label">
              PRÉ-VISUALIZAÇÃO
            </span>

            <p
              className="fonte-preview-text"
              style={{
                fontSize:
                  `${tamanhoFonte}px`,
              }}
            >
              Porque Deus amou o mundo
              de tal maneira que deu o
              seu Filho unigênito.
            </p>

            <span className="fonte-preview-reference">
              João 3:16
            </span>

          </div>

        </section>

        {/* =================================================
            VERSÍCULO DIÁRIO
            ================================================= */}

        <section className="config-card">

          <div className="config-section-header">

            <div className="config-icon config-icon-teal">
              <Bell
                size={21}
                strokeWidth={2}
              />
            </div>

            <div>
              <h2>
                Versículo diário
              </h2>

              <p>
                Receba a Palavra de Deus
                todos os dias.
              </p>
            </div>

          </div>

          <div className="config-divider" />

          {/* STATUS */}

          <div
            className={
              notificacoesAtivas
                ? 'notificacao-status ativa'
                : 'notificacao-status desativada'
            }
          >

            <span className="status-dot" />

            <span>
              {notificacoesAtivas
                ? 'Notificações ativadas'
                : 'Notificações desativadas'}
            </span>

            {notificacoesAtivas && (
              <span className="status-check">
                <Check
                  size={12}
                  strokeWidth={3}
                />
              </span>
            )}

          </div>

          {/* SWITCH */}

          <div className="notificacao-row">

            <div className="notificacao-textos">

              <span className="notificacao-titulo">
                Receber versículo diariamente
              </span>

              <span className="notificacao-subtitulo">
                Enviaremos uma notificação
                todos os dias.
              </span>

            </div>

            <button
              type="button"
              role="switch"
              aria-checked={
                notificacoesAtivas
              }
              className={
                notificacoesAtivas
                  ? 'config-switch ativo'
                  : 'config-switch'
              }
              onClick={
                alternarNotificacoes
              }
              aria-label="Receber versículo diariamente"
            >
              <span />
            </button>

          </div>

          <div className="config-divider horario-divider" />

          {/* HORÁRIO */}

          <div className="horario-card">
  <div className="horario-icon">
    <Clock3
      size={20}
      strokeWidth={2}
    />
  </div>

  <div className="horario-textos">
    <span>
      Horário da notificação
    </span>

    <strong>
      Todos os dias às{' '}
      {horarioNotificacao}
    </strong>
  </div>

  <ChevronRight
    size={20}
    className="horario-arrow"
  />

  <input
    type="time"
    value={horarioNotificacao}
    onChange={alterarHorario}
    className="horario-input-hidden"
    aria-label="Alterar horário da notificação"
  />
</div>

        </section>

      </div>
    </main>
  )
}