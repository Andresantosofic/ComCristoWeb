import {
  BookOpen,
  Minus,
  Plus,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'

import './Configuracoes.css'

/* =========================================================
   CHAVES DO LOCALSTORAGE
   ========================================================= */

const STORAGE_FONTE =
  'comcristo_tamanho_fonte'

/* =========================================================
   LIMITES DA FONTE
   ========================================================= */

const FONTE_MINIMA = 14
const FONTE_MAXIMA = 32
const FONTE_PADRAO = 16

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

      </div>
    </main>
  )
}