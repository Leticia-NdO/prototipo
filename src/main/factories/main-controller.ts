import { DbProcessService, DbSearchService } from '../../data/service'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository'
import { EsisPgRepository, VestPgRepository, VlevPgRepository, ViagPgRepository, VlocPgRepository, VsttPgRepository } from '../../infra/db/postgres/process-repository'
import { SearchPgRepository } from '../../infra/db/postgres/search-repository'
import { MainController } from '../../presentation/controllers/main-controller'
import { Controller } from '../../presentation/protocols/controller'
import { LogControllerDecorator } from '../decorators/log'

// in this factory method we will instantiate all the implementations we built, attributing each object as a parameters to the needed classes.

export const makeMainController = (): Controller => {
  // instantiation of repositories
  const searchRepository = new SearchPgRepository()
  const esisRepository = new EsisPgRepository()
  const vlevRepository = new VlevPgRepository()
  const vlocRepository = new VlocPgRepository()
  const vsttRepository = new VsttPgRepository()
  const viagRepository = new ViagPgRepository()
  const vestRepository = new VestPgRepository()
  // instantiation of services
  const searchService = new DbSearchService(searchRepository) // the repository that the DbSearchService needs to work
  const processService = new DbProcessService(
    esisRepository,
    vlevRepository,
    vsttRepository,
    vlocRepository,
    viagRepository,
    vestRepository
  )
  // log repositoy
  const logMongoRepository = new LogMongoRepository()
  const mainController = new MainController(searchService, processService)
  // here we return an decorator (with the log function) instead of the MainController, for the defaultMain function it won't make any difference since the decorator returns the same thing as the class it is decorating.
  return new LogControllerDecorator(mainController, logMongoRepository)
}
