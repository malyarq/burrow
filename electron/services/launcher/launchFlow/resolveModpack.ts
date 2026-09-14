import type { CanonicalInstanceRecord, LauncherRoot } from '../../../domains/instances/instanceTypes';
import type { InstanceReadPort, LauncherRootResolver } from '../../../domains/instances/ports';
import type { LaunchAdapters } from '../../../infrastructure/instances/launchAdapters';

export type ResolvedLaunchInstance = Readonly<{
  root: LauncherRoot;
  rootPath: string;
  instanceId: string;
  instancePath: string;
  record: CanonicalInstanceRecord;
}>;

export async function resolveLaunchInstance(params: {
  instances: InstanceReadPort;
  rootResolver: LauncherRootResolver;
  native: LaunchAdapters;
  launcherRootPath: string;
  options: {
    instanceId?: string;
    version: string;
    ram: number;
  };
}): Promise<ResolvedLaunchInstance> {
  const { instances, rootResolver, native, launcherRootPath, options } = params;
  const root = await rootResolver.resolve(launcherRootPath);
  const rootPath = native.rootPath(root);
  const requestedId = options.instanceId?.trim();
  const record = await canonicalRecord(instances, root, requestedId);
  const instancePath = native.instancePath(root, record.id);
  native.ensureInstanceDirectory(instancePath);

  return { root, rootPath, instanceId: record.id, instancePath, record };
}

async function canonicalRecord(instances: InstanceReadPort, root: LauncherRoot, requestedId?: string): Promise<CanonicalInstanceRecord> {
  const state = await instances.read(root);
  if (state.status === 'uninitialized') {
    throw new Error('Canonical instance state is uninitialized');
  }

  const instanceId = requestedId ?? state.snapshot.selectedId;
  if (!instanceId) throw new Error('Canonical instance state has no selected instance');
  const record = state.snapshot.records.find((candidate) => candidate.id === instanceId);
  if (!record) throw new Error(`Canonical instance does not exist: ${instanceId}`);
  return record;
}
