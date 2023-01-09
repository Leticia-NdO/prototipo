import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import { PgHelper } from '../infra/db/postgres/helpers/pg-helper'
import env from './config/env'
import { makeMainController } from './factories/main-controller'

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

const appName = env.appName

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    `App exiting due to an unhandled promise: ${JSON.stringify(promise)} and reason: ${JSON.stringify(reason)}`
  )
  throw reason
})

process.on('uncaughtException', (error) => {
  console.log(`App exiting due to an uncaught exception: ${error.message}`)
  process.exit(ExitStatus.Failure)
})

async function sleep (seconds: number): Promise<number> {
  const ms = seconds * 1000 // to convert seconds to milisseconds
  return await new Promise(resolve => setTimeout(resolve, ms))
}

const defaultMain = async (): Promise<void> => {
  await PgHelper.connect(appName) // cinnect to Postgres
  await MongoHelper.connect(env.mongoUrl) // connect to MongoDB
  const controller = makeMainController()
  try {
    while (process.exitCode == null) {
      await MongoHelper.getConfig() // Load event config information

      console.time(`${appName}.sql`)
      const res = await controller.handle(MongoHelper.eventConfig.offset, MongoHelper.eventConfig.limit)

      console.log(MongoHelper.eventConfig)

      if ((Array.isArray(res) && res.length > 0) || 'stack' in res) console.log(res) // if there is an answer, log it
      console.timeEnd(`${appName}.sql`)

      const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']

      for (const exitSignal of exitSignals) {
        process.on(exitSignal, async () => {
          try {
            await PgHelper.disconnect()
            await MongoHelper.disconnect()
            console.log('App exited with success') // if there is an exit signal disconnect from both DBs and exit application on successful exit
            process.exit(ExitStatus.Success)
          } catch (error) {
            console.log(`App exited with error: ${error as string}`)
            process.exit(ExitStatus.Failure)
          }
        })
      }
      await sleep(MongoHelper.eventConfig.loopingTime) // looping time is defined on event config
    }
  } catch (err) {
    console.log('defaultMain.err', err)
    if (process.exitCode == null) process.exitCode = 645
  } finally {
    try {
      await PgHelper.disconnect()
      await MongoHelper.disconnect()
      console.log('App exited with success')
      process.exit(ExitStatus.Success)
    } catch (err) {
      console.log(`App exited with error: ${err as string}`)
      process.exit(ExitStatus.Failure)
    }
  }
}

defaultMain()
