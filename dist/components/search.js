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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStaticSearch } from 'fumadocs-core/search/client';
import { SearchDialog, SearchDialogClose, SearchDialogContent, SearchDialogHeader, SearchDialogIcon, SearchDialogInput, SearchDialogList, SearchDialogOverlay, } from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
export function StaticSearchDialog(props) {
    const { locale } = useI18n();
    const search = useStaticSearch({ locale });
    return (_jsxs(SearchDialog, { ...search, ...props, children: [_jsx(SearchDialogOverlay, {}), _jsxs(SearchDialogContent, { children: [_jsxs(SearchDialogHeader, { children: [_jsx(SearchDialogIcon, {}), _jsx(SearchDialogInput, {}), _jsx(SearchDialogClose, {})] }), _jsx(SearchDialogList, {})] })] }));
}
export function StaticSearchProvider({ children }) {
    return _jsx(RootProvider, { search: { SearchDialog: StaticSearchDialog }, children: children });
}
