/**
 * Renderer-safe Java runtime transport.
 *
 * Installation IDs are opaque, short-lived main-process capabilities. Native
 * executable details never cross this boundary.
 */
export const JAVA_RUNTIME_CHANNELS = {
  scan: 'javaRuntime:scan',
  get: 'javaRuntime:get',
  select: 'javaRuntime:select',
} as const;

export type JavaRuntimeChannel = (typeof JAVA_RUNTIME_CHANNELS)[keyof typeof JAVA_RUNTIME_CHANNELS];

export type JavaRuntimeInstallationDto = Readonly<{
  id: string;
  version: string;
  majorVersion: number;
  arch?: string;
}>;

export type JavaRuntimeSelectRequest = Readonly<{
  instanceId: string;
  installationId: string | null;
}>;

export type JavaRuntimeSelectResponse = Readonly<{
  status: 'selected' | 'auto';
}>;

export type JavaRuntimeGetRequest = Readonly<{
  instanceId: string;
}>;

export type JavaRuntimeGetResponse = Readonly<{
  installationId: string | null;
}>;

/** Dedicated typed preload capability for Java discovery and selection. */
export type JavaRuntimeAPI = Readonly<{
  scan(): Promise<readonly JavaRuntimeInstallationDto[]>;
  get(request: JavaRuntimeGetRequest): Promise<JavaRuntimeGetResponse>;
  select(request: JavaRuntimeSelectRequest): Promise<JavaRuntimeSelectResponse>;
}>;
