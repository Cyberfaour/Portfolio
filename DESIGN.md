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

The shared header pairs Ali's name with a compact UAE flag and the supplied “فخورين بالإمارات” emblem. Keep both assets static, reserve their dimensions, and retain the same treatment on the homepage and case studies. The flag sits beside the name; the emblem has a separate, quiet position beside the wordmark. Certification and training providers appear as a wrapping typographic row within the credentials section, backed by the linked CV and credential bundle. Provider names describe education and training, not commercial endorsements.

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

## Audience pacing and optional exploration

Ali wants memorable interactions while keeping the audience comfortable. Preserve the homepage’s existing reading order and visual identity. A visitor can understand the work without operating a demonstration.

- Keep the hero’s blueprint compact. Its construction is a brief, finite sequence; explanatory layers remain inside a closed native disclosure until requested. Show one layer at a time when enhanced, with equivalent keyboard and touch access.
- Place the AI workbench inside the existing workflow case study. Keep it closed initially, advance only on deliberate input, and retain a readable explanation when JavaScript is unavailable.
- Use explicit synthetic records in the workbench. Show where values originate, how exceptions are reviewed, and which missing documents remain assigned follow-ups. A generated draft is never presented as an approval or proof that missing evidence has arrived.
- Use a short native cross-fade between pages, with the brand and theme control visually anchored. Normal navigation is the fallback; reduced-motion users receive ordinary page changes.
- Use the shared palette and fonts through CSS variables. Feature styles and scripts load only on their owning pages. Do not introduce scroll capture, autoplay walkthroughs, sound, or a new framework for these interactions.
