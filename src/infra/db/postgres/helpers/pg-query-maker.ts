import { buildDatesByDay } from './build-dates'

const [today] = buildDatesByDay(1, -1)
const day = today.getUTCDate()

export const queryMaker = (flag: string): string => {
  let sql: string
  switch (flag) {
    case 'search':
      sql = `WITH 
  tope AS
  (
    SELECT * FROM tope_tipo_operacao
  ),
  cte_term_em_viag
  AS (SELECT vter_term_codigo AS term_codigo
        FROM viag_viagem
        JOIN vimp_viagem_importada ON vimp_viag_codigo = viag_codigo
        JOIN vter_viagem_terminal  ON vter_viag_codigo = viag_codigo
       WHERE vter_precedencia = '1'
         AND vter_ativo = 'S'
         AND viag_data_inicio IS NOT NULL
         AND viag_data_fim IS NULL
         AND vimp_status = 'P'
),
  cte_rpos AS 
  (
    SELECT *
    FROM (
    SELECT rpos_rece_codigo,
           rpos_data_computador_bordo,
           rpos_latitude,
           rpos_longitude,
           rpos_term_numero_terminal,
           rpos_vtec_codigo,
           rpos_descricao_sistema
      FROM rpos_recebimento_posicao_${day < 10 ? (`0${day}`) : day}
     WHERE rpos_data_cadastro >= $1 AND rpos_velocidade <= '7' OR rpos_ignicao = '0' OR rpos_vtec_codigo = 6658
  ) AS rpos_hoje
  ), 
  pontos_viagem AS 
  (
    SELECT * 
    FROM 
      viag_viagem viag
     JOIN vloc_viagem_local        vloc         ON viag.viag_codigo               = vloc.vloc_viag_codigo AND vloc.vloc_ativo = 'S'
    JOIN vimp_viagem_importada    vimp         ON vimp.vimp_viag_codigo          = viag.viag_codigo AND vimp.vimp_status = 'P'
    JOIN vter_viagem_terminal     vter         ON vter.vter_viag_codigo          = viag.viag_codigo AND vter.vter_precedencia = '1' AND vter.vter_ativo = 'S'
    WHERE 
      viag_data_fim IS NULL
  ),
  pontos_visitados AS
  (
    SELECT * 
    FROM 
      viag_viagem viag
      JOIN vloc_viagem_local        vloc         ON viag.viag_codigo               = vloc.vloc_viag_codigo AND vloc.vloc_ativo = 'S'
      JOIN vimp_viagem_importada    vimp         ON vimp.vimp_viag_codigo          = viag.viag_codigo AND vimp.vimp_status = 'P'
      JOIN vter_viagem_terminal     vter         ON vter.vter_viag_codigo          = viag.viag_codigo AND vter.vter_precedencia = '1' AND vter.vter_ativo = 'S'
      JOIN vlev_viagem_local_evento vlev         ON vloc.vloc_codigo               = vlev.vlev_vloc_codigo
      WHERE 
      viag_data_fim IS NULL AND vlev.vlev_codigo IS NOT NULL
  )
  SELECT DISTINCT ON 
  (
    from_viag_rpos.vloc_codigo
  ) *
  FROM 
  (
    SELECT 
      from_viag.*,
          cte_rpos.*,
      CASE
        WHEN from_viag.lcal_area_codigo IS NOT NULL AND from_viag.area_ativo = 'S'
              THEN referencia_dentro_poligono(cte_rpos.rpos_latitude, cte_rpos.rpos_longitude, from_viag.lcal_area_codigo)
        ELSE 
          CASE
                      WHEN
                      (
              ACOS
              (
                              COS(RADIANS(from_viag.refe_latitude)) * COS(RADIANS(cte_rpos.rpos_latitude)) * COS(RADIANS(from_viag.refe_longitude) - RADIANS(cte_rpos.rpos_longitude)) 
                              +
                              SIN(RADIANS(from_viag.refe_latitude)) * SIN(RADIANS(cte_rpos.rpos_latitude))
                          ) * 6371 * 1000) <= from_viag.raio
                      THEN true
                      ELSE false
                  END
          END AS dentro_do_local,
          CASE
              WHEN ((SELECT COUNT(*) FROM pontos_visitados pvis WHERE pvis.viag_codigo = from_viag.viag_codigo) = 0)
              THEN true
              ELSE false
          END AS primeiro_ponto,
          CASE
              WHEN ((SELECT COUNT(*) FROM pontos_viagem pvia WHERE pvia.viag_codigo = from_viag.viag_codigo) * 2 - 2) - (SELECT COUNT(*) FROM pontos_visitados pvis WHERE pvis.viag_codigo = from_viag.viag_codigo) = 0
              THEN true
              ELSE false
          END AS ultimo_ponto
      FROM 
    (
      SELECT 
        viag.viag_codigo,
        viag.viag_data_inicio,
        viag.viag_data_fim,
        viag.viag_data_cadastro,
        lcal_area_codigo,
        area_ativo,
        vloc.vloc_sequencia,
        vloc.vloc_tpar_codigo,
        vloc.vloc_descricao,
        vloc.vloc_codigo,
        vimp.vimp_codigo,
        vter.vter_data_cadastro,
        term.term_codigo,
        term.term_numero_terminal,
        term.term_vtec_codigo,
        refe.refe_codigo,
        refe.refe_latitude,
        refe.refe_longitude,
        tope.tope_livre,
        tpar.tpar_codigo,
        tpar.tpar_descricao,
        vlev.vlev_codigo AS vlev_entrada_codigo,
        COALESCE(vimp_finalizacao_automatica, 'S') AS vimp_finalizacao_automatica,
        COALESCE(vimp_finalizacao_entrada, 'N') AS vimp_finalizacao_entrada,
        COALESCE(vimp_finalizacao_saida, 'S') AS vimp_finalizacao_saida,
        COALESCE(vimp_efetivacao_automatica, 'S') AS vimp_efetivacao_automatica,
        COALESCE(vimp_efetivacao_entrada, 'S') AS vimp_efetivacao_entrada,
        COALESCE(vimp_efetivacao_saida, 'N') AS vimp_efetivacao_saida,
        coalesce(vloc.vloc_raio, refe.refe_raio, 500) as raio
          FROM viag_viagem viag
      JOIN                                      tope        ON viag.viag_tope_codigo          = tope.tope_codigo AND tope.tope_livre = 'S'
      JOIN vloc_viagem_local                    vloc        ON viag.viag_codigo               = vloc.vloc_viag_codigo AND vloc.vloc_ativo = 'S'                      
      JOIN vimp_viagem_importada                vimp        ON vimp.vimp_viag_codigo          = viag.viag_codigo AND vimp.vimp_status = 'P'
      JOIN vter_viagem_terminal                 vter        ON vter.vter_viag_codigo          = viag.viag_codigo AND vter.vter_precedencia = '1' AND vter.vter_ativo = 'S'
      JOIN term_terminal                        term        ON term.term_codigo               = vter.vter_term_codigo
      JOIN refe_referencia                      refe        ON refe.refe_codigo               = vloc.vloc_refe_codigo
      JOIN lcal_local                           lcal        ON lcal.lcal_refe_codigo          = refe.refe_codigo
      JOIN tpar_tipo_parada                     tpar        ON tpar.tpar_codigo               = vloc.vloc_tpar_codigo
      LEFT JOIN area_area                       area        ON area_codigo                    = lcal_area_codigo
      LEFT JOIN cte_term_em_viag         cte_em_viag  ON cte_em_viag.term_codigo        = term.term_codigo
      LEFT JOIN vlev_viagem_local_evento        vlev      ON vloc.vloc_codigo             = vlev.vlev_vloc_codigo
      WHERE 
        vlev.vlev_data IS NULL
        AND viag.viag_data_fim IS NULL
        AND NOT (cte_em_viag.term_codigo IS NOT NULL AND viag.viag_data_inicio IS NULL)
    ) AS from_viag
      JOIN cte_rpos ON cte_rpos.rpos_term_numero_terminal = from_viag.term_numero_terminal AND cte_rpos.rpos_vtec_codigo = from_viag.term_vtec_codigo
      WHERE 
      cte_rpos.rpos_data_computador_bordo >  COALESCE(from_viag.viag_data_inicio, from_viag.vter_data_cadastro)
  ) AS from_viag_rpos
  WHERE 
    from_viag_rpos.dentro_do_local = true
  ORDER BY 
    from_viag_rpos.vloc_codigo,
      from_viag_rpos.viag_codigo 
  DESC,
    from_viag_rpos.rpos_data_computador_bordo
  ASC
  LIMIT $2 OFFSET $3
  `
      break
    case 'add-esis':
      sql = `INSERT INTO esis_evento_sistema(
        esis_codigo,
        esis_espa_codigo,
        esis_data_inicio,
        esis_data_fim,
        esis_valor,
        esis_valor2,
        esis_term_codigo,
        esis_descricao,
        esis_pgai_codigo,
        esis_latitude,
        esis_longitude,
        esis_descricao_posicao,
        esis_data_computador_bordo,
        esis_viag_codigo)
      VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`
      break
    case 'add-vest':
      sql = `
      INSERT INTO vest_viagem_estatus (
        vest_codigo,
        vest_viag_codigo,
        vest_usua_pfis_pess_oras_codigo,
        vest_estatus,
        vest_observacao
      )
      VALUES (DEFAULT, $1, $2, $3, $4)
      `
      break
    case 'add-viagDataInicio':
      sql = `
      UPDATE viag_viagem
         SET viag_data_inicio = now(),
             viag_usuario_efetivou = $2
       WHERE viag_codigo = $1
      `
      break
    case 'add-viagDataFim':
      sql = `
      UPDATE viag_viagem
         SET viag_data_fim = now(),
             viag_usuario_finalizou = $2
       WHERE viag_codigo = $1
      `
      break
    case 'update-vlev':
      sql = `
      UPDATE vlev_viagem_local_evento
         SET vlev_data = $2,
             vlev_rece_codigo = $3,
             vlev_latitude = $4,
             vlev_longitude = $5
       WHERE vlev_codigo = $1
      `
      break
    case 'get-vloc-sequence':
      sql = 'select max(vloc_sequencia_executada) from vloc_viagem_local where vloc_viag_codigo = $1'
      break
    case 'update-vloc-sequence':
      sql = 'update vloc_viagem_local set vloc_sequencia_executada = $1 where vloc_codigo = $2'
      break
    case 'add-vstt-status':
      sql = `UPDATE vstt_viagem_status
      SET
        vstt_status_viagem = $1
      WHERE vstt_viag_codigo = $2
      `
      break
    default:
      sql = ''
      break
  }

  return sql
}
