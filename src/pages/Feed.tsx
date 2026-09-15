import { useEffect, useRef, useState } from 'react'

import {
  observarFeed,
  type Publicacao,
  type TipoMidia,
} from '../services/feedService'

import './Feed.css'

/* =========================================================
   EVENTOS GLOBAIS DOS PLAYERS
   ========================================================= */

const EVENTO_PAUSAR_YOUTUBE = 'comcristo:pausar-youtube'
const EVENTO_PAUSAR_VIDEOS = 'comcristo:pausar-videos'

/* =========================================================
   TIPOS DO YOUTUBE IFRAME API
   ========================================================= */

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string
          playerVars?: {
            autoplay?: number
            controls?: number
            playsinline?: number
            rel?: number
            modestbranding?: number
          }
          events?: {
            onReady?: () => void
            onStateChange?: (event: {
              data: number
            }) => void
          }
        }
      ) => {
        pauseVideo: () => void
        destroy: () => void
      }

      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
        BUFFERING: number
        CUED: number
      }
    }

    onYouTubeIframeAPIReady?: () => void
  }
}

/* =========================================================
   TEMPO DA PUBLICAÇÃO
   ========================================================= */

function calcularTempo(data: Date) {
  const agora = new Date()

  const diferenca =
    agora.getTime() - data.getTime()

  const minutos = Math.floor(
    diferenca / 60000
  )

  if (minutos < 1) {
    return 'Agora'
  }

  if (minutos < 60) {
    return minutos === 1
      ? 'Há 1 minuto'
      : `Há ${minutos} minutos`
  }

  const horas = Math.floor(
    minutos / 60
  )

  if (horas < 24) {
    return horas === 1
      ? 'Há 1 hora'
      : `Há ${horas} horas`
  }

  const dias = Math.floor(
    horas / 24
  )

  if (dias === 1) {
    return 'Ontem'
  }

  return `Há ${dias} dias`
}

/* =========================================================
   EXTRAIR ID DO YOUTUBE
   ========================================================= */

function extrairYoutubeId(url: string) {
  try {
    const parsed = new URL(url)

    /* -----------------------------------------
       youtu.be/ID
       ----------------------------------------- */

    if (
      parsed.hostname === 'youtu.be' ||
      parsed.hostname === 'www.youtu.be'
    ) {
      return parsed.pathname
        .replace('/', '')
        .split('/')[0]
    }

    /* -----------------------------------------
       youtube.com
       ----------------------------------------- */

    if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes(
        'youtube-nocookie.com'
      )
    ) {
      /* watch?v=ID */

      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v')
      }

      /* shorts/ID */

      if (
        parsed.pathname.startsWith('/shorts/')
      ) {
        return parsed.pathname
          .replace('/shorts/', '')
          .split('/')[0]
      }

      /* embed/ID */

      if (
        parsed.pathname.startsWith('/embed/')
      ) {
        return parsed.pathname
          .replace('/embed/', '')
          .split('/')[0]
      }
    }

    return null
  } catch {
    return null
  }
}

/* =========================================================
   IMAGEM
   ========================================================= */

function FeedImagem({
  url,
}: {
  url: string
}) {
  return (
    <div className="feed-media feed-image-container">
      <img
        src={url}
        alt="Publicação do Com Cristo"
        className="feed-media-image"
      />
    </div>
  )
}

/* =========================================================
   VÍDEO NORMAL
   ========================================================= */

