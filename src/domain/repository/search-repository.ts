import { EntryRegistry } from '../../domain/models/entry-registry'

export interface SearchRepository {
  get: (limit: number, offset: number) => Promise<EntryRegistry[]>
}
