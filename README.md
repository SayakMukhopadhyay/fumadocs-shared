# fumadocs-shared

`@sayakm/fumadocs-shared` provides Fumadocs components for Sayak's projects across SayakMukhopadhyay, Kode Blox, and GreyBody Games.

## Install from Git

Pin a full commit SHA in the consumer's `package.json`.

```json
{
  "dependencies": {
    "@sayakm/fumadocs-shared": "github:SayakMukhopadhyay/fumadocs-shared#<full-commit-sha>"
  }
}
```

Run `npm install --ignore-scripts` to update the pin and commit the resolved `package-lock.json`. Use `npm ci --ignore-scripts` to install the locked version with its compiled output.

## Maintain the library

Use the Node.js version in `.nvmrc` and install the locked dependencies before building.

```sh
npm ci --ignore-scripts
npm run build:dist
```

`npm run build:dist` clears `dist/` before compiling JavaScript and declarations. npm treats a `build` script as a signal to prepare a Git dependency during installation. The shared styles ship as plain CSS from `styles/`. Commit source changes and the regenerated output together. `npm run validate:generated` compares the built files with Git, and Pipeline also checks for untracked output.

## Static search

Use `StaticSearchProvider` in the Next.js root layout. It wraps Fumadocs' Next.js `RootProvider` and configures the static search dialog.

```tsx
import { StaticSearchProvider } from '@sayakm/fumadocs-shared';
import type { ReactNode } from 'react';
import './global.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StaticSearchProvider>{children}</StaticSearchProvider>
      </body>
    </html>
  );
}
```

The provider reads the static index at `/api/search` by default. Pass `from` if the site's Fumadocs `staticGET` handler is at a different URL.

```tsx
<StaticSearchProvider from="/docs/api/search">{children}</StaticSearchProvider>
```

Sites with their own provider can import `{ StaticSearchDialog }` from `@sayakm/fumadocs-shared` and pass it as `search.SearchDialog`. The dialog also accepts `from` and reads the active locale from its provider.

The site owns its theme CSS, content, and static search route.

The consumer needs `fumadocs-core` `16.18.4`, `fumadocs-ui` aliased to `npm:@fumadocs/base-ui@16.18.4`, Next.js `^16.4.5`, and React and React DOM `^19.3.1`.

## Access-aware layouts

Use `AccessAwareHomeLayout` or `AccessAwareDocsLayout` in a site-owned client component under the site's Fumadocs provider. Pass the page tree as `tree` to the Docs layout.

```tsx
import { AccessAwareHomeLayout, AccessAwareDocsLayout } from '@sayakm/fumadocs-shared';
```

- `getLogoutUrl(signal)` verifies the session using the site's existing endpoint and returns the logout URL on success. Pass the signal to `fetch` and return `undefined` when verification fails. Define this callback at module scope or memoize it so its identity stays stable across renders.
- `getLayoutProps(logoutUrl)` returns the site's Fumadocs layout options, including any logout link. It receives `undefined` during checks and when a check fails.
- The layout checks on mount. Set `sessionKey` to the pathname to recheck after navigation. Set `recheckOnReturn` to also check when the window regains focus or the browser restores the page from its back-forward cache.

## Mermaid diagrams

Register `Mermaid` in the site's MDX component map. The site supplies its Fumadocs provider and `remarkMdxMermaid` configuration.

```tsx
import { Mermaid } from '@sayakm/fumadocs-shared';
```

Import the library stylesheet in the site's global CSS after the Fumadocs preset.

```css
@import '@sayakm/fumadocs-shared/styles.css';
```

Other SVG viewers can render `DiagramViewportControls` inside their viewport root and use `createDiagramViewport` for zoom, fit, centering, and fullscreen. Use the shared `diagram-viewport` classes for the viewport markup and load local viewer rules after the shared stylesheet.

```tsx
import { DiagramViewportControls, createDiagramViewport } from '@sayakm/fumadocs-shared';
```
