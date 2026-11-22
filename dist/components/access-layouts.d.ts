import { type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { type HomeLayoutProps } from 'fumadocs-ui/layouts/home';
import { type ReactNode } from 'react';
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
export type AccessAwareDocsLayoutProps = AccessAwareLayoutProps<Omit<DocsLayoutProps, 'children' | 'tree'>> & Pick<DocsLayoutProps, 'tree'>;
export declare function AccessAwareHomeLayout({ children, getLayoutProps, ...access }: AccessAwareHomeLayoutProps): import("react").JSX.Element;
export declare function AccessAwareDocsLayout({ tree, children, getLayoutProps, ...access }: AccessAwareDocsLayoutProps): import("react").JSX.Element;
export {};
