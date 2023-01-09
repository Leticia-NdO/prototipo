import { Controller } from '../protocols/controller'
import { SearchService, ProcessService } from '../../domain/service'
import { EntryRegistry } from '../../domain/models/entry-registry'
import { processResult, serverError } from '../helpers/event-helper'
import { ProcessResult } from '../../domain/models/process-result'
import { ServerError } from '../errors/server-error'

export class MainController implements Controller {
  private readonly searchService: SearchService
  private readonly processService: ProcessService

  constructor (
    searchService: SearchService,
    processService: ProcessService
  ) {
    this.searchService = searchService
    this.processService = processService
  }

  async handle (offset: number, limit: number): Promise<ProcessResult[] | ServerError> {
    try {
      const searchResult = await this.searchService.get(offset, limit)
      const results: ProcessResult[] = []

      // if SearchService returns something, we process each registry individually
      if (searchResult && searchResult.length > 0) {
        for (let i = 0; i < searchResult.length; i++) {
          const processResult = await this.process(searchResult[i])
          results.push(processResult as ProcessResult)
        }
      }
      // and then we return a ProccessResult array
      return results
    } catch (error) {
      // if there is an error we return an ServerError object
      return serverError(new ServerError(error.stack as string))
    }
  }

  private async process (entryRegistry: EntryRegistry): Promise<ProcessResult | ServerError> {
    try {
      // it process the EntryRegistry
      const res = await this.processService.add(entryRegistry)
      // it returns a ProcessResult object
      return processResult(res.travelId, res.terminalNumber, res.message)
    } catch (error) {
      return serverError(new ServerError(error.stack as string))
    }
  }
}
