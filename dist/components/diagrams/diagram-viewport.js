import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
import * as d3 from 'd3';
export function DiagramViewportControls() {
    return (_jsxs(_Fragment, { children: [_jsx("button", { className: "diagram-viewport__button", "data-diagram-viewport-fit": true, type: "button", children: "Fit" }), _jsx("button", { className: "diagram-viewport__button", "data-diagram-viewport-fullscreen": true, type: "button", children: "Fullscreen" })] }));
}
export function createDiagramViewport(options) {
    const { root, canvas, surface, getContentBounds, applyTransform, onZoom, fitAlignment = 'center', fitPadding = 0.9, maxFitScale = 1.35, minCenterScale = 0.35, minScale = 0.08, maxScale = 2.8, minViewportWidth = 320, minViewportHeight = 240, topPadding = 28, } = options;
    const fitButton = requireElement(root, '[data-diagram-viewport-fit]');
    const fullscreenButton = requireElement(root, '[data-diagram-viewport-fullscreen]');
    const abortController = new AbortController();
    const surfaceSelection = d3.select(surface);
    let fitFrame = null;
    let wasFullscreen = document.fullscreenElement === root;
    const zoom = d3
        .zoom()
        .extent(() => {
        const { width, height } = viewportSize(canvas);
        return [
            [0, 0],
            [width, height],
        ];
    })
        .scaleExtent([minScale, maxScale])
        .on('zoom', (event) => {
        applyTransform(event.transform);
        onZoom?.(event.transform.k);
    });
    surfaceSelection.call(zoom);
    function applyViewportTransform(transform, animate) {
        const selection = animate ? surfaceSelection.transition().duration(180) : surfaceSelection;
        selection.call(zoom.transform, transform);
    }
    function fit(animate = false) {
        const bounds = validBounds(getContentBounds());
        if (!bounds) {
            return;
        }
        const width = Math.max(canvas.clientWidth, minViewportWidth);
        const height = Math.max(canvas.clientHeight, minViewportHeight);
        const scale = Math.min(maxFitScale, Math.max(minScale, Math.min(width / bounds.width, height / bounds.height) * fitPadding));
        const x = (width - bounds.width * scale) / 2 - bounds.x * scale;
        const y = fitAlignment === 'top' ? topPadding - bounds.y * scale : (height - bounds.height * scale) / 2 - bounds.y * scale;
        applyViewportTransform(d3.zoomIdentity.translate(x, y).scale(scale), animate);
    }
    function center(bounds, animate = true) {
        if (!validBounds(bounds)) {
            return;
        }
        const width = Math.max(canvas.clientWidth, minViewportWidth);
        const height = Math.max(canvas.clientHeight, minViewportHeight);
        const scale = Math.max(d3.zoomTransform(surface).k, minCenterScale);
        const x = width / 2 - (bounds.x + bounds.width / 2) * scale;
        const y = height / 2 - (bounds.y + bounds.height / 2) * scale;
        applyViewportTransform(d3.zoomIdentity.translate(x, y).scale(scale), animate);
    }
    function scheduleFit() {
        if (fitFrame !== null) {
            window.cancelAnimationFrame(fitFrame);
        }
        fitFrame = window.requestAnimationFrame(() => {
            fitFrame = null;
            fit(false);
        });
    }
    function updateFullscreenButton() {
        const isFullscreen = document.fullscreenElement === root;
        fullscreenButton.textContent = isFullscreen ? 'Exit fullscreen' : 'Fullscreen';
        fullscreenButton.setAttribute('aria-pressed', String(isFullscreen));
    }
    async function toggleFullscreen() {
        if (!document.fullscreenEnabled) {
            return;
        }
        if (document.fullscreenElement === root) {
            await document.exitFullscreen();
        }
        else {
            await root.requestFullscreen();
        }
    }
    fitButton.addEventListener('click', (event) => {
        event.preventDefault();
        fit(true);
    }, { signal: abortController.signal });
    fullscreenButton.addEventListener('click', (event) => {
        event.preventDefault();
        void toggleFullscreen();
    }, { signal: abortController.signal });
    document.addEventListener('fullscreenchange', () => {
        const isFullscreen = document.fullscreenElement === root;
        updateFullscreenButton();
        if (isFullscreen || wasFullscreen) {
            scheduleFit();
        }
        wasFullscreen = isFullscreen;
    }, { signal: abortController.signal });
    updateFullscreenButton();
    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(canvas);
    return {
        center,
        fit,
        destroy() {
            abortController.abort();
            resizeObserver.disconnect();
            if (fitFrame !== null) {
                window.cancelAnimationFrame(fitFrame);
            }
            surfaceSelection.interrupt().on('.zoom', null);
        },
    };
}
function viewportSize(canvas) {
    const bounds = canvas.getBoundingClientRect();
    return {
        width: Math.max(bounds.width, 1),
        height: Math.max(bounds.height, 1),
    };
}
function validBounds(bounds) {
    return bounds &&
        Number.isFinite(bounds.x) &&
        Number.isFinite(bounds.y) &&
        Number.isFinite(bounds.width) &&
        Number.isFinite(bounds.height) &&
        bounds.width > 0 &&
        bounds.height > 0
        ? bounds
        : null;
}
function requireElement(root, selector) {
    const element = root.querySelector(selector);
    if (!element) {
        throw new Error(`missing diagram viewport element: ${selector}`);
    }
    return element;
}
