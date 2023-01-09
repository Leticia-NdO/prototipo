import { Collection } from 'mongodb'
import { MongoHelper } from './helpers/mongo-helper'
import { LogMongoRepository } from './log-repository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log MongoRepository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({}) // if we pass an empty object all collection's documents will be deleted
  })

  it('Should create an error log in success', async () => {
    const sut = makeSut()
    await sut.logError('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
