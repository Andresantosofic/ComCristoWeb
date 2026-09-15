import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, PackageOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  observarCategoriasWallpapers,
  observarWallpapers,
  type CategoriaWallpaper,
  type Wallpaper,
} from '../services/wallpaperService'

import './Wallpapers.css'

export default function Wallpapers() {
  const navigate = useNavigate()

  const [categorias, setCategorias] = useState<CategoriaWallpaper[]>([])
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let categoriasCarregadas = false
    let wallpapersCarregados = false

    const verificarCarregamento = () => {
      if (categoriasCarregadas && wallpapersCarregados) {
        setCarregando(false)
      }
    }

    const cancelarCategorias = observarCategoriasWallpapers(
      (dados) => {
        setCategorias(dados)
        categoriasCarregadas = true
        verificarCarregamento()
      },
      (error) => {
        console.error(
          'Erro ao carregar categorias de wallpapers:',
          error,
        )

        categoriasCarregadas = true
        verificarCarregamento()
      },
    )

    const cancelarWallpapers = observarWallpapers(
      (dados) => {
        setWallpapers(dados)
        wallpapersCarregados = true
        verificarCarregamento()
      },
      (error) => {
        console.error(
          'Erro ao carregar wallpapers:',
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
  }, [])

  return (
    <main className="wallpapers-page">
      <section className="wallpapers-content">

        <div className="wallpapers-back-container">
          <button
            type="button"
            className="wallpapers-back"
            onClick={() => navigate('/explorar')}
            aria-label="Voltar para Explorar"
          >
            <ArrowLeft size={21} />
            <span>Voltar</span>
          </button>
        </div>

        {carregando ? (
          <div className="wallpapers-loading">
            <p>Carregando wallpapers...</p>
          </div>
        ) : (
          <>
            {categorias.map((categoria) => {
              const wallpapersDaCategoria = wallpapers
                .filter(
                  (wallpaper) =>
                    wallpaper.categoriaId === categoria.id,
                )
                .sort((a, b) => a.ordem - b.ordem)

              if (wallpapersDaCategoria.length === 0) {
                return null
              }

              const limite =
                categoria.limitePreview > 0
                  ? categoria.limitePreview
                  : 4

              const previewWallpapers =
                wallpapersDaCategoria.slice(0, limite)

              return (
                <section
                  className="wallpaper-category"
                  key={categoria.id}
                >
                  <div className="wallpaper-category-header">
                    <h2>{categoria.nome}</h2>

                    <button
                      type="button"
                      className="wallpaper-see-all"
                      onClick={() =>
                        navigate(
                          `/wallpapers/categoria/${categoria.id}`,
                        )
                      }
                      aria-label={`Ver todos os wallpapers de ${categoria.nome}`}
                    >
                      <span>Ver tudo</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="wallpaper-horizontal-list">
                    {previewWallpapers.map((wallpaper) => (
                      <button
                        type="button"
                        className="wallpaper-item"
                        key={wallpaper.id}
                        onClick={() =>
                          navigate(
                            `/wallpapers/${wallpaper.id}`,
                          )
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
                </section>
              )
            })}

            <section className="wallpapers-coming-soon">
              <div className="wallpapers-coming-icon">
                <PackageOpen size={48} />
              </div>

              <div className="wallpapers-coming-content">
                <h2>Novos wallpapers em breve!</h2>

                <p>
                  Estamos preparando novos papéis de parede
                  para você usar e compartilhar.
                </p>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  )
}