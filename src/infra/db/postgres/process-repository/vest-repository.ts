import { VestRepository } from '../../../../domain/repository/vest-repository'
import env from '../../../../main/config/env'
import { PgHelper } from '../helpers/pg-helper'
import { queryMaker } from '../helpers/pg-query-maker'

export class VestPgRepository implements VestRepository {
  async add (viagCodigo: number, vestEstatus: string, message: string): Promise<void> {
    await PgHelper.client.query({
      name: 'add-vest-repository.sql',
      text: queryMaker('add-vest'),
      values: [
        viagCodigo,
        env.GeCode,
        vestEstatus,
        message
      ]
    })
  }
}
