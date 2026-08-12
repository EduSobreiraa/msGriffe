---
name: msgriffe-frontend
description: Orient frontend work in the MS Griffe storefront. Use when creating, reviewing, refactoring, or styling React/CSS pages and components so the existing architecture, visual identity, responsive behavior, accessibility, and theme conventions are preserved.
---

# MS Griffe Frontend

Use this skill as the project-specific frontend layer. It complements, rather than replaces, the repository architecture and product context.

## Read only what the task needs

- For component or feature structure: read the relevant sections of [`docs/ARCHITECTURE_PRINCIPLES.md`](../../../docs/ARCHITECTURE_PRINCIPLES.md), especially frontend organization and responsibility rules.
- For catalog, cart, checkout, account, payment, WhatsApp, or admin behavior: read the relevant sections of [`docs/PROJECT_CONTEXT.md`](../../../docs/PROJECT_CONTEXT.md).
- For colors, themes, typography, spacing, breakpoints, or visual states: inspect [`src/shared/styles/tokens.css`](../../../src/shared/styles/tokens.css) and the relevant selectors in [`src/shared/styles/global.css`](../../../src/shared/styles/global.css).
- For a new or changed component: inspect the closest existing component in `src/shared/components/` or the relevant feature first.
- For visual direction or asset selection: read [`references/visual-identity.md`](references/visual-identity.md) and inspect only the referenced images relevant to the task.

Do not read every document or the entire stylesheet by default. Follow references only when the requested change touches that concern.

## Implementation rules

- Organize new UI by feature/domain as described in `ARCHITECTURE_PRINCIPLES.md`.
- Keep generic visual primitives in `src/shared/components/`; keep feature behavior inside its feature.
- Keep pages responsible for composition, components for presentation, hooks for reusable state/behavior, and services/adapters for external data.
- Reuse existing tokens and components before adding CSS values, patterns, or abstractions.
- Treat frontend prices, discounts, stock, shipping, and totals as projections until confirmed by the backend, as defined in `PROJECT_CONTEXT.md`.
- Preserve keyboard operation, visible focus, semantic headings, labels, live feedback, dialog focus management, and reduced-motion behavior already present.
- Do not add emoji or mixed icon styles. Keep the existing SVG icon language.
- Do not alter an established visual or architectural pattern merely for preference. Justify necessary deviations and keep them local.

## Validation proportional to scope

- Copy, text, or isolated component styling: run the most relevant focused tests or lint; check the affected state and one representative viewport.
- Component behavior, accessibility, or interaction: run focused tests plus lint; check keyboard/focus behavior and the affected theme if styling changed.
- Page layout, responsive CSS, header, catalog, drawer, or theme changes: run relevant tests and lint; check the affected mobile/desktop breakpoints and both themes when applicable.
- Cross-cutting architecture, routing, tokens, or global CSS changes: run the full relevant test suite and build; verify representative mobile, desktop, theme, keyboard, and reduced-motion behavior.

Do not run the full viewport/theme matrix for a change that cannot affect it. Use the repository commands documented in `README.md` when the selected validation level requires them.

## References

Read [`references/visual-identity.md`](references/visual-identity.md) only for visual, responsive, component, or asset decisions. It points to the source assets and CSS; it does not replace them.
