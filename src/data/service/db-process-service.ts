/* eslint-disable no-useless-catch */
import { ProcessService } from '../../domain/service/process-service'
import { EntryRegistry, ProcessResult } from '../../domain/models'
import { VlevRepository, VsttRepository, VestRepository, ViagRepository, VlocRepository, EsisRepository } from '../../domain/repository'
import { TPAR, VEST } from '../../domain/enums'

/* This class is the implementation of the ProcessService interface that the MainController requires, therefore,
we can pass it as a parameter to MainController  */
export class DbProcessService implements ProcessService {
  private readonly esisRepository: EsisRepository
  private readonly vlevRepository: VlevRepository
  private readonly vsttRepository: VsttRepository
  private readonly vlocRepository: VlocRepository
  private readonly viagRepository: ViagRepository
  private readonly vestRepository: VestRepository

  private message: string

  constructor (
    esisRepository: EsisRepository,
    vlevRepository: VlevRepository,
    vsttRepository: VsttRepository,
    vlocRepository: VlocRepository,
    viagRepository: ViagRepository,
    vestRepository: VestRepository
  ) {
    this.esisRepository = esisRepository
    this.vlevRepository = vlevRepository
    this.vsttRepository = vsttRepository
    this.vlocRepository = vlocRepository
    this.viagRepository = viagRepository
    this.vestRepository = vestRepository
  }

  // an entry registry process have 6 steps in total, and each step was divided in a function
  async add (entryRegistry: EntryRegistry): Promise<ProcessResult> {
    // first, it will insert the event in the esis table
    await this.esisRepository.add(entryRegistry)
    // second, it will insert or update the entry date in the vlev table
    await this.handleVlev(entryRegistry)
    // change the vstt travel status
    await this.handleVsttStatus(entryRegistry)

    await this.vlocRepository.updateExecutedSequence(entryRegistry.vloc_codigo, entryRegistry.viag_codigo)
    // check if it fits all the conditions for travel initiation
    await this.checkIniciationConditions(entryRegistry)
    // check if it fits all the conditions for travel completion
    await this.checkFinalizationConditions(entryRegistry)

    // returns an ProcessResult object
    return {
      travelId: entryRegistry.viag_codigo,
      terminalNumber: entryRegistry.term_numero_terminal,
      message: this.message
    }
  }

  private async handleVlev (entryRegistry: EntryRegistry): Promise<void> {
    entryRegistry.vlev_entrada_codigo
      ? await this.vlevRepository.update(entryRegistry, [''])
      : await this.vlevRepository.add(entryRegistry)
  }

  // it updates the vstt travel status based on kinf of location
  private async handleVsttStatus (entryRegistry: EntryRegistry): Promise<void> {
    if (entryRegistry.tpar_codigo === TPAR.TPAR_CODIGO__COLETA || entryRegistry.tpar_codigo === TPAR.TPAR_CODIGO__ENTREGA || entryRegistry.tpar_codigo === TPAR.TPAR_CODIGO__ORIGEM || entryRegistry.tpar_codigo === TPAR.TPAR_CODIGO__DESTINO) {
      await this.vsttRepository.updateStatus(entryRegistry.tpar_codigo === 2 || entryRegistry.tpar_codigo === 4 ? 'NC' : 'ND', entryRegistry.viag_codigo)
    }
  }

  private async checkIniciationConditions (entryRegistry: EntryRegistry): Promise<void> {
    const iniciatedTerms: { [key: number]: boolean } = {}
    if (
      entryRegistry.vimp_efetivacao_automatica === 'S' &&
      !(entryRegistry.vimp_efetivacao_entrada === 'N' && entryRegistry.vimp_efetivacao_saida === 'S') &&
      entryRegistry.primeiro_ponto &&
      entryRegistry.viag_data_inicio === null &&
      !iniciatedTerms[entryRegistry.term_codigo]
    ) {
      this.message = 'Viagem iniciada'
      iniciatedTerms[entryRegistry.term_codigo] = true
      await this.iniciateTravel(entryRegistry.viag_codigo)
      await this.insertVest(entryRegistry.viag_codigo, VEST.VEST_ESTATUS__EFETIVADA, `CHEGADA EM ${entryRegistry.tpar_descricao}`)
    }
  }

  private async iniciateTravel (viagCodigo: number): Promise<void> {
    await this.viagRepository.addViagDataInicio(viagCodigo)
  }

  private async insertVest (viagCodigo: number, vestEstatus: string, message: string): Promise<void> {
    await this.vestRepository.add(viagCodigo, vestEstatus, message)
  }

  private async checkFinalizationConditions (entryRegistry: EntryRegistry): Promise<void> {
    const finishedTerms: { [key: number]: boolean } = {}
    if (
      entryRegistry.vimp_finalizacao_automatica === 'S' &&
      entryRegistry.vimp_finalizacao_entrada === 'S' &&
      entryRegistry.vimp_finalizacao_saida === 'N' &&
      !finishedTerms[entryRegistry.term_codigo] &&
      entryRegistry.viag_data_fim === null &&
       entryRegistry.ultimo_ponto
    ) {
      this.message = 'viagem finalizada'
      finishedTerms[entryRegistry.term_codigo] = true
      await this.finishTravel(entryRegistry.viag_codigo)
      await this.insertVest(entryRegistry.viag_codigo, VEST.VEST_ESTATUS__FINALIZADA, `CHEGADA EM ${entryRegistry.tpar_descricao}`)
    }
  }

  private async finishTravel (viagCodigo: number): Promise<void> {
    await this.viagRepository.addViagDataFim(viagCodigo)
  }
}
