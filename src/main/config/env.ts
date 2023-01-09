export default {
  GeCode: process.env.USUA_CODIGO__GE ?? -7,
  GeLogin: process.env.USUA_LOGIN__GE ?? 'GERADOR DE EVENTOS',
  eventId: process.env.EVENT_ID ?? '639887bcca0c9f4ff07c8498',
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/prototipo',
  port: process.env.PORT ?? 5050,
  appName: process.env.APP_NAME ?? 'trouw-ge-entrada-local-em-viagem-livre'
}
