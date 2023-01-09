import { ViagRepository } from '../../../../domain/repository/viag-repository'
import env from '../../../../main/config/env'
import { PgHelper } from '../helpers/pg-helper'
import { queryMaker } from '../helpers/pg-query-maker'

export class ViagPgRepository implements ViagRepository {
  async addViagDataInicio (viagCodigo: number): Promise<void> {
    await PgHelper.client.query({
      name: 'add-viag-data-inicio-repository.sql',
      text: queryMaker('add-viagDataInicio'),
      values: [
        viagCodigo,
        env.GeLogin
      ]
    })
  }

  async addViagDataFim (viagCodigo: number): Promise<void> {
    await PgHelper.client.query({
      name: 'add-viag-data-fim-repository.sql',
      text: queryMaker('add-viagDataFim'),
      values: [
        viagCodigo,
        env.GeLogin
      ]
    })
  }
}
