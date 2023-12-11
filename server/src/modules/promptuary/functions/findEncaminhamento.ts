export function findEncaminhamento(recordType, fullResource) {
  if (recordType === 'E') {
    const encaminhamentoText = fullResource.resource.category?.[0]?.text
    if (encaminhamentoText) {
      return encaminhamentoText
    }
  }
  return 'null'
}
