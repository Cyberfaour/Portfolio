# Portfolio fonts

These unmodified Latin variable WOFF2 files were downloaded from the official Google Fonts service on 2 October 2026. They restore the three families used by the original portfolio. The combined font payload is 101,976 bytes (approximately 100 KiB).

| File | CSS family | Declared weights | License notice |
| --- | --- | --- | --- |
| `space-grotesk-latin-variable.woff2` | `Space Grotesk` | 400–700 | [SpaceGrotesk-OFL.txt](SpaceGrotesk-OFL.txt) |
| `inter-latin-variable.woff2` | `Inter` | 400–600 | [Inter-OFL.txt](Inter-OFL.txt) |
| `jetbrains-mono-latin-variable.woff2` | `JetBrains Mono` | 400–600 | [JetBrainsMono-OFL.txt](JetBrainsMono-OFL.txt) |

All three families are distributed under the SIL Open Font License, version 1.1. Keep the included copyright and license notices with the font files. No font binary was edited, converted, or subset locally.

## Integration

Load `assets/styles/fonts.css` before the main portfolio stylesheet. Its three normal-style `@font-face` declarations use relative local URLs, variable weight ranges, and the Latin Unicode ranges supplied by Google Fonts. `font-display: swap` keeps text visible during the first font load. Characters outside the supplied subsets use the site's fallback font stack.

The original family request was:

<https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap>

The equivalent variable-font request used for these downloads was:

<https://fonts.googleapis.com/css2?family=Inter:wght@400..600&family=JetBrains+Mono:wght@400..600&family=Space+Grotesk:wght@400..700&display=swap>

## Exact download sources

- Space Grotesk: <https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2>
- Inter: <https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2>
- JetBrains Mono: <https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2>

License notices were obtained from the matching families in Google's official repository:

- <https://github.com/google/fonts/blob/main/ofl/spacegrotesk/OFL.txt>
- <https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt>
- <https://github.com/google/fonts/blob/main/ofl/jetbrainsmono/OFL.txt>

## SHA-256 checksums

```text
0640890476fc1198ab4de571fb658de443c4d85b66466ec09534a8737ab1ce9d  space-grotesk-latin-variable.woff2
3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62  inter-latin-variable.woff2
83c005d49d8a6a50474c73a5a36ac0468076e9c4a29da7bdb14995d80560a5be  jetbrains-mono-latin-variable.woff2
```
