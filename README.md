# fumadocs-shared

`@sayakm/fumadocs-shared` provides Fumadocs components for Sayak's projects across SayakMukhopadhyay, Kode Blox, and GreyBody Games. The intended distribution is a prebuilt, versioned `.tgz` attached to a GitHub Release under the SayakMukhopadhyay account.

## Build and pack

```sh
npm ci --ignore-scripts
npm pack
```

`npm pack` runs the TypeScript build and creates `sayakm-fumadocs-shared-0.1.0.tgz` with ES modules and type declarations. The consumer can install the archive with scripts disabled. To try a local archive, copy it into the consumer directory and run `npm install --ignore-scripts ./sayakm-fumadocs-shared-0.1.0.tgz` there.

## Static search

Import `StaticSearchProvider` from `@sayakm/fumadocs-shared/search` in the Next.js root layout. It wraps Fumadocs' Next.js `RootProvider` and configures the static search dialog. Sites with their own provider can import `StaticSearchDialog` from the same entry and assign it to their Fumadocs provider's `search.SearchDialog`.

```tsx
import { StaticSearchProvider } from '@sayakm/fumadocs-shared/search';
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

The site owns its theme CSS, content, and static search route. Keep the Fumadocs `staticGET` handler at `/api/search`, the default index URL in Next.js. The dialog reads the active locale from its provider.

The consumer needs `fumadocs-core` `16.18.4`, `fumadocs-ui` aliased to `npm:@fumadocs/base-ui@16.18.4`, Next.js `^16.4.5`, and React and React DOM `^19.3.1`.
