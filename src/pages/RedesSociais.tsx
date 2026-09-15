import { ChevronRight, Heart } from 'lucide-react'

import './RedesSociais.css'

function abrirInstagram(username: string) {
  const appUrl = `instagram://user?username=${username}`
  const webUrl = `https://www.instagram.com/${username}/`

  const tempoInicial = Date.now()

  window.location.href = appUrl

  window.setTimeout(() => {
    if (Date.now() - tempoInicial < 1800) {
      window.location.href = webUrl
    }
  }, 1000)
}

function RedesSociais() {
  return (
    <main className="social-page">
      <section className="social-content">

        {/* =========================
            CABEÇALHO
        ========================= */}

        <header className="social-header">
          <h1>Redes Sociais</h1>

          <p>
            Conecte-se conosco e fique por dentro de
            conteúdos, mensagens e novidades dos nossos
            aplicativos.
          </p>
        </header>

        {/* =========================
            CARD DO CRIADOR
        ========================= */}

        <article className="social-card-wrapper">

          <button
            type="button"
            className="social-card"
            onClick={() =>
              abrirInstagram('andresantosofic')
            }
            aria-label="Abrir Instagram de André Santos"
          >
            <div className="social-card-main">

              <div className="social-icon social-icon-instagram">
                <svg
  className="instagram-logo"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <rect
    x="3"
    y="3"
    width="18"
    height="18"
    rx="5"
    stroke="currentColor"
    strokeWidth="2"
  />
  <circle
    cx="12"
    cy="12"
    r="4"
    stroke="currentColor"
    strokeWidth="2"
  />
  <circle
    cx="17.5"
    cy="6.5"
    r="1"
    fill="currentColor"
  />
</svg>
              </div>

              <div className="social-card-content">

                <span className="social-badge">
                  INSTAGRAM
                </span>

                <strong>
                  @andresantosofic
                </strong>

                <p>
                  Acompanhe um pouco sobre o criador do
                  aplicativo,e seus conteúdos
                </p>

              </div>

              <div className="social-arrow">
                <ChevronRight
                  size={25}
                  strokeWidth={2}
                />
              </div>

            </div>

            <div className="social-divider" />

            <div className="social-card-footer">
              <Heart
                size={20}
                fill="currentColor"
                strokeWidth={1.8}
              />

              <span>
                Um jovem cristão com grandes sonhos
              </span>
            </div>

          </button>

        </article>

        {/* =========================
            CARD DO APLICATIVO
        ========================= */}

        <article className="social-card-wrapper">

          <button
            type="button"
            className="social-card"
            onClick={() =>
              abrirInstagram('comcristoapp')
            }
            aria-label="Abrir Instagram do Com Cristo"
          >
            <div className="social-card-main">

              <div className="social-icon social-icon-app">
                <svg
  className="instagram-logo"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <rect
    x="3"
    y="3"
    width="18"
    height="18"
    rx="5"
    stroke="currentColor"
    strokeWidth="2"
  />
  <circle
    cx="12"
    cy="12"
    r="4"
    stroke="currentColor"
    strokeWidth="2"
  />
  <circle
    cx="17.5"
    cy="6.5"
    r="1"
    fill="currentColor"
  />
</svg>
              </div>

              <div className="social-card-content">

                <span className="social-badge">
                  INSTAGRAM
                </span>

                <strong>
                  @comcristoapp
                </strong>

                <p>
                  Fique por dentro das novidades sobre o
                  aplicativo
                </p>

              </div>

              <div className="social-arrow">
                <ChevronRight
                  size={25}
                  strokeWidth={2}
                />
              </div>

            </div>

            <div className="social-divider" />

            <div className="social-card-footer">
              <Heart
                size={20}
                fill="currentColor"
                strokeWidth={1.8}
              />

              <span>
                Atualizações, conteúdos e projetos do
                Com Cristo.
              </span>
            </div>

          </button>

        </article>

        {/* =========================
            RODAPÉ
        ========================= */}

        <footer className="social-footer">

          <Heart
            size={28}
            fill="currentColor"
            strokeWidth={1.8}
          />

          <p>
            Obrigado por fazer parte da nossa comunidade.
          </p>

          <span>
            Deus abençoe sua caminhada! 🤍
          </span>

        </footer>

      </section>
    </main>
  )
}

export default RedesSociais