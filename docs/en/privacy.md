# Privacy and analytics

Burrow remains fully functional without analytics. Official builds present two explicit first-run choices: **Share analytics** and **No thanks**. No event is sent and no identifier is created before an affirmative choice. The preference can be changed under **Settings → Launcher → Privacy and Feedback**.

## What is sent

Official builds use PostHog EU Cloud with a fixed, reviewable event allowlist. Every event carries its time, Burrow version, operating-system family, schema version, and a random installation identifier. Extra properties are restricted by a runtime allowlist:

| Group | Allowed properties |
| --- | --- |
| Consent and application open | Consent source, language, UI mode, and startup-duration bucket |
| Minecraft launch | Modloader family, whether Burrow Link is active, outcome, bounded failure stage, and duration bucket |
| Onboarding | View and a bounded action: play, modpacks, Burrow Link, settings, or the optional tour |
| Interface failure | Surface, available recovery action, and recovery outcome only; never an error message or stack |
| Modpack operations | Bounded kind, result, and duration bucket; no project, instance, or file identifiers |
| Modpack catalog | Provider, outcome, presence of a query and filters, result-count bucket, and duration bucket; never the query or project identifier |
| Burrow updates | Check source, stage, safe target version, and download-duration bucket |
| Burrow Link | Role, stage, bounded diagnostic code, direct/relay/unknown mode, duration, traffic, peak-peer and game-connection buckets, and qualified-session flag |
| Network, backup, and feedback | Selected network mode, backup export/import, and the fixed GitHub feedback source |

Durations, traffic, and counts are sent only as coarse buckets. A qualified Burrow Link session means a game connection was opened, traffic passed, and the session lasted at least one minute. Burrow does not inspect traffic contents.

To correlate the two sides of one Burrow Link attempt, Burrow uses a truncated, domain-separated SHA-256 of the random 256-bit room code. The room code itself is never sent. This identifier cannot establish a connection, reveals no participant address, and changes with each room.

## Local data and delivery

The random installation identifier is created only after consent and is not derived from hardware, an account, a nickname, or a filesystem path. Events are anonymous/personless: Burrow never calls `identify`, and every event sets `$process_person_profile: false` and `$geoip_disable: true`.

When delivery is unavailable, the device retains at most 100 already-sanitized events for no longer than 7 days. Each carries a random `$insert_id` so a retry should not duplicate it. Opting out immediately deletes both this queue and the installation identifier. A material schema expansion increments the consent version and asks again.

Burrow **never sends** IP or location, account data, nicknames, tokens, room codes, server addresses, paths, file names, search text, logs, form contents, error messages or stacks, screenshots, session recordings, or network payloads. There is no PostHog SDK, autocapture, cookie, heatmap, session replay, or remote analytics enablement.

The processor necessarily observes network metadata when receiving an HTTPS request. Burrow's project must remain in the EU region, discard IP data, create no person profiles, and retain events for no longer than 12 months. App code sets defensive event properties but cannot verify hosted settings, so the release owner checks them before every public release.

## Feedback reports

The **Report a problem on GitHub** action builds a local preview containing only the Burrow version, operating-system family, interface language, and analytics preference. Nothing is submitted automatically: the user reviews, edits, and sends the draft under GitHub's terms.

Never add credentials, room codes, private addresses, personal paths, or vulnerability details to a public issue. Report vulnerabilities through [private vulnerability reporting](https://github.com/malyarq/burrow/security/advisories/new).

## Control and questions

- Choose **No thanks** to create and send no product events.
- Disable analytics later to stop collection and remove the queue and identifier.
- Remove an issue or comment through GitHub if you submitted information there.
- Ask through a [GitHub issue](https://github.com/malyarq/burrow/issues/new) without including private data.

This document describes the current implementation. Any collection change must update the contract, tests, translations, and this notice together before release.
