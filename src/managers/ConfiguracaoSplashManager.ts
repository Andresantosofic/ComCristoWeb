import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export type ConfiguracaoSplash = {
  splashFundoTipo: string
  splashFundoCor: string
  splashFundoImagem: string

  splashCampanhaAtiva: boolean
  splashCampanhaImagem: string
  splashCampanhaTexto: string

  splashLogoImagem: string
}

const configuracaoPadrao: ConfiguracaoSplash = {
  splashFundoTipo: 'cor',
  splashFundoCor: '#042251',
  splashFundoImagem: '',

  splashCampanhaAtiva: true,
  splashCampanhaImagem: '',
  splashCampanhaTexto: 'Semana dos Namorados',

  splashLogoImagem: '',
}

export async function carregarConfiguracaoSplash(): Promise<ConfiguracaoSplash> {
  try {
    const referencia = doc(
      db,
      'configuracoes',
      'splash',
    )

    const documento = await getDoc(referencia)

    if (!documento.exists()) {
      console.warn(
        'Documento configuracoes/splash não encontrado. Usando configuração padrão.',
      )

      return configuracaoPadrao
    }

    const dados = documento.data()

    return {
      splashFundoTipo:
        typeof dados.splashFundoTipo === 'string'
          ? dados.splashFundoTipo
          : configuracaoPadrao.splashFundoTipo,

      splashFundoCor:
        typeof dados.splashFundoCor === 'string'
          ? dados.splashFundoCor
          : configuracaoPadrao.splashFundoCor,

      splashFundoImagem:
        typeof dados.splashFundoImagem === 'string'
          ? dados.splashFundoImagem
          : configuracaoPadrao.splashFundoImagem,

      splashCampanhaAtiva:
        typeof dados.splashCampanhaAtiva === 'boolean'
          ? dados.splashCampanhaAtiva
          : configuracaoPadrao.splashCampanhaAtiva,

      splashCampanhaImagem:
        typeof dados.splashCampanhaImagem === 'string'
          ? dados.splashCampanhaImagem
          : configuracaoPadrao.splashCampanhaImagem,

      splashCampanhaTexto:
        typeof dados.splashCampanhaTexto === 'string'
          ? dados.splashCampanhaTexto
          : configuracaoPadrao.splashCampanhaTexto,

      splashLogoImagem:
        typeof dados.splashLogoImagem === 'string'
          ? dados.splashLogoImagem
          : configuracaoPadrao.splashLogoImagem,
    }
  } catch (erro) {
    console.error(
      'Erro ao carregar configuração da Splash:',
      erro,
    )

    return configuracaoPadrao
  }
}