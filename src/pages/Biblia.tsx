import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Search,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Biblia.css'

type BibleVersion = 'ACF' | 'TB'

type BibleBook = {
  nome: string
  capitulos: Record<string, string[]>
}

type BibleData = Record<string, BibleBook>

const ARQUIVOS_BIBLIA: Record<BibleVersion, string> = {
  ACF: '/data/biblias/ACF_OFICIAL.json',
  TB: '/data/biblias/TB.json',
}

const LIVROS_ANTIGO = [
  'Gênesis',
  'Êxodo',
  'Levítico',
  'Números',
  'Deuteronômio',
  'Josué',
  'Juízes',
  'Rute',
  '1 Samuel',
  '2 Samuel',
  '1 Reis',
  '2 Reis',
  '1 Crônicas',
  '2 Crônicas',
  'Esdras',
  'Neemias',
  'Ester',
  'Jó',
  'Salmos',
  'Provérbios',
  'Eclesiastes',
  'Cânticos',
  'Isaías',
  'Jeremias',
  'Lamentações',
  'Ezequiel',
  'Daniel',
  'Oséias',
  'Joel',
  'Amós',
  'Obadias',
  'Jonas',
  'Miquéias',
  'Naum',
  'Habacuque',
  'Sofonias',
  'Ageu',
  'Zacarias',
  'Malaquias',
]

const LIVROS_NOVO = [
  'Mateus',
  'Marcos',
  'Lucas',
  'João',
  'Atos',
  'Romanos',
  '1 Coríntios',
  '2 Coríntios',
  'Gálatas',
  'Efésios',
  'Filipenses',
  'Colossenses',
  '1 Tessalonicenses',
  '2 Tessalonicenses',
  '1 Timóteo',
  '2 Timóteo',
  'Tito',
  'Filemom',
  'Hebreus',
  'Tiago',
  '1 Pedro',
  '2 Pedro',
  '1 João',
  '2 João',
  '3 João',
  'Judas',
  'Apocalipse',
]

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function quantidadeCapitulos(livro: BibleBook): number {
  return Object.keys(livro.capitulos ?? {}).length
}

function encontrarLivroPorNome(
  livros: BibleBook[],
  nome: string,
): BibleBook | undefined {
  const alvo = normalizarTexto(nome)

  return livros.find(
    (livro) => normalizarTexto(livro.nome) === alvo,
  )
}

function organizarLivros(
  bible: BibleData,
): {
  antigo: BibleBook[]
  novo: BibleBook[]
} {
  const todos = Object.values(bible)

  const antigo = LIVROS_ANTIGO
    .map((nome) => encontrarLivroPorNome(todos, nome))
    .filter((livro): livro is BibleBook => Boolean(livro))

  const novo = LIVROS_NOVO
    .map((nome) => encontrarLivroPorNome(todos, nome))
    .filter((livro): livro is BibleBook => Boolean(livro))

  return {
    antigo,
    novo,
  }
}

function LivroCard({
  livro,
  onClick,
}: {
  livro: BibleBook
  onClick: () => void
}) {
  const totalCapitulos = quantidadeCapitulos(livro)

  return (
    <button
      type="button"
      className="biblia-livro-card"
      onClick={onClick}
      aria-label={`Abrir ${livro.nome}`}
    >
      <span className="biblia-livro-icon">
        <BookOpen size={26} strokeWidth={2.1} />
      </span>

      <span className="biblia-livro-content">
        <strong>{livro.nome}</strong>

        <span>
          {totalCapitulos}{' '}
          {totalCapitulos === 1 ? 'capítulo' : 'capítulos'}
        </span>
      </span>

      <ChevronRight
        className="biblia-livro-arrow"
        size={21}
        strokeWidth={2.2}
      />
    </button>
  )
}

