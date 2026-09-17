import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import './Sugestao.css'

function Feedback() {
  const navigate = useNavigate()

  const [mensagem, setMensagem] = useState('')

  function enviarFeedback() {
    const texto = mensagem.trim()

    if (!texto) {
      window.alert(
        'Escreva sua sugestão antes de enviar 🙏',
      )
      return
    }

    const nome =
      localStorage.getItem('comcristo_nome_usuario') ||
      'Não informado'

    const assunto = 'Mensagem / Usuário do App'

    const corpo = `Seu Nome: ${nome}
Seu Aparelho: Navegador Web

${texto}

---
Enviado pelo app Com Cristo`

    const mailto =
      `mailto:contato.andresantosapps@gmail.com` +
      `?subject=${encodeURIComponent(assunto)}` +
      `&body=${encodeURIComponent(corpo)}`

    window.location.href = mailto
  }

  return (
    <main className="feedback-page">
      <section className="feedback-content">

        <header className="feedback-header">

  <div className="feedback-header-top">

    <button
      type="button"
      className="feedback-back-button"
      onClick={() => navigate(-1)}
      aria-label="Voltar"
    >
      <ArrowLeft
        size={21}
        strokeWidth={2}
      />
    </button>

    <h1>Enviar Feedback</h1>

  </div>

</header>

        <section className="feedback-card">

          <div className="feedback-card-content">

            <h2>
              Deixe sua sugestão, opinião ou crítica!
            </h2>

            <p>
              Você pode nos dizer o que devemos
              implementar nas próximas atualizações ou
              o que podemos melhorar.
            </p>

            <p>
              Sua opinião é muito importante para nós. 🙏
            </p>

          </div>

          <label
            htmlFor="feedback-mensagem"
            className="feedback-label"
          >
            Sua mensagem
          </label>

          <textarea
            id="feedback-mensagem"
            value={mensagem}
            onChange={(event) =>
              setMensagem(event.target.value)
            }
            placeholder="Digite sua sugestão aqui..."
            maxLength={2000}
          />

          <div className="feedback-counter">
            {mensagem.length}/2000
          </div>

          <button
            type="button"
            className="feedback-submit"
            onClick={enviarFeedback}
          >
            <Send size={19} />
            <span>ENVIAR FEEDBACK</span>
          </button>

        </section>

        <footer className="feedback-footer">
          <Mail size={18} />

          <p>
            Seu feedback nos ajuda a melhorar cada vez
            mais o aplicativo Com Cristo.
          </p>
        </footer>

      </section>
    </main>
  )
}

export default Feedback