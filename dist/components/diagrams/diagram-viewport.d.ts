import type { ZoomTransform } from 'd3';
export type DiagramBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};
type DiagramViewportOptions = {
    root: HTMLElement;
    canvas: HTMLElement;
    surface: SVGSVGElement;
    getContentBounds: () => DiagramBounds | null;
    applyTransform: (transform: ZoomTransform) => void;
    onZoom?: (scale: number) => void;
    fitAlignment?: 'center' | 'top';
    fitPadding?: number;
    maxFitScale?: number;
    minCenterScale?: number;
    minScale?: number;
    maxScale?: number;
    minViewportWidth?: number;
    minViewportHeight?: number;
    topPadding?: number;
};
export type DiagramViewportController = {
    center: (bounds: DiagramBounds, animate?: boolean) => void;
    destroy: () => void;
    fit: (animate?: boolean) => void;
};
export declare function DiagramViewportControls(): import("react").JSX.Element;
export declare function createDiagramViewport(options: DiagramViewportOptions): DiagramViewportController;
export {};
