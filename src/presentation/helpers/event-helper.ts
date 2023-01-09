import { ProcessResult } from '../../domain/models/process-result'
import { ServerError } from '../errors/server-error'

// factory functions to return ProcessResult objects and ServerError objects
export const processResult = (travelId: number, terminalNumber: string, message?: string): ProcessResult => {
  return {
    travelId,
    terminalNumber,
    message
  }
}

export const serverError = (error: Error): ServerError => ({
  name: error.name,
  message: error.message,
  stack: error.stack
})
