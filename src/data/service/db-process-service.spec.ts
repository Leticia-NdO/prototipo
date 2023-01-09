import { EntryRegistry } from '../../domain/models/entry-registry'
import { EsisRepository } from '../../domain/repository/esis-repository'
import { VestRepository } from '../../domain/repository/vest-repository'
import { ViagRepository } from '../../domain/repository/viag-repository'
import { VlevRepository } from '../../domain/repository/vlev-repository'
import { VlocRepository } from '../../domain/repository/vloc-repository'
import { VsttRepository } from '../../domain/repository/vstt-repository'
import { DbProcessService } from './db-process-service'

interface sutTypes {
  sut: DbProcessService
  esisRepositoryStub: EsisRepository
  vlevRepositoryStub: VlevRepository
  vsttRepositoryStub: VsttRepository
  vlocRepositoryStub: VlocRepository
  viagRepositoryStub: ViagRepository
  vestRepositoryStub: VestRepository
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
    vloc_descricao: 'ORIGEM',
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
    tpar_descricao: 'ORIGEM',
    vlev_entrada_codigo: 123,
    vimp_finalizacao_automatica: 'S',
    vimp_finalizacao_entrada: 'S',
    vimp_finalizacao_saida: 'N',
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

const makeEsisRepositoryStub = (): EsisRepository => {
  class EsisRepositoryStub implements EsisRepository {
    async add (entryRegistry: EntryRegistry): Promise<void> {

    }
  }
  return new EsisRepositoryStub()
}

const makeVlevRepositoryStub = (): VlevRepository => {
  class VlevRepositoryStub implements VlevRepository {
    async add (entryRegistry: EntryRegistry): Promise<void> {

    }

    async update (entryRegistry: EntryRegistry, fields: string[]): Promise<void> {

    }
  }

  return new VlevRepositoryStub()
}

const makeVsttRepositoryStub = (): VsttRepository => {
  class VsttRepositoryStub implements VsttRepository {
    async add (entryRegistry: EntryRegistry): Promise<void> {

    }

    async updateStatus (status: string, viagCodigo: number): Promise<void> {

    }
  }

  return new VsttRepositoryStub()
}

const makeVlocRepositoryStub = (): VlocRepository => {
  class VlocRepositoryStub implements VlocRepository {
    async updateExecutedSequence (vlocCodigo: number, viagCodigo: number): Promise<void> {

    }
  }

  return new VlocRepositoryStub()
}

const makeViagRepositoryStub = (): ViagRepository => {
  class ViagRepositoryStub implements ViagRepository {
    async addViagDataFim (viagCodigo: number): Promise<void> {

    }

    async addViagDataInicio (viagCodigo: number): Promise<void> {

    }
  }

  return new ViagRepositoryStub()
}

const makeVestRepositoryStub = (): VestRepository => {
  class VestRepositoryStub implements VestRepository {
    async add (viagCodigo: number, vestEstatus: string, vestObs: string): Promise<void> {

    }
  }

  return new VestRepositoryStub()
}

const makeSut = (): sutTypes => {
  const esisRepositoryStub = makeEsisRepositoryStub()
  const vlevRepositoryStub = makeVlevRepositoryStub()
  const vsttRepositoryStub = makeVsttRepositoryStub()
  const vlocRepositoryStub = makeVlocRepositoryStub()
  const viagRepositoryStub = makeViagRepositoryStub()
  const vestRepositoryStub = makeVestRepositoryStub()
  const sut = new DbProcessService(
    esisRepositoryStub,
    vlevRepositoryStub,
    vsttRepositoryStub,
    vlocRepositoryStub,
    viagRepositoryStub,
    vestRepositoryStub
  )
  return {
    sut,
    esisRepositoryStub,
    vlevRepositoryStub,
    vsttRepositoryStub,
    vlocRepositoryStub,
    viagRepositoryStub,
    vestRepositoryStub
  }
}

describe('Process Service', () => {
  it('Should call EsisRepository`s add method with correct values', async () => {
    const { sut, esisRepositoryStub } = makeSut()

    const sutEsisMethod = jest.spyOn(esisRepositoryStub, 'add')

    await sut.add(makeEntryRegistry())

    expect(sutEsisMethod).toHaveBeenCalledWith(makeEntryRegistry())
  })

  it('Should call VlevRepository`s update method with correct values if vlev_entrada_codigo already exists', async () => {
    const { sut, vlevRepositoryStub } = makeSut()

    const sutVlevMethod = jest.spyOn(vlevRepositoryStub, 'update')

    await sut.add(makeEntryRegistry())

    expect(sutVlevMethod).toHaveBeenCalled()
  })

  it('Should call VlevRepository`s add method if vlev_entrada_codigo does not exists', async () => {
    const { sut, vlevRepositoryStub } = makeSut()

    const sutVlevMethod = jest.spyOn(vlevRepositoryStub, 'add')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.vlev_entrada_codigo = null
    await sut.add(entryRegistry)

    expect(sutVlevMethod).toHaveBeenCalled()
  })

  it('Should call VsttRepository`s updateStatus method with `NC` and 123 if tpar_codigo is 2', async () => {
    const { sut, vsttRepositoryStub } = makeSut()

    const sutVsttMethod = jest.spyOn(vsttRepositoryStub, 'updateStatus')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.tpar_codigo = 2
    await sut.add(entryRegistry)

    expect(sutVsttMethod).toHaveBeenCalledWith('NC', entryRegistry.viag_codigo)
  })

  it('Should call VsttRepository`s updateStatus method with `NC` and 123 if tpar_codigo is 4', async () => {
    const { sut, vsttRepositoryStub } = makeSut()

    const sutVsttMethod = jest.spyOn(vsttRepositoryStub, 'updateStatus')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.tpar_codigo = 4
    await sut.add(entryRegistry)

    expect(sutVsttMethod).toHaveBeenCalledWith('NC', entryRegistry.viag_codigo)
  })

  it('Should call VsttRepository`s updateStatus method with `ND` and 123 if tpar_codigo is 3', async () => {
    const { sut, vsttRepositoryStub } = makeSut()

    const sutVsttMethod = jest.spyOn(vsttRepositoryStub, 'updateStatus')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.tpar_codigo = 3
    await sut.add(entryRegistry)

    expect(sutVsttMethod).toHaveBeenCalledWith('ND', entryRegistry.viag_codigo)
  })

  it('Should call VsttRepository`s updateStatus method with `ND` and 123 if tpar_codigo is 5', async () => {
    const { sut, vsttRepositoryStub } = makeSut()

    const sutVsttMethod = jest.spyOn(vsttRepositoryStub, 'updateStatus')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.tpar_codigo = 5
    await sut.add(entryRegistry)

    expect(sutVsttMethod).toHaveBeenCalledWith('ND', entryRegistry.viag_codigo)
  })

  it('Should call ViagRepository`s addViagDataInicio method with 123 if it meets all iniciation criteria', async () => {
    const { sut, viagRepositoryStub } = makeSut()

    const sutViagMethod = jest.spyOn(viagRepositoryStub, 'addViagDataInicio')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.viag_data_inicio = null
    await sut.add(entryRegistry)

    expect(sutViagMethod).toHaveBeenCalledWith(entryRegistry.viag_codigo)
  })

  it('Should not call ViagRepository`s addViagDataInicio method when it doensn`t meet entrance iniciation criteria', async () => {
    const { sut, viagRepositoryStub } = makeSut()

    const sutViagMethod = jest.spyOn(viagRepositoryStub, 'addViagDataInicio')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.viag_data_inicio = null
    entryRegistry.vimp_efetivacao_automatica = 'S'
    entryRegistry.vimp_efetivacao_entrada = 'N'
    entryRegistry.vimp_efetivacao_saida = 'S'
    await sut.add(entryRegistry)

    expect(sutViagMethod).toHaveBeenCalledTimes(0)
  })

  it('Should call ViagRepository`s addViagDataFim method with 123 if it meets all finalization criteria', async () => {
    const { sut, viagRepositoryStub } = makeSut()

    const sutViagMethod = jest.spyOn(viagRepositoryStub, 'addViagDataFim')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.viag_data_fim = null
    entryRegistry.primeiro_ponto = false
    entryRegistry.ultimo_ponto = true
    await sut.add(entryRegistry)

    expect(sutViagMethod).toHaveBeenCalledWith(entryRegistry.viag_codigo)
  })

  it('Should not call ViagRepository`s addViagDataFim method when it doensn`t meet entrance iniciation criteria', async () => {
    const { sut, viagRepositoryStub } = makeSut()

    const sutViagMethod = jest.spyOn(viagRepositoryStub, 'addViagDataFim')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.viag_data_fim = null
    entryRegistry.vimp_finalizacao_automatica = 'S'
    entryRegistry.vimp_finalizacao_entrada = 'N'
    entryRegistry.vimp_efetivacao_saida = 'S'
    await sut.add(entryRegistry)

    expect(sutViagMethod).toHaveBeenCalledTimes(0)
  })

  it('Should call VestRepository`s add method when it meets all finalization criteria', async () => {
    const { sut, vestRepositoryStub } = makeSut()

    const sutVestMethod = jest.spyOn(vestRepositoryStub, 'add')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.viag_data_fim = null
    entryRegistry.primeiro_ponto = false
    entryRegistry.ultimo_ponto = true
    await sut.add(entryRegistry)

    expect(sutVestMethod).toHaveBeenCalledWith(entryRegistry.viag_codigo, '5', `CHEGADA EM ${entryRegistry.tpar_descricao}`)
  })

  it('Should call VestRepository`s add method when it meets all iniciation criteria', async () => {
    const { sut, vestRepositoryStub } = makeSut()

    const sutVestMethod = jest.spyOn(vestRepositoryStub, 'add')
    const entryRegistry = makeEntryRegistry()
    entryRegistry.viag_data_inicio = null
    await sut.add(entryRegistry)

    expect(sutVestMethod).toHaveBeenCalledWith(entryRegistry.viag_codigo, '1', `CHEGADA EM ${entryRegistry.tpar_descricao}`)
  })

  it('Should throw if Repository throws', async () => {
    const {
      sut,
      esisRepositoryStub
    } = makeSut()

    jest.spyOn(esisRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const entryRegistry = makeEntryRegistry()
    entryRegistry.viag_data_inicio = null
    const res = sut.add(entryRegistry)

    await expect(res).rejects.toThrow()
  })
})