export default function Biblia() {
  const navigate = useNavigate()

  const [bible, setBible] = useState<BibleData | null>(null)

  const [version, setVersion] =
    useState<BibleVersion>('ACF')

  const [mostrandoVelho, setMostrandoVelho] =
    useState(true)

  const [busca, setBusca] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /*
   * ============================================================
   * CARREGAR BÍBLIA
   * ============================================================
   */

  useEffect(() => {
    let cancelado = false

    async function carregarBiblia() {
      setLoading(true)
      setError('')

      try {
        const resposta = await fetch(
          ARQUIVOS_BIBLIA[version],
        )

        if (!resposta.ok) {
          throw new Error(
            `Não foi possível carregar a versão ${version}.`,
          )
        }

        const dados =
          (await resposta.json()) as BibleData

        if (cancelado) return

        setBible(dados)
      } catch (erro) {
        console.error(
          'Erro ao carregar Bíblia:',
          erro,
        )

        if (cancelado) return

        setBible(null)

        setError(
          'Não foi possível carregar a Bíblia. Tente novamente.',
        )
      } finally {
        if (!cancelado) {
          setLoading(false)
        }
      }
    }

    carregarBiblia()

    return () => {
      cancelado = true
    }
  }, [version])

  /*
   * ============================================================
   * ORGANIZAÇÃO DOS LIVROS
   * ============================================================
   */

  const livrosOrganizados = useMemo(() => {
    if (!bible) {
      return {
        antigo: [],
        novo: [],
      }
    }

    return organizarLivros(bible)
  }, [bible])

  const livrosAtuais = mostrandoVelho
    ? livrosOrganizados.antigo
    : livrosOrganizados.novo

  /*
   * ============================================================
   * BUSCA
   * ============================================================
   */

  const filtro = normalizarTexto(busca)

  const livrosFiltrados = useMemo(() => {
    if (!filtro) {
      return livrosAtuais
    }

    return livrosAtuais.filter((livro) =>
      normalizarTexto(livro.nome).includes(filtro),
    )
  }, [livrosAtuais, filtro])

  /*
   * ============================================================
   * MUDAR TESTAMENTO
   * ============================================================
   */

  function selecionarAntigoTestamento() {
    setMostrandoVelho(true)
  }

  function selecionarNovoTestamento() {
    setMostrandoVelho(false)
  }

  /*
   * ============================================================
   * ABRIR LIVRO
   * ============================================================
   */

  function abrirLivro(livro: BibleBook) {
    const totalCapitulos =
      quantidadeCapitulos(livro)

    navigate(
      `/biblia/capitulos?livro=${encodeURIComponent(
        livro.nome,
      )}&totalCapitulos=${totalCapitulos}&versao=${version}`,
    )
  }

  /*
   * ============================================================
   * BUSCA AUTOMÁTICA DO TESTAMENTO
   * ============================================================
   */

  useEffect(() => {
    if (!filtro) return

    const existeNoAntigo =
      livrosOrganizados.antigo.some((livro) =>
        normalizarTexto(livro.nome).includes(filtro),
      )

    const existeNoNovo =
      livrosOrganizados.novo.some((livro) =>
        normalizarTexto(livro.nome).includes(filtro),
      )

    if (existeNoNovo && mostrandoVelho) {
      setMostrandoVelho(false)
    } else if (existeNoAntigo && !mostrandoVelho) {
      setMostrandoVelho(true)
    }
  }, [
    filtro,
    livrosOrganizados,
    mostrandoVelho,
  ])

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main className="biblia-page">
      <div className="biblia-container">

        {/* =====================================================
            TÍTULO
        ===================================================== */}

        <header className="biblia-list-header">
  <button
    type="button"
    className="biblia-header-back"
    onClick={() => navigate('/')}
    aria-label="Voltar"
  >
    <ArrowLeft size={24} strokeWidth={2.2} />
  </button>

  <h1>Bíblia Sagrada</h1>
</header>

        {/* =====================================================
            BUSCA
        ===================================================== */}

        <div className="biblia-search">
          <Search
            size={22}
            strokeWidth={2}
            aria-hidden="true"
          />

          <input
            type="text"
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Buscar livro, capítulo ou versículo"
            aria-label="Buscar livro"
          />
        </div>

        {/* =====================================================
            BOTÕES TESTAMENTO
        ===================================================== */}

        <div className="biblia-testamentos">
          <button
            type="button"
            className={
              mostrandoVelho
                ? 'biblia-testamento active'
                : 'biblia-testamento'
            }
            onClick={
              selecionarAntigoTestamento
            }
          >
            Antigo Testamento
          </button>

          <button
            type="button"
            className={
              !mostrandoVelho
                ? 'biblia-testamento active'
                : 'biblia-testamento'
            }
            onClick={
              selecionarNovoTestamento
            }
          >
            Novo Testamento
          </button>
        </div>

        {/* =====================================================
            TÍTULO DA LISTA
        ===================================================== */}

        <div className="biblia-section-title">
          <span />

          <h2>
            {mostrandoVelho
              ? 'Livros do Antigo Testamento'
              : 'Livros do Novo Testamento'}
          </h2>
        </div>

        {/* =====================================================
            CONTEÚDO
        ===================================================== */}

        {loading && (
          <div className="biblia-state">
            Carregando Bíblia...
          </div>
        )}

        {!loading && error && (
          <div className="biblia-state biblia-state-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                setVersion((atual) =>
                  atual === 'ACF' ? 'TB' : 'ACF',
                )
              }
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          livrosFiltrados.length === 0 && (
            <div className="biblia-state">
              <BookOpen size={38} />

              <strong>
                Nenhum livro encontrado
              </strong>

              <span>
                Tente buscar por outro nome.
              </span>
            </div>
          )}

        {!loading &&
          !error &&
          livrosFiltrados.length > 0 && (
            <section
              className="biblia-livros"
              aria-label={
                mostrandoVelho
                  ? 'Livros do Antigo Testamento'
                  : 'Livros do Novo Testamento'
              }
            >
              {livrosFiltrados.map((livro) => (
                <LivroCard
                  key={livro.nome}
                  livro={livro}
                  onClick={() =>
                    abrirLivro(livro)
                  }
                />
              ))}
            </section>
          )}
      </div>
    </main>
  )
}