export class GhasPrescrMedflowPParams {
  nr_atendimento_p: number | null
  cd_medico_p: string | null
  nr_prescr_medflow: number | null
  ie_tipo_p: string | null
  ie_liberado_p: string | null
  cd_procedimento_p: number | null
  qt_procedimento_p: number | null
  ie_lado_p: string | null
  cd_intervalo_p: string | null
  ie_se_necessario_p: string | null
  ie_acm_p: string | null
  ds_horarios_p: string | null
  ie_anestesia_p: string | null
  ds_justificativa_proc_p: string | null
  cd_material_p: number | null
  ds_material_p: string | null
  ds_ind_material_p: string | null
  ie_via_aplicacao_p: string | null
  qt_dose_p: number | null
  cd_unidade_medida_dose_p: string | null
  cd_especialidade_p: number | null
  cd_especialidade_dest_p: number | null
  ds_encaminhamento_p: string | null
  ds_orientacao_p: string | null

  constructor() {
    this.nr_atendimento_p = null
    this.cd_medico_p = null
    this.nr_prescr_medflow = null
    this.ie_tipo_p = null
    this.cd_procedimento_p = null
    this.qt_procedimento_p = null
    this.ie_lado_p = null
    this.cd_intervalo_p = null
    this.ie_se_necessario_p = null
    this.ie_acm_p = null
    this.ds_horarios_p = null
    this.ie_anestesia_p = null
    this.ds_justificativa_proc_p = null
    this.cd_material_p = null
    this.ds_material_p = null
    this.ds_ind_material_p = null
    this.ie_via_aplicacao_p = null
    this.qt_dose_p = null
    this.cd_unidade_medida_dose_p = null
    this.cd_especialidade_p = null
    this.cd_especialidade_dest_p = null
    this.ds_encaminhamento_p = null
    this.ds_orientacao_p = null

    this.ie_liberado_p = 'N'
  }
}
