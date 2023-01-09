import { EntryRegistry } from '../../domain/models/entry-registry'
import { SearchRepository } from '../../domain/repository/search-repository'
import { DbSearchService } from './db-search-service'

interface sutTypes {
  sut: DbSearchService
  searchRepositoryStub: SearchRepository
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

const makeSearchRepositoryStub = (): SearchRepository => {
  class SearchRepositoryStub implements SearchRepository {
    async get (limit: number, offset: number): Promise<EntryRegistry[]> {
      return await new Promise(resolve => resolve([makeEntryRegistry()]))
    }
  }
  return new SearchRepositoryStub()
}

const makeSut = (): sutTypes => {
  const searchRepositoryStub = makeSearchRepositoryStub()
  const sut = new DbSearchService(searchRepositoryStub)
  return { sut, searchRepositoryStub }
}

describe('Search Service', () => {
  it('Should throw if repository throws', async () => {
    const { sut, searchRepositoryStub } = makeSut()

    jest.spyOn(searchRepositoryStub, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const res = sut.get(1, 1)

    await expect(res).rejects.toThrow()
  })

  it('Should return an EntryRegistry on success', async () => {
    const { sut } = makeSut()

    const res = await sut.get(1, 1)

    expect(res).toEqual([makeEntryRegistry()])
  })
})
