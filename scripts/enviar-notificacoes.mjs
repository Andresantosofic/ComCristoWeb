import {
  initializeApp,
  cert,
  getApps,
} from 'firebase-admin/app'

import {
  getFirestore,
  FieldValue,
} from 'firebase-admin/firestore'

import {
  getMessaging,
} from 'firebase-admin/messaging'

const COLLECTION_DISPOSITIVOS =
  'notificacoes_dispositivos'

const COLLECTION_CONTEUDO =
  'conteudo_diario'

const secret =
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON

if (!secret) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT_JSON não foi encontrado nas variáveis de ambiente.',
  )
}

let serviceAccount

try {
  serviceAccount =
    JSON.parse(secret)
} catch {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT_JSON não contém um JSON válido.',
  )
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const db = getFirestore()
const messaging = getMessaging()

function obterDataHoraNoTimezone(
  timezone,
) {
  const agora = new Date()

  const partes =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      },
    ).formatToParts(agora)

  const valores = {}

  for (const parte of partes) {
    if (parte.type !== 'literal') {
      valores[parte.type] =
        parte.value
    }
  }

  const ano = valores.year
  const mes = valores.month
  const dia = valores.day
  const hora = valores.hour
  const minuto = valores.minute

  return {
    dataCompleta:
      `${ano}-${mes}-${dia}`,

    dataKey:
      `${mes}-${dia}`,

    hora,
    minuto,

    horaMinuto:
      `${hora}:${minuto}`,
  }
}

function normalizarHorario(horario) {
  if (typeof horario !== 'string') {
    return null
  }

  const match =
    horario.match(/^(\d{2}):(\d{2})$/)

  if (!match) {
    return null
  }

  const hora =
    Number(match[1])

  const minuto =
    Number(match[2])

  if (
    hora > 23 ||
    minuto > 59
  ) {
    return null
  }

  return {
    hora,
    minuto,
    totalMinutos:
      hora * 60 + minuto,
  }
}

async function obterConteudoDoDia(
  dataKey,
) {
  const snapshot =
    await db
      .collection(COLLECTION_CONTEUDO)
      .doc(dataKey)
      .get()

  if (!snapshot.exists) {
    console.log(
      `[CONTEÚDO] Não existe conteúdo para ${dataKey}.`,
    )

    return null
  }

  const dados =
    snapshot.data()

  const versiculo =
    dados?.versiculoDoDia

  if (!versiculo) {
    console.log(
      `[CONTEÚDO] ${dataKey} não possui versiculoDoDia.`,
    )

    return null
  }

  const texto =
    String(
      versiculo.texto || '',
    ).trim()

  const referencia =
    String(
      versiculo.referencia || '',
    ).trim()

  if (!texto || !referencia) {
    console.log(
      `[CONTEÚDO] ${dataKey} possui versículo incompleto.`,
    )

    return null
  }

  return {
    texto,
    referencia,
  }
}

function erroDeTokenInvalido(error) {
  const code =
    error?.code

  return (
    code ===
      'messaging/registration-token-not-registered' ||
    code ===
      'messaging/invalid-registration-token'
  )
}

async function enviarParaDispositivo(
  token,
  referencia,
  texto,
  origem,
) {
  const link =
    origem
      ? `${origem}/`
      : undefined

  const mensagem = {
    token,

    notification: {
      title:
        'Versículo do dia',

      body:
        `${referencia}\n${texto}`,
    },

    data: {
      tipo:
        'versiculo_diario',

      title:
        'Versículo do dia',

      body:
        `${referencia}\n${texto}`,

      referencia,
      texto,

      url: '/',
    },

    webpush: {
      headers: {
        Urgency: 'high',
      },

      notification: {
        title:
          'Versículo do dia',

        body:
          `${referencia}\n${texto}`,

        icon: `${origem}/images/icone_notificacao.png`,

        badge:
          '/images/logo_app.png',

        tag:
          'comcristo-versiculo-diario',
      },

      ...(link
        ? {
            fcmOptions: {
              link,
            },
          }
        : {}),
    },
  }

  return messaging.send(
    mensagem,
  )
}

