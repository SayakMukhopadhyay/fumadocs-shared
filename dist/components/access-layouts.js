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
import { jsx as _jsx } from "react/jsx-runtime";
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { useEffect, useState } from 'react';
function useLogoutUrl({ getLogoutUrl, sessionKey, recheckOnReturn = false }) {
    const [session, setSession] = useState();
    useEffect(() => {
        let controller;
        async function checkSession() {
            controller?.abort();
            const check = new AbortController();
            controller = check;
            setSession(undefined);
            let logoutUrl;
            try {
                logoutUrl = await getLogoutUrl(check.signal);
            }
            catch {
                // A failed check leaves the logout URL unset.
            }
            if (!check.signal.aborted && logoutUrl) {
                setSession({ getLogoutUrl, sessionKey, logoutUrl });
            }
        }
        function restorePage(event) {
            if (event.persisted)
                void checkSession();
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
export function AccessAwareHomeLayout({ children, getLayoutProps, ...access }) {
    const logoutUrl = useLogoutUrl(access);
    return _jsx(HomeLayout, { ...getLayoutProps(logoutUrl), children: children });
}
export function AccessAwareDocsLayout({ tree, children, getLayoutProps, ...access }) {
    const logoutUrl = useLogoutUrl(access);
    return _jsx(DocsLayout, { ...getLayoutProps(logoutUrl), tree: tree, children: children });
}
