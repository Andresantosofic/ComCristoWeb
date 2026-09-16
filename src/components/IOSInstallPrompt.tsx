import { useEffect, useState } from 'react'
import { Share, X } from 'lucide-react'
import './IOSInstallPrompt.css'

export default function IOSInstallPrompt() {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const userAgent = window.navigator.userAgent

      const isIOS =
        /iPad|iPhone|iPod/.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone ===
          true

      const jaViu =
        localStorage.getItem('comcristo_ios_install_prompt') === 'true'

      if (isIOS && !isStandalone && !jaViu) {
        setMostrar(true)
      }
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [])

  const fechar = () => {
    localStorage.setItem('comcristo_ios_install_prompt', 'true')
    setMostrar(false)
  }

  if (!mostrar) {
    return null
  }

  return (
    <div className="ios-install-overlay">
      <div className="ios-install-card">
        <button
          type="button"
          className="ios-install-close"
          onClick={fechar}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <div className="ios-install-icon">
          <img
            src="/images/logo_app.png"
            alt="Com Cristo"
          />
        </div>

        <h2>Tenha o Com Cristo na Tela de Início</h2>

        <p>
          Adicione o Com Cristo à Tela de Início do seu iPhone
          para acessar de forma rápida, como um aplicativo.
        </p>

        <div className="ios-install-steps">
          <div className="ios-install-step">
            <span>1</span>

            <div>
              <strong>Toque em Compartilhar</strong>

              <small>
                Use o botão de compartilhar do Safari.
              </small>

              <div className="ios-share-example">
                <Share size={18} />
                <span>Compartilhar</span>
              </div>
            </div>
          </div>

          <div className="ios-install-step">
            <span>2</span>

            <div>
              <strong>Toque em “Adicionar à Tela de Início”</strong>

              <small>
                Talvez seja necessário deslizar o menu para encontrar essa opção.
              </small>
            </div>
          </div>

          <div className="ios-install-step">
            <span>3</span>

            <div>
              <strong>Toque em “Adicionar”</strong>

              <small>
                Pronto! O Com Cristo aparecerá na sua Tela de Início.
              </small>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="ios-install-button"
          onClick={fechar}
        >
          Entendi
        </button>
      </div>
    </div>
  )
}