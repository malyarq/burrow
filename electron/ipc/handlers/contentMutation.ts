/** A main-process gate that serializes one instance content write with operations. */
export type ContentMutationGate = <T>(instanceId: string, work: () => Promise<T>) => Promise<T>;

export async function runContentMutation<T>(
  gate: ContentMutationGate | undefined,
  instanceId: string,
  work: () => Promise<T>,
): Promise<T> {
  return await (gate ? gate(instanceId, work) : work());
}
