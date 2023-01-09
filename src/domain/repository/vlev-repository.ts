import { EntryRegistry } from '../../domain/models/entry-registry'

export interface VlevRepository {
  add: (entryRegistry: EntryRegistry) => Promise<void>

  update: (entryRegistry: EntryRegistry, fields: string[]) => Promise<void>
}
