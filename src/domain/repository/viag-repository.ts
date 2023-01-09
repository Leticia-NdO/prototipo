
export interface ViagRepository {
  addViagDataInicio: (viagCodigo: number) => Promise<void>
  addViagDataFim: (viagCodigo: number) => Promise<void>
}
