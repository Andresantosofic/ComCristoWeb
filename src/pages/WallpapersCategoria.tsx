import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  observarCategoriasWallpapers,
  observarWallpapers,
  type CategoriaWallpaper,
  type Wallpaper,
} from '../services/wallpaperService'

import './WallpapersCategoria.css'

export default function WallpapersCategoria() {
  const navigate = useNavigate()
  const { categoriaId } = useParams<{ categoriaId: string }>()

  const [categoria, setCategoria] =
    useState<CategoriaWallpaper | null>(null)

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!categoriaId) {
      setCarregando(false)
      return
    }

    let categoriasCarregadas = false
    let wallpapersCarregados = false

    const verificarCarregamento = () => {
      if (categoriasCarregadas && wallpapersCarregados) {
        setCarregando(false)
      }
    }

    const cancelarCategorias = observarCategoriasWallpapers(
      (categorias) => {
        const encontrada = categorias.find(
          (item) => item.id === categoriaId,
        )

        setCategoria(encontrada ?? null)

        categoriasCarregadas = true
        verificarCarregamento()
      },
      (error) => {
        console.error(
          'Erro ao carregar categoria de wallpapers:',
          error,
        )

        categoriasCarregadas = true
        verificarCarregamento()
      },
    )

    const cancelarWallpapers = observarWallpapers(
      (dados) => {
        const daCategoria = dados
          .filter(
            (wallpaper) =>
              wallpaper.categoriaId === categoriaId,
          )
          .sort((a, b) => a.ordem - b.ordem)

        setWallpapers(daCategoria)

        wallpapersCarregados = true
        verificarCarregamento()
      },
      (error) => {
        console.error(
          'Erro ao carregar wallpapers da categoria:',
          error,
        )

        wallpapersCarregados = true
        verificarCarregamento()
      },
    )

    return () => {
      cancelarCategorias()
      cancelarWallpapers()
    }
  }, [categoriaId])

  const voltar = () => {
    navigate('/wallpapers')
  }

  if (carregando) {
    return (
      <main className="wallpapers-categoria-page">
        <section className="wallpapers-categoria-content">
          <div className="wallpapers-categoria-loading">
            <p>Carregando wallpapers...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!categoria) {
    return (
      <main className="wallpapers-categoria-page">
        <section className="wallpapers-categoria-content">
          <header className="wallpapers-categoria-header">
            <button
              type="button"
              className="wallpapers-categoria-back"
              onClick={voltar}
              aria-label="Voltar"
            >
              <ArrowLeft size={22} />
            </button>

            <h1>Categoria não encontrada</h1>
          </header>
        </section>
      </main>
    )
  }

  return (
    <main className="wallpapers-categoria-page">
      <section className="wallpapers-categoria-content">

        <header className="wallpapers-categoria-header">
          <button
            type="button"
            className="wallpapers-categoria-back"
            onClick={voltar}
            aria-label="Voltar"
          >
            <ArrowLeft size={22} />
          </button>

          <h1>{categoria.nome}</h1>
        </header>

        {wallpapers.length === 0 ? (
          <div className="wallpapers-categoria-empty">
            <h2>Nenhum wallpaper disponível</h2>

            <p>
              Ainda não há wallpapers nesta categoria.
            </p>
          </div>
        ) : (
          <div className="wallpapers-categoria-grid">
            {wallpapers.map((wallpaper) => (
              <button
                type="button"
                className="wallpapers-categoria-item"
                key={wallpaper.id}
                onClick={() =>
                  navigate(`/wallpapers/${wallpaper.id}`)
                }
                aria-label={wallpaper.titulo}
              >
                <img
                  src={wallpaper.imagem}
                  alt={wallpaper.titulo}
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}

      </section>
    </main>
  )
}