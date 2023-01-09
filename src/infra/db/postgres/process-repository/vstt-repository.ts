import { VsttRepository } from '../../../../domain/repository/vstt-repository'
import { PgHelper } from '../helpers/pg-helper'
import { queryMaker } from '../helpers/pg-query-maker'

export class VsttPgRepository implements VsttRepository {
  async updateStatus (status: string, viagCodigo: number): Promise<void> {
    await PgHelper.client.query({
      name: 'update-vstt-status-repository.sql',
      text: queryMaker('add-vstt-status'),
      values: [
        status,
        viagCodigo
      ]
    })
  }
}
