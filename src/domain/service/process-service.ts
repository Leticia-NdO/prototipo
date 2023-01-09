import { EntryRegistry } from '../models/entry-registry'
import { ProcessResult } from '../models/process-result'

export interface ProcessService {
  add: (entryRegister: EntryRegistry) => Promise<ProcessResult>
}
