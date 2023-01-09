import { ObjectId } from 'mongodb'
import { ProcessResult } from '../../../domain/models/process-result'
import { LogRepository } from '../../../domain/repository/log-repository'
import env from '../../../main/config/env'
import { MongoHelper } from './helpers/mongo-helper'

export class LogMongoRepository implements LogRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date().toLocaleString(),
      eventId: new ObjectId(env.eventId)
    })
  }

  async logSuccess (processResult: ProcessResult): Promise<void> {
    const successCollection = await MongoHelper.getCollection('successful')
    await successCollection.insertOne({
      travelId: processResult.travelId,
      terminalNumber: processResult.terminalNumber,
      message: processResult.message,
      eventId: new ObjectId(env.eventId),
      date: new Date().toLocaleString()
    })
  }
}