function FeedVideo({
  url,
}: {
  url: string
}) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const scrollPositionRef =
    useRef(0)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current

    if (!video || !container) {
      return
    }

    /* -----------------------------------------
       Pausar quando outro vídeo normal começar.
       ----------------------------------------- */

    function handlePausarVideo(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent<{
          source?: HTMLVideoElement
        }>

      const source =
        customEvent.detail?.source

      if (source === video) {
        return
      }

      if (video && !video.paused) {
  video.pause()
}
    }

    window.addEventListener(
      EVENTO_PAUSAR_VIDEOS,
      handlePausarVideo
    )

    /* -----------------------------------------
       IntersectionObserver
       ----------------------------------------- */

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0]

          if (
            !entry.isIntersecting ||
            entry.intersectionRatio < 0.5
          ) {
            if (video && !video.paused) {
  video.pause()
}
          }
        },
        {
          threshold: [0, 0.5, 1],
        }
      )

    observer.observe(container)

    /* -----------------------------------------
       Tela cheia
       ----------------------------------------- */

    function handleFullscreenChange() {
      const estaEmTelaCheia =
        document.fullscreenElement === video

      if (estaEmTelaCheia) {
        /*
         * Guarda a posição atual do Feed.
         */
        scrollPositionRef.current =
          window.scrollY

        /*
         * Tenta colocar o celular em
         * orientação paisagem.
         *
         * Em computadores isso simplesmente
         * não interfere.
         */
        if (
          'orientation' in screen &&
          typeof screen.orientation.lock === 'function'
        ) {
          screen.orientation
            .lock('landscape')
            .catch(() => {
              /*
               * Alguns navegadores não permitem
               * bloquear a orientação.
               */
            })
        }

        return
      }

      /*
       * Saiu da tela cheia.
       * Tenta voltar à orientação normal.
       */
      if (
        'orientation' in screen &&
        typeof screen.orientation.unlock === 'function'
      ) {
        try {
          screen.orientation.unlock()
        } catch {
          // Alguns navegadores não permitem desbloquear.
        }
      }

      /*
       * Restaura a posição do Feed.
       */
      requestAnimationFrame(() => {
        window.scrollTo(
          0,
          scrollPositionRef.current
        )
      })
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    )

    /* -----------------------------------------
       Limpeza
       ----------------------------------------- */

    return () => {
      window.removeEventListener(
        EVENTO_PAUSAR_VIDEOS,
        handlePausarVideo
      )

      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      )

      observer.disconnect()

      video.pause()
    }
  }, [])

  /* -----------------------------------------
     Pausar outros vídeos
     ----------------------------------------- */

  function pausarOutrosVideos() {
    document
      .querySelectorAll<HTMLVideoElement>(
        '.feed-media-video'
      )
      .forEach((outroVideo) => {
        if (
          outroVideo !== videoRef.current
        ) {
          outroVideo.pause()
        }
      })
  }

  /* -----------------------------------------
     Reprodução
     ----------------------------------------- */

  function handlePlay() {
    const video = videoRef.current

    if (!video) {
      return
    }

    /*
     * Primeiro pausa os outros vídeos normais.
     */
    pausarOutrosVideos()

    /*
     * Depois pausa qualquer YouTube aberto.
     */
    window.dispatchEvent(
      new CustomEvent(
        EVENTO_PAUSAR_YOUTUBE
      )
    )

    /*
     * Informa aos outros vídeos que este
     * foi o vídeo que começou.
     */
    window.dispatchEvent(
      new CustomEvent(
        EVENTO_PAUSAR_VIDEOS,
        {
          detail: {
            source: video,
          },
        }
      )
    )
  }

  return (
    <div
      ref={containerRef}
      className="feed-media feed-video-container"
    >
      <video
        ref={videoRef}
        className="feed-media-video"
        src={url}
        playsInline
        preload="metadata"
        controls
        onPlay={handlePlay}
      />
    </div>
  )
}

/* =========================================================
   YOUTUBE
   ========================================================= */

