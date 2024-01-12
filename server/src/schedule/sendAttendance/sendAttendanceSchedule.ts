import { AxiosRequestConfig } from 'axios'

import { findCidToProcess } from './repository/findCidToProcess'
import { findDataToSendByIdIntegracao } from './repository/findDataToSendByIdIntegracao'
import { executeProcedure_GHAS_ATEND_PACIENTE_P } from './repository/executeProcedure_GHAS_ATEND_PACIENTE_P'
import { updateStatusByIdIntegracao } from './repository/updateStatusByIdIntegracao'

import { makeRequest } from '../../utils/makeRequest'
import { buildHl7AttendanceObject } from './functions/buildHl7AttendanceObject/buildHl7AttendanceObject'

import { IAttendancePatient } from './types/selectTableAttendancePatient.types'

export async function sendAttendanceSchedule(): Promise<void> {
  try {
    const cidToProcess = await findCidToProcess()

    if (!cidToProcess) {
      console.log('\n \n-> Sem registros para processar!')
      return
    }

    const cidOnMediflowObjectRequest: AxiosRequestConfig = {
      method: 'GET',
      url: process.env.URL_VERIFY_CID,
      headers: {
        'x-client-id': process.env.CLIENT_ID,
        'x-client-token': process.env.CLIENT_TOKEN,
      },
      params: {
        cid10: cidToProcess.CD_CID, // 'v954'
      },
    }

    const cidOnMedflow = await makeRequest(cidOnMediflowObjectRequest)
    const protocolsToFindedCid = cidOnMedflow.data.results[0]

    console.log('\n \n-> Resposta da Verificação de Cid -> ', cidOnMedflow.data)

    if (!protocolsToFindedCid) {
      await updateStatusByIdIntegracao(cidToProcess.ID_INTEGRACAO, 'E')

      const responseData = { detail: 'Nenhum protocolo encontrado para o Cid.' }
      const responseStatus = 404

      await executeProcedure_GHAS_ATEND_PACIENTE_P(
        cidToProcess.ID_INTEGRACAO,
        responseStatus,
        responseData,
      )

      console.log('\n \n-> Sem protocolo para o Cid informado!')
      return
    }

    await updateStatusByIdIntegracao(cidToProcess.ID_INTEGRACAO, 'T')

    const dataToSendAttendance: IAttendancePatient =
      await findDataToSendByIdIntegracao(cidToProcess.ID_INTEGRACAO)

    const attendanceToSend = await buildHl7AttendanceObject(
      dataToSendAttendance,
    )

    console.log(
      '\n \n-> Atendimento em HL7 -> ',
      JSON.stringify(attendanceToSend),
    )

    const protocolCode = cidOnMedflow.data.results[0].codigo
    const sendAttendanceObjectRequest: AxiosRequestConfig = {
      method: 'POST',
      url: `${process.env.URL_SEND_ATTENDANCE}${protocolCode}/abrir/`,
      headers: {
        'x-client-id': process.env.CLIENT_ID,
        'x-client-token': process.env.CLIENT_TOKEN,
      },
      data: attendanceToSend,
    }

    const returnedAttendance = await makeRequest(sendAttendanceObjectRequest)

    console.log(
      `\n \n-> Retorno do atendimento -> ${returnedAttendance.status}`,
      returnedAttendance.data,
    )

    const responseData = JSON.stringify({
      detail: 'Sucesso',
    })
    const responseStatus = returnedAttendance.status
    await executeProcedure_GHAS_ATEND_PACIENTE_P(
      cidToProcess.ID_INTEGRACAO,
      responseStatus,
      responseData,
    )

    const urlToOpen = returnedAttendance.data.redirect_uri
    const hostToSend = dataToSendAttendance.IP

    const sendUrlToOpenObjectRequest: AxiosRequestConfig = {
      method: 'POST',
      url: `http://${hostToSend}:3434/openScreen`,
      headers: {},
      data: {
        urlToOpen,
      },
    }

    console.log('Vai abrir a tela do Medflow')
    await makeRequest(sendUrlToOpenObjectRequest)

    console.log('Vai abrir o Google')
    sendUrlToOpenObjectRequest.data.url = 'https://www.google.com.br'
    await makeRequest(sendUrlToOpenObjectRequest)

    console.log('\n \n## Fim da Operação ##')
    return
  } catch (error) {
    console.log(error)
  }
}
