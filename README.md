# Northline Icons

<p align="center">
  <img src="assets/preview.png" alt="Northline Icons Preview" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/northcodebase/north-iconpack/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="https://github.com/northcodebase/north-iconpack/releases"><img src="https://img.shields.io/github/v/release/northcodebase/north-iconpack?color=4f46e5&label=version" alt="Version" /></a>
  <img src="https://img.shields.io/badge/icons-292-brightgreen" alt="Icon Count" />
  <img src="https://img.shields.io/badge/format-SVG-orange" alt="Format" />
  <img src="https://img.shields.io/badge/style-outline-lightgrey" alt="Style" />
</p>

<p align="center">
  A minimal, outline-based SVG icon library built for modern web applications.
</p>

---

## Features

- **292 hand-crafted SVG icons** (and their corresponding white outline dark-mode variants) across 15 categories
- **Consistent 24×24 grid** with 1.8px stroke width throughout
- **Outline style** — clean, modern, and framework-agnostic
- **Zero dependencies** — drop in as raw SVG or reference by path
- **Lucide-compatible naming** — predictable, semantic, kebab-case filenames
- **Organized by category** — actions, navigation, security, and more
- **MIT licensed** — use freely in personal and commercial projects

---

## Categories

| Category | Count | Description |
|---|---|---|
| `actions` | 46 | Copy, trash, search, upload, sparkles, and more |
| `security` | 40 | Lock, shield variants, eye, fingerprint, key, signals |
| `navigation` | 30 | Home, menu, arrow, map pin, list, grid |
| `development` | 30 | Api, console, git branch/merge/pull-request, plugin |
| `system` | 24 | Settings, server, wifi, code, plane, film |
| `files` | 22 | Folder, database, file-lock |
| `communication` | 20 | Mail, bell, globe |
| `commerce` | 17 | Credit card, shopping bag, landmark |
| `ai` | 16 | Agent, brain, neural-network, workflow |
| `users` | 15 | User, users, briefcase, passport, id-card |
| `media` | 14 | Camera, headphones, podcast, radio |
| `extensions` | 11 | Browser, cookie, puzzle, shield-browser |
| `alerts` | 3 | Info, circle-help, clock-alert |
| `theme` | 2 | Moon, sun |
| `brands` | 2 | Brand shield, brand lock |

---

## Installation

### Option 1 — Copy SVGs directly

Download the release archive and copy the `icons/` folder into your project:

```
your-project/
└── icons/
    ├── actions/
    ├── security/
    └── ...
```

### Option 2 — Reference via URL (CDN — coming soon)

```html
<img src="https://cdn.northline.dev/icons/security/lock.svg" width="24" height="24" />
```

### Option 3 — Inline SVG

Copy the SVG source directly from any file and paste it inline in your HTML or component.

---

## Usage

### HTML

```html
<!-- Inline -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- paste icon path here -->
</svg>

<!-- Image tag -->
<img src="icons/security/lock.svg" width="24" height="24" alt="Lock" />
```

### React / JSX

```jsx
import { ReactComponent as LockIcon } from './icons/security/lock.svg';

export function Example() {
  return <LockIcon width={24} height={24} stroke="currentColor" />;
}
```

### CSS background

```css
.icon-lock {
  background-image: url('icons/security/lock.svg');
  background-size: 24px 24px;
  width: 24px;
  height: 24px;
}
```

### Vite / Webpack (raw import)

```js
import lockSvg from './icons/security/lock.svg?raw';

element.innerHTML = lockSvg;
```

---

## Folder Structure

```
northline-icons/
│
├── icons/              (Standard SVGs - Blue Accent, Dark Outline)
│   ├── actions/        (46 icons)
│   ├── ai/             (16 icons)
│   ├── alerts/         (3 icons)
│   ├── brands/         (2 icons)
│   ├── commerce/       (17 icons)
│   ├── communication/  (20 icons)
│   ├── development/    (30 icons)
│   ├── extensions/     (11 icons)
│   ├── files/          (22 icons)
│   ├── media/          (14 icons)
│   ├── navigation/     (30 icons)
│   ├── security/       (40 icons)
│   ├── system/         (24 icons)
│   ├── theme/          (2 icons)
│   └── users/          (15 icons)
│
├── icons-white/        (White Outline / Blue Accent SVGs - Dark Mode)
│   └── ...             (Same 15 subfolders)
│
├── assets/
│   ├── icons/          (Standard PNGs - 128x128px transparent)
│   ├── icons-white/    (White Outline PNGs - 128x128px transparent)
│   ├── ico/            (Standard Microsoft ICO files)
│   ├── ico-white/      (White Outline Microsoft ICO files)
│   └── preview.png     (Grid preview image)
│
├── docs/               (Interactive preview site)
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── metadata.json
```

---

## Icon Naming Convention

All icons follow **Lucide-compatible kebab-case** naming:

| Rule | Example |
|---|---|
| Lowercase kebab-case | `shield-alert.svg` |
| Singular nouns | `star.svg` not `stars.svg` |
| No redundant words | `eye.svg` not `view-password.svg` |
| Directional suffix | `arrow-left.svg` |
| State suffix | `lock-open.svg`, `star-filled.svg` |
| Modifier suffix | `signal-low.svg`, `signal-high.svg` |

---

## Design Specifications

| Property | Value |
|---|---|
| Grid size | 24 × 24 |
| Viewbox | `0 0 24 24` |
| Stroke width | 1.8px |
| Stroke linecap | `round` |
| Stroke linejoin | `round` |
| Fill | `none` (outline) |
| Style | Minimal outline |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards.

---

## License

[MIT](LICENSE) © Northline
