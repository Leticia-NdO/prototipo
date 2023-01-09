import { ProcessResult } from '../../domain/models/process-result'
import { ServerError } from '../errors/server-error'

// the Controller interface is in the presentation layer because it's only used here and by the main layer

export interface Controller {
  handle: (offset: number, limit: number) => Promise<ProcessResult[] | ServerError>
}
