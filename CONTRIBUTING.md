# Contributing to Northline Icons

Thank you for your interest in contributing. Northline Icons is a curated icon library — contributions are reviewed carefully to maintain consistency across the entire set.

---

## Table of Contents

- [Getting Started](#getting-started)
- [What We Accept](#what-we-accept)
- [Icon Design Rules](#icon-design-rules)
- [Naming Conventions](#naming-conventions)
- [Folder Structure](#folder-structure)
- [Pull Request Workflow](#pull-request-workflow)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

1. **Fork** this repository
2. **Clone** your fork locally
3. Create a new branch: `git checkout -b icon/your-icon-name`
4. Make your changes
5. Open a pull request against `main`

---

## What We Accept

✅ New icons that fill genuine gaps in the library  
✅ Bug fixes to existing icon geometry (misaligned paths, incorrect viewBox)  
✅ Documentation improvements  
✅ Tooling and automation improvements  

❌ Icons that duplicate an existing icon under a different name  
❌ Filled / solid style icons (this library is outline-only)  
❌ Brand/logo icons unless they are part of the Northline brand itself  
❌ Icons with embedded raster images or external references  

---

## Icon Design Rules

All icons must conform to the following specification. Non-conforming submissions will be rejected.

| Property | Required Value |
|---|---|
| Canvas / Grid | 24 × 24 |
| `viewBox` | `"0 0 24 24"` |
| `width` / `height` | `"24"` (or omit; viewBox is authoritative) |
| Stroke width | `1.8` |
| `stroke-linecap` | `"round"` |
| `stroke-linejoin` | `"round"` |
| `fill` | `"none"` on root `<svg>` |
| Style | Outline only — no solid fills on icon paths |
| Units | Unitless (no `px`, `em`, etc. in path data) |
| Groups | Avoid unnecessary `<g>` wrappers |
| IDs | No `id` attributes on internal elements |
| Comments | Remove all `<!-- -->` comments before submitting |
| Transforms | Do not use `transform` attributes; flatten paths instead |

### Visual guidelines

- **Optical balance**: icons must look visually centred, not mathematically centred
- **Minimum stroke gap**: 1.5px minimum between parallel strokes
- **Corner radius**: use consistent rounding — match the style of existing icons
- **Avoid ornamentation**: every path must serve a semantic purpose
- **Test at 16px and 24px**: icons must remain legible at both sizes

---

## Naming Conventions

Follow **Lucide-compatible kebab-case** naming. Review existing names before proposing a new one.

| Rule | Correct | Incorrect |
|---|---|---|
| Lowercase kebab-case | `shield-alert.svg` | `ShieldAlert.svg`, `shield_alert.svg` |
| Singular nouns | `star.svg` | `stars.svg` |
| No redundant words | `eye.svg` | `view-password-icon.svg` |
| Describe the shape, not the action | `trash.svg` | `delete.svg` |
| Directional suffix | `arrow-left.svg` | `back-arrow.svg` |
| State suffix | `lock-open.svg` | `unlocked.svg` |
| Modifier suffix | `signal-low.svg` | `weak-signal.svg` |

When in doubt, check what [Lucide Icons](https://lucide.dev) uses for the same concept.

---

## Folder Structure

Place your icon in the correct category folder under `icons/`:

```
icons/
├── actions/
├── navigation/
├── security/
├── communication/
├── files/
├── commerce/
├── users/
├── alerts/
├── system/
├── theme/
└── brands/
```

If your icon does not fit any existing category, propose a new one in your pull request description with a justification.

---

## Pull Request Workflow

### 1. Branch naming

```
icon/plus           # new icon
fix/lock-path       # geometry fix
docs/readme-update  # documentation
chore/metadata      # tooling / metadata
```

### 2. PR checklist

Before opening a pull request, confirm:

- [ ] Icon follows all design specifications above
- [ ] Filename is lowercase kebab-case, singular
- [ ] Icon is placed in the correct category folder
- [ ] `metadata.json` is updated with the new icon entry
- [ ] No duplicate of an existing icon
- [ ] SVG has been opened in a browser and visually verified
- [ ] SVG file is clean — no editor metadata, no comments, no unused elements

### 3. PR description template

```markdown
## Icon name
`icon-name.svg`

## Category
actions / navigation / security / ...

## Reason for addition
[Why does this icon belong in the library?]

## Screenshot
[Attach a screenshot at 24px and 64px]
```

### 4. Review process

- Maintainers will review the geometry, naming, and fit within the library
- Feedback is given on the PR — please respond and update within 14 days
- Approved PRs are merged to `main` and included in the next release

---

## Reporting Issues

Found a geometry bug, misnamed file, or broken SVG? Open an issue with:

- The filename
- A description of the problem
- A screenshot if relevant

Use the label `bug` for broken icons and `naming` for naming issues.

---

By contributing, you agree that your submissions are licensed under the [MIT License](LICENSE).
