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
import { Component, Suspense, use, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, } from 'react';
import { useTheme } from 'fumadocs-ui/provider/base';
import { createDiagramViewport, DiagramViewportControls } from './diagram-viewport.js';
const subscribe = () => () => { };
export function Mermaid({ chart }) {
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    if (!mounted) {
        return null;
    }
    return (_jsx(MermaidErrorBoundary, { chart: chart, children: _jsx(Suspense, { fallback: _jsx("pre", { "aria-label": "Diagram source", children: chart }), children: _jsx(MermaidContent, { chart: chart }) }) }, chart));
}
class MermaidErrorBoundary extends Component {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        return this.state.failed ? (_jsx("pre", { "aria-label": "Diagram source; rendering unavailable", children: this.props.chart })) : (this.props.children);
    }
}
const cache = new Map();
function cachePromise(key, setPromise) {
    const cached = cache.get(key);
    if (cached) {
        return cached;
    }
    const promise = setPromise();
    cache.set(key, promise);
    return promise;
}
function MermaidContent({ chart }) {
    const id = useId();
    const { resolvedTheme } = useTheme();
    const { default: mermaid } = use(cachePromise('mermaid', () => import('mermaid')));
    mermaid.initialize({
        startOnLoad: false,
        suppressErrorRendering: true,
        securityLevel: 'loose',
        fontFamily: 'inherit',
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
    });
    const { svg, bindFunctions } = use(cachePromise(`${chart}-${resolvedTheme}`, () => mermaid.render(id, chart.replaceAll('\\n', '\n'))));
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const [sectionHeading, setSectionHeading] = useState();
    useLayoutEffect(() => {
        const root = rootRef.current;
        const sourceHeading = root?.previousElementSibling;
        if (!(sourceHeading instanceof HTMLHeadingElement) || sourceHeading.tagName !== 'H2') {
            setSectionHeading(null);
            return;
        }
        const headingLink = sourceHeading.querySelector('a[href^="#"]');
        const title = headingLink?.textContent?.trim() || sourceHeading.textContent?.trim();
        if (!title) {
            setSectionHeading(null);
            return;
        }
        const id = sourceHeading.id || headingLink?.hash.slice(1) || null;
        const wasHidden = sourceHeading.hidden;
        sourceHeading.hidden = true;
        sourceHeading.removeAttribute('id');
        setSectionHeading({ id, title });
        return () => {
            sourceHeading.hidden = wasHidden;
            if (id) {
                sourceHeading.id = id;
            }
        };
    }, []);
    useEffect(() => {
        if (sectionHeading === undefined) {
            return;
        }
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const renderedSvg = canvas?.querySelector(':scope > svg');
        if (!root || !canvas || !renderedSvg) {
            return;
        }
        const fallbackBounds = svgViewBox(renderedSvg);
        const originalViewBox = renderedSvg.getAttribute('viewBox');
        const originalWidth = renderedSvg.getAttribute('width');
        const originalHeight = renderedSvg.getAttribute('height');
        const originalMaxWidth = renderedSvg.style.maxWidth;
        const contentLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        contentLayer.classList.add('mermaid-diagram__content');
        for (const child of Array.from(renderedSvg.childNodes)) {
            if (child instanceof SVGElement && ['defs', 'desc', 'style', 'title'].includes(child.tagName.toLowerCase())) {
                continue;
            }
            contentLayer.append(child);
        }
        renderedSvg.append(contentLayer);
        renderedSvg.removeAttribute('viewBox');
        renderedSvg.setAttribute('width', '100%');
        renderedSvg.setAttribute('height', '100%');
        renderedSvg.style.maxWidth = 'none';
        renderedSvg.classList.add('diagram-viewport__svg', 'mermaid-diagram__svg');
        bindFunctions?.(canvas);
        const viewport = createDiagramViewport({
            root,
            canvas,
            surface: renderedSvg,
            getContentBounds: () => contentBounds(contentLayer, fallbackBounds),
            applyTransform: (transform) => contentLayer.setAttribute('transform', transform.toString()),
        });
        viewport.fit();
        return () => {
            viewport.destroy();
            if (contentLayer.parentNode === renderedSvg) {
                while (contentLayer.firstChild) {
                    renderedSvg.insertBefore(contentLayer.firstChild, contentLayer);
                }
                contentLayer.remove();
            }
            restoreAttribute(renderedSvg, 'viewBox', originalViewBox);
            restoreAttribute(renderedSvg, 'width', originalWidth);
            restoreAttribute(renderedSvg, 'height', originalHeight);
            renderedSvg.style.maxWidth = originalMaxWidth;
            renderedSvg.classList.remove('diagram-viewport__svg', 'mermaid-diagram__svg');
        };
    }, [bindFunctions, sectionHeading, svg]);
    return (_jsxs("div", { ref: rootRef, className: "diagram-viewport mermaid-diagram", children: [_jsxs("div", { className: "diagram-viewport__toolbar mermaid-diagram__toolbar", children: [sectionHeading ? (_jsx("h2", { id: sectionHeading.id ?? undefined, className: "mermaid-diagram__label mermaid-diagram__heading", children: sectionHeading.id ? _jsx("a", { href: `#${sectionHeading.id}`, children: sectionHeading.title }) : sectionHeading.title })) : (_jsx("span", { className: "mermaid-diagram__label", children: "Diagram" })), _jsx(DiagramViewportControls, {})] }), _jsx("div", { ref: canvasRef, className: "diagram-viewport__canvas mermaid-diagram__canvas", dangerouslySetInnerHTML: { __html: svg } })] }));
}
function svgViewBox(svg) {
    if (!svg.hasAttribute('viewBox')) {
        return null;
    }
    const { x, y, width, height } = svg.viewBox.baseVal;
    return { x, y, width, height };
}
function contentBounds(content, fallback) {
    try {
        const { x, y, width, height } = content.getBBox();
        if (width > 0 && height > 0) {
            return { x, y, width, height };
        }
    }
    catch {
        // The original Mermaid viewBox remains a safe fallback while an SVG is not measurable.
    }
    return fallback;
}
function restoreAttribute(element, name, value) {
    if (value === null) {
        element.removeAttribute(name);
    }
    else {
        element.setAttribute(name, value);
    }
}
