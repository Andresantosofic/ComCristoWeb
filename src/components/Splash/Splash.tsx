import { useEffect, useState } from 'react'
import './Splash.css'

import {
  carregarConfiguracaoSplash,
  type ConfiguracaoSplash,
} from '../../managers/ConfiguracaoSplashManager'

type SplashProps = {
  onFinish: () => void
}

const configuracaoPadrao: ConfiguracaoSplash = {
  splashFundoTipo: 'cor',
  splashFundoCor: '#042251',
  splashFundoImagem: '',
  splashCampanhaAtiva: false,
  splashCampanhaImagem: '',
  splashCampanhaTexto: '',
  splashLogoImagem: '',
}

function carregarImagem(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url.trim()) {
      resolve(false)
      return
    }

    const imagem = new Image()

    imagem.onload = () => {
      resolve(true)
    }

    imagem.onerror = () => {
      resolve(false)
    }

    imagem.src = url
  })
}

function Splash({ onFinish }: SplashProps) {
  const [configuracao, setConfiguracao] =
    useState<ConfiguracaoSplash | null>(null)

  const [imagemCampanhaCarregada, setImagemCampanhaCarregada] =
    useState(false)

  const [logoCarregada, setLogoCarregada] =
    useState(false)

  const [fundoImagemCarregado, setFundoImagemCarregado] =
    useState(false)

  const [iniciouAnimacao, setIniciouAnimacao] =
    useState(false)

  const [erroLogo, setErroLogo] =
    useState(false)

  /*
   * ==========================================================
   * BLOQUEIA A ROLAGEM ENQUANTO A SPLASH ESTÁ ABERTA
   * ==========================================================
   */

  useEffect(() => {
    const overflowAnterior =
      document.body.style.overflow

    const heightAnterior =
      document.body.style.height

    const widthAnterior =
      document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.height = '100%'
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow =
        overflowAnterior

      document.body.style.height =
        heightAnterior

      document.body.style.width =
        widthAnterior
    }
  }, [])

  /*
   * ==========================================================
   * CARREGA CONFIGURAÇÃO DA SPLASH
   * ==========================================================
   */

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const dados =
          await carregarConfiguracaoSplash()

        if (!ativo) {
          return
        }

        setConfiguracao(dados)
      } catch (erro) {
        console.error(
          'Erro ao carregar configuração da Splash:',
          erro,
        )

        if (ativo) {
          setConfiguracao(configuracaoPadrao)
        }
      }
    }

    carregar()

    return () => {
      ativo = false
    }
  }, [])

  /*
   * ==========================================================
   * PREPARA TODAS AS IMAGENS ANTES DA ANIMAÇÃO
   *
   * Isso evita que a composição mude de posição depois
   * que a Splash já começou.
   * ==========================================================
   */

  useEffect(() => {
  if (!configuracao) {
    return
  }

  const dados = configuracao

  let ativo = true

  async function prepararSplash() {
      const logoUrl =
        dados.splashLogoImagem.trim()

      const campanhaUrl =
        dados.splashCampanhaImagem.trim()

      const fundoUrl =
        dados.splashFundoImagem.trim()

      const fundoEhImagem =
        dados.splashFundoTipo.toLowerCase() ===
          'imagem' &&
        fundoUrl !== ''

      const possuiCampanha =
        dados.splashCampanhaAtiva &&
        (
          campanhaUrl !== '' ||
          dados.splashCampanhaTexto.trim() !== ''
        )

      /*
       * LOGO
       */

      if (logoUrl) {
        const carregou =
          await carregarImagem(logoUrl)

        if (!ativo) {
          return
        }

        setLogoCarregada(carregou)
      } else {
        /*
         * A logo local está disponível.
         */
        setLogoCarregada(true)
      }

      /*
       * FUNDO
       */

      if (fundoEhImagem) {
        const carregou =
          await carregarImagem(fundoUrl)

        if (!ativo) {
          return
        }

        setFundoImagemCarregado(carregou)
      } else {
        setFundoImagemCarregado(false)
      }

      /*
       * CAMPANHA
       */

      if (
        possuiCampanha &&
        campanhaUrl
      ) {
        const carregou =
          await carregarImagem(campanhaUrl)

        if (!ativo) {
          return
        }

        setImagemCampanhaCarregada(carregou)
      } else {
        setImagemCampanhaCarregada(false)
      }

      /*
       * Tudo que pode alterar o layout já foi resolvido.
       */
      if (ativo) {
        setIniciouAnimacao(true)
      }
    }

    prepararSplash()

    return () => {
      ativo = false
    }
  }, [configuracao])

  /*
   * ==========================================================
   * MANTÉM A SPLASH POR 2500 MS
   * ==========================================================
   */

  useEffect(() => {
    if (!iniciouAnimacao) {
      return
    }

    const timer =
      window.setTimeout(() => {
        onFinish()
      }, 2500)

    return () => {
      window.clearTimeout(timer)
    }
  }, [iniciouAnimacao, onFinish])

  /*
   * ==========================================================
   * CONFIGURAÇÃO GARANTIDA
   *
   * A partir daqui NÃO usamos diretamente
   * "configuracao", porque ela pode ser null.
   *
   * "dados" sempre possui uma configuração válida.
   * ==========================================================
   */

  const dados: ConfiguracaoSplash =
    configuracao ?? configuracaoPadrao

  /*
   * ==========================================================
   * FUNDO
   * ==========================================================
   */

  const fundoCor =
    dados.splashFundoCor.trim() ||
    '#042251'

  const fundoEhImagem =
    dados.splashFundoTipo.toLowerCase() ===
      'imagem' &&
    dados.splashFundoImagem.trim() !== '' &&
    fundoImagemCarregado

  /*
   * ==========================================================
   * CAMPANHA
   * ==========================================================
   */

  const possuiCampanha =
    dados.splashCampanhaAtiva &&
    (
      dados.splashCampanhaImagem.trim() !== '' ||
      dados.splashCampanhaTexto.trim() !== ''
    )

  /*
   * Se a imagem da campanha falhou,
   * ela simplesmente não é renderizada.
   *
   * Isso reproduz o View.GONE do Android.
   */

  const mostrarImagemCampanha =
    possuiCampanha &&
    dados.splashCampanhaImagem.trim() !== '' &&
    imagemCampanhaCarregada

  const textoCampanha =
    dados.splashCampanhaTexto.trim()

  /*
   * ==========================================================
   * LOGO
   * ==========================================================
   */

  const logoRemota =
    dados.splashLogoImagem.trim()

  const logo =
    logoRemota &&
    logoCarregada &&
    !erroLogo
      ? logoRemota
      : '/logo_splash.png'

  /*
   * ==========================================================
   * ESTILO DO FUNDO
   * ==========================================================
   */

  const estiloFundo: React.CSSProperties =
    fundoEhImagem
      ? {
          backgroundImage:
            `url("${dados.splashFundoImagem}")`,
        }
      : {
          backgroundColor: fundoCor,
        }

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div
      className={[
        'splash',
        fundoEhImagem
          ? 'splash-com-imagem'
          : '',
        iniciouAnimacao
          ? 'splash-pronta'
          : 'splash-carregando',
      ]
        .filter(Boolean)
        .join(' ')}
      style={estiloFundo}
    >
      <div className="splash-conteudo">

        {/* ==================================================
            LOGO
            ================================================== */}

        <img
          className="splash-logo"
          src={logo}
          alt=""
          aria-hidden="true"
          onError={() => {
            /*
             * Se a logo remota falhar,
             * volta para a logo local.
             */
            if (
              logoRemota &&
              !erroLogo
            ) {
              setErroLogo(true)
            }
          }}
        />

        {/* ==================================================
            CAMPANHA
            ================================================== */}

        {possuiCampanha && (
          <>
            <div
              className="splash-espaco-campanha"
              aria-hidden="true"
            />

            {mostrarImagemCampanha && (
              <div className="splash-card-campanha">
                <img
                  className="splash-imagem-campanha"
                  src={
                    dados.splashCampanhaImagem
                  }
                  alt=""
                  aria-hidden="true"
                />
              </div>
            )}

            {textoCampanha && (
              <>
                {mostrarImagemCampanha && (
                  <div
                    className="splash-espaco-texto-campanha"
                    aria-hidden="true"
                  />
                )}

                <p className="splash-texto-campanha">
                  {textoCampanha}
                </p>
              </>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default Splash