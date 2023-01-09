export interface VestRepository {
  add: (viagCodigo: number, vestEstatus: string, vestObs: string) => Promise<void>
}
