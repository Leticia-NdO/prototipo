import { EntryRegistry } from '../models/entry-registry'

export interface EsisRepository {
  add: (entryRegistry: EntryRegistry) => Promise<void>
}
