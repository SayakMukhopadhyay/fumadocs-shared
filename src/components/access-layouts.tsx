/*
 * Copyright 2026 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { HomeLayout, type HomeLayoutProps } from 'fumadocs-ui/layouts/home';
import { useEffect, useState, type ReactNode } from 'react';

interface AccessCheckOptions {
  getLogoutUrl: (signal: AbortSignal) => Promise<string | undefined>;
  sessionKey?: string | null;
  recheckOnReturn?: boolean;
}

type AccessAwareLayoutProps<LayoutProps> = AccessCheckOptions & {
  getLayoutProps: (logoutUrl: string | undefined) => LayoutProps;
  children?: ReactNode;
};

export type AccessAwareHomeLayoutProps = AccessAwareLayoutProps<Omit<HomeLayoutProps, 'children'>>;

export type AccessAwareDocsLayoutProps = AccessAwareLayoutProps<Omit<DocsLayoutProps, 'children' | 'tree'>> &
  Pick<DocsLayoutProps, 'tree'>;

type VerifiedSession = Pick<AccessCheckOptions, 'getLogoutUrl' | 'sessionKey'> & {
  logoutUrl: string;
};

function useLogoutUrl({ getLogoutUrl, sessionKey, recheckOnReturn = false }: AccessCheckOptions) {
  const [session, setSession] = useState<VerifiedSession>();

  useEffect(() => {
    let controller: AbortController | undefined;

    async function checkSession() {
      controller?.abort();
      const check = new AbortController();
      controller = check;
      setSession(undefined);

      let logoutUrl: string | undefined;
      try {
        logoutUrl = await getLogoutUrl(check.signal);
      } catch {
        // A failed check leaves the logout URL unset.
      }

      if (!check.signal.aborted && logoutUrl) {
        setSession({ getLogoutUrl, sessionKey, logoutUrl });
      }
    }

    function restorePage(event: PageTransitionEvent) {
      if (event.persisted) void checkSession();
    }

    void checkSession();
    if (recheckOnReturn) {
      window.addEventListener('focus', checkSession);
      window.addEventListener('pageshow', restorePage);
    }

    return () => {
      controller?.abort();
      if (recheckOnReturn) {
        window.removeEventListener('focus', checkSession);
        window.removeEventListener('pageshow', restorePage);
      }
    };
  }, [getLogoutUrl, sessionKey, recheckOnReturn]);

  if (session?.getLogoutUrl === getLogoutUrl && session.sessionKey === sessionKey) {
    return session.logoutUrl;
  }
}

export function AccessAwareHomeLayout({ children, getLayoutProps, ...access }: AccessAwareHomeLayoutProps) {
  const logoutUrl = useLogoutUrl(access);
  return <HomeLayout {...getLayoutProps(logoutUrl)}>{children}</HomeLayout>;
}

export function AccessAwareDocsLayout({ tree, children, getLayoutProps, ...access }: AccessAwareDocsLayoutProps) {
  const logoutUrl = useLogoutUrl(access);
  return <DocsLayout {...getLayoutProps(logoutUrl)} tree={tree}>{children}</DocsLayout>;
}
