export function findMaterialDescription(fullResource) {
  if (fullResource.resource.resourceType === 'MedicationRequest') {
    const coding =
      fullResource.resource.medicationCodeableConcept?.coding?.[0]?.display ??
      null

    return coding
  }
  return 'null'
}
