export interface VlocRepository {
  updateExecutedSequence: (vlocCodigo: number, viagCodigo: number) => Promise<void>
}
