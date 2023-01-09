import { ProcessResult } from '../../domain/models/process-result'
import { EntryRegistry } from '../../domain/models/entry-registry'
import { ProcessService } from '../../domain/service/process-service'
import { SearchService } from '../../domain/service/search-service'
import { MainController } from './main-controller'
import { ServerError } from '../errors/server-error'
import { serverError } from '../helpers/event-helper'

interface sutTypes {
  sut: MainController
  searchServiceStub: SearchService
  processServiceStub: ProcessService
}

const makeEntryRegistry = (): EntryRegistry => {
  const entryRegistry = {
    viag_codigo: 123,
    viag_data_inicio: new Date('01/01/2000'),
    viag_data_fim: new Date('01/01/2000'),
    viag_data_cadastro: new Date('01/01/2000'),
    lcal_area_codigo: 123,
    area_ativo: 'S',
    vloc_sequencia: 123,
    vloc_tpar_codigo: 123,
    vloc_descricao: '',
    vloc_codigo: 123,
    vimp_codigo: 123,
    vter_data_cadastro: new Date('01/01/2000'),
    term_codigo: 123,
    term_numero_terminal: '',
    term_vtec_codigo: 123,
    refe_latitude: 123,
    refe_longitude: 123,
    tope_livre: 'S',
    tpar_codigo: 123,
    tpar_descricao: '',
    vlev_entrada_codigo: 123,
    vimp_finalizacao_automatica: 'S',
    vimp_finalizacao_entrada: 'S',
    vimp_finalizacao_saida: 'S',
    vimp_efetivacao_automatica: 'S',
    vimp_efetivacao_entrada: 'S',
    vimp_efetivacao_saida: 'S',
    raio: 123,
    rpos_rece_codigo: 123,
    rpos_data_computador_bordo: new Date('01/01/2000'),
    rpos_latitude: 123,
    rpos_longitude: 123,
    rpos_term_numero_terminal: '',
    rpos_vtec_codigo: 123,
    rpos_descricao_sistema: '',
    dentro_do_local: true,
    primeiro_ponto: true,
    ultimo_ponto: false
  }

  return entryRegistry
}

const makeSearchService = (): SearchService => {
  class SearchServiceStub implements SearchService {
    async get (offset: number, limit: number): Promise<EntryRegistry[] | null> {
      return await new Promise(resolve => resolve([makeEntryRegistry()]))
    }
  }

  return new SearchServiceStub()
}

const makeProcessService = (): ProcessService => {
  class ProcessServiceStub implements ProcessService {
    async add (entryRegister: EntryRegistry): Promise<ProcessResult> {
      return await new Promise(resolve => resolve({
        travelId: 1,
        terminalNumber: '52525252',
        message: 'Finished'
      }))
    }
  }

  return new ProcessServiceStub()
}

const makeSut = (): sutTypes => {
  const searchServiceStub = makeSearchService()
  const processServiceStub = makeProcessService()
  const sut = new MainController(searchServiceStub, processServiceStub)

  return { sut, searchServiceStub, processServiceStub }
}

describe('MainController', () => {
  it('Should return a Server Error when Search Service throws', async () => {
    const { sut, searchServiceStub } = makeSut()

    const fakeError = new Error('error')
    fakeError.stack = 'error'

    jest.spyOn(searchServiceStub, 'get').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(fakeError))
    })

    const res = await sut.handle(1, 1)

    expect(res).toEqual(serverError(new ServerError('error')))
  })

  it('Should return a ProcessResult array on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(1, 1)

    expect(res).toEqual([{
      travelId: 1,
      terminalNumber: '52525252',
      message: 'Finished'
    }])
  })
})