function FeedYoutube({
  url,
}: {
  url: string
}) {
  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const playerHostRef =
    useRef<HTMLDivElement | null>(null)

  const playerRef =
    useRef<{
      pauseVideo: () => void
      destroy: () => void
    } | null>(null)

  const scrollPositionRef =
    useRef(0)

  const youtubeId = extrairYoutubeId(url)

  /* -----------------------------------------
     Carrega a API oficial do YouTube.
     ----------------------------------------- */

  useEffect(() => {
  if (!youtubeId) {
    return
  }

  const idVideo = youtubeId

  let cancelado = false

    function criarPlayer() {
      if (
        cancelado ||
        !window.YT ||
        !playerHostRef.current
      ) {
        return
      }

      /*
       * Evita criar o player duas vezes.
       */
      if (playerRef.current) {
        return
      }

      playerRef.current =
        new window.YT.Player(
          playerHostRef.current,
          {
            videoId: idVideo,

            playerVars: {
              autoplay: 0,
              controls: 1,
              playsinline: 1,
              rel: 0,
              modestbranding: 1,
            },

            events: {
              onStateChange: (event) => {
                if (
                  event.data ===
                  window.YT?.PlayerState
                    .PLAYING
                ) {
                  /*
                   * YouTube começou.
                   *
                   * Pausa todos os vídeos
                   * HTML5 do Feed.
                   */
                  window.dispatchEvent(
                    new CustomEvent(
                      EVENTO_PAUSAR_VIDEOS
                    )
                  )
                }
              },
            },
          }
        )

      /*
       * Garante que o iframe do YouTube
       * permita tela cheia.
       */
      requestAnimationFrame(() => {
        const iframe =
          playerHostRef.current?.querySelector(
            'iframe'
          )

        if (iframe) {
          iframe.setAttribute(
            'allowfullscreen',
            'true'
          )

          iframe.setAttribute(
            'allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          )
        }
      })
    }

    /*
     * API já carregada.
     */
    if (window.YT?.Player) {
      criarPlayer()
      return
    }

    /*
     * Se o script já existe, aguarda
     * o callback global.
     */
    const scriptExistente =
      document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )

    if (scriptExistente) {
      const callbackAnterior =
        window.onYouTubeIframeAPIReady

      window.onYouTubeIframeAPIReady =
        () => {
          callbackAnterior?.()
          criarPlayer()
        }

      return () => {
        cancelado = true
      }
    }

    /*
     * Carrega a API oficial.
     */
    const script =
      document.createElement('script')

    script.src =
      'https://www.youtube.com/iframe_api'

    script.async = true

    const callbackAnterior =
      window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady =
      () => {
        callbackAnterior?.()
        criarPlayer()
      }

    document.body.appendChild(script)

    return () => {
      cancelado = true
    }
  }, [youtubeId])

  /* -----------------------------------------
     Detectar entrada/saída da tela cheia.
     ----------------------------------------- */

  useEffect(() => {
    const container =
      containerRef.current

    if (!container || !youtubeId) {
      return
    }

    function handleFullscreenChange() {
      const elementoFullscreen =
        document.fullscreenElement

      /*
       * Verifica se este YouTube está
       * relacionado ao elemento que entrou
       * em tela cheia.
       */
      if (!container) return

const estaNesteYoutube =
  elementoFullscreen === container ||
  (elementoFullscreen !== null &&
    container.contains(elementoFullscreen))

      if (estaNesteYoutube) {
        /*
         * Guarda a posição do Feed.
         */
        scrollPositionRef.current =
          window.scrollY

        /*
         * Tenta colocar o celular
         * em orientação paisagem.
         */
        if (
          'orientation' in screen &&
          typeof screen.orientation.lock ===
            'function'
        ) {
          screen.orientation
            .lock('landscape')
            .catch(() => {
              /*
               * Alguns navegadores não permitem
               * bloquear a orientação.
               */
            })
        }

        return
      }

      /*
       * Se nenhum elemento está em fullscreen,
       * significa que o usuário saiu.
       */
      if (!elementoFullscreen) {
        if (
          'orientation' in screen &&
          typeof screen.orientation.unlock ===
            'function'
        ) {
          try {
            screen.orientation.unlock()
          } catch {
            // Navegador não suporta desbloqueio.
          }
        }

        /*
         * Restaura a posição do Feed.
         */
        requestAnimationFrame(() => {
          window.scrollTo(
            0,
            scrollPositionRef.current
          )
        })
      }
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    )

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      )
    }
  }, [youtubeId])

  /* -----------------------------------------
     Pausar YouTube
     ----------------------------------------- */

  useEffect(() => {
    if (!youtubeId) {
      return
    }

    function pausarYoutube() {
      playerRef.current?.pauseVideo()
    }

    window.addEventListener(
      EVENTO_PAUSAR_YOUTUBE,
      pausarYoutube
    )

    return () => {
      window.removeEventListener(
        EVENTO_PAUSAR_YOUTUBE,
        pausarYoutube
      )
    }
  }, [youtubeId])

  /* -----------------------------------------
     Pausar quando sair da tela.
     ----------------------------------------- */

  useEffect(() => {
    const container =
      containerRef.current

    if (!container || !youtubeId) {
      return
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0]

          /*
           * Não pausa o vídeo enquanto ele
           * estiver em tela cheia.
           */
          if (
            document.fullscreenElement
          ) {
            return
          }

          if (
            !entry.isIntersecting ||
            entry.intersectionRatio < 0.5
          ) {
            playerRef.current?.pauseVideo()
          }
        },
        {
          threshold: [0, 0.5, 1],
        }
      )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [youtubeId])

  /* -----------------------------------------
     Limpeza do player.
     ----------------------------------------- */

  useEffect(() => {
    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [])

  if (!youtubeId) {
    return (
      <div className="feed-media-loading">
        Vídeo do YouTube indisponível
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="feed-media feed-youtube-container"
    >
      <div
        ref={playerHostRef}
        className="feed-youtube-player-host"
      />
    </div>
  )
}

/* =========================================================
   MÍDIA
   ========================================================= */

function FeedMidia({
  tipo,
  url,
}: {
  tipo: TipoMidia
  url: string
}) {
  if (!url) {
    return (
      <div className="feed-media-loading">
        Nenhuma mídia disponível
      </div>
    )
  }

  if (tipo === 'imagem') {
    return <FeedImagem url={url} />
  }

  if (tipo === 'video') {
    return <FeedVideo url={url} />
  }

  if (tipo === 'youtube') {
    return <FeedYoutube url={url} />
  }

  return (
    <div className="feed-media-loading">
      Tipo de mídia não suportado
    </div>
  )
}

/* =========================================================
   CARD
   ========================================================= */

function FeedCard({
  publicacao,
}: {
  publicacao: Publicacao
}) {
  return (
    <article className="feed-card">
      {/* -----------------------------------------
          AUTOR
          ----------------------------------------- */}

      <div className="feed-author">
        <div className="feed-avatar">
          <img
  src="/images/logo_feed_perfil.png"
  alt="Com Cristo"
  className="feed-avatar-logo"
/>
        </div>

        <div className="feed-author-info">
          <strong>
            {publicacao.autor}
          </strong>

          <span>
            {calcularTempo(
              publicacao.dataPublicacao
            )}
          </span>
        </div>
      </div>

      {/* -----------------------------------------
          LEGENDA
          ----------------------------------------- */}

      {publicacao.legenda && (
        <p className="feed-caption">
          {publicacao.legenda}
        </p>
      )}

      {/* -----------------------------------------
          MÍDIA
          ----------------------------------------- */}

      <FeedMidia
        tipo={publicacao.tipo}
        url={publicacao.urlMidia}
      />
    </article>
  )
}

/* =========================================================
   FEED
   ========================================================= */

export default function Feed() {
  const [publicacoes, setPublicacoes] =
    useState<Publicacao[]>([])

  const [carregando, setCarregando] =
    useState(true)

  useEffect(() => {
    const cancelar = observarFeed(
      (dados) => {
        setPublicacoes(dados)
        setCarregando(false)
      },
      (error) => {
        console.error(
          'Erro ao carregar o Feed:',
          error,
        )

        setPublicacoes([])
        setCarregando(false)
      },
    )

    return () => {
      cancelar()
    }
  }, [])

  return (
    <main className="feed-page">

      {/* =========================
          CABEÇALHO
      ========================= */}

      <header className="feed-header">
        <img
          src="/images/logo_feed.png"
          alt="Com Cristo"
          className="feed-logo"
        />
      </header>

      {/* =========================
          PUBLICAÇÕES
      ========================= */}

      <section className="feed-container">
        {carregando ? (
          <div className="feed-status">
            🔵 Carregando publicações...
          </div>
        ) : publicacoes.length === 0 ? (
          <div className="feed-status">
            Nenhuma publicação disponível.
          </div>
        ) : (
          publicacoes.map((publicacao) => (
            <FeedCard
              key={publicacao.id}
              publicacao={publicacao}
            />
          ))
        )}
      </section>

    </main>
  )
}