// this is the expected result from the search query
export interface EntryRegistry {
  viag_codigo: number
  viag_data_inicio: Date | null
  viag_data_fim: Date | null
  viag_data_cadastro: Date
  lcal_area_codigo: number
  area_ativo: string
  vloc_sequencia: number
  vloc_tpar_codigo: number
  vloc_descricao: string
  vloc_codigo: number
  vimp_codigo: number
  vter_data_cadastro: Date
  term_codigo: number
  term_numero_terminal: string
  term_vtec_codigo: number
  refe_latitude: number
  refe_longitude: number
  tope_livre: string
  tpar_codigo: number
  tpar_descricao: string
  vlev_entrada_codigo: number | null
  vimp_finalizacao_automatica: string
  vimp_finalizacao_entrada: string
  vimp_finalizacao_saida: string
  vimp_efetivacao_automatica: string
  vimp_efetivacao_entrada: string
  vimp_efetivacao_saida: string
  raio: number
  rpos_rece_codigo: number
  rpos_data_computador_bordo: Date
  rpos_latitude: number
  rpos_longitude: number
  rpos_term_numero_terminal: string
  rpos_vtec_codigo: number
  rpos_descricao_sistema: string
  dentro_do_local: boolean
  primeiro_ponto: boolean
  ultimo_ponto: boolean
}
