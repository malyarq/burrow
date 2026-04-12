# Architecture Research

**Domain:** Brownfield desktop-launcher UI system and UX redesign
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Renderer Screen Layer                    │
├─────────────────────────────────────────────────────────────┤
│  Welcome / Play / Modpacks / Accounts / Settings / Dialogs │
│          consume shared layout, tokens, icons, copy        │
├─────────────────────────────────────────────────────────────┤
│                 Shared Presentation Layer                   │
├─────────────────────────────────────────────────────────────┤
│  ui/ primitives   shell components   surface classes       │
│  icon rules       focus/motion rules locale key contracts  │
├─────────────────────────────────────────────────────────────┤
│                 State + Integration Layer                   │
├─────────────────────────────────────────────────────────────┤
│  SettingsContext  theme.ts  locales/*.json  IPC wrappers   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Shared UI primitives | Own button/input/select/modal/card semantics and variants | `src/components/ui/*` backed by token-driven class composition |
| App shell components | Own launcher-wide hierarchy, navigation chrome, and section framing | `TitleBar`, `Sidebar`, welcome/home shell, section headers |
| Settings/theme seam | Own theme, accent, motion, and appearance state as source of truth | `SettingsContext` + `src/contexts/settings/theme.ts` + CSS variables in `src/index.css` |
| Localization layer | Own all user-facing strings and keep EN/RU parity | `src/locales/en.json` and `src/locales/ru.json` only, no hardcoded screen copy |
| Feature screens | Compose the shared system and add workflow-specific content | `src/features/*` and `src/components/*` screens should not invent new visual systems |

## Recommended Project Structure

```text
src/
├── components/ui/            # Shared primitives and reusable visual contracts
├── components/layout/        # Background, shell, and layout-specific wrappers
├── components/sidebar/       # Launcher chrome and navigation controls
├── components/settings/      # Settings shells and tabs consuming shared system
├── features/                 # Domain screens like accounts and share
├── contexts/settings/        # Theme, accent, appearance source of truth
├── locales/                  # EN/RU user-facing copy
└── services/ipc/             # Typed renderer-to-main seams that UI consumes
```

### Structure Rationale

- **`components/ui/`:** should be the main source of truth for shared affordances, variant logic, and visual states.
- **`contexts/settings/`:** should remain the single owner of theme and appearance decisions instead of duplicating state across screens.
- **`locales/`:** should be treated as required completion scope for any user-facing UI change.
- **`features/` and screen components:** should consume the system rather than define it.

## Architectural Patterns

### Pattern 1: Token-First Theming

**What:** Apply theme and accent through document-level CSS custom properties and shared utility classes.
**When to use:** Any surface that must react to theme, accent, motion, or contrast choices.
**Trade-offs:** Centralizes behavior well, but requires disciplined rollout because old hardcoded classes remain visible until migrated.

**Example:**
```typescript
applyThemeToDocument(theme, accentColor, customTheme);
// Shared surfaces and controls then read the same CSS variables.
```

### Pattern 2: Shared-Primitive Ownership

**What:** Put visual and interaction consistency into shared buttons, inputs, selects, cards, modals, and shell wrappers.
**When to use:** Any repeated control or state pattern across more than one screen.
**Trade-offs:** Requires up-front cleanup, but prevents screen-local drift from returning.

**Example:**
```tsx
<Button variant="primary" size="lg">
  {t('general.play')}
</Button>
```

### Pattern 3: Locale-First UI Text

**What:** Treat every user-visible string as a localization key backed by EN/RU parity.
**When to use:** All renderer copy, including placeholders, empty states, tooltips, and modal titles.
**Trade-offs:** Slightly slower for quick edits, but avoids the current placeholder/hardcoded-string regressions.

## Data Flow

### Request Flow

```text
[User changes appearance setting]
    ↓
[Settings UI] → [SettingsContext] → [theme.ts] → [document CSS variables]
    ↓
[Shared primitives + screens re-render with tokenized styles]
```

### State Management

```text
[Persisted appearance settings]
    ↓
[SettingsContext]
    ↓
[Components subscribe through props/hooks]
    ↓
[Theme + layout updates stay consistent across screens]
```

### Key Data Flows

1. **Theme propagation:** Settings change updates root CSS variables, then shared primitives and screen surfaces inherit the same palette and contrast rules.
2. **Localization coverage:** Screen copy resolves through locale keys, then EN/RU files remain the shipped source of truth.
3. **Manual verification:** Dev server run plus browser walkthrough validates actual composition, theme, navigation, and focus behavior on live screens.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 5-10 core screens | Shared primitives and shell components are enough; avoid new state layers |
| 10-25 complex surfaces | Add stricter visual contracts and focused component tests around shared primitives and route shells |
| 25+ heavily distinct surfaces | Add stronger system documentation and a surface rollout checklist to stop feature-local divergence |

### Scaling Priorities

1. **First bottleneck:** theme and surface drift between old and newly refreshed screens — fix by making tokens and shared surfaces mandatory.
2. **Second bottleneck:** translation and icon coverage drift — fix by including string and icon audit in each rollout wave.

## Anti-Patterns

### Anti-Pattern 1: Screen-Local Design Systems

**What people do:** Each screen invents its own spacing, surfaces, icon style, and empty states.
**Why it's wrong:** The launcher starts looking like multiple products glued together.
**Do this instead:** Move repeated visual decisions into shared primitives, shell wrappers, and token classes.

### Anti-Pattern 2: Theme Toggle Without Theme Ownership

**What people do:** Persist a light/dark setting but leave large sections on hardcoded colors.
**Why it's wrong:** Users experience the theme switch as broken even when settings persist correctly.
**Do this instead:** Make the token layer the only accepted source of app colors and migrate screens onto it.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Manual browser runtime | `npm run dev` / preview + browser walkthrough | Required for milestone verification of live UI behavior |
| Existing test runner | Focused Vitest component and utility tests | Useful for shared primitive and theme regressions, but not a replacement for browser walkthroughs |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `SettingsContext` ↔ `theme.ts` | Direct API and document side effects | Primary theme source of truth; keep it centralized |
| `theme.ts` ↔ `src/index.css` | CSS variable contract | Token names must remain stable once the design system starts depending on them |
| `components/ui/*` ↔ feature screens | Props and shared variants | Screens should compose, not fork, primitive behavior |
| Feature screens ↔ `locales/*.json` | Localization keys | No direct hardcoded user copy in renderer components |

## Sources

- Local repo inspection: `.planning/PROJECT.md`
- Local repo inspection: `src/index.css`
- Local repo inspection: `src/contexts/settings/theme.ts`
- Local repo inspection: `src/components/ui/Button.tsx`
- Local repo inspection: `docs/KNOWN_ISSUES.md`

---
*Architecture research for: FMCL v0.2.0 UI system and UX redesign*
*Researched: 2026-04-13*
