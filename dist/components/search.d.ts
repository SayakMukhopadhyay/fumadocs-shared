import { type SharedProps } from 'fumadocs-ui/components/dialog/search';
import type { ReactNode } from 'react';
type StaticSearchDialogProps = SharedProps & {
    from?: string;
};
export declare function StaticSearchDialog({ from, ...props }: StaticSearchDialogProps): import("react").JSX.Element;
export declare function StaticSearchProvider({ children, from }: {
    children: ReactNode;
    from?: string;
}): import("react").JSX.Element;
export {};
