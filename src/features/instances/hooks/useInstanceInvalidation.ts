import { useMemo } from 'react';
import { useInstanceQueryProvider } from '../InstanceQueryProvider';

export interface InstanceInvalidation {
  invalidateInstance(id: string): Promise<void>;
  invalidateInstances(): Promise<void>;
  selectInstance(id: string): Promise<void>;
}

export function useInstanceInvalidation(): InstanceInvalidation {
  const store = useInstanceQueryProvider();
  return useMemo(() => ({
    invalidateInstance: store.invalidateInstance,
    invalidateInstances: store.invalidateInstances,
    selectInstance: store.selectInstance,
  }), [store]);
}
