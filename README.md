# Ali Faour — Engineering Portfolio

A static portfolio for industrial software, gas telemetry, field delivery, and documentation automation.

**Website:** [cyberfaour.github.io/Portfolio](https://cyberfaour.github.io/Portfolio/)

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Introduction, selected work, defined program outcomes, experience, credentials, and contact. |
| `Gridlock Case Study.html` | Product definition, connected workflows, engineering approach, and current development/pilot stage. |
| `Telemetry Case Study.html` | Device integration, commissioning checks, reporting behavior, and operational requirements. |
| `ADNOC Case Study.html` | A coordinated field-delivery program and its documentation workflow. |
| `DoE LPG Case Study.html` | The 2023–2025 LPG enhancement program, illustrated with existing field and tooling artifacts. |

## Run locally

No build step or JavaScript framework is required.

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The site also uses relative URLs suitable for the repository’s GitHub Pages subpath.

## Verify changes

```sh
python3 scripts/check-site.py
node --check assets/scripts/portfolio.js
node --check assets/scripts/redirect.js
```

The Python check uses only the standard library. It verifies local destinations and fragments, retained anchors, HTML structure, required form fields, shared asset references, and legacy redirects. It makes no network requests and never submits the contact form.

Before publishing visual or interaction changes, inspect desktop and narrow layouts in both themes. Check the mobile menu by keyboard, the skip link, visible focus, native required/email validation, reduced motion, and page content with JavaScript disabled. Exercise submission states with a stubbed network response; do not send test messages to the live endpoint as part of an automated check.

## Shared implementation

- `assets/styles/portfolio.css`: colors, typography, layout, responsive navigation, focus, scrollbars, and print styles.
- `assets/scripts/portfolio.js`: one theme controller, mobile-menu behavior, and progressively enhanced contact submission.
- `assets/scripts/redirect.js`: preserves fragments and query strings on older page URLs.
- `.nojekyll`: publishes ordinary static files with GitHub Pages.

The core content, section links, images, CV, and native form work without JavaScript. Without enhancement, the form posts directly to its existing Formspree endpoint. With JavaScript, it reports sending/success/error status, prevents concurrent sends, and preserves text when delivery cannot be confirmed. Actual email delivery depends on the configured Formspree account.

The older `.dc.html` and `Ali Faour Portfolio.html` URLs redirect to the canonical pages, with a visible link and a meta-refresh fallback. Existing case-study section anchors remain available.

## Content maintenance

Keep the website and profile’s role title, qualification, product stack, and project status aligned. [The results ledger](docs/results-ledger.md) records the scope and definition of the figures used in the site.

Gridlock is presented as **in development, with pilot preparation underway**, dated 2 October 2026. Its diagrams explain product relationships and workflows; they are not product screenshots or a production demonstration. Add actual demonstration images only when they can be accurately captioned and shared.

The DoE page retains the previously published site photo, structured tracker, and Python-generator image. Preserve their context when changing captions. The CV and training certificate are linked as existing files; edits to website copy do not update the contents of those PDFs.

## Design

See [DESIGN.md](DESIGN.md) for the shared visual direction and interaction choices. All content is authored as ordinary semantic HTML. The former exported `support.js`/`theme.js` files are not used by the current public pages.