async function executar() {
  console.log(
    '==========================================',
  )

  console.log(
    'COM CRISTO — NOTIFICAÇÕES DIÁRIAS',
  )

  console.log(
    '==========================================',
  )

  const dispositivosSnapshot =
    await db
      .collection(
        COLLECTION_DISPOSITIVOS,
      )
      .where(
        'ativo',
        '==',
        true,
      )
      .get()

  console.log(
    `[DISPOSITIVOS] Encontrados: ${dispositivosSnapshot.size}`,
  )

  if (
    dispositivosSnapshot.empty
  ) {
    console.log(
      'Nenhum dispositivo ativo.',
    )

    return
  }

  let enviados = 0
  let ignorados = 0
  let erros = 0

  const cacheConteudo =
    new Map()

  for (
    const documento
    of dispositivosSnapshot.docs
  ) {
    const dados =
      documento.data()

    const token =
      String(
        dados.token || '',
      ).trim()

    const horario =
      normalizarHorario(
        dados.horario,
      )

    const timezone =
      String(
        dados.timezone ||
          'America/Sao_Paulo',
      ).trim()

    if (
      !token ||
      !horario
    ) {
      console.log(
        `[IGNORADO] ${documento.id}: token/horário inválido.`,
      )

      ignorados++
      continue
    }

    let dataAtual

    try {
      dataAtual =
        obterDataHoraNoTimezone(
          timezone,
        )
    } catch (error) {
      console.error(
        `[ERRO] ${documento.id}: timezone inválido: ${timezone}`,
        error,
      )

      erros++
      continue
    }

    const minutosAgora =
      Number(dataAtual.hora) *
        60 +
      Number(dataAtual.minuto)

    const diferenca =
      minutosAgora -
      horario.totalMinutos

    if (
      diferenca < 0 ||
      diferenca > 10
    ) {
      console.log(
        `[IGNORADO] ${documento.id} | horário configurado: ${dados.horario} | horário local atual: ${dataAtual.horaMinuto} | timezone: ${timezone} | fora da janela`,
      )

      ignorados++
      continue
    }

    const dataCompleta =
      dataAtual.dataCompleta

    const dataKey =
      dataAtual.dataKey

    if (
      dados.ultimoEnvioData ===
      dataCompleta
    ) {
      ignorados++
      continue
    }

    let conteudo =
      cacheConteudo.get(
        dataKey,
      )

    if (!conteudo) {
      conteudo =
        await obterConteudoDoDia(
          dataKey,
        )

      if (conteudo) {
        cacheConteudo.set(
          dataKey,
          conteudo,
        )
      }
    }

    if (!conteudo) {
      ignorados++
      continue
    }

    console.log(
      `[ENVIO] ${documento.id} | ${timezone} | ${dataAtual.horaMinuto} | ${conteudo.referencia}`,
    )

    try {
      const messageId =
        await enviarParaDispositivo(
          token,
          conteudo.referencia,
          conteudo.texto,
          dados.origem,
        )

      await documento.ref.set(
        {
          ultimoEnvioData:
            dataCompleta,

          ultimoEnvioEm:
            FieldValue.serverTimestamp(),

          ultimoEnvioMessageId:
            messageId,
        },
        {
          merge: true,
        },
      )

      console.log(
        `[OK] ${documento.id} | mensagem: ${messageId}`,
      )

      enviados++
    } catch (error) {
      console.error(
        `[ERRO ENVIO] ${documento.id}`,
        error,
      )

      if (
        erroDeTokenInvalido(
          error,
        )
      ) {
        await documento.ref.set(
          {
            ativo: false,

            ultimoErro:
              String(
                error?.message ||
                  'Token inválido',
              ),

            atualizadoEm:
              FieldValue.serverTimestamp(),
          },
          {
            merge: true,
          },
        )

        console.log(
          `[DESATIVADO] Token inválido: ${documento.id}`,
        )
      }

      erros++
    }
  }

  console.log(
    '==========================================',
  )

  console.log(
    `Enviados: ${enviados}`,
  )

  console.log(
    `Ignorados: ${ignorados}`,
  )

  console.log(
    `Erros: ${erros}`,
  )

  console.log(
    '==========================================',
  )
}

executar().catch(
  (error) => {
    console.error(
      '[FATAL] Falha na execução:',
      error,
    )

    process.exit(1)
  },
)