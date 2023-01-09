import { ProcessResult } from '../models/process-result'

export interface LogRepository {
  logError: (stack: string) => Promise<void>
  logSuccess: (processResult: ProcessResult) => Promise<void>
}
