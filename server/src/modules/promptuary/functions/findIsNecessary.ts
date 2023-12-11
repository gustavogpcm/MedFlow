export function findIsNecessary(fullResource) {
  const dosageInstruction = fullResource.resource.dosageInstruction
  if (
    dosageInstruction &&
    Array.isArray(dosageInstruction) &&
    dosageInstruction.length > 0
  ) {
    const asNeededBoolean = dosageInstruction[0].asNeededBoolean
    if (asNeededBoolean !== undefined) {
      return asNeededBoolean
    }
  }
  return false
}
