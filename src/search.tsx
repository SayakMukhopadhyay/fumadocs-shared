'use client';

// Adapted from the GOLFS Docs search dialog and provider under Apache-2.0.
import { useStaticSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

export function StaticSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const search = useStaticSearch({ locale });

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList />
      </SearchDialogContent>
    </SearchDialog>
  );
}

export function StaticSearchProvider({ children }: { children: ReactNode }) {
  return <RootProvider search={{ SearchDialog: StaticSearchDialog }}>{children}</RootProvider>;
}
