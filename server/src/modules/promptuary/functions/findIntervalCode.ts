export function findIntervalCode(fullResource) {
  if (fullResource.resource.resourceType === 'MedicationRequest') {
    const intervalCode: string =
      fullResource.resource.dosageInstruction[0].timing.code.coding[0].code
    return intervalCode
  } else return null
}
