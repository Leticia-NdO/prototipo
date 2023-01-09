import { Client } from 'pg'
import * as fs from 'fs'

// PgHelper is an object with helpful DB properties and functions
export const PgHelper = {
  client: null as unknown as Client,
  async connect (appName: string): Promise<void> {
    const config = JSON.parse(fs.readFileSync('db.json').toString())
    config.application_name = appName
    this.client = new Client(config)
    this.client.connect()
  },
  async disconnect (): Promise<void> {
    await this.client.end()
    this.client = null
  }
}
