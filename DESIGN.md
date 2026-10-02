# Portfolio design direction

## Subject and purpose

Ali Faour’s engineering portfolio helps a technical reviewer understand the connection between his industrial software, connected infrastructure, and field-delivery work. The visitor should reach evidence immediately after the short introduction.

## Visual identity

Preserve the dark industrial identity and amber accent. Real field photography supplies the setting; small monospace labels identify the kind of work. Product diagrams explain relationships without imitating an application screenshot.

| Token | Dark | Light |
| --- | --- | --- |
| Canvas | `#090c0e` | `#f5f5f1` |
| Surface | `#11171a` | `#ffffff` |
| Main text | `#f1f3f2` | `#182429` |
| Muted text | `#b0b9bc` | `#46555b` |
| Text accent | `#f3a45f` | `#945014` |
| Focus | `#ffbd7e` | `#854208` |

System sans-serif fonts handle body and display text; system monospace fonts handle small technical labels. No external font download is required. Shared runtime tokens live in `assets/styles/portfolio.css`.

## Layout and behavior

- Keep the introduction compact and place selected work immediately after it. Gridlock leads, followed by telemetry and DoE delivery/documentation.
- Use a maximum content width of 1120px, measured line lengths, and restrained section spacing.
- Reuse the header, button labels, theme control, focus style, and case-study layout across pages.
- Core content remains visible without JavaScript. Navigation uses native URLs and fragments.
- On narrow layouts, JavaScript enhances the section links with a menu. The links remain available without JavaScript.
- Opening the mobile menu places focus on its first link; Escape closes it and returns focus when appropriate.
- Use one theme button. Save only the chosen theme locally; do not persist contact-form text.
- Use native contact constraints with real labels. During submission, prevent a second send and protect the submitted text from editing until the result returns.
- Respect reduced-motion preferences. Do not animate counters, hide content for reveal effects, or change numbers on load.
- Wide explanatory tables scroll inside their own labeled region. Keep visible scrollbars.

## Content rules

Distinguish completed engagements from current product development. A six-month plan completed by a team in two months describes elapsed delivery; it does not establish a measured throughput percentage. Keep report volumes attached to the relevant program. Training labels must not imply an unverified current registration or authorization.
