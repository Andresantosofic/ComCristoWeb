import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Copy,
  CreditCard,
  Heart,
  Megaphone,
  Smartphone,
} from 'lucide-react'
import './Ofertas.css'

function Ofertas() {
  const navigate = useNavigate()

  const [pixCopiado, setPixCopiado] = useState(false)

  const chavePix = 'comcristoapp@gmail.com'

  const copiarChavePix = async () => {
    try {
      await navigator.clipboard.writeText(chavePix)

      setPixCopiado(true)

      setTimeout(() => {
        setPixCopiado(false)
      }, 2500)
    } catch {
      alert('Não foi possível copiar a chave Pix.')
    }
  }

  const abrirPagamentoCartao = () => {
    window.open(
      'https://link.mercadopago.com.br/andresantosdsn',
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <main className="ofertas-page">

      <section className="ofertas-content">

        {/* VOLTAR */}

        <button
          type="button"
          className="ofertas-back-button"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <ArrowLeft size={21} strokeWidth={2.5} />
        </button>

        {/* TÍTULO */}

        <section className="ofertas-intro">

          <h1>
            Faça parte desta missão
          </h1>

          <p>
            Seu apoio ajuda a manter o aplicativo e
            transformar vidas através da Palavra de Deus.
          </p>

        </section>

        {/* CARD PRINCIPAL */}

        <section className="ofertas-missao-card">

          <div className="ofertas-heart">

            <Heart
              size={72}
              strokeWidth={1.8}
              fill="currentColor"
            />

          </div>

          <div className="ofertas-missao-text">

            <p>
              Enquanto você lê isso, existem vidas precisando
              de esperança. Este é um projeto cristão
              independente, e o seu apoio ajuda a manter o
              aplicativo, levar a Palavra de Deus, e manter nosso projeto de caridade.
            </p>

            <p>
              Nosso propósito é espalhar o Evangelho e
              transformar vidas — e você pode fazer parte disso.
              Não é apenas uma doação, é transformação de vidas.
              Você poderá acompanhar cada ação pelas redes
              sociais.
            </p>

          </div>

        </section>

        {/* FORMAS DE APOIO */}

        <section className="ofertas-apoio-card">

          <h2>
            Formas de apoio
          </h2>

          {/* PIX */}

          <div className="ofertas-metodo">

            <div className="ofertas-metodo-icon">
              <Smartphone
                size={38}
                strokeWidth={2}
              />
            </div>

            <div className="ofertas-metodo-info">

              <h3>PIX</h3>

              <p className="ofertas-pix-chave">
                {chavePix}
              </p>

            </div>

          </div>

          <button
            type="button"
            className="ofertas-action-button"
            onClick={copiarChavePix}
          >
            {pixCopiado ? (
              <>
                <Check size={18} />
                <span>CHAVE PIX COPIADA</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>COPIAR CHAVE PIX</span>
              </>
            )}
          </button>

          <p className="ofertas-metodo-description">
            Copie a Chave Pix clicando no botão acima.
            Todo valor é bem-vindo e utilizado com
            responsabilidade e propósito.
          </p>

          {/* DIVISOR */}

          <div className="ofertas-divider" />

          <div className="ofertas-ou">
            OU
          </div>

          {/* CARTÃO */}

          <div className="ofertas-metodo">

            <div className="ofertas-metodo-icon">
              <CreditCard
                size={38}
                strokeWidth={2}
              />
            </div>

            <div className="ofertas-metodo-info">

              <h3>
                Cartão de Débito e Crédito
              </h3>

              <p>
                Contribua de forma rápida e segura.
              </p>

            </div>

          </div>

          <button
            type="button"
            className="ofertas-action-button"
            onClick={abrirPagamentoCartao}
          >
            <CreditCard size={18} />
            <span>APOIAR COM CARTÃO</span>
          </button>

          <p className="ofertas-metodo-description">
            Pagamento seguro através do Mercado Pago.
          </p>

        </section>

        {/* DIVULGAÇÃO */}

        <section className="ofertas-divulgacao-card">

          <Megaphone size={22} />

          <p>
            Compartilhar o aplicativo também é uma forma
            de apoio. Quanto mais pessoas conhecerem o
            Com Cristo, mais vidas poderão ser alcançadas.
          </p>

        </section>

      </section>

    </main>
  )
}

export default Ofertas