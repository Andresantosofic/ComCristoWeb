import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
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

        {/* =========================
            CABEÇALHO
        ========================= */}

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
            CARD SOBRE O COM CRISTO
        ========================= */}

        <section className="sobre-card sobre-aplicativo-card">

          <h2>
            Sobre o Com Cristo
          </h2>

          <div className="sobre-card-divider" />

          <div className="sobre-text">

            <p>
              Meu nome é André Santos, sou cristão e criador do Com Cristo.
            </p>

            <p>
              Minha caminhada com Deus começou em 31 de julho de 2025, e foi a partir dessa transformação que nasceu o desejo de criar algo que ajudasse outras pessoas a se aproximarem da Palavra de forma simples e acessível.
            </p>

            <p>
              O Com Cristo é um aplicativo feito para ser um companheiro diário de fé — com Bíblia, versículos e devocionais que fortalecem o coração e renovam a esperança.
            </p>

            <p>
              Além do propósito espiritual, o app também tem um impacto social, levando apoio, cuidado e a Palavra de Deus a pessoas em situação de vulnerabilidade.
            </p>

            <p>
              É um projeto simples, gratuito e feito com carinho, pensado para ajudar você a caminhar mais perto de Cristo todos os dias.
            </p>

          </div>


          {/* =========================
              VERSÍCULO
          ========================= */}

          <div className="sobre-versiculo-card">

            <BookOpen
              size={24}
              className="sobre-versiculo-icon"
            />

            <p>
              “Lâmpada para os meus pés é a tua palavra,
              <br />
              e luz para o meu caminho.”
            </p>

            <strong>
              Salmos 119:105
            </strong>

          </div>

        </section>


        {/* =========================
            CARD DA VERSÃO
        ========================= */}

        <section className="sobre-versao-card">

          <div className="sobre-versao-logo">

            <Heart
              size={30}
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
            CARD DE AÇÕES
        ========================= */}

        <section className="sobre-acoes">

          <button
            type="button"
            className="sobre-acao-button"
            onClick={() =>
              navigate('/termos-privacidade')
            }
          >

            <span className="sobre-acao-icon">
              <ShieldCheck size={22} />
            </span>

            <span className="sobre-acao-text">
              Termos e Condições • Política de Privacidade
            </span>

          </button>


          <button
            type="button"
            className="sobre-acao-button"
            onClick={() =>
              navigate('/licenca-biblia')
            }
          >

            <span className="sobre-acao-icon">
              <FileText size={22} />
            </span>

            <span className="sobre-acao-text">
              Licença da Bíblia
            </span>

          </button>

        </section>

      </section>
    </main>
  )
}

export default Sobre