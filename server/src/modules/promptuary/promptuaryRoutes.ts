import { AxiosRequestConfig } from 'axios'
import { FastifyInstance, FastifyReply } from 'fastify'

import { GhasPrescrMedflowPParams } from './model/GhasPrescrMedflowPParams'

import { findAttendance } from './functions/findAttendance'
import { findDoctor } from './functions/findDoctor'
import { executeProcedure_GHAS_PRESCR_MEDFLOW_P } from './repository/executeProcedure_GHAS_PRESCR_MEDFLOW_P'
import { identifyRecordType } from './functions/identifyRecordType'
import { findProcedureCode } from './functions/findProcedureCode'
import { findQuantityProcedure } from './functions/findQuantityProcedure'
import { findSide } from './functions/findSide'
import { findIntervalCode } from './functions/findIntervalCode'
import { findIsNecessary } from './functions/findIsNecessary'
import { findMaterialCode } from './functions/findMaterialCode'
import { findApplicationVia } from './functions/findApplicationVia'
import { findQuantityDose } from './functions/findQuantityDose'
import { findMedidaUnityCode } from './functions/findMedidaUnityCode'
import { findEspecialidadeMedica } from './functions/findEspecialidadeMedica'
import { findEncaminhamento } from './functions/findEncaminhamento'
import { findOrientacao } from './functions/findOrientacao'
import { makeRequest } from '../../utils/makeRequest'

const validResourceTypes = ['MedicationRequest', 'ServiceRequest', 'CarePlan']

export async function promptuary(app: FastifyInstance) {
  app.post(
    '/webhook/endpoint/path/',
    async (request, reply): Promise<FastifyReply> => {
      console.log('Chegou Requisição Medflow')

      const body: any = request.body

      const urlToGetBundle = `${process.env.URL_BASE_MEDFLOW}${body.data.bundle_url}`

      const protocolOnMediflowObjectRequest: AxiosRequestConfig = {
        method: 'GET',
        url: urlToGetBundle,
        headers: {
          'x-client-id': process.env.CLIENT_ID,
        },
      }

      console.log(protocolOnMediflowObjectRequest)

      const medflowBundle: any = (
        await makeRequest(protocolOnMediflowObjectRequest)
      ).data

      console.log('Bundle Medflow:')
      console.log(medflowBundle)

      const resourcesToProcess = medflowBundle.entry.filter((item) =>
        validResourceTypes.includes(item.resource.resourceType),
      )

      let index = 0

      for (const resource of resourcesToProcess) {
        const attendanceData = findAttendance(medflowBundle)
        const doctorData = findDoctor(medflowBundle, resource)
        const recordType = identifyRecordType(resource)
        const procedureCode = findProcedureCode(resource, recordType)
        const quantityProcedure = findQuantityProcedure(resource)
        const side = findSide(resource)
        const intervalCode = findIntervalCode(resource)
        const isNecessary = findIsNecessary(resource)
        const materialCode = findMaterialCode(resource)
        const applicationVia = findApplicationVia(resource)
        const quantityDose = findQuantityDose(resource)
        const unityCode = findMedidaUnityCode(resource)
        const especialidadeCode = findEspecialidadeMedica(recordType, resource)
        const encaminhamentoText = findEncaminhamento(recordType, resource)
        const orientacao = findOrientacao(resource)
        const prdParams = new GhasPrescrMedflowPParams()

        prdParams.nr_atendimento_p = attendanceData.resource.identifier.find(
          (item) => item.use === 'usual',
        ).value
        prdParams.cd_medico_p = doctorData.resource.identifier[0].value // 1367

        prdParams.nr_prescr_medflow = medflowBundle.id

        prdParams.ie_tipo_p = recordType
        if (index === resourcesToProcess.length - 1) {
          prdParams.ie_liberado_p = 'S'
        }

        prdParams.cd_procedimento_p = procedureCode // 4397
        prdParams.qt_procedimento_p = quantityProcedure
        prdParams.ie_lado_p = side
        prdParams.cd_intervalo_p = intervalCode
        prdParams.ie_acm_p = 'N'
        prdParams.ds_horarios_p = ''
        prdParams.ie_se_necessario_p = isNecessary
        prdParams.ie_anestesia_p = null
        prdParams.cd_material_p = materialCode
        prdParams.ie_via_aplicacao_p = applicationVia
        prdParams.qt_dose_p = quantityDose
        prdParams.cd_unidade_medida_dose_p = unityCode
        prdParams.cd_especialidade_dest_p = especialidadeCode // 6
        prdParams.ds_encaminhamento_p = encaminhamentoText
        prdParams.ds_orientacao_p = orientacao
        prdParams.cd_especialidade_p = null

        await executeProcedure_GHAS_PRESCR_MEDFLOW_P(prdParams)

        console.log('(INF) Concluiu a execução!')
        index++
      }

      return reply.status(201).send()
    },
  )
}
