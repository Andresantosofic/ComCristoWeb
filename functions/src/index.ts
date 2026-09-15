import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {getMessaging} from "firebase-admin/messaging";

initializeApp();

const db = getFirestore();
const messaging = getMessaging();

const COLECAO_DISPOSITIVOS = "notificacoes_dispositivos";
const COLECAO_CONTEUDO = "conteudo_diario";

type Dispositivo = {
  token?: string
  ativo?: boolean
  horario?: string
  timezone?: string
  ultimoEnvioData?: string
}

type ConteudoDiario = {
  versiculoDoDia?: {
    texto?: string
    referencia?: string
  }
}

/**
 * Obtém a data e hora atual no fuso horário informado.
 * @param {string} timezone Fuso horário no formato IANA.
 * @return {Object} Data e hora locais.
 */
function obterDataHoraNoTimezone(timezone: string) {
  const agora = new Date();

  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(agora);

  const valores: Record<string, string> = {};

  for (const parte of partes) {
    if (parte.type !== "literal") {
      valores[parte.type] = parte.value;
    }
  }

  return {
    ano: valores.year,
    mes: valores.month,
    dia: valores.day,
    hora: valores.hour,
    minuto: valores.minute,
  };
}

/**
 * Normaliza e valida um horário no formato HH:mm.
 * @param {string} [hora] Horário a ser validado.
 * @return {string|null} Horário normalizado ou null.
 */
function normalizarHora(hora?: string) {
  if (!hora) return null;

  const partes = hora.split(":");

  if (partes.length !== 2) return null;

  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);

  if (
    !Number.isInteger(horas) ||
    !Number.isInteger(minutos) ||
    horas < 0 ||
    horas > 23 ||
    minutos < 0 ||
    minutos > 59
  ) {
    return null;
  }

  return `${String(horas).padStart(2, "0")}:${
    String(minutos).padStart(2, "0")
  }`;
}

/**
 * Busca o conteúdo diário pelo identificador da data.
 * @param {string} dataKey Identificador da data no formato MM-DD.
 * @return {Promise<ConteudoDiario|null>} Conteúdo encontrado.
 */
async function obterConteudoDoDia(
  dataKey: string,
): Promise<ConteudoDiario | null> {
  const documento = await db
    .collection(COLECAO_CONTEUDO)
    .doc(dataKey)
    .get();

  if (!documento.exists) {
    logger.warn(`Nenhum conteúdo encontrado para ${dataKey}.`);
    return null;
  }

  return documento.data() as ConteudoDiario;
}

/**
 * Envia o versículo diário para um dispositivo via FCM.
 * @param {string} token Token FCM do dispositivo.
 * @param {string} referencia Referência bíblica.
 * @param {string} texto Texto do versículo.
 * @return {Promise<void>} Conclusão do envio.
 */
async function enviarParaDispositivo(
  token: string,
  referencia: string,
  texto: string,
) {
  await messaging.send({
    token,

    notification: {
      title: "Versículo do dia",
      body: `${referencia}\n${texto}`,
    },

    data: {
      tipo: "versiculo_diario",
      referencia,
      texto,
      url: "/",
    },

    webpush: {
      notification: {
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: "comcristo-versiculo-diario",
      },
    },
  });
}

export const enviarVersiculoDiario = onSchedule(
  {
    schedule: "* * * * *",
    timeZone: "UTC",
    region: "southamerica-east1",
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async () => {
    logger.info(
      "Iniciando verificação de notificações diárias.",
    );

    const snapshot = await db
      .collection(COLECAO_DISPOSITIVOS)
      .where("ativo", "==", true)
      .get();

    if (snapshot.empty) {
      logger.info(
        "Nenhum dispositivo ativo encontrado.",
      );
      return;
    }

    logger.info(
      `Encontrados ${snapshot.size} dispositivo(s) ativo(s).`,
    );

    for (const documento of snapshot.docs) {
      const dispositivo = documento.data() as Dispositivo;

      const token = dispositivo.token;
      const horario = normalizarHora(dispositivo.horario);
      const timezone =
        dispositivo.timezone || "America/Sao_Paulo";

      if (!token) {
        logger.warn(
          `Dispositivo ${documento.id} não possui token.`,
        );
        continue;
      }

      if (!horario) {
        logger.warn(
          `Dispositivo ${documento.id} possui horário inválido: ${
            dispositivo.horario
          }`,
        );
        continue;
      }

      let dataHora: ReturnType<typeof obterDataHoraNoTimezone>;

      try {
        dataHora = obterDataHoraNoTimezone(timezone);
      } catch (erro) {
        logger.error(
          `Timezone inválido no dispositivo ${documento.id}: ${
            timezone
          }`,
          erro,
        );
        continue;
      }

      const horaAtual =
        `${dataHora.hora}:${dataHora.minuto}`;

      if (horaAtual !== horario) {
        continue;
      }

      const dataKey =
        `${dataHora.mes}-${dataHora.dia}`;

      if (dispositivo.ultimoEnvioData === dataKey) {
        logger.info(
          `Notificação de ${dataKey} já enviada para ${
            documento.id
          }.`,
        );
        continue;
      }

      logger.info(
        `Horário alcançado para ${documento.id}: ${
          horario
        } (${timezone}).`,
      );

      const conteudo =
        await obterConteudoDoDia(dataKey);

      const versiculo =
        conteudo?.versiculoDoDia;

      if (
        !versiculo?.texto ||
        !versiculo?.referencia
      ) {
        logger.warn(
          `Versículo do dia incompleto para ${dataKey}.`,
        );
        continue;
      }

      try {
        await enviarParaDispositivo(
          token,
          versiculo.referencia,
          versiculo.texto,
        );

        await documento.ref.update({
          ultimoEnvioData: dataKey,
          ultimoEnvioEm:
            FieldValue.serverTimestamp(),
        });

        logger.info(
          `Notificação enviada com sucesso para ${
            documento.id
          }.`,
        );
      } catch (erro: unknown) {
        logger.error(
          `Erro ao enviar notificação para ${
            documento.id
          }.`,
          erro,
        );

        const mensagem =
          erro instanceof Error ?
            erro.message :
            String(erro);

        /*
         * Tokens inválidos/expirados não devem continuar
         * sendo utilizados.
         */
        if (
          mensagem.includes(
            "registration-token-not-registered",
          ) ||
          mensagem.includes(
            "invalid-registration-token",
          ) ||
          mensagem.includes(
            "messaging/registration-token-not-registered",
          ) ||
          mensagem.includes(
            "messaging/invalid-registration-token",
          )
        ) {
          await documento.ref.update({
            ativo: false,
            atualizadoEm:
              FieldValue.serverTimestamp(),
          });

          logger.warn(
            `Dispositivo ${documento.id} desativado por ` +
            "token inválido.",
          );
        }
      }
    }

    logger.info(
      "Verificação de notificações concluída.",
    );
  },
);
