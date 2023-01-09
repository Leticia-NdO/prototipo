import { EntryRegistry } from '../models/entry-registry'

export interface SearchService {
  get: (offset: number, limit: number) => Promise<EntryRegistry[] | null>
}
