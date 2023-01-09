import { EntryRegistry } from '../../../../domain/models/entry-registry'
import { EsisRepository } from '../../../../domain/repository/esis-repository'
import { PgHelper, queryMaker } from '../helpers'
import { ESIS } from '../../../../domain/enums/espa'
import { buildDatesByDay } from '../helpers/build-dates'

export class EsisPgRepository implements EsisRepository {
  async add (entryRegistry: EntryRegistry): Promise<void> {
    const [today] = buildDatesByDay(1, -1)
    await PgHelper.client.query({
      name: 'add-esis-repository.sql',
      text: queryMaker('add-esis'),
      values: [
        ESIS.ESPA_CODIGO__ENTRADA_RAIO_DE_COLETA_ENTREGA,
        today,
        new Date(),
        entryRegistry.rpos_rece_codigo,
        entryRegistry.vloc_codigo,
        entryRegistry.term_codigo,
        `CHEGADA EM ${entryRegistry.tpar_descricao}`,
        null,
        entryRegistry.rpos_latitude,
        entryRegistry.rpos_longitude,
        entryRegistry.rpos_descricao_sistema,
        entryRegistry.rpos_data_computador_bordo,
        entryRegistry.viag_codigo
      ]
    })
  }
}
