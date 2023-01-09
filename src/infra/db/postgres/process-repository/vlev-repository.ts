import { TLEV } from '../../../../domain/enums/tlev'
import { VLEV } from '../../../../domain/enums/vlev'
import { EntryRegistry } from '../../../../domain/models/entry-registry'
import { VlevRepository } from '../../../../domain/repository/vlev-repository'
import { PgHelper } from '../helpers/pg-helper'
import { queryMaker } from '../helpers/pg-query-maker'

export class VlevPgRepository implements VlevRepository {
  async add (entryRegistry: EntryRegistry): Promise<void> {
    await PgHelper.client.query({
      name: 'add-vlev-repository.sql',
      text: queryMaker('add-vlev'),
      values: [
        VLEV.VLEV_CODIGO__CHEGADA,
        entryRegistry.vloc_codigo,
        TLEV.TLEV_CODIGO__CHEGADA,
        entryRegistry.rpos_data_computador_bordo,
        entryRegistry.rpos_rece_codigo,
        entryRegistry.rpos_latitude,
        entryRegistry.rpos_longitude
      ]
    })
  }

  async update (entryRegistry: EntryRegistry): Promise<void> {
    await PgHelper.client.query({
      name: 'update-vlev-repository.sql',
      text: queryMaker('update-vlev'),
      values: [
        entryRegistry.vlev_entrada_codigo,
        entryRegistry.rpos_data_computador_bordo,
        entryRegistry.rpos_rece_codigo,
        entryRegistry.rpos_latitude,
        entryRegistry.rpos_longitude
      ]
    })
  }
}
