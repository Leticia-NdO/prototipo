import { VlocRepository } from '../../../../domain/repository/vloc-repository'
import { PgHelper } from '../helpers/pg-helper'
import { queryMaker } from '../helpers/pg-query-maker'

export class VlocPgRepository implements VlocRepository {
  async updateExecutedSequence (vlocCodigo: number, viagCodigo: number): Promise<void> {
    await PgHelper.client.query({
      name: 'add-vlov-sequencia-executada-repository.sql',
      text: queryMaker('add-vlocSequence'),
      values: [
        viagCodigo,
        vlocCodigo
      ]
    })
  }
}
