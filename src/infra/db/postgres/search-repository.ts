import { SearchRepository } from '../../../domain/repository/search-repository'
import { EntryRegistry } from '../../../domain/models/entry-registry'
import { PgHelper, queryMaker } from '../postgres/helpers'
import { buildDatesByDay } from './helpers/build-dates'

export class SearchPgRepository implements SearchRepository {
  async get (limit: number, offset: number): Promise<EntryRegistry[]> {
    const [today] = buildDatesByDay(1, -1)
    const resQuery = await PgHelper.client.query<EntryRegistry>({
      name: 'get-search-repository.sql',
      text: queryMaker('search'),
      values: [today, limit, offset]
    })
    return resQuery.rows
  }
}
