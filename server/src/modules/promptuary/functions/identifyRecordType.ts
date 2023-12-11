function identifyRecordType(fullResource): string {
  const resourceType = fullResource.resource.resourceType

  if (resourceType === 'MedicationRequest') {
    return 'M'
  }

  if (resourceType === 'CarePlan') {
    return 'O'
  }

  if (resourceType === 'ServiceRequest') {
    if (!fullResource.resource?.category) {
      return 'P'
    }

    if (fullResource.resource.category[0].coding[0].code === '103696004') {
      return 'E'
    }
  }

  return 'U'
}

export { identifyRecordType }
