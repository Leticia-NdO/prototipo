import { Collection, MongoClient, ObjectId } from 'mongodb'
import { EventConfig } from '../../../../domain/models/event-config'
import env from '../../../../main/config/env'

// MongoHelper is an object with helpful DB properties and functions
export const MongoHelper = {
  url: null as unknown as string,
  client: null as unknown as MongoClient, // Because the syntax for assigning value to an object key and type is the same, so we assign a null value and then type it.
  eventConfig: null as unknown as EventConfig,
  async connect (url: string): Promise<void> {
    this.url = url
    this.client = new MongoClient(url, {
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },
  // gets the event config in MongoDB database
  async getConfig (): Promise<void> {
    this.eventConfig = await this.client.db().collection('config').findOne({ eventId: new ObjectId(env.eventId) })
  },
  // gets specific collection in MongoDB database by name
  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  }
}
