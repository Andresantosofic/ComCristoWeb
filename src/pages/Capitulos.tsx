import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Capitulos.css'

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

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function encontrarLivro(
  bible: BibleData,
  nomeLivro: string,
): BibleBook | undefined {
  const alvo = normalizarTexto(nomeLivro)

  return Object.values(bible).find(
    (livro) =>
      normalizarTexto(livro.nome) === alvo,
  )
}

function obterCapitulos(
  livro: BibleBook | undefined,
): number[] {
  if (!livro) return []

  return Object.keys(livro.capitulos ?? {})
    .map(Number)
    .filter((numero) => Number.isFinite(numero))
    .sort((a, b) => a - b)
}

export default function Capitulos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const nomeLivro =
    searchParams.get('livro') ?? ''

  const versaoParam =
    searchParams.get('versao') as BibleVersion | null

  const version: BibleVersion =
    versaoParam === 'TB' ? 'TB' : 'ACF'

  const totalCapitulosParam = Number(
    searchParams.get('totalCapitulos') ?? 0,
  )

  const [bible, setBible] =
    useState<BibleData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

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
            `Erro ao carregar ${version}`,
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
          'Não foi possível carregar os capítulos.',
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
   * LIVRO
   * ============================================================
   */

  const livro = useMemo(() => {
    if (!bible || !nomeLivro) {
      return undefined
    }

    return encontrarLivro(
      bible,
      nomeLivro,
    )
  }, [bible, nomeLivro])

  /*
   * ============================================================
   * CAPÍTULOS
   * ============================================================
   */

  const capitulos = useMemo(() => {
    const encontrados = obterCapitulos(livro)

    /*
     * Se o JSON não retornar os capítulos, usamos
     * o total recebido pela URL como fallback.
     */
    if (
      encontrados.length === 0 &&
      totalCapitulosParam > 0
    ) {
      return Array.from(
        { length: totalCapitulosParam },
        (_, index) => index + 1,
      )
    }

    return encontrados
  }, [
    livro,
    totalCapitulosParam,
  ])

  /*
   * ============================================================
   * VOLTAR
   * ============================================================
   */

  function voltar() {
    navigate('/biblia')
  }

  /*
   * ============================================================
   * ABRIR CAPÍTULO
   * ============================================================
   */

  function abrirCapitulo(
    numeroCapitulo: number,
  ) {
    if (!nomeLivro) return

    navigate(
      `/biblia/leitura?livro=${encodeURIComponent(
        nomeLivro,
      )}&capitulo=${numeroCapitulo}&versao=${version}`,
    )
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main className="capitulos-page">
      <div className="capitulos-container">

        {/* =====================================================
            TOPO
        ===================================================== */}

        <header className="capitulos-header">

          <button
            type="button"
            className="capitulos-back"
            onClick={voltar}
            aria-label="Voltar"
          >
            <ArrowLeft
              size={22}
              strokeWidth={2.2}
            />
          </button>

          <div className="capitulos-header-text">
            <h1>
              {nomeLivro || 'Bíblia'}
            </h1>

            <p>
              Selecione o capítulo
            </p>
          </div>

        </header>

        {/* =====================================================
            CONTEÚDO
        ===================================================== */}

        {loading && (
          <div className="capitulos-state">
            Carregando capítulos...
          </div>
        )}

        {!loading && error && (
          <div className="capitulos-state capitulos-state-error">

            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Tentar novamente
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          !livro &&
          capitulos.length === 0 && (
            <div className="capitulos-state">

              <strong>
                Livro não encontrado
              </strong>

              <span>
                Não foi possível localizar
                este livro na Bíblia.
              </span>

            </div>
          )}

        {!loading &&
          !error &&
          capitulos.length > 0 && (
            <section
              className="capitulos-grid"
              aria-label={`Capítulos de ${nomeLivro}`}
            >
              {capitulos.map(
                (numeroCapitulo) => (
                  <button
                    key={numeroCapitulo}
                    type="button"
                    className="capitulo-card"
                    onClick={() =>
                      abrirCapitulo(
                        numeroCapitulo,
                      )
                    }
                    aria-label={`Capítulo ${numeroCapitulo}`}
                  >
                    {numeroCapitulo}
                  </button>
                ),
              )}
            </section>
          )}

      </div>
    </main>
  )
}