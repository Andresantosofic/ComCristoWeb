import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Edit3,
  User,
  X,
} from 'lucide-react'
import './MeuPerfil.css'


type Sexo = 'Não informar' | 'Masculino' | 'Feminino'

const NOME_KEY = 'comcristo_nome_usuario'
const SEXO_KEY = 'comcristo_sexo'
const IDADE_KEY = 'comcristo_idade'
const DEVOCIONAIS_KEY = 'comcristo_devocionais_concluidos'
const AVATAR_KEY = 'comcristo_avatar'

function MeuPerfil() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('Filho(a) de Deus')
  const [sexo, setSexo] = useState<Sexo>('Não informar')
  const [idade, setIdade] = useState('')
  const [diasComoUsuario, setDiasComoUsuario] = useState(0)

  const [devocionaisConcluidos, setDevocionaisConcluidos] =
    useState(0)

  const [streak, setStreak] = useState(0)

  const [avatar, setAvatar] = useState<string | null>(null)

  const [modalAberto, setModalAberto] = useState(false)

  const [nomeEditado, setNomeEditado] = useState('')
  const [idadeEditada, setIdadeEditada] = useState('')
  const [sexoEditado, setSexoEditado] =
    useState<Sexo>('Não informar')

  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    carregarPerfil()
    carregarProgresso()
    calcularTempoDeUso()
  }, [])

  function carregarPerfil() {
    const nomeSalvo =
      localStorage.getItem(NOME_KEY)

    const sexoSalvo =
      localStorage.getItem(SEXO_KEY)

    const idadeSalva =
      localStorage.getItem(IDADE_KEY)

    const avatarSalvo =
      localStorage.getItem(AVATAR_KEY)

    const nomeFinal =
  nomeSalvo || 'Filho(a) de Deus'

setNome(nomeFinal)

    if (
      sexoSalvo === 'Masculino' ||
      sexoSalvo === 'Feminino' ||
      sexoSalvo === 'Não informar'
    ) {
      setSexo(sexoSalvo)
    }

    if (idadeSalva) {
      setIdade(idadeSalva)
    }

    if (avatarSalvo) {
      setAvatar(avatarSalvo)
    }
  }

  function carregarProgresso() {
    const dados =
      localStorage.getItem(DEVOCIONAIS_KEY)

    if (!dados) {
      setDevocionaisConcluidos(0)
      setStreak(0)
      return
    }

    try {
      const valores = JSON.parse(dados)

      if (Array.isArray(valores)) {
        setDevocionaisConcluidos(
          valores.length,
        )

        calcularSequencia(valores)

        return
      }

      if (
        typeof valores === 'object' &&
        valores !== null
      ) {
        const concluidos =
          Object.entries(valores)
            .filter(([, valor]) => valor === true)
            .map(([chave]) => chave)

        setDevocionaisConcluidos(
          concluidos.length,
        )

        calcularSequencia(concluidos)
      }
    } catch {
      setDevocionaisConcluidos(0)
      setStreak(0)
    }
  }

  function calcularSequencia(
    dias: string[],
  ) {
    if (!dias.length) {
      setStreak(0)
      return
    }

    const datas = dias
      .map((item) => {
        const data = new Date(item)

        if (!Number.isNaN(data.getTime())) {
          return data
        }

        const match =
          item.match(/^(\d{2})-(\d{2})$/)

        if (match) {
          const ano =
            new Date().getFullYear()

          return new Date(
            ano,
            Number(match[1]) - 1,
            Number(match[2]),
          )
        }

        return null
      })
      .filter(
        (data): data is Date =>
          data !== null,
      )
      .sort(
        (a, b) =>
          b.getTime() - a.getTime(),
      )

    if (!datas.length) {
      setStreak(0)
      return
    }

    const hoje = new Date()

    hoje.setHours(0, 0, 0, 0)

    const ultimaData =
      new Date(datas[0])

    ultimaData.setHours(0, 0, 0, 0)

    const diferencaHoje =
      Math.floor(
        (hoje.getTime() -
          ultimaData.getTime()) /
          (1000 * 60 * 60 * 24),
      )

    if (diferencaHoje > 1) {
      setStreak(0)
      return
    }

    let sequencia = 1

    for (
      let i = 1;
      i < datas.length;
      i++
    ) {
      const atual =
        new Date(datas[i - 1])

      const anterior =
        new Date(datas[i])

      atual.setHours(0, 0, 0, 0)
      anterior.setHours(0, 0, 0, 0)

      const diferenca =
        Math.floor(
          (atual.getTime() -
            anterior.getTime()) /
            (1000 * 60 * 60 * 24),
        )

      if (diferenca === 1) {
        sequencia++
      } else if (diferenca > 1) {
        break
      }
    }

    setStreak(sequencia)
  }

  function calcularTempoDeUso() {
    const PRIMEIRO_ACESSO_KEY =
      'comcristo_primeiro_acesso'

    let primeiroAcesso =
      localStorage.getItem(
        PRIMEIRO_ACESSO_KEY,
      )

    if (!primeiroAcesso) {
      primeiroAcesso =
        String(Date.now())

      localStorage.setItem(
        PRIMEIRO_ACESSO_KEY,
        primeiroAcesso,
      )
    }

    const inicio =
      new Date(Number(primeiroAcesso))

    const hoje = new Date()

    inicio.setHours(0, 0, 0, 0)
    hoje.setHours(0, 0, 0, 0)

    const diferenca =
      Math.floor(
        (hoje.getTime() -
          inicio.getTime()) /
          (1000 * 60 * 60 * 24),
      )

    setDiasComoUsuario(
      Math.max(1, diferenca + 1),
    )
  }

  function abrirEdicao() {
    setNomeEditado(nome)
    setIdadeEditada(idade)
    setSexoEditado(sexo)

    setModalAberto(true)
  }

  function salvarPerfil() {
    const novoNome =
  nomeEditado.trim() || 'Filho(a) de Deus'

    const novaIdade =
      idadeEditada.trim()

    localStorage.setItem(
      NOME_KEY,
      novoNome,
    )

    localStorage.setItem(
      SEXO_KEY,
      sexoEditado,
    )

    localStorage.setItem(
      IDADE_KEY,
      novaIdade,
    )

    setNome(novoNome)
    setSexo(sexoEditado)
    setIdade(novaIdade)

    setModalAberto(false)

    window.dispatchEvent(
      new Event(
        'comcristo:perfil-atualizado',
      ),
    )
  }

  function selecionarFoto(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      event.target.files?.[0]

    if (!arquivo) {
      return
    }

    if (!arquivo.type.startsWith('image/')) {
      return
    }

    const leitor = new FileReader()

    leitor.onload = () => {
      if (
        typeof leitor.result !==
        'string'
      ) {
        return
      }

      const foto = leitor.result

      setAvatar(foto)

      localStorage.setItem(
        AVATAR_KEY,
        foto,
      )

      localStorage.setItem(
        'comcristo_foto_perfil',
        foto,
      )

      window.dispatchEvent(
        new Event(
          'comcristo:perfil-atualizado',
        ),
      )
    }

    leitor.readAsDataURL(arquivo)

    event.target.value = ''
  }

  return (
  <main className="perfil-page">

    <button
      type="button"
      className="perfil-back-button"
      onClick={() => navigate(-1)}
      aria-label="Voltar"
    >
      <ArrowLeft
        size={22}
        strokeWidth={2.2}
      />
    </button>

    <section className="perfil-content">

        {/* =========================
            FOTO
        ========================= */}

        <div className="perfil-avatar-wrapper">

          <div className="perfil-avatar-ring">

            {avatar ? (
              <img
                src={avatar}
                alt="Foto de perfil"
                className="perfil-avatar"
              />
            ) : (
              <div className="perfil-avatar-placeholder">
                <User
                  size={58}
                  strokeWidth={1.6}
                />
              </div>
            )}

          </div>

          <button
            type="button"
            className="perfil-camera-button"
            aria-label="Alterar foto"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <Camera
              size={22}
              strokeWidth={2.3}
            />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="perfil-file-input"
            onChange={selecionarFoto}
          />

        </div>

        {/* =========================
            IDENTIDADE
        ========================= */}

        <div className="perfil-identidade">

          <h1>{nome}</h1>

          <p>
            Filho de Deus em caminhada
            com Cristo ✝️
          </p>

          <button
            type="button"
            className="perfil-editar-button"
            onClick={abrirEdicao}
          >
            <Edit3
              size={18}
              strokeWidth={2}
            />

            <span>Editar perfil</span>
          </button>

        </div>

        {/* =========================
            PROGRESSO
        ========================= */}

        <section className="perfil-card perfil-progresso-card">

          <div className="perfil-card-title">
            <h2>Progresso espiritual</h2>
            <span />
          </div>

          <div className="perfil-estatisticas">

            <div className="perfil-estatistica">
              <strong>
                {devocionaisConcluidos}
              </strong>

              <span>
                Devocionais
                <br />
                concluídos
              </span>
            </div>

            <div className="perfil-divisor" />

            <div className="perfil-estatistica">
              <strong>
                {streak}
              </strong>

              <span>
                Sequência
                <br />
                atual
              </span>
            </div>

          </div>

        </section>

        {/* =========================
            INFORMAÇÕES
        ========================= */}

        <section className="perfil-card perfil-info-card">

          <div className="perfil-card-title">
            <h2>Informações do perfil</h2>
            <span />
          </div>

          <div className="perfil-info-list">

            <div className="perfil-info-row">
              <span>Sexo</span>

              <strong>
                {sexo}
              </strong>
            </div>

            <div className="perfil-info-row">
              <span>Idade</span>

              <strong>
                {idade
                  ? `${idade} anos`
                  : 'Não informado'}
              </strong>
            </div>

            <div className="perfil-info-row">
              <span>Tempo de uso</span>

              <strong>
                Usuário há{' '}
                {diasComoUsuario} dias
              </strong>
            </div>

          </div>

        </section>

      </section>

      {/* =========================
          MODAL / EDITAR PERFIL
      ========================= */}

      {modalAberto && (
        <div
          className="perfil-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setModalAberto(false)
            }
          }}
        >
          <div className="perfil-modal">

            <div className="perfil-modal-header">

              <div>
                <h2>Editar perfil</h2>

                <p>
                  Atualize suas informações.
                </p>
              </div>

              <button
                type="button"
                className="perfil-modal-close"
                onClick={() =>
                  setModalAberto(false)
                }
                aria-label="Fechar"
              >
                <X size={21} />
              </button>

            </div>

            <div className="perfil-form">

              <label>
                <span>Nome</span>

                <input
                  type="text"
                  value={nomeEditado}
                  onChange={(event) =>
                    setNomeEditado(
                      event.target.value,
                    )
                  }
                  placeholder="Digite seu nome"
                />
              </label>

              <label>
                <span>Idade</span>

                <input
                  type="number"
                  min="0"
                  max="120"
                  value={idadeEditada}
                  onChange={(event) =>
                    setIdadeEditada(
                      event.target.value,
                    )
                  }
                  placeholder="Digite sua idade"
                />
              </label>

              <label>
                <span>Sexo</span>

                <div className="perfil-select-wrapper">

                  <select
                    value={sexoEditado}
                    onChange={(event) =>
                      setSexoEditado(
                        event.target.value as Sexo,
                      )
                    }
                  >
                    <option value="Não informar">
                      Não informar
                    </option>

                    <option value="Masculino">
                      Masculino
                    </option>

                    <option value="Feminino">
                      Feminino
                    </option>
                  </select>

                  <ChevronDown size={18} />

                </div>
              </label>

            </div>

            <div className="perfil-modal-actions">

              <button
                type="button"
                className="perfil-cancelar"
                onClick={() =>
                  setModalAberto(false)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="perfil-salvar"
                onClick={salvarPerfil}
              >
                <Check size={18} />
                Salvar
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  )
}

export default MeuPerfil