import { useEffect, useState } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  observarWallpaperPorId,
  type Wallpaper,
} from '../services/wallpaperService'

import './WallpaperDetalhe.css'

export default function WallpaperDetalhe() {
  const navigate = useNavigate()

  const { wallpaperId } = useParams<{
    wallpaperId: string
  }>()

  const [wallpaper, setWallpaper] =
    useState<Wallpaper | null>(null)

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!wallpaperId) {
      setCarregando(false)
      return
    }

    const cancelar = observarWallpaperPorId(
      wallpaperId,
      (dados) => {
        setWallpaper(dados)
        setCarregando(false)
      },
      (error) => {
        console.error(
          'Erro ao carregar detalhe do wallpaper:',
          error,
        )

        setWallpaper(null)
        setCarregando(false)
      },
    )

    return () => {
      cancelar()
    }
  }, [wallpaperId])

  const voltar = () => {
    navigate(-1)
  }

  const salvarWallpaper = async () => {
    if (!wallpaper?.imagem || salvando) {
      return
    }

    try {
      setSalvando(true)

      const resposta = await fetch(wallpaper.imagem)

      if (!resposta.ok) {
        throw new Error(
          `Erro HTTP ${resposta.status}`,
        )
      }

      const blob = await resposta.blob()

      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url
      link.download =
        wallpaper.titulo || 'wallpaper'

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(
        'Erro ao salvar wallpaper:',
        error,
      )

      window.open(
        wallpaper.imagem,
        '_blank',
        'noopener,noreferrer',
      )
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <main className="wallpaper-detalhe-page">
        <div className="wallpaper-detalhe-loading">
          <p>Carregando wallpaper...</p>
        </div>
      </main>
    )
  }

  if (!wallpaper) {
    return (
      <main className="wallpaper-detalhe-page">
        <div className="wallpaper-detalhe-not-found">

          <button
            type="button"
            className="wallpaper-detalhe-back"
            onClick={voltar}
            aria-label="Voltar"
          >
            <ArrowLeft size={22} />
            <span>Voltar</span>
          </button>

          <h1>Wallpaper não encontrado</h1>

          <p>
            Este wallpaper pode ter sido removido ou
            desativado.
          </p>

        </div>
      </main>
    )
  }

  return (
    <main className="wallpaper-detalhe-page">

      {/* =========================
          FUNDO DESFOCADO
      ========================= */}

      <div
        className="wallpaper-detalhe-background"
        style={{
          backgroundImage: `url("${wallpaper.imagem}")`,
        }}
      />

      {/* =========================
          OVERLAY
      ========================= */}

      <div className="wallpaper-detalhe-overlay" />

      {/* =========================
          CONTEÚDO
      ========================= */}

      <section className="wallpaper-detalhe-content">

        {/* VOLTAR */}

        <button
          type="button"
          className="wallpaper-detalhe-back"
          onClick={voltar}
          aria-label="Voltar"
        >
          <ArrowLeft size={22} />
          <span>Voltar</span>
        </button>

        {/* IMAGEM */}

        <div className="wallpaper-detalhe-image-wrapper">
          <img
            className="wallpaper-detalhe-image"
            src={wallpaper.imagem}
            alt={wallpaper.titulo}
            draggable={false}
          />
        </div>

        {/* SALVAR */}

        <button
          type="button"
          className="wallpaper-detalhe-save"
          onClick={salvarWallpaper}
          disabled={salvando}
        >
          <Download size={22} />

          <span>
            {salvando
              ? 'Salvando...'
              : 'Salvar na galeria'}
          </span>
        </button>

      </section>
    </main>
  )
}