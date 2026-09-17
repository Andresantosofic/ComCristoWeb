import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  FileText,
  Heart,
  ShieldCheck,
} from 'lucide-react'
import './Sobre.css'

function Sobre() {
  const navigate = useNavigate()

  return (
    <main className="sobre-page">
      <section className="sobre-content">

        <header className="sobre-header">

  <div className="sobre-header-top">

    <button
      type="button"
      className="sobre-back-button"
      onClick={() => navigate(-1)}
      aria-label="Voltar"
    >
      <ArrowLeft
        size={21}
        strokeWidth={2}
      />
    </button>

    <h1>Sobre</h1>

  </div>

  <p>
    Saiba mais sobre o aplicativo Com Cristo.
  </p>

</header>

        {/* =========================
            SOBRE O APLICATIVO
        ========================= */}

        <section className="sobre-card sobre-aplicativo-card">

          <div className="sobre-card-heading">
            <div className="sobre-heading-icon">
              <Heart
                size={24}
                fill="currentColor"
              />
            </div>

            <h2>Sobre o Com Cristo 🤍</h2>
          </div>

          <div className="sobre-text">

            <p>
              Meu nome é André Santos, sou cristão e
              criador do Com Cristo.
            </p>

            <p>
              Minha caminhada com Deus começou em 31 de
              julho de 2025, e foi a partir dessa
              transformação que nasceu o desejo de criar
              algo que ajudasse outras pessoas a se
              aproximarem da Palavra de forma simples e
              acessível.
            </p>

            <p>
              O Com Cristo é um aplicativo feito para ser
              um companheiro diário de fé — com Bíblia,
              versículos e devocionais que fortalecem o
              coração e renovam a esperança.
            </p>

            <p>
              Além do propósito espiritual, o app também
              tem um impacto social, levando apoio,
              cuidado e a Palavra de Deus a pessoas em
              situação de vulnerabilidade.
            </p>

            <p>
              É um projeto simples, gratuito e feito com
              carinho, pensado para ajudar você a caminhar
              mais perto de Cristo todos os dias.
            </p>

          </div>

        </section>

        {/* =========================
            VERSÍCULO
        ========================= */}

        <section className="sobre-versiculo-card">

          <BookOpen
            size={24}
            className="sobre-versiculo-icon"
          />

          <p>
            “Lâmpada para os meus pés é a tua palavra,
            <br />
            e luz para o meu caminho.”
          </p>

          <strong>Salmos 119:105</strong>

        </section>

        {/* =========================
            VERSÃO
        ========================= */}

        <section className="sobre-versao-card">

          <div className="sobre-versao-logo">
            <Heart
              size={22}
              fill="currentColor"
            />
          </div>

          <div>
            <strong>
              Com Cristo • Versão 2.0
            </strong>

            <span>
              Desenvolvido por André Santos
            </span>
          </div>

        </section>

        {/* =========================
            DOCUMENTOS
        ========================= */}

        <section className="sobre-documentos">

          <button
            type="button"
            className="sobre-documento"
            onClick={() =>
              navigate('/termos-privacidade')
            }
          >
            <div className="sobre-documento-icon sobre-termos-icon">
              <ShieldCheck size={22} />
            </div>

            <div className="sobre-documento-content">
              <strong>
                Termos e Condições
              </strong>

              <span>
                Política de Privacidade
              </span>
            </div>

            <ChevronRight
              size={21}
              className="sobre-documento-arrow"
            />
          </button>

          <button
            type="button"
            className="sobre-documento"
            onClick={() =>
              navigate('/licenca-biblia')
            }
          >
            <div className="sobre-documento-icon sobre-licenca-icon">
              <FileText size={22} />
            </div>

            <div className="sobre-documento-content">
              <strong>
                Licença da Bíblia
              </strong>

              <span>
                Licenças e créditos das versões bíblicas
              </span>
            </div>

            <ChevronRight
              size={21}
              className="sobre-documento-arrow"
            />
          </button>

        </section>

      </section>
    </main>
  )
}

export default Sobre