# Portfolio design direction

## Subject and purpose

Ali Faour’s engineering portfolio connects operational software, industrial infrastructure, field delivery, and practical AI-assisted work. A technical reviewer should understand the engineering decisions, Ali’s responsibility, and the evidence behind each outcome. Selected work follows the introduction directly.

## Visual identity

The established identity is neutral black, sharp amber, expressive Space Grotesk typography, and fine technical detail. The hero pairs a large mixed-weight statement with an engineering console. The composition is spacious and deliberate; real field photographs and explanatory system maps give each project its own visual evidence.

| Token | Dark | Light |
| --- | --- | --- |
| Canvas | `#060606` | `#f7f4ee` |
| Surface | `#0b0b0b` | `#f2eee6` |
| Main text | `#f5f5f5` | `#1a160f` |
| Muted text | `#9a9a9a` | `#5c564b` |
| Accent ink | `#e8893a` | `#a24d0c` |
| Decorative amber | `#e8893a` | `#e8893a` |
| Focus | `#e8893a` | `#a24d0c` |

Space Grotesk handles display headings and large figures; Inter handles body text and buttons; JetBrains Mono handles navigation, chapter labels, metadata, and diagrams. Original font families are self-hosted with `font-display: swap`; licenses and provenance live in `assets/fonts/`. Runtime tokens live in `assets/styles/portfolio.css`.

Preserve the warm ivory light theme, understated neutral dividers, amber marker underlines, off-white primary buttons, and joined project/capability grids. Gridlock can use a restrained blue accent inside its software diagrams. The homepage uses a 1440px maximum width with 40px outer gutters, and case studies use a 1280px maximum.

## Motion and behavior

- The hero’s decorative signal drawing expresses scattered information becoming a connected system. It contains no live operational data or invented metrics.
- Give continuous hero motion a visible pause/play control. Render a static alternative for reduced-motion preferences and pause rendering when the hero or tab is not visible.
- Keep entry motion brief. Content remains present and readable if scripts, observers, or canvas are unavailable.
- Use the AUH clock only as a local-time indicator, and the amber top line only for document scroll progress.
- Preserve native URLs, anchors, visible focus, and accessible mobile navigation. Opening the mobile menu focuses its first link; Escape closes it and returns focus appropriately.
- Use one floating theme button at body level so the blurred header does not capture its fixed position. Save only the theme preference, never contact text.
- Retain native required/email constraints and real labels. Prevent duplicate sends, capture the submitted values before temporarily locking fields, and keep the message after errors or uncertain delivery.
- Wide tables scroll within their own labeled, keyboard-focusable region. Keep visible scrollbars and avoid clipping focus outlines on joined cards.

## Content rules

Telemetry represents infrastructure engineering across device behavior, communications, server/platform requirements, manufacturer coordination, integration boundaries, and stakeholder decisions. Explain hands-on commissioning within that wider responsibility. Public copy does not name the equipment manufacturers.

AI-assisted work should show the actual process: source documents, extraction, structured data, reconciliation, reusable outputs, and human review. RELAAM’s contract-draft batch and building-program tracker are distinct scopes. Describe draft production separately from submission or approval. Explain throughput through reduced repeated handling, reusable data, and clear output volumes; distinguish estimates from measured timing.

Distinguish completed engagements from product development, requirements, and architecture review. Keep Gridlock’s current stack and pilot-preparation status accurate. Attach delivery figures to their program and team contribution. Training labels must not imply unverified personal registration. Public diagrams explain relationships and never pretend to be screenshots of a running system.
