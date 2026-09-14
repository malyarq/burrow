# Burrow Next

Burrow Next (`1.0.0-next.1`) is a working product build on Electron, React, and TypeScript. It retains launcher capabilities while replacing the former shell with four clear areas: Play, Library, Together, and Settings. Completed work is recorded in the [changelog](../../CHANGELOG.md); technical contracts live in the adjacent documentation.

## Pilot evidence

Two identical model scenes were compared on Windows. Electron + React reached ready state in 392.7 ms at the median and used 301.2 MiB private bytes; Tauri + Node took 991.4 ms and 325.2 MiB. Burrow Next therefore remains on Electron + React. This measurement is not a full-product test, a network compatibility result, or evidence of Minecraft launching.

## Current product shape

- Play contains standard launching and its configuration.
- Library remains the home for modpacks and their content; the primary launch action belongs either to the shell or the current library route.
- Together contains Burrow Link flows.
- Settings is a full page and remains mounted while moving to another area, so entered data and scroll position are retained.
- Light and dark themes are neutral, with a separately selected accent. Motion is restrained and respects the system reduced-motion preference.
- New artwork and icons are part of the Next shell.
- Next uses an isolated userData directory; the built-in updater is disabled in this build.

## Limits before a public release

- Fresh install, first launch, Minecraft launch, update, and uninstall still need one release-level smoke pass on Windows, macOS, and Linux.
- Microsoft authentication must be registered and integrated before claiming official-account support.
- Windows packages need signing, and macOS packages need signing/notarization once publisher credentials exist.
- The hosted PostHog project still needs separate confirmation that IP capture is disabled, person profiles are not created, and retention matches the documentation.
- CurseForge browsing must remain disabled until API credentials, attribution, distribution terms, tests, and failure handling are complete.

The next priority comes from a verifiable defect, product-trial evidence, or an explicit maintainer decision. The former gate of 20 external users is no longer a stop condition.
