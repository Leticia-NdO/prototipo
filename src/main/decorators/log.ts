import { LogRepository } from '../../domain/repository/log-repository'
import { Controller } from '../../presentation/protocols/controller'
import { ProcessResult } from '../../domain/models/process-result'
import { ServerError } from '../../presentation/errors/server-error'

/* "Decorator is a structural design pattern that lets you attach new behaviors to objects by
placing these objects inside special wrapper objects that contain the behaviors."
  In this case we want to add a new behavior of logging in a database to the MainController class, but at the same time, we want
to respect the Open-closed Principle (OCP) (objects or entities should be open for extension but closed for modification). So,
to solve this problem, we wrap the MainController in a class that contain the logger behavior. It will return the exact same thing
as the MainController, but before, it will log into the Mongo database. */

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logRepository: LogRepository

  constructor (controller: Controller, logRepository: LogRepository) {
    this.controller = controller
    this.logRepository = logRepository
  }

  async handle (offset: number, limit: number): Promise<ProcessResult[] | ServerError> {
    const result = await this.controller.handle(offset, limit)
    if ('stack' in result) { // if it's a ServerError
      await this.logRepository.logError(result.stack as string)
    }

    if (Array.isArray(result)) { // If it's a ProcessResult
      for (let i = 0; i < result.length; i++) {
        await this.logRepository.logSuccess(result[i])
      }
    }
    return result
  }
}
