export interface VsttRepository {
  updateStatus: (status: string, viagCodigo: number) => Promise<void>
}
