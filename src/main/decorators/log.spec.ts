import { serverError } from '../../presentation/helpers/event-helper'
import { Controller } from '../../presentation/protocols/controller'
import { LogControllerDecorator } from './log'
import { LogRepository } from '../../domain/repository/log-repository'
import { ServerError } from '../../presentation/errors/server-error'
import { ProcessResult } from '../../domain/models/process-result'

interface sutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
  logRepositoryStub: LogRepository
}

const makeServerError = (): ServerError => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  return serverError(fakeError)
}

const makeProcessResult = (): ProcessResult => {
  const entryRegistry = {
    travelId: 1,
    terminalNumber: '52525252',
    message: 'Finished'
  }

  return entryRegistry
}
const makeLogErrorRepository = (): LogRepository => {
  class LogRepositoryStub implements LogRepository {
    async logError (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }

    async logSuccess (processResult: ProcessResult): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new LogRepositoryStub()
}
const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (offset: number, limit: number): Promise<ProcessResult[] | ServerError> {
      return [makeProcessResult()]
    }
  }
  return new ControllerStub()
}

const makeSut = (): sutTypes => {
  const controllerStub = makeControllerStub()
  const logRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logRepositoryStub)
  return { controllerStub, sut, logRepositoryStub }
}

describe('LogControllerDecorator', () => {
  it('Should call controller handle function', async () => {
    const { sut, controllerStub } = makeSut()
    const sutHandleMethod = jest.spyOn(controllerStub, 'handle')
    await sut.handle(1, 1)
    expect(sutHandleMethod).toHaveBeenCalledWith(1, 1)
  })

  it('Should return same result of the controller', async () => {
    const { sut } = makeSut()
    const processResult = makeProcessResult()
    const result = await sut.handle(1, 1)
    expect(result).toEqual([processResult])
  })

  it('Should call LogRepository`s logError with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logRepositoryStub } = makeSut()
    const error = makeServerError()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const logSpy = jest.spyOn(logRepositoryStub, 'logError')

    await sut.handle(1, 1)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })

  it('Should call LogRepository`s logError with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logRepositoryStub } = makeSut()
    const error = makeServerError()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const logSpy = jest.spyOn(logRepositoryStub, 'logError')

    await sut.handle(1, 1)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })

  it('Should call LogRepository`s logSuccess with correct values if controller returns ProcessResult', async () => {
    const { sut, logRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logRepositoryStub, 'logSuccess')

    await sut.handle(1, 1)
    expect(logSpy).toHaveBeenCalledWith(makeProcessResult())
  })
})
