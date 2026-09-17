import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Mail,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './LicencaBiblia.css'

type LicencaProps = {
  sigla: string
  nome: string
  children: React.ReactNode
}

function Licenca({
  sigla,
  nome,
  children,
}: LicencaProps) {
  return (
    <section className="licenca-versao">

      <div className="licenca-versao-header">

        <div className="licenca-sigla">
          {sigla}
        </div>

        <div>
          <h2>{nome}</h2>
        </div>

      </div>

      <div className="licenca-versao-content">
        {children}
      </div>

    </section>
  )
}

function LicencaBiblia() {
  const navigate = useNavigate()
  return (
    <main className="licenca-page">
      <section className="licenca-content">

        <header className="licenca-header">
  <button
    type="button"
    className="licenca-back-button"
    onClick={() => navigate(-1)}
    aria-label="Voltar"
  >
    <ArrowLeft size={21} strokeWidth={2} />
  </button>

  <div className="licenca-header-icon">
    <BookOpen size={28} />
  </div>

  <h1>Licença da Bíblia</h1>

  <p>
    Licença e créditos das versões bíblicas
    disponibilizadas no Com Cristo.
  </p>
</header>

        <article className="licenca-card">

          <div className="licenca-intro">

            <FileText size={21} />

            <div>
              <strong>
                LICENÇA E CRÉDITOS DAS VERSÕES BÍBLICAS
              </strong>

              <span>
                Informações sobre as versões utilizadas
                pelo aplicativo.
              </span>
            </div>

          </div>

          {/* ACF */}

          <Licenca
            sigla="ACF"
            nome="ALMEIDA CORRIGIDA FIEL"
          >
            <p>
              <strong>ACF — Almeida Corrigida Fiel</strong>
            </p>

            <p>
              Sociedade Bíblica Trinitariana do Brasil.
            </p>

            <p>
              © 1994, 1995, 2007, 2011.
            </p>

            <p>
              Esta versão é utilizada de acordo com as
              condições aplicáveis de sua licença e
              direitos autorais.
            </p>
          </Licenca>

          {/* WEB */}

          <Licenca
            sigla="WEB"
            nome="WORLD ENGLISH BIBLE"
          >
            <p>
              <strong>WEB — World English Bible</strong>
            </p>

            <p>
              A World English Bible é uma tradução bíblica
              em inglês disponibilizada em domínio público.
            </p>

            <p>
              eBible.org é uma marca registrada.
            </p>

            <p>
              A utilização da versão observa as condições
              aplicáveis ao seu status de domínio público e
              às informações fornecidas pelos responsáveis
              pela obra.
            </p>
          </Licenca>

          {/* BL */}

          <Licenca
            sigla="BL"
            nome="BÍBLIA LIVRE"
          >
            <p>
              <strong>BL — Bíblia Livre</strong>
            </p>

            <p>
              Autores: Diego Santos, Mario Sérgio e
              Marco Teles.
            </p>

            <p>
              © 2018.
            </p>

            <p>
              Licenciada sob Creative Commons
              Attribution 4.0 Brasil (CC BY 4.0 Brasil).
            </p>
          </Licenca>

          {/* TB */}

          <Licenca
            sigla="TB"
            nome="TRADUÇÃO BRASILEIRA"
          >
            <p>
              <strong>
                TB — Tradução Brasileira
              </strong>
            </p>

            <p>
              Edição histórica de 1917.
            </p>

            <p>
              A versão disponibilizada corresponde à
              edição histórica utilizada pelo aplicativo.
            </p>
          </Licenca>

          {/* ALM1911 */}

          <Licenca
            sigla="1911"
            nome="ALMEIDA 1911"
          >
            <p>
              <strong>
                ALM1911 — Almeida 1911
              </strong>
            </p>

            <p>
              Edição histórica de 1911.
            </p>

            <p>
              A versão disponibilizada corresponde à
              edição histórica utilizada pelo aplicativo.
            </p>
          </Licenca>

          {/* DIREITOS */}

          <section className="licenca-info">

            <div className="licenca-info-title">
              <CheckCircle2 size={20} />

              <h2>
                Direitos e utilização
              </h2>
            </div>

            <p>
              As versões bíblicas disponibilizadas no
              aplicativo estão sujeitas aos respectivos
              direitos autorais, licenças, condições de uso
              e informações dos responsáveis por cada obra.
            </p>

            <p>
              As versões que se encontram em domínio
              público permanecem sujeitas às regras
              aplicáveis ao domínio público e às condições
              eventualmente indicadas pelos responsáveis
              pelas respectivas edições.
            </p>

            <p>
              As versões licenciadas permanecem sujeitas
              aos termos de suas respectivas licenças.
            </p>

          </section>

          {/* CONTATO */}

          <section className="licenca-contato">

            <div className="licenca-contato-icon">
              <Mail size={20} />
            </div>

            <div>
              <h2>
                Solicitações e contato
              </h2>

              <p>
                Caso algum responsável por uma obra ou
                detentor de direitos identifique qualquer
                questão relacionada à utilização de uma
                versão bíblica no aplicativo, entre em
                contato conosco.
              </p>

              <a href="mailto:contato.andresantosapps@gmail.com">
                contato.andresantosapps@gmail.com
              </a>
            </div>

          </section>

          {/* ATUALIZAÇÕES */}

          <section className="licenca-final">

            <h2>
              Atualizações
            </h2>

            <p>
              As informações desta página poderão ser
              atualizadas sempre que houver alterações nas
              versões disponibilizadas, licenças, créditos
              ou condições de utilização.
            </p>

            <div className="licenca-final-verse">
              <p>
                “Toda a Escritura é divinamente inspirada,
                e proveitosa para ensinar, para redarguir,
                para corrigir, para instruir em justiça.”
              </p>

              <strong>
                2 Timóteo 3:16
              </strong>
            </div>

          </section>

        </article>

      </section>
    </main>
  )
}

export default LicencaBiblia