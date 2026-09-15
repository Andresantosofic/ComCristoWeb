import { useEffect, useState } from 'react'
import { PackageOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  observarWallpapers,
  type Wallpaper,
} from '../services/wallpaperService'

import './Explorar.css'

export default function Explorar() {
  const navigate = useNavigate()

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])

  useEffect(() => {
    const cancelar = observarWallpapers(
      (dados) => {
        setWallpapers(dados)
      },
      (error) => {
        console.error(
          'Erro ao carregar previews dos wallpapers:',
          error,
        )
      },
    )

    return () => {
      cancelar()
    }
  }, [])

  const previews = wallpapers.slice(0, 3)

  return (
    <main className="explorar-page">
      <section className="explorar-content">

        <h1>Explorar</h1>

        <button
          type="button"
          className="explorar-wallpapers-card"
          onClick={() => navigate('/wallpapers')}
          aria-label="Abrir papéis de parede"
        >
          <div className="explorar-wallpapers-info">

            <div className="explorar-wallpapers-icon">
              <PackageOpen size={28} />
            </div>

            <div className="explorar-wallpapers-text">
              <h2>Papéis de parede</h2>

              <p>
                Encontre wallpapers para deixar seu
                celular ainda mais especial.
              </p>
            </div>

          </div>

          <div className="explorar-wallpapers-preview">
            {previews.map((wallpaper, index) => (
              <div
                key={wallpaper.id}
                className={`explorar-preview explorar-preview-${index + 1}`}
              >
                <img
                  src={wallpaper.imagem}
                  alt=""
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </button>

        <section className="explorar-news-card">
          <div className="explorar-news-icon">
            <PackageOpen size={72} />
          </div>

          <div className="explorar-news-content">
            <h2>Novidades em breve!</h2>

            <p>
              Estamos preparando novas experiências
              para você dentro do Com Cristo.
            </p>
          </div>
        </section>

      </section>
    </main>
  )
}