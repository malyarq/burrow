# External Integrations

## Scope

- This repo is mostly a local desktop launcher.
- The important integrations are with Minecraft distribution endpoints, mod ecosystems, peer-to-peer networking, GitHub Releases, and local OS/runtime facilities.
- There is no first-party backend service for FriendLauncher in this repository.

## 1. GitHub Releases And App Updates

- Packaging is configured to publish to GitHub Releases in `electron-builder.json5`.
  - provider: `github`
  - owner: `malyarq`
  - repo: `fmcl`
- The same config is the source of truth for `electron-updater`.
- Runtime update events are wired in `electron/services/updater/appUpdater.ts`.
  - It forwards updater lifecycle events into renderer IPC channels such as `app-updater:available` and `app-updater:progress`.
- Release automation lives in:
  - `.github/workflows/release.yml`
  - `scripts/release.js`
- CI builds with publish disabled in `.github/workflows/ci.yml`.

## 2. Mojang / Official Minecraft Distribution

- Official Minecraft metadata and assets are treated as first-class download sources in `electron/services/mirrors/providers.ts`.
- Official endpoints hardcoded in that provider include:
  - `https://launchermeta.mojang.com/mc/game/version_manifest.json`
  - `https://piston-meta.mojang.com/mc/game/version_manifest_v2.json`
  - `https://resources.download.minecraft.net`
- Additional official host candidates appear in `electron/services/launcher/modLoaders/installDependencies.ts`:
  - `https://libraries.minecraft.net`
  - `https://piston-data.mojang.com`
  - `https://launchermeta.mojang.com`
- Java runtime provisioning uses XMCL’s Mojang runtime manifest flow in `electron/services/java/provisioning.ts` through `fetchJavaRuntimeManifest(...)`.

## 3. Mirror And CDN Integrations

- Mirror logic is centralized in:
  - `electron/services/mirrors/providers.ts`
  - `electron/services/mirrors/mirrorsService.ts`
  - `electron/services/runtime/downloadService.ts`
  - `electron/services/mirrors/scoring.ts`
- Built-in mirror choices persisted in `mirrors.json` are:
  - Official Mojang mirror (`https://launchermeta.mojang.com`)
  - BMCLAPI (`https://bmclapi2.bangbang93.com`)
- Auto-download mode also knows about both BMCL roots:
  - `https://bmclapi.bangbang93.com`
  - `https://bmclapi2.bangbang93.com`
- The mirror system rewrites official URLs to mirror-compatible equivalents for:
  - Mojang metadata and assets
  - Minecraft libraries
  - Forge Maven
  - NeoForge Maven
  - Fabric metadata/Maven
  - authlib-injector download path
- Extra Maven/CDN fallbacks are explicitly listed in `electron/services/mirrors/providers.ts`:
  - `https://forge.fastmcmirror.org`
  - `https://mirror.sjtu.edu.cn/bmclapi/maven`
  - `https://mirrors.tuna.tsinghua.edu.cn/bmclapi/maven`
  - `https://mirrors.bfsu.edu.cn/bmclapi/maven`
  - `https://maven.aliyun.com/repository/public`
  - `https://repo.huaweicloud.com/repository/maven`
  - `https://mirrors.cloud.tencent.com/nexus/repository/maven-public`
  - `https://alist.8mi.tech/...`
- `electron/services/runtime/downloadService.ts` probes mirror latency and blacklists bad origins during a launch session.

## 4. Modrinth Integration

- Modrinth is integrated through the official XMCL client package `@xmcl/modrinth`.
- Main integration point: `electron/services/mods/platform/modPlatformService.ts`.
  - search projects
  - fetch project versions
  - download/install mod files
  - search modpacks
  - fetch modpack versions
- Modpack import/export also supports Modrinth manifests in:
  - `electron/services/modpacks/parsers/modrinthParser.ts`
  - `electron/services/modpacks/importers/localInstaller.ts`
  - `electron/services/modpacks/exporters/modrinthExporter.ts`
- Renderer deep links users to Modrinth pages from:
  - `src/components/modpacks/details/ModsTab.tsx`
  - `src/components/modpacks/details/ModpackDetailsModsTab.tsx`
- Share codes can carry Modrinth project/version identifiers in `electron/services/sharing/shareService.ts`.

## 5. CurseForge Integration

- CurseForge integration is also in `electron/services/mods/platform/modPlatformService.ts`, using `@xmcl/curseforge`.
- CurseForge support is conditional.
  - The client is only constructed when `CURSEFORGE_API_KEY` exists.
  - Without that env var, CurseForge search/install operations throw a clear error.
- Supported operations include:
  - searching mods
  - fetching mod versions
  - installing files
  - searching modpacks
  - retrieving modpack versions
- Modpack import/export also supports CurseForge formats in:
  - `electron/services/modpacks/parsers/curseforgeParser.ts`
  - `electron/services/modpacks/importers/localInstaller.ts`
  - `electron/services/modpacks/exporters/curseforgeExporter.ts`
- Renderer contains outbound CurseForge links in:
  - `src/components/modpacks/details/ModsTab.tsx`
  - `src/components/modpacks/details/ModpackDetailsModsTab.tsx`

## 6. Fabric Metadata APIs

- Fabric version discovery uses HTTP fetches in:
  - `electron/services/launcher/versionDiscovery/fabric.ts`
  - `electron/services/versions/versionResolver.ts`
- Official Fabric API endpoints:
  - `https://meta.fabricmc.net/v2/versions/game`
  - `https://meta.fabricmc.net/v2/versions/loader`
- BMCL mirror fallbacks:
  - `https://bmclapi2.bangbang93.com/fabric-meta/v2/versions/game`
  - `https://bmclapi2.bangbang93.com/fabric-meta/v2/versions/loader`
- Fabric Maven rewriting is also handled by `electron/services/mirrors/providers.ts` through `https://maven.fabricmc.net`.

## 7. Forge Metadata And Artifact Sources

- Forge support touches several places:
  - `electron/services/launcher/versionDiscovery/forge.ts`
  - `electron/services/launcher/forge/forgeVersionSelection.ts`
  - `electron/services/launcher/forgeInstaller.ts`
  - `electron/services/launcher/forge/mcpConfigRecovery.ts`
  - `electron/services/launcher/legacyCompatibility.ts`
- Primary Forge metadata endpoint:
  - `https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json`
- Maven/artifact sources referenced in code:
  - `https://maven.minecraftforge.net`
  - `https://files.minecraftforge.net/maven`
  - `http://files.minecraftforge.net/maven`
  - `https://repo.maven.apache.org/maven2`
- Legacy runtime fallback sources in `electron/services/launcher/legacyCompatibility.ts` include:
  - `https://files.multimc.org/fmllibs/...`
  - BMCL `fmllibs` endpoints
- The code explicitly avoids generic mirror substitution for some Forge artifacts because HTML placeholder pages can corrupt JAR downloads; see comments in `electron/services/mirrors/providers.ts` and `electron/services/launcher/forge/mcpConfigRecovery.ts`.

## 8. NeoForge Integration

- NeoForge discovery lives in:
  - `electron/services/launcher/versionDiscovery/neoforge.ts`
  - `electron/services/versions/versionResolver.ts`
  - `electron/services/launcher/neoforgeInstaller.ts`
- Runtime lookup endpoints:
  - `https://bmclapi2.bangbang93.com/neoforge/list/<mcVersion>`
  - `https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoforge`
- Maven downloads are routed through `downloadProvider.injectURLWithCandidates('https://maven.neoforged.net/releases/')` in `electron/services/launcher/neoforgeInstaller.ts`.

## 9. OptiFine Integration

- OptiFine support is implemented in:
  - `electron/services/launcher/versionDiscovery/optifine.ts`
  - `electron/services/versions/versionResolver.ts`
  - `electron/services/launcher/optifineInstaller.ts`
- The repo currently depends on BMCL-hosted OptiFine metadata and binaries, not an official OptiFine API:
  - `https://bmclapi2.bangbang93.com/optifine/versionList`
  - `https://bmclapi2.bangbang93.com/optifine/<mc>/<type>/<patch>`

## 10. Authlib Injector And Authentication

- Offline / permissive authentication is a core integration point.
- A local Yggdrasil-like auth mock server runs in `electron/auth/server.ts`.
  - default port is derived from app instance slot in `electron/app/bootstrap.ts`
  - slot 1 uses `http://127.0.0.1:25530`
  - later instances increment the port
- Minecraft launch injects this auth layer through `authlib-injector` in:
  - `electron/services/launcher/orchestrator.ts`
  - `electron/services/launcher/preLaunchSetup.ts`
  - `electron/services/launcher/launchFlow/prepareAuthInjector.ts`
- Injector acquisition order:
  - packaged resource from `resources/authlib-injector.jar`
  - mirror-aware latest URL `https://authlib-injector.yushi.moe/artifact/latest`
  - GitHub release fallback `https://github.com/yushijinhun/authlib-injector/releases/download/v1.2.5/authlib-injector-1.2.5.jar`
- Third-party account support is implemented by:
  - `electron/services/account/accountService.ts`
  - `electron/services/account/yggdrasil.ts`
- `YggdrasilClient` talks to arbitrary `authServerUrl` values stored per account and calls:
  - `/authserver/authenticate`
  - `/authserver/refresh`
  - `/authserver/validate`
- Important negative finding:
  - there is no Microsoft OAuth, Xbox Live, or Mojang account login flow in this repo
  - account support is offline or third-party Yggdrasil-style auth only

## 11. P2P Networking, LAN, And NAT Traversal

- Core internet multiplayer integration uses Hyperswarm in `electron/services/network/networkManager.ts`.
  - room codes are 32-byte random topics encoded as hex
  - host joins the DHT as a server
  - joiner creates a local TCP server and tunnels to the host
- Supporting packages:
  - `hyperswarm`
  - `b4a`
  - `pump`
  - Node `net`
- Additional Minecraft network integrations live in `electron/services/network/networkService.ts`:
  - LAN discovery/broadcast via `MinecraftLanDiscover` from `@xmcl/client`
  - server ping/status via `queryStatus` from `@xmcl/client`
  - UPnP mapping via `createUpnpClient` from `@xmcl/nat-api`
- Shared contracts expose these capabilities through `shared/contracts/network.ts`, preload bridge `electron/preload/bridges/NetworkBridge.ts`, and renderer wrapper `src/services/ipc/networkIPC.ts`.

## 12. Java Runtime Provisioning

- Java discovery/provisioning is local-first, then remote.
- Local machine scanning happens in:
  - `electron/services/java/discovery.ts`
  - `electron/services/java/javaScanner.ts`
- If no suitable Java is found, `electron/services/java/provisioning.ts` downloads Mojang/XMCL runtime targets using `fetchJavaRuntimeManifest(...)` and `installJavaRuntimeTask(...)`.
- Provisioned runtimes are stored under `app.getPath('userData')/runtime`.
- This is an external integration with Mojang runtime manifests via XMCL, even though the code never hardcodes a public adoptium/zulu endpoint.

## 13. OS / Desktop Platform Integrations

- Electron shell/browser integration:
  - `electron/window/windowManager.ts` redirects external links to the system browser with `shell.openExternal(...)`
- Electron tray integration:
  - `electron/tray/trayManager.ts`
- Multi-window integration:
  - main window and console window are created from `electron/window/windowManager.ts`
- Process management:
  - Java/Minecraft subprocesses are launched from `electron/services/launcher/launchFlow/spawnMinecraft.ts`
  - process tree termination uses `tree-kill` in `electron/services/launcher/orchestrator.ts`
- File-system integration is extensive and local:
  - accounts, mirrors, modpacks, content store, runtime cache, exported/imported archives

## 14. In-Process API Boundary Between Renderer And Main

- This is not an external SaaS integration, but it is the most important internal interface boundary.
- Contracts live in `shared/contracts/*`.
- Main-process handler registration lives in `electron/ipc/ipcManager.ts`.
- Preload exposure happens in `electron/preload.ts`.
- Renderer consumption should go through `src/services/ipc/*`.
- The canonical public renderer namespace is `window.api`, typed by `shared/contracts/windowApi.ts`.

## 15. Local-Only Features (No Remote Service)

- Share codes in `electron/services/sharing/shareService.ts` are purely local encoding/decoding of modpack metadata into `fmcl://share/v1/...`.
  - No hosted share backend was found.
- Statistics in `electron/services/stats/statisticsService.ts` are local launcher analytics, not a remote telemetry pipeline.
- Settings and themeing in `src/contexts/SettingsContext.tsx` are stored locally, not synced.

## 16. Explicit Non-Integrations

- No FriendLauncher web API or cloud control plane was found.
- No database client or ORM is present.
- No Sentry, Datadog, Grafana Cloud, Amplitude, Segment, or similar telemetry SDK is present.
- No Microsoft account OAuth flow is present.
