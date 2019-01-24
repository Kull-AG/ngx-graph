/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// rename transition due to conflict with d3 transition
import { animate, style, transition as ngTransition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation, NgZone, ChangeDetectorRef } from '@angular/core';
import { BaseChartComponent, ChartComponent, ColorHelper, calculateViewDimensions } from '@swimlane/ngx-charts';
import { select } from 'd3-selection';
import * as shape from 'd3-shape';
import 'd3-transition';
import { Observable, Subscription, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { identity, scale, toSVG, transform, translate } from 'transformation-matrix';
import { LayoutService } from './layouts/layout.service';
import { id } from '../utils/id';
console.log('EL REF', ElementRef);
/**
 * Matrix
 * @record
 */
export function Matrix() { }
if (false) {
    /** @type {?} */
    Matrix.prototype.a;
    /** @type {?} */
    Matrix.prototype.b;
    /** @type {?} */
    Matrix.prototype.c;
    /** @type {?} */
    Matrix.prototype.d;
    /** @type {?} */
    Matrix.prototype.e;
    /** @type {?} */
    Matrix.prototype.f;
}
export class GraphComponent extends BaseChartComponent {
    /**
     * @param {?} el
     * @param {?} zone
     * @param {?} cd
     * @param {?} layoutService
     */
    constructor(el, zone, cd, layoutService) {
        super(el, zone, cd);
        this.el = el;
        this.zone = zone;
        this.cd = cd;
        this.layoutService = layoutService;
        this.legend = false;
        this.nodes = [];
        this.clusters = [];
        this.links = [];
        this.activeEntries = [];
        this.draggingEnabled = true;
        this.panningEnabled = true;
        this.enableZoom = true;
        this.zoomSpeed = 0.1;
        this.minZoomLevel = 0.1;
        this.maxZoomLevel = 4.0;
        this.autoZoom = false;
        this.panOnZoom = true;
        this.autoCenter = false;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.graphSubscription = new Subscription();
        this.subscriptions = [];
        this.margin = [0, 0, 0, 0];
        this.results = [];
        this.isPanning = false;
        this.isDragging = false;
        this.initialized = false;
        this.graphDims = { width: 0, height: 0 };
        this._oldLinks = [];
        this.transformationMatrix = identity();
        this._touchLastX = null;
        this._touchLastY = null;
        this.zoomBefore = 1;
        this.groupResultsBy = node => node.label;
    }
    /**
     * Get the current zoom level
     * @return {?}
     */
    get zoomLevel() {
        return this.transformationMatrix.a;
    }
    /**
     * Set the current zoom level
     * @param {?} level
     * @return {?}
     */
    set zoomLevel(level) {
        this.zoomTo(Number(level));
    }
    /**
     * Get the current `x` position of the graph
     * @return {?}
     */
    get panOffsetX() {
        return this.transformationMatrix.e;
    }
    /**
     * Set the current `x` position of the graph
     * @param {?} x
     * @return {?}
     */
    set panOffsetX(x) {
        this.panTo(Number(x), null);
    }
    /**
     * Get the current `y` position of the graph
     * @return {?}
     */
    get panOffsetY() {
        return this.transformationMatrix.f;
    }
    /**
     * Set the current `y` position of the graph
     * @param {?} y
     * @return {?}
     */
    set panOffsetY(y) {
        this.panTo(null, Number(y));
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngOnInit() {
        if (this.update$) {
            this.subscriptions.push(this.update$.subscribe(() => {
                this.update();
            }));
        }
        if (this.center$) {
            this.subscriptions.push(this.center$.subscribe(() => {
                this.center();
            }));
        }
        if (this.zoomToFit$) {
            this.subscriptions.push(this.zoomToFit$.subscribe(() => {
                this.zoomToFit();
            }));
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        console.log(changes);
        const { layout, layoutSettings, nodes, clusters, links } = changes;
        this.setLayout(this.layout);
        if (layoutSettings) {
            this.setLayoutSettings(this.layoutSettings);
        }
        if (nodes || clusters || links) {
            this.update();
        }
    }
    /**
     * @param {?} layout
     * @return {?}
     */
    setLayout(layout) {
        this.initialized = false;
        if (!layout) {
            layout = 'dagre';
        }
        if (typeof layout === 'string') {
            this.layout = this.layoutService.getLayout(layout);
            this.setLayoutSettings(this.layoutSettings);
        }
    }
    /**
     * @param {?} settings
     * @return {?}
     */
    setLayoutSettings(settings) {
        if (this.layout && typeof this.layout !== 'string') {
            this.layout.settings = settings;
            this.update();
        }
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
        this.subscriptions = null;
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        setTimeout(() => this.update());
    }
    /**
     * Base class update implementation for the dag graph
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    update() {
        super.update();
        if (!this.curve) {
            this.curve = shape.curveBundle.beta(1);
        }
        this.zone.run(() => {
            this.dims = calculateViewDimensions({
                width: this.width,
                height: this.height,
                margins: this.margin,
                showLegend: this.legend
            });
            this.seriesDomain = this.getSeriesDomain();
            this.setColors();
            this.legendOptions = this.getLegendOptions();
            this.createGraph();
            // If zoom isn't 1, then nodes sometimes don't render in correct size
            // zooming to 1 fixes this
            this.saveZoomBeforeLoad();
            this.zoomLevel = 1;
            this.updateTransform();
            this.initialized = true;
        });
    }
    /**
     * Draws the graph using dagre layouts
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    draw() {
        if (!this.layout || typeof this.layout === 'string') {
            return;
        }
        // Calc view dims for the nodes
        this.applyNodeDimensions();
        // Recalc the layout
        /** @type {?} */
        const result = this.layout.run(this.graph);
        /** @type {?} */
        const result$ = result instanceof Observable ? result : of(result);
        this.graphSubscription.add(result$.subscribe(graph => {
            this.graph = graph;
            this.tick();
        }));
        result$
            .pipe(first(graph => graph.nodes.length > 0))
            .subscribe(() => this.applyNodeDimensions());
        this.restoreZoomBeforeLoad();
    }
    /**
     * @return {?}
     */
    tick() {
        // Transposes view options to the node
        this.graph.nodes.map(n => {
            n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n.position.y - n.dimension.height / 2 || 0})`;
            if (!n.data) {
                n.data = {};
            }
            if (!n.data.color) {
                n.data = {
                    color: this.colors.getColor(this.groupResultsBy(n))
                };
            }
        });
        (this.graph.clusters || []).map(n => {
            n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n.position.y - n.dimension.height / 2 || 0})`;
            if (!n.data) {
                n.data = {};
            }
            if (!n.data.color) {
                n.data = {
                    color: this.colors.getColor(this.groupResultsBy(n))
                };
            }
        });
        // Update the labels to the new positions
        /** @type {?} */
        const newLinks = [];
        for (const edgeLabelId in this.graph.edgeLabels) {
            /** @type {?} */
            const edgeLabel = this.graph.edgeLabels[edgeLabelId];
            /** @type {?} */
            const normKey = edgeLabelId.replace(/[^\w-]*/g, '');
            /** @type {?} */
            let oldLink = this._oldLinks.find(ol => `${ol.source}${ol.target}` === normKey);
            if (!oldLink) {
                oldLink = this.graph.edges.find(nl => `${nl.source}${nl.target}` === normKey) || edgeLabel;
            }
            oldLink.oldLine = oldLink.line;
            /** @type {?} */
            const points = edgeLabel.points;
            /** @type {?} */
            const line = this.generateLine(points);
            /** @type {?} */
            const newLink = Object.assign({}, oldLink);
            newLink.line = line;
            newLink.points = points;
            /** @type {?} */
            const textPos = points[Math.floor(points.length / 2)];
            if (textPos) {
                newLink.textTransform = `translate(${textPos.x || 0},${textPos.y || 0})`;
            }
            newLink.textAngle = 0;
            if (!newLink.oldLine) {
                newLink.oldLine = newLink.line;
            }
            this.calcDominantBaseline(newLink);
            newLinks.push(newLink);
        }
        this.graph.edges = newLinks;
        // Map the old links for animations
        if (this.graph.edges) {
            this._oldLinks = this.graph.edges.map(l => {
                /** @type {?} */
                const newL = Object.assign({}, l);
                newL.oldLine = l.line;
                return newL;
            });
        }
        // Calculate the height/width total
        this.graphDims.width = Math.max(...this.graph.nodes.map(n => n.position.x + n.dimension.width));
        this.graphDims.height = Math.max(...this.graph.nodes.map(n => n.position.y + n.dimension.height));
        if (this.autoZoom) {
            this.zoomToFit();
        }
        if (this.autoCenter) {
            // Auto-center when rendering
            this.center();
        }
        requestAnimationFrame(() => this.redrawLines());
        this.cd.markForCheck();
    }
    /**
     * Measures the node element and applies the dimensions
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    applyNodeDimensions() {
        if (this.nodeElements && this.nodeElements.length) {
            this.nodeElements.map(elem => {
                /** @type {?} */
                const nativeElement = elem.nativeElement;
                /** @type {?} */
                const node = this.graph.nodes.find(n => n.id === nativeElement.id);
                // calculate the height
                /** @type {?} */
                let dims;
                try {
                    dims = nativeElement.getBoundingClientRect();
                }
                catch (ex) {
                    // Skip drawing if element is not displayed - Firefox would throw an error here
                    return;
                }
                if (this.nodeHeight) {
                    node.dimension.height = this.nodeHeight;
                }
                else {
                    node.dimension.height = dims.height;
                }
                if (this.nodeMaxHeight) {
                    node.dimension.height = Math.max(node.dimension.height, this.nodeMaxHeight);
                }
                if (this.nodeMinHeight) {
                    node.dimension.height = Math.min(node.dimension.height, this.nodeMinHeight);
                }
                if (this.nodeWidth) {
                    node.dimension.width = this.nodeWidth;
                }
                else {
                    // calculate the width
                    if (nativeElement.getElementsByTagName('text').length) {
                        /** @type {?} */
                        let textDims;
                        try {
                            textDims = nativeElement.getElementsByTagName('text')[0].getBBox();
                        }
                        catch (ex) {
                            // Skip drawing if element is not displayed - Firefox would throw an error here
                            return;
                        }
                        node.dimension.width = textDims.width + 20;
                    }
                    else {
                        node.dimension.width = dims.width;
                    }
                }
                if (this.nodeMaxWidth) {
                    node.dimension.width = Math.max(node.dimension.width, this.nodeMaxWidth);
                }
                if (this.nodeMinWidth) {
                    node.dimension.width = Math.min(node.dimension.width, this.nodeMinWidth);
                }
            });
        }
    }
    /**
     * Redraws the lines when dragged or viewport updated
     *
     * \@memberOf GraphComponent
     * @param {?=} _animate
     * @return {?}
     */
    redrawLines(_animate = true) {
        this.linkElements.map(linkEl => {
            /** @type {?} */
            const edge = this.graph.edges.find(lin => lin.id === linkEl.nativeElement.id);
            if (edge) {
                /** @type {?} */
                const linkSelection = select(linkEl.nativeElement).select('.line');
                linkSelection
                    .attr('d', edge.oldLine)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.line);
                /** @type {?} */
                const textPathSelection = select(this.chartElement.nativeElement).select(`#${edge.id}`);
                textPathSelection
                    .attr('d', edge.oldTextPath)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.textPath);
            }
        });
    }
    /**
     * Creates the dagre graph engine
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    createGraph() {
        this.graphSubscription.unsubscribe();
        this.graphSubscription = new Subscription();
        /** @type {?} */
        const initializeNode = n => {
            if (!n.id) {
                n.id = id();
            }
            n.dimension = {
                width: 30,
                height: 30
            };
            n.position = {
                x: 0,
                y: 0
            };
            n.data = n.data ? n.data : {};
            return n;
        };
        this.graph = {
            nodes: [...this.nodes].map(initializeNode),
            clusters: [...(this.clusters || [])].map(initializeNode),
            edges: [...this.links].map(e => {
                if (!e.id) {
                    e.id = id();
                }
                return e;
            })
        };
        requestAnimationFrame(() => this.draw());
    }
    /**
     * Calculate the text directions / flipping
     *
     * \@memberOf GraphComponent
     * @param {?} link
     * @return {?}
     */
    calcDominantBaseline(link) {
        /** @type {?} */
        const firstPoint = link.points[0];
        /** @type {?} */
        const lastPoint = link.points[link.points.length - 1];
        link.oldTextPath = link.textPath;
        if (lastPoint.x < firstPoint.x) {
            link.dominantBaseline = 'text-before-edge';
            // reverse text path for when its flipped upside down
            link.textPath = this.generateLine([...link.points].reverse());
        }
        else {
            link.dominantBaseline = 'text-after-edge';
            link.textPath = link.line;
        }
    }
    /**
     * Generate the new line path
     *
     * \@memberOf GraphComponent
     * @param {?} points
     * @return {?}
     */
    generateLine(points) {
        /** @type {?} */
        const lineFunction = shape
            .line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(this.curve);
        return lineFunction(points);
    }
    /**
     * Zoom was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @param {?} direction
     * @return {?}
     */
    onZoom($event, direction) {
        /** @type {?} */
        const zoomFactor = 1 + (direction === 'in' ? this.zoomSpeed : -this.zoomSpeed);
        // Check that zooming wouldn't put us out of bounds
        /** @type {?} */
        const newZoomLevel = this.zoomLevel * zoomFactor;
        if (newZoomLevel <= this.minZoomLevel || newZoomLevel >= this.maxZoomLevel) {
            return;
        }
        // Check if zooming is enabled or not
        if (!this.enableZoom) {
            return;
        }
        if (this.panOnZoom === true && $event) {
            // Absolute mouse X/Y on the screen
            /** @type {?} */
            const mouseX = $event.clientX;
            /** @type {?} */
            const mouseY = $event.clientY;
            // Transform the mouse X/Y into a SVG X/Y
            /** @type {?} */
            const svg = this.chart.nativeElement.querySelector('svg');
            /** @type {?} */
            const svgGroup = svg.querySelector('g.chart');
            /** @type {?} */
            const point = svg.createSVGPoint();
            point.x = mouseX;
            point.y = mouseY;
            /** @type {?} */
            const svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());
            // Panzoom
            /** @type {?} */
            const NO_ZOOM_LEVEL = 1;
            this.pan(svgPoint.x, svgPoint.y, NO_ZOOM_LEVEL);
            this.zoom(zoomFactor);
            this.pan(-svgPoint.x, -svgPoint.y, NO_ZOOM_LEVEL);
        }
        else {
            this.zoom(zoomFactor);
        }
    }
    /**
     * Pan by x/y
     *
     * @param {?} x
     * @param {?} y
     * @param {?=} zoomLevel
     * @return {?}
     */
    pan(x, y, zoomLevel = this.zoomLevel) {
        this.transformationMatrix = transform(this.transformationMatrix, translate(x / zoomLevel, y / zoomLevel));
        this.updateTransform();
    }
    /**
     * Pan to a fixed x/y
     *
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    panTo(x, y) {
        this.transformationMatrix.e = x === null || x === undefined || isNaN(x) ? this.transformationMatrix.e : Number(x);
        this.transformationMatrix.f = y === null || y === undefined || isNaN(y) ? this.transformationMatrix.f : Number(y);
        this.updateTransform();
    }
    /**
     * Zoom by a factor
     *
     * @param {?} factor
     * @return {?}
     */
    zoom(factor) {
        this.transformationMatrix = transform(this.transformationMatrix, scale(factor, factor));
        this.updateTransform();
    }
    /**
     * Zoom to a fixed level
     *
     * @param {?} level
     * @return {?}
     */
    zoomTo(level) {
        this.transformationMatrix.a = isNaN(level) ? this.transformationMatrix.a : Number(level);
        this.transformationMatrix.d = isNaN(level) ? this.transformationMatrix.d : Number(level);
        this.updateTransform();
    }
    /**
     * Pan was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onPan(event) {
        this.pan(event.movementX, event.movementY);
    }
    /**
     * Drag was invoked from an event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onDrag(event) {
        if (!this.draggingEnabled) {
            return;
        }
        /** @type {?} */
        const node = this.draggingNode;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDrag) {
            this.layout.onDrag(node, event);
        }
        node.position.x += event.movementX / this.zoomLevel;
        node.position.y += event.movementY / this.zoomLevel;
        // move the node
        /** @type {?} */
        const x = node.position.x - node.dimension.width / 2;
        /** @type {?} */
        const y = node.position.y - node.dimension.height / 2;
        node.transform = `translate(${x}, ${y})`;
        for (const link of this.graph.edges) {
            if (link.target === node.id ||
                link.source === node.id ||
                ((/** @type {?} */ (link.target))).id === node.id ||
                ((/** @type {?} */ (link.source))).id === node.id) {
                if (this.layout && typeof this.layout !== 'string') {
                    /** @type {?} */
                    const result = this.layout.updateEdge(this.graph, link);
                    /** @type {?} */
                    const result$ = result instanceof Observable ? result : of(result);
                    this.graphSubscription.add(result$.subscribe(graph => {
                        this.graph = graph;
                        this.redrawEdge(link);
                    }));
                }
            }
        }
        this.redrawLines(false);
    }
    /**
     * @param {?} edge
     * @return {?}
     */
    redrawEdge(edge) {
        /** @type {?} */
        const line = this.generateLine(edge.points);
        this.calcDominantBaseline(edge);
        edge.oldLine = edge.line;
        edge.line = line;
    }
    /**
     * Update the entire view for the new pan position
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    updateTransform() {
        this.transform = toSVG(this.transformationMatrix);
    }
    /**
     * Node was clicked
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    onClick(event, originalEvent) {
        event.origEvent = originalEvent;
        this.select.emit(event);
    }
    /**
     * Node was clicked
     *
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    onDoubleClick(event, originalEvent) {
        event.origEvent = originalEvent;
        event.isDoubleClick = true;
        this.select.emit(event);
    }
    /**
     * Node was focused
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onActivate(event) {
        if (this.activeEntries.indexOf(event) > -1) {
            return;
        }
        this.activeEntries = [event, ...this.activeEntries];
        this.activate.emit({ value: event, entries: this.activeEntries });
    }
    /**
     * Node was defocused
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onDeactivate(event) {
        /** @type {?} */
        const idx = this.activeEntries.indexOf(event);
        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];
        this.deactivate.emit({ value: event, entries: this.activeEntries });
    }
    /**
     * Get the domain series for the nodes
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    getSeriesDomain() {
        return this.nodes
            .map(d => this.groupResultsBy(d))
            .reduce((nodes, node) => (nodes.indexOf(node) !== -1 ? nodes : nodes.concat([node])), [])
            .sort();
    }
    /**
     * Tracking for the link
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} link
     * @return {?}
     */
    trackLinkBy(index, link) {
        return link.id;
    }
    /**
     * Tracking for the node
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} node
     * @return {?}
     */
    trackNodeBy(index, node) {
        return node.id;
    }
    /**
     * Sets the colors the nodes
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    setColors() {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
    }
    /**
     * Gets the legend options
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    getLegendOptions() {
        return {
            scaleType: 'ordinal',
            domain: this.seriesDomain,
            colors: this.colors
        };
    }
    /**
     * On mouse move event, used for panning and dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @return {?}
     */
    onMouseMove($event) {
        if (this.isPanning && this.panningEnabled) {
            this.onPan($event);
        }
        else if (this.isDragging && this.draggingEnabled) {
            this.onDrag($event);
        }
    }
    /**
     * On touch start event to enable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onTouchStart(event) {
        this._touchLastX = event.changedTouches[0].clientX;
        this._touchLastY = event.changedTouches[0].clientY;
        this.isPanning = true;
    }
    /**
     * On touch move event, used for panning.
     *
     * @param {?} $event
     * @return {?}
     */
    onTouchMove($event) {
        if (this.isPanning && this.panningEnabled) {
            /** @type {?} */
            const clientX = $event.changedTouches[0].clientX;
            /** @type {?} */
            const clientY = $event.changedTouches[0].clientY;
            /** @type {?} */
            const movementX = clientX - this._touchLastX;
            /** @type {?} */
            const movementY = clientY - this._touchLastY;
            this._touchLastX = clientX;
            this._touchLastY = clientY;
            this.pan(movementX, movementY);
        }
    }
    /**
     * On touch end event to disable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onTouchEnd(event) {
        this.isPanning = false;
    }
    /**
     * On mouse up event to disable panning/dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        this.isDragging = false;
        this.isPanning = false;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragEnd) {
            this.layout.onDragEnd(this.draggingNode, event);
        }
    }
    /**
     * On node mouse down to kick off dragging
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    onNodeMouseDown(event, node) {
        if (!this.draggingEnabled) {
            return;
        }
        this.isDragging = true;
        this.draggingNode = node;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragStart) {
            this.layout.onDragStart(node, event);
        }
    }
    /**
     * Center the graph in the viewport
     * @return {?}
     */
    center() {
        this.panTo(this.dims.width / 2 - (this.graphDims.width * this.zoomLevel) / 2, this.dims.height / 2 - (this.graphDims.height * this.zoomLevel) / 2);
    }
    /**
     * Zooms to fit the entier graph
     * @return {?}
     */
    zoomToFit() {
        /** @type {?} */
        const heightZoom = this.dims.height / this.graphDims.height;
        /** @type {?} */
        const widthZoom = this.dims.width / this.graphDims.width;
        /** @type {?} */
        const zoomLevel = Math.min(heightZoom, widthZoom, 1);
        if (zoomLevel !== this.zoomLevel) {
            this.zoomLevel = zoomLevel;
            this.updateTransform();
        }
    }
    /**
     * @return {?}
     */
    restoreZoomBeforeLoad() {
        if (this.autoZoom) {
            this.zoomToFit();
        }
        else {
            this.zoomLevel = this.zoomBefore;
        }
    }
    /**
     * @return {?}
     */
    saveZoomBeforeLoad() {
        this.zoomBefore = this.zoomLevel;
    }
}
GraphComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-graph',
                styles: [`.graph{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.graph .edge{stroke:#666;fill:none}.graph .edge .edge-label{stroke:none;font-size:12px;fill:#251e1e}.graph .panning-rect{fill:transparent;cursor:move}.graph .node-group .node:focus{outline:0}.graph .cluster rect{opacity:.2}`],
                template: `
  <ngx-charts-chart [view]="[width, height]" [showLegend]="legend" [legendOptions]="legendOptions" (legendLabelClick)="onClick($event, undefined)"
  (legendLabelActivate)="onActivate($event)" (legendLabelDeactivate)="onDeactivate($event)" mouseWheel (mouseWheelUp)="onZoom($event, 'in')"
  (mouseWheelDown)="onZoom($event, 'out')">
  <svg:g *ngIf="initialized && graph" [attr.transform]="transform" (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)"
    class="graph chart">
    <defs>
      <ng-template *ngIf="defsTemplate" [ngTemplateOutlet]="defsTemplate">
      </ng-template>
      <svg:path class="text-path" *ngFor="let link of graph.edges" [attr.d]="link.textPath" [attr.id]="link.id">
      </svg:path>
    </defs>
    <svg:rect class="panning-rect" [attr.width]="dims.width * 100" [attr.height]="dims.height * 100" [attr.transform]="'translate(' + ((-dims.width || 0) * 50) +',' + ((-dims.height || 0) *50) + ')' "
      (mousedown)="isPanning = true" />
      <svg:g class="clusters">
        <svg:g #clusterElement *ngFor="let node of graph.clusters; trackBy: trackNodeBy" class="node-group" [id]="node.id" [attr.transform]="node.transform"
          (click)="onClick(node,$event)">
          <ng-template *ngIf="clusterTemplate" [ngTemplateOutlet]="clusterTemplate" [ngTemplateOutletContext]="{ $implicit: node }">
          </ng-template>
          <svg:g *ngIf="!clusterTemplate" class="node cluster">
            <svg:rect [attr.width]="node.dimension.width" [attr.height]="node.dimension.height" [attr.fill]="node.data?.color" />
            <svg:text alignment-baseline="central" [attr.x]="10" [attr.y]="node.dimension.height / 2">{{node.label}}</svg:text>
          </svg:g>
        </svg:g>
      </svg:g>
      <svg:g class="links">
      <svg:g #linkElement *ngFor="let link of graph.edges; trackBy: trackLinkBy" class="link-group" [id]="link.id">
        <ng-template *ngIf="linkTemplate" [ngTemplateOutlet]="linkTemplate" [ngTemplateOutletContext]="{ $implicit: link }">
        </ng-template>
        <svg:path *ngIf="!linkTemplate" class="edge" [attr.d]="link.line" />
      </svg:g>
    </svg:g>
    <svg:g class="nodes">
      <svg:g #nodeElement *ngFor="let node of graph.nodes; trackBy: trackNodeBy" class="node-group" [id]="node.id" [attr.transform]="node.transform"
        (click)="onClick(node,$event)" (mousedown)="onNodeMouseDown($event, node)" (dblclick)="onDoubleClick(node,$event)">
        <ng-template *ngIf="nodeTemplate" [ngTemplateOutlet]="nodeTemplate" [ngTemplateOutletContext]="{ $implicit: node }">
        </ng-template>
        <svg:circle *ngIf="!nodeTemplate" r="10" [attr.cx]="node.dimension.width / 2" [attr.cy]="node.dimension.height / 2" [attr.fill]="node.data?.color"
        />
      </svg:g>
    </svg:g>
  </svg:g>
</ngx-charts-chart>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [trigger('link', [ngTransition('* => *', [animate(500, style({ transform: '*' }))])])]
            },] },
];
/** @nocollapse */
GraphComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: LayoutService }
];
GraphComponent.propDecorators = {
    legend: [{ type: Input }],
    nodes: [{ type: Input }],
    clusters: [{ type: Input }],
    links: [{ type: Input }],
    activeEntries: [{ type: Input }],
    curve: [{ type: Input }],
    draggingEnabled: [{ type: Input }],
    nodeHeight: [{ type: Input }],
    nodeMaxHeight: [{ type: Input }],
    nodeMinHeight: [{ type: Input }],
    nodeWidth: [{ type: Input }],
    nodeMinWidth: [{ type: Input }],
    nodeMaxWidth: [{ type: Input }],
    panningEnabled: [{ type: Input }],
    enableZoom: [{ type: Input }],
    zoomSpeed: [{ type: Input }],
    minZoomLevel: [{ type: Input }],
    maxZoomLevel: [{ type: Input }],
    autoZoom: [{ type: Input }],
    panOnZoom: [{ type: Input }],
    autoCenter: [{ type: Input }],
    update$: [{ type: Input }],
    center$: [{ type: Input }],
    zoomToFit$: [{ type: Input }],
    layout: [{ type: Input }],
    layoutSettings: [{ type: Input }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    linkTemplate: [{ type: ContentChild, args: ['linkTemplate',] }],
    nodeTemplate: [{ type: ContentChild, args: ['nodeTemplate',] }],
    clusterTemplate: [{ type: ContentChild, args: ['clusterTemplate',] }],
    defsTemplate: [{ type: ContentChild, args: ['defsTemplate',] }],
    chart: [{ type: ViewChild, args: [ChartComponent, { read: ElementRef },] }],
    nodeElements: [{ type: ViewChildren, args: ['nodeElement',] }],
    linkElements: [{ type: ViewChildren, args: ['linkElement',] }],
    groupResultsBy: [{ type: Input }],
    zoomLevel: [{ type: Input, args: ['zoomLevel',] }],
    panOffsetX: [{ type: Input, args: ['panOffsetX',] }],
    panOffsetY: [{ type: Input, args: ['panOffsetY',] }],
    onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }],
    onTouchMove: [{ type: HostListener, args: ['document:touchmove', ['$event'],] }],
    onMouseUp: [{ type: HostListener, args: ['document:mouseup',] }]
};
if (false) {
    /** @type {?} */
    GraphComponent.prototype.legend;
    /** @type {?} */
    GraphComponent.prototype.nodes;
    /** @type {?} */
    GraphComponent.prototype.clusters;
    /** @type {?} */
    GraphComponent.prototype.links;
    /** @type {?} */
    GraphComponent.prototype.activeEntries;
    /** @type {?} */
    GraphComponent.prototype.curve;
    /** @type {?} */
    GraphComponent.prototype.draggingEnabled;
    /** @type {?} */
    GraphComponent.prototype.nodeHeight;
    /** @type {?} */
    GraphComponent.prototype.nodeMaxHeight;
    /** @type {?} */
    GraphComponent.prototype.nodeMinHeight;
    /** @type {?} */
    GraphComponent.prototype.nodeWidth;
    /** @type {?} */
    GraphComponent.prototype.nodeMinWidth;
    /** @type {?} */
    GraphComponent.prototype.nodeMaxWidth;
    /** @type {?} */
    GraphComponent.prototype.panningEnabled;
    /** @type {?} */
    GraphComponent.prototype.enableZoom;
    /** @type {?} */
    GraphComponent.prototype.zoomSpeed;
    /** @type {?} */
    GraphComponent.prototype.minZoomLevel;
    /** @type {?} */
    GraphComponent.prototype.maxZoomLevel;
    /** @type {?} */
    GraphComponent.prototype.autoZoom;
    /** @type {?} */
    GraphComponent.prototype.panOnZoom;
    /** @type {?} */
    GraphComponent.prototype.autoCenter;
    /** @type {?} */
    GraphComponent.prototype.update$;
    /** @type {?} */
    GraphComponent.prototype.center$;
    /** @type {?} */
    GraphComponent.prototype.zoomToFit$;
    /** @type {?} */
    GraphComponent.prototype.layout;
    /** @type {?} */
    GraphComponent.prototype.layoutSettings;
    /** @type {?} */
    GraphComponent.prototype.activate;
    /** @type {?} */
    GraphComponent.prototype.deactivate;
    /** @type {?} */
    GraphComponent.prototype.linkTemplate;
    /** @type {?} */
    GraphComponent.prototype.nodeTemplate;
    /** @type {?} */
    GraphComponent.prototype.clusterTemplate;
    /** @type {?} */
    GraphComponent.prototype.defsTemplate;
    /** @type {?} */
    GraphComponent.prototype.chart;
    /** @type {?} */
    GraphComponent.prototype.nodeElements;
    /** @type {?} */
    GraphComponent.prototype.linkElements;
    /** @type {?} */
    GraphComponent.prototype.graphSubscription;
    /** @type {?} */
    GraphComponent.prototype.subscriptions;
    /** @type {?} */
    GraphComponent.prototype.colors;
    /** @type {?} */
    GraphComponent.prototype.dims;
    /** @type {?} */
    GraphComponent.prototype.margin;
    /** @type {?} */
    GraphComponent.prototype.results;
    /** @type {?} */
    GraphComponent.prototype.seriesDomain;
    /** @type {?} */
    GraphComponent.prototype.transform;
    /** @type {?} */
    GraphComponent.prototype.legendOptions;
    /** @type {?} */
    GraphComponent.prototype.isPanning;
    /** @type {?} */
    GraphComponent.prototype.isDragging;
    /** @type {?} */
    GraphComponent.prototype.draggingNode;
    /** @type {?} */
    GraphComponent.prototype.initialized;
    /** @type {?} */
    GraphComponent.prototype.graph;
    /** @type {?} */
    GraphComponent.prototype.graphDims;
    /** @type {?} */
    GraphComponent.prototype._oldLinks;
    /** @type {?} */
    GraphComponent.prototype.transformationMatrix;
    /** @type {?} */
    GraphComponent.prototype._touchLastX;
    /** @type {?} */
    GraphComponent.prototype._touchLastY;
    /** @type {?} */
    GraphComponent.prototype.zoomBefore;
    /** @type {?} */
    GraphComponent.prototype.groupResultsBy;
    /**
     * @type {?}
     * @private
     */
    GraphComponent.prototype.el;
    /** @type {?} */
    GraphComponent.prototype.zone;
    /** @type {?} */
    GraphComponent.prototype.cd;
    /**
     * @type {?}
     * @private
     */
    GraphComponent.prototype.layoutService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLElBQUksWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLGlCQUFpQixFQUdsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLGNBQWMsRUFDZCxXQUFXLEVBRVgsdUJBQXVCLEVBQ3hCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBSXpELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxR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Qjs7SUFFbkIsb0NBQWU7O0lBV2Ysd0NBQzJEOzs7OztJQVR6RCw0QkFBc0I7O0lBQ3RCLDhCQUFtQjs7SUFDbkIsNEJBQTRCOzs7OztJQUM1Qix1Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyByZW5hbWUgdHJhbnNpdGlvbiBkdWUgdG8gY29uZmxpY3Qgd2l0aCBkMyB0cmFuc2l0aW9uXHJcbmltcG9ydCB7IGFuaW1hdGUsIHN0eWxlLCB0cmFuc2l0aW9uIGFzIG5nVHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIENvbnRlbnRDaGlsZCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgUXVlcnlMaXN0LFxyXG4gIFRlbXBsYXRlUmVmLFxyXG4gIFZpZXdDaGlsZCxcclxuICBWaWV3Q2hpbGRyZW4sXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgTmdab25lLFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgQmFzZUNoYXJ0Q29tcG9uZW50LFxyXG4gIENoYXJ0Q29tcG9uZW50LFxyXG4gIENvbG9ySGVscGVyLFxyXG4gIFZpZXdEaW1lbnNpb25zLFxyXG4gIGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zXHJcbn0gZnJvbSAnQHN3aW1sYW5lL25neC1jaGFydHMnO1xyXG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBzaGFwZSBmcm9tICdkMy1zaGFwZSc7XHJcbmltcG9ydCAnZDMtdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGlkZW50aXR5LCBzY2FsZSwgdG9TVkcsIHRyYW5zZm9ybSwgdHJhbnNsYXRlIH0gZnJvbSAndHJhbnNmb3JtYXRpb24tbWF0cml4JztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL2xheW91dHMvbGF5b3V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uL21vZGVscy9ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcclxuXHJcbmNvbnNvbGUubG9nKCdFTCBSRUYnLCBFbGVtZW50UmVmKTtcclxuXHJcbi8qKlxyXG4gKiBNYXRyaXhcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWF0cml4IHtcclxuICBhOiBudW1iZXI7XHJcbiAgYjogbnVtYmVyO1xyXG4gIGM6IG51bWJlcjtcclxuICBkOiBudW1iZXI7XHJcbiAgZTogbnVtYmVyO1xyXG4gIGY6IG51bWJlcjtcclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZ3JhcGgnLFxyXG4gIHN0eWxlczogW2AuZ3JhcGh7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5ncmFwaCAuZWRnZXtzdHJva2U6IzY2NjtmaWxsOm5vbmV9LmdyYXBoIC5lZGdlIC5lZGdlLWxhYmVse3N0cm9rZTpub25lO2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzI1MWUxZX0uZ3JhcGggLnBhbm5pbmctcmVjdHtmaWxsOnRyYW5zcGFyZW50O2N1cnNvcjptb3ZlfS5ncmFwaCAubm9kZS1ncm91cCAubm9kZTpmb2N1c3tvdXRsaW5lOjB9LmdyYXBoIC5jbHVzdGVyIHJlY3R7b3BhY2l0eTouMn1gXSxcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxuZ3gtY2hhcnRzLWNoYXJ0IFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiIFtzaG93TGVnZW5kXT1cImxlZ2VuZFwiIFtsZWdlbmRPcHRpb25zXT1cImxlZ2VuZE9wdGlvbnNcIiAobGVnZW5kTGFiZWxDbGljayk9XCJvbkNsaWNrKCRldmVudCwgdW5kZWZpbmVkKVwiXHJcbiAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCIgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiIG1vdXNlV2hlZWwgKG1vdXNlV2hlZWxVcCk9XCJvblpvb20oJGV2ZW50LCAnaW4nKVwiXHJcbiAgKG1vdXNlV2hlZWxEb3duKT1cIm9uWm9vbSgkZXZlbnQsICdvdXQnKVwiPlxyXG4gIDxzdmc6ZyAqbmdJZj1cImluaXRpYWxpemVkICYmIGdyYXBoXCIgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQpXCIgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiXHJcbiAgICBjbGFzcz1cImdyYXBoIGNoYXJ0XCI+XHJcbiAgICA8ZGVmcz5cclxuICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwiZGVmc1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGVmc1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxzdmc6cGF0aCBjbGFzcz1cInRleHQtcGF0aFwiICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzXCIgW2F0dHIuZF09XCJsaW5rLnRleHRQYXRoXCIgW2F0dHIuaWRdPVwibGluay5pZFwiPlxyXG4gICAgICA8L3N2ZzpwYXRoPlxyXG4gICAgPC9kZWZzPlxyXG4gICAgPHN2ZzpyZWN0IGNsYXNzPVwicGFubmluZy1yZWN0XCIgW2F0dHIud2lkdGhdPVwiZGltcy53aWR0aCAqIDEwMFwiIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodCAqIDEwMFwiIFthdHRyLnRyYW5zZm9ybV09XCIndHJhbnNsYXRlKCcgKyAoKC1kaW1zLndpZHRoIHx8IDApICogNTApICsnLCcgKyAoKC1kaW1zLmhlaWdodCB8fCAwKSAqNTApICsgJyknIFwiXHJcbiAgICAgIChtb3VzZWRvd24pPVwiaXNQYW5uaW5nID0gdHJ1ZVwiIC8+XHJcbiAgICAgIDxzdmc6ZyBjbGFzcz1cImNsdXN0ZXJzXCI+XHJcbiAgICAgICAgPHN2ZzpnICNjbHVzdGVyRWxlbWVudCAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5jbHVzdGVyczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIiBjbGFzcz1cIm5vZGUtZ3JvdXBcIiBbaWRdPVwibm9kZS5pZFwiIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXHJcbiAgICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlLCRldmVudClcIj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImNsdXN0ZXJUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNsdXN0ZXJUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHN2ZzpnICpuZ0lmPVwiIWNsdXN0ZXJUZW1wbGF0ZVwiIGNsYXNzPVwibm9kZSBjbHVzdGVyXCI+XHJcbiAgICAgICAgICAgIDxzdmc6cmVjdCBbYXR0ci53aWR0aF09XCJub2RlLmRpbWVuc2lvbi53aWR0aFwiIFthdHRyLmhlaWdodF09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHRcIiBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIiAvPlxyXG4gICAgICAgICAgICA8c3ZnOnRleHQgYWxpZ25tZW50LWJhc2VsaW5lPVwiY2VudHJhbFwiIFthdHRyLnhdPVwiMTBcIiBbYXR0ci55XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIj57e25vZGUubGFiZWx9fTwvc3ZnOnRleHQ+XHJcbiAgICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDxzdmc6ZyBjbGFzcz1cImxpbmtzXCI+XHJcbiAgICAgIDxzdmc6ZyAjbGlua0VsZW1lbnQgKm5nRm9yPVwibGV0IGxpbmsgb2YgZ3JhcGguZWRnZXM7IHRyYWNrQnk6IHRyYWNrTGlua0J5XCIgY2xhc3M9XCJsaW5rLWdyb3VwXCIgW2lkXT1cImxpbmsuaWRcIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJsaW5rVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJsaW5rVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IGxpbmsgfVwiPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPHN2ZzpwYXRoICpuZ0lmPVwiIWxpbmtUZW1wbGF0ZVwiIGNsYXNzPVwiZWRnZVwiIFthdHRyLmRdPVwibGluay5saW5lXCIgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgICA8c3ZnOmcgY2xhc3M9XCJub2Rlc1wiPlxyXG4gICAgICA8c3ZnOmcgI25vZGVFbGVtZW50ICpuZ0Zvcj1cImxldCBub2RlIG9mIGdyYXBoLm5vZGVzOyB0cmFja0J5OiB0cmFja05vZGVCeVwiIGNsYXNzPVwibm9kZS1ncm91cFwiIFtpZF09XCJub2RlLmlkXCIgW2F0dHIudHJhbnNmb3JtXT1cIm5vZGUudHJhbnNmb3JtXCJcclxuICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlLCRldmVudClcIiAobW91c2Vkb3duKT1cIm9uTm9kZU1vdXNlRG93bigkZXZlbnQsIG5vZGUpXCIgKGRibGNsaWNrKT1cIm9uRG91YmxlQ2xpY2sobm9kZSwkZXZlbnQpXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwibm9kZVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibm9kZVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxzdmc6Y2lyY2xlICpuZ0lmPVwiIW5vZGVUZW1wbGF0ZVwiIHI9XCIxMFwiIFthdHRyLmN4XT1cIm5vZGUuZGltZW5zaW9uLndpZHRoIC8gMlwiIFthdHRyLmN5XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIiBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIDwvc3ZnOmc+XHJcbjwvbmd4LWNoYXJ0cy1jaGFydD5cclxuICBgLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ2xpbmsnLCBbbmdUcmFuc2l0aW9uKCcqID0+IConLCBbYW5pbWF0ZSg1MDAsIHN0eWxlKHsgdHJhbnNmb3JtOiAnKicgfSkpXSldKV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdyYXBoQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KClcclxuICBsZWdlbmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlczogTm9kZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY2x1c3RlcnM6IENsdXN0ZXJOb2RlW10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBsaW5rczogRWRnZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBjdXJ2ZTogYW55O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGRyYWdnaW5nRW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNYXhIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWluSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZVdpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1pbldpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1heFdpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGFubmluZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGVuYWJsZVpvb20gPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHpvb21TcGVlZCA9IDAuMTtcclxuXHJcbiAgQElucHV0KClcclxuICBtaW5ab29tTGV2ZWwgPSAwLjE7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWF4Wm9vbUxldmVsID0gNC4wO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGF1dG9ab29tID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGFuT25ab29tID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBhdXRvQ2VudGVyID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdXBkYXRlJDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNlbnRlciQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tVG9GaXQkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQ7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGF5b3V0U2V0dGluZ3M6IGFueTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnbGlua1RlbXBsYXRlJylcclxuICBsaW5rVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ25vZGVUZW1wbGF0ZScpXHJcbiAgbm9kZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdjbHVzdGVyVGVtcGxhdGUnKVxyXG4gIGNsdXN0ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnZGVmc1RlbXBsYXRlJylcclxuICBkZWZzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBWaWV3Q2hpbGQoQ2hhcnRDb21wb25lbnQsIHsgcmVhZDogRWxlbWVudFJlZiB9KVxyXG4gIGNoYXJ0OiBFbGVtZW50UmVmO1xyXG5cclxuICBAVmlld0NoaWxkcmVuKCdub2RlRWxlbWVudCcpXHJcbiAgbm9kZUVsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XHJcblxyXG4gIEBWaWV3Q2hpbGRyZW4oJ2xpbmtFbGVtZW50JylcclxuICBsaW5rRWxlbWVudHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcclxuXHJcbiAgZ3JhcGhTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuICBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xyXG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XHJcbiAgZGltczogVmlld0RpbWVuc2lvbnM7XHJcbiAgbWFyZ2luID0gWzAsIDAsIDAsIDBdO1xyXG4gIHJlc3VsdHMgPSBbXTtcclxuICBzZXJpZXNEb21haW46IGFueTtcclxuICB0cmFuc2Zvcm06IHN0cmluZztcclxuICBsZWdlbmRPcHRpb25zOiBhbnk7XHJcbiAgaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gIGRyYWdnaW5nTm9kZTogTm9kZTtcclxuICBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gIGdyYXBoOiBHcmFwaDtcclxuICBncmFwaERpbXM6IGFueSA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xyXG4gIF9vbGRMaW5rczogRWRnZVtdID0gW107XHJcbiAgdHJhbnNmb3JtYXRpb25NYXRyaXg6IE1hdHJpeCA9IGlkZW50aXR5KCk7XHJcbiAgX3RvdWNoTGFzdFggPSBudWxsO1xyXG4gIF90b3VjaExhc3RZID0gbnVsbDtcclxuXHJcbiAgem9vbUJlZm9yZSA9IDE7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcclxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXHJcbiAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgcHJpdmF0ZSBsYXlvdXRTZXJ2aWNlOiBMYXlvdXRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICBzdXBlcihlbCwgem9uZSwgY2QpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBncm91cFJlc3VsdHNCeTogKG5vZGU6IGFueSkgPT4gc3RyaW5nID0gbm9kZSA9PiBub2RlLmxhYmVsO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxyXG4gICAqL1xyXG4gIGdldCB6b29tTGV2ZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcclxuICAgKi9cclxuICBASW5wdXQoJ3pvb21MZXZlbCcpXHJcbiAgc2V0IHpvb21MZXZlbChsZXZlbCkge1xyXG4gICAgdGhpcy56b29tVG8oTnVtYmVyKGxldmVsKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHhgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIGdldCBwYW5PZmZzZXRYKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgQElucHV0KCdwYW5PZmZzZXRYJylcclxuICBzZXQgcGFuT2Zmc2V0WCh4KSB7XHJcbiAgICB0aGlzLnBhblRvKE51bWJlcih4KSwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHlgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIGdldCBwYW5PZmZzZXRZKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgQElucHV0KCdwYW5PZmZzZXRZJylcclxuICBzZXQgcGFuT2Zmc2V0WSh5KSB7XHJcbiAgICB0aGlzLnBhblRvKG51bGwsIE51bWJlcih5KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnVwZGF0ZSQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy51cGRhdGUkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY2VudGVyJCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLmNlbnRlciQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2VudGVyKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnpvb21Ub0ZpdCQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy56b29tVG9GaXQkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZyhjaGFuZ2VzKTtcclxuICAgIGNvbnN0IHsgbGF5b3V0LCBsYXlvdXRTZXR0aW5ncywgbm9kZXMsIGNsdXN0ZXJzLCBsaW5rcyB9ID0gY2hhbmdlcztcclxuICAgIHRoaXMuc2V0TGF5b3V0KHRoaXMubGF5b3V0KTtcclxuICAgIGlmIChsYXlvdXRTZXR0aW5ncykge1xyXG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgaWYgKG5vZGVzIHx8IGNsdXN0ZXJzIHx8IGxpbmtzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMYXlvdXQobGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgIGlmICghbGF5b3V0KSB7XHJcbiAgICAgIGxheW91dCA9ICdkYWdyZSc7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGxheW91dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5sYXlvdXQgPSB0aGlzLmxheW91dFNlcnZpY2UuZ2V0TGF5b3V0KGxheW91dCk7XHJcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMYXlvdXRTZXR0aW5ncyhzZXR0aW5nczogYW55KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmxheW91dC5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xyXG4gICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhc2UgY2xhc3MgdXBkYXRlIGltcGxlbWVudGF0aW9uIGZvciB0aGUgZGFnIGdyYXBoXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBzdXBlci51cGRhdGUoKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuY3VydmUpIHtcclxuICAgICAgdGhpcy5jdXJ2ZSA9IHNoYXBlLmN1cnZlQnVuZGxlLmJldGEoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luLFxyXG4gICAgICAgIHNob3dMZWdlbmQ6IHRoaXMubGVnZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zZXJpZXNEb21haW4gPSB0aGlzLmdldFNlcmllc0RvbWFpbigpO1xyXG4gICAgICB0aGlzLnNldENvbG9ycygpO1xyXG4gICAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcclxuXHJcbiAgICAgIHRoaXMuY3JlYXRlR3JhcGgoKTtcclxuXHJcbiAgICAgIC8vIElmIHpvb20gaXNuJ3QgMSwgdGhlbiBub2RlcyBzb21ldGltZXMgZG9uJ3QgcmVuZGVyIGluIGNvcnJlY3Qgc2l6ZVxyXG4gICAgICAvLyB6b29taW5nIHRvIDEgZml4ZXMgdGhpc1xyXG4gICAgICB0aGlzLnNhdmVab29tQmVmb3JlTG9hZCgpO1xyXG4gICAgICB0aGlzLnpvb21MZXZlbCA9IDE7XHJcbiAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEcmF3cyB0aGUgZ3JhcGggdXNpbmcgZGFncmUgbGF5b3V0c1xyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBkcmF3KCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmxheW91dCB8fCB0eXBlb2YgdGhpcy5sYXlvdXQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIENhbGMgdmlldyBkaW1zIGZvciB0aGUgbm9kZXNcclxuICAgIHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpO1xyXG5cclxuICAgIC8vIFJlY2FsYyB0aGUgbGF5b3V0XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmxheW91dC5ydW4odGhpcy5ncmFwaCk7XHJcbiAgICBjb25zdCByZXN1bHQkID0gcmVzdWx0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSA/IHJlc3VsdCA6IG9mKHJlc3VsdCk7XHJcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLmFkZChyZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XHJcbiAgICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcclxuICAgICAgdGhpcy50aWNrKCk7XHJcbiAgICB9KSk7XHJcbiAgICByZXN1bHQkXHJcbiAgICAgIC5waXBlKGZpcnN0KGdyYXBoID0+IGdyYXBoLm5vZGVzLmxlbmd0aCA+IDApKVxyXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpKTtcclxuXHJcbiAgICB0aGlzLnJlc3RvcmVab29tQmVmb3JlTG9hZCgpO1xyXG4gIH1cclxuXHJcbiAgdGljaygpIHtcclxuICAgIC8vIFRyYW5zcG9zZXMgdmlldyBvcHRpb25zIHRvIHRoZSBub2RlXHJcbiAgICB0aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7XHJcbiAgICAgICAgbi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHwgMFxyXG4gICAgICAgIH0pYDtcclxuICAgICAgaWYgKCFuLmRhdGEpIHtcclxuICAgICAgICBuLmRhdGEgPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIW4uZGF0YS5jb2xvcikge1xyXG5cclxuICAgICAgICBuLmRhdGEgPSB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnMuZ2V0Q29sb3IodGhpcy5ncm91cFJlc3VsdHNCeShuKSlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICh0aGlzLmdyYXBoLmNsdXN0ZXJzIHx8IFtdKS5tYXAobiA9PiB7XHJcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke1xyXG4gICAgICAgIG4ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8IDBcclxuICAgICAgICB9KWA7XHJcbiAgICAgIGlmICghbi5kYXRhKSB7XHJcbiAgICAgICAgbi5kYXRhID0ge307XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFuLmRhdGEuY29sb3IpIHtcclxuXHJcbiAgICAgICAgbi5kYXRhID0ge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVXBkYXRlIHRoZSBsYWJlbHMgdG8gdGhlIG5ldyBwb3NpdGlvbnNcclxuICAgIGNvbnN0IG5ld0xpbmtzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGVkZ2VMYWJlbElkIGluIHRoaXMuZ3JhcGguZWRnZUxhYmVscykge1xyXG4gICAgICBjb25zdCBlZGdlTGFiZWwgPSB0aGlzLmdyYXBoLmVkZ2VMYWJlbHNbZWRnZUxhYmVsSWRdO1xyXG5cclxuICAgICAgY29uc3Qgbm9ybUtleSA9IGVkZ2VMYWJlbElkLnJlcGxhY2UoL1teXFx3LV0qL2csICcnKTtcclxuICAgICAgbGV0IG9sZExpbmsgPSB0aGlzLl9vbGRMaW5rcy5maW5kKG9sID0+IGAke29sLnNvdXJjZX0ke29sLnRhcmdldH1gID09PSBub3JtS2V5KTtcclxuICAgICAgaWYgKCFvbGRMaW5rKSB7XHJcbiAgICAgICAgb2xkTGluayA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChubCA9PiBgJHtubC5zb3VyY2V9JHtubC50YXJnZXR9YCA9PT0gbm9ybUtleSkgfHwgZWRnZUxhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvbGRMaW5rLm9sZExpbmUgPSBvbGRMaW5rLmxpbmU7XHJcblxyXG4gICAgICBjb25zdCBwb2ludHMgPSBlZGdlTGFiZWwucG9pbnRzO1xyXG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUocG9pbnRzKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld0xpbmsgPSBPYmplY3QuYXNzaWduKHt9LCBvbGRMaW5rKTtcclxuICAgICAgbmV3TGluay5saW5lID0gbGluZTtcclxuICAgICAgbmV3TGluay5wb2ludHMgPSBwb2ludHM7XHJcblxyXG4gICAgICBjb25zdCB0ZXh0UG9zID0gcG9pbnRzW01hdGguZmxvb3IocG9pbnRzLmxlbmd0aCAvIDIpXTtcclxuICAgICAgaWYgKHRleHRQb3MpIHtcclxuICAgICAgICBuZXdMaW5rLnRleHRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGV4dFBvcy54IHx8IDB9LCR7dGV4dFBvcy55IHx8IDB9KWA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5ld0xpbmsudGV4dEFuZ2xlID0gMDtcclxuICAgICAgaWYgKCFuZXdMaW5rLm9sZExpbmUpIHtcclxuICAgICAgICBuZXdMaW5rLm9sZExpbmUgPSBuZXdMaW5rLmxpbmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUobmV3TGluayk7XHJcbiAgICAgIG5ld0xpbmtzLnB1c2gobmV3TGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ncmFwaC5lZGdlcyA9IG5ld0xpbmtzO1xyXG5cclxuICAgIC8vIE1hcCB0aGUgb2xkIGxpbmtzIGZvciBhbmltYXRpb25zXHJcbiAgICBpZiAodGhpcy5ncmFwaC5lZGdlcykge1xyXG4gICAgICB0aGlzLl9vbGRMaW5rcyA9IHRoaXMuZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld0wgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgICBuZXdMLm9sZExpbmUgPSBsLmxpbmU7XHJcbiAgICAgICAgcmV0dXJuIG5ld0w7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSB0aGUgaGVpZ2h0L3dpZHRoIHRvdGFsXHJcbiAgICB0aGlzLmdyYXBoRGltcy53aWR0aCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi54ICsgbi5kaW1lbnNpb24ud2lkdGgpKTtcclxuICAgIHRoaXMuZ3JhcGhEaW1zLmhlaWdodCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi55ICsgbi5kaW1lbnNpb24uaGVpZ2h0KSk7XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b1pvb20pIHtcclxuICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hdXRvQ2VudGVyKSB7XHJcbiAgICAgIC8vIEF1dG8tY2VudGVyIHdoZW4gcmVuZGVyaW5nXHJcbiAgICAgIHRoaXMuY2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMucmVkcmF3TGluZXMoKSk7XHJcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWVhc3VyZXMgdGhlIG5vZGUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGUgZGltZW5zaW9uc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgYXBwbHlOb2RlRGltZW5zaW9ucygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm5vZGVFbGVtZW50cyAmJiB0aGlzLm5vZGVFbGVtZW50cy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5ub2RlRWxlbWVudHMubWFwKGVsZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBlbGVtLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5hdGl2ZUVsZW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGhlaWdodFxyXG4gICAgICAgIGxldCBkaW1zO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBkaW1zID0gbmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlSGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSB0aGlzLm5vZGVIZWlnaHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IGRpbXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1heEhlaWdodCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24uaGVpZ2h0LCB0aGlzLm5vZGVNYXhIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWluSGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1pbihub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1pbkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlV2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gdGhpcy5ub2RlV2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGhcclxuICAgICAgICAgIGlmIChuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0RGltcztcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICB0ZXh0RGltcyA9IG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKVswXS5nZXRCQm94KCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IHRleHREaW1zLndpZHRoICsgMjA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IGRpbXMud2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4V2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1heFdpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbldpZHRoKSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNaW5XaWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZHJhd3MgdGhlIGxpbmVzIHdoZW4gZHJhZ2dlZCBvciB2aWV3cG9ydCB1cGRhdGVkXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICByZWRyYXdMaW5lcyhfYW5pbWF0ZSA9IHRydWUpOiB2b2lkIHtcclxuICAgIHRoaXMubGlua0VsZW1lbnRzLm1hcChsaW5rRWwgPT4ge1xyXG4gICAgICBjb25zdCBlZGdlID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKGxpbiA9PiBsaW4uaWQgPT09IGxpbmtFbC5uYXRpdmVFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgIGlmIChlZGdlKSB7XHJcbiAgICAgICAgY29uc3QgbGlua1NlbGVjdGlvbiA9IHNlbGVjdChsaW5rRWwubmF0aXZlRWxlbWVudCkuc2VsZWN0KCcubGluZScpO1xyXG4gICAgICAgIGxpbmtTZWxlY3Rpb25cclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRMaW5lKVxyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgLmR1cmF0aW9uKF9hbmltYXRlID8gNTAwIDogMClcclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5saW5lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dFBhdGhTZWxlY3Rpb24gPSBzZWxlY3QodGhpcy5jaGFydEVsZW1lbnQubmF0aXZlRWxlbWVudCkuc2VsZWN0KGAjJHtlZGdlLmlkfWApO1xyXG4gICAgICAgIHRleHRQYXRoU2VsZWN0aW9uXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2Uub2xkVGV4dFBhdGgpXHJcbiAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLnRleHRQYXRoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBkYWdyZSBncmFwaCBlbmdpbmVcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNyZWF0ZUdyYXBoKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuICAgIGNvbnN0IGluaXRpYWxpemVOb2RlID0gbiA9PiB7XHJcbiAgICAgIGlmICghbi5pZCkge1xyXG4gICAgICAgIG4uaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIG4uZGltZW5zaW9uID0ge1xyXG4gICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICBoZWlnaHQ6IDMwXHJcbiAgICAgIH07XHJcbiAgICAgIG4ucG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICAgIH07XHJcbiAgICAgIG4uZGF0YSA9IG4uZGF0YSA/IG4uZGF0YSA6IHt9O1xyXG4gICAgICByZXR1cm4gbjtcclxuICAgIH07XHJcbiAgICB0aGlzLmdyYXBoID0ge1xyXG4gICAgICBub2RlczogWy4uLnRoaXMubm9kZXNdLm1hcChpbml0aWFsaXplTm9kZSksXHJcbiAgICAgIGNsdXN0ZXJzOiBbLi4uKHRoaXMuY2x1c3RlcnMgfHwgW10pXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxyXG4gICAgICBlZGdlczogWy4uLnRoaXMubGlua3NdLm1hcChlID0+IHtcclxuICAgICAgICBpZiAoIWUuaWQpIHtcclxuICAgICAgICAgIGUuaWQgPSBpZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZTtcclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhdygpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZSB0aGUgdGV4dCBkaXJlY3Rpb25zIC8gZmxpcHBpbmdcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNhbGNEb21pbmFudEJhc2VsaW5lKGxpbmspOiB2b2lkIHtcclxuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBsaW5rLnBvaW50c1swXTtcclxuICAgIGNvbnN0IGxhc3RQb2ludCA9IGxpbmsucG9pbnRzW2xpbmsucG9pbnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgbGluay5vbGRUZXh0UGF0aCA9IGxpbmsudGV4dFBhdGg7XHJcblxyXG4gICAgaWYgKGxhc3RQb2ludC54IDwgZmlyc3RQb2ludC54KSB7XHJcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWJlZm9yZS1lZGdlJztcclxuXHJcbiAgICAgIC8vIHJldmVyc2UgdGV4dCBwYXRoIGZvciB3aGVuIGl0cyBmbGlwcGVkIHVwc2lkZSBkb3duXHJcbiAgICAgIGxpbmsudGV4dFBhdGggPSB0aGlzLmdlbmVyYXRlTGluZShbLi4ubGluay5wb2ludHNdLnJldmVyc2UoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsaW5rLmRvbWluYW50QmFzZWxpbmUgPSAndGV4dC1hZnRlci1lZGdlJztcclxuICAgICAgbGluay50ZXh0UGF0aCA9IGxpbmsubGluZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIHRoZSBuZXcgbGluZSBwYXRoXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZW5lcmF0ZUxpbmUocG9pbnRzKTogYW55IHtcclxuICAgIGNvbnN0IGxpbmVGdW5jdGlvbiA9IHNoYXBlXHJcbiAgICAgIC5saW5lPGFueT4oKVxyXG4gICAgICAueChkID0+IGQueClcclxuICAgICAgLnkoZCA9PiBkLnkpXHJcbiAgICAgIC5jdXJ2ZSh0aGlzLmN1cnZlKTtcclxuICAgIHJldHVybiBsaW5lRnVuY3Rpb24ocG9pbnRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gd2FzIGludm9rZWQgZnJvbSBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25ab29tKCRldmVudDogTW91c2VFdmVudCwgZGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICBjb25zdCB6b29tRmFjdG9yID0gMSArIChkaXJlY3Rpb24gPT09ICdpbicgPyB0aGlzLnpvb21TcGVlZCA6IC10aGlzLnpvb21TcGVlZCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgdGhhdCB6b29taW5nIHdvdWxkbid0IHB1dCB1cyBvdXQgb2YgYm91bmRzXHJcbiAgICBjb25zdCBuZXdab29tTGV2ZWwgPSB0aGlzLnpvb21MZXZlbCAqIHpvb21GYWN0b3I7XHJcbiAgICBpZiAobmV3Wm9vbUxldmVsIDw9IHRoaXMubWluWm9vbUxldmVsIHx8IG5ld1pvb21MZXZlbCA+PSB0aGlzLm1heFpvb21MZXZlbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgem9vbWluZyBpcyBlbmFibGVkIG9yIG5vdFxyXG4gICAgaWYgKCF0aGlzLmVuYWJsZVpvb20pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBhbk9uWm9vbSA9PT0gdHJ1ZSAmJiAkZXZlbnQpIHtcclxuICAgICAgLy8gQWJzb2x1dGUgbW91c2UgWC9ZIG9uIHRoZSBzY3JlZW5cclxuICAgICAgY29uc3QgbW91c2VYID0gJGV2ZW50LmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG1vdXNlWSA9ICRldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgLy8gVHJhbnNmb3JtIHRoZSBtb3VzZSBYL1kgaW50byBhIFNWRyBYL1lcclxuICAgICAgY29uc3Qgc3ZnID0gdGhpcy5jaGFydC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG4gICAgICBjb25zdCBzdmdHcm91cCA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdnLmNoYXJ0Jyk7XHJcblxyXG4gICAgICBjb25zdCBwb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICBwb2ludC54ID0gbW91c2VYO1xyXG4gICAgICBwb2ludC55ID0gbW91c2VZO1xyXG4gICAgICBjb25zdCBzdmdQb2ludCA9IHBvaW50Lm1hdHJpeFRyYW5zZm9ybShzdmdHcm91cC5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xyXG5cclxuICAgICAgLy8gUGFuem9vbVxyXG4gICAgICBjb25zdCBOT19aT09NX0xFVkVMID0gMTtcclxuICAgICAgdGhpcy5wYW4oc3ZnUG9pbnQueCwgc3ZnUG9pbnQueSwgTk9fWk9PTV9MRVZFTCk7XHJcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcclxuICAgICAgdGhpcy5wYW4oLXN2Z1BvaW50LngsIC1zdmdQb2ludC55LCBOT19aT09NX0xFVkVMKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiBieSB4L3lcclxuICAgKlxyXG4gICAqL1xyXG4gIHBhbih4OiBudW1iZXIsIHk6IG51bWJlciwgem9vbUxldmVsOiBudW1iZXIgPSB0aGlzLnpvb21MZXZlbCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0cmFuc2xhdGUoeCAvIHpvb21MZXZlbCwgeSAvIHpvb21MZXZlbCkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gdG8gYSBmaXhlZCB4L3lcclxuICAgKlxyXG4gICAqL1xyXG4gIHBhblRvKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmUgPSB4ID09PSBudWxsIHx8IHggPT09IHVuZGVmaW5lZCB8fCBpc05hTih4KSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZSA6IE51bWJlcih4KTtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZiA9IHkgPT09IG51bGwgfHwgeSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHkpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mIDogTnVtYmVyKHkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIGJ5IGEgZmFjdG9yXHJcbiAgICpcclxuICAgKi9cclxuICB6b29tKGZhY3RvcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHNjYWxlKGZhY3RvciwgZmFjdG9yKSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gdG8gYSBmaXhlZCBsZXZlbFxyXG4gICAqXHJcbiAgICovXHJcbiAgem9vbVRvKGxldmVsOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA6IE51bWJlcihsZXZlbCk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgOiBOdW1iZXIobGV2ZWwpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gd2FzIGludm9rZWQgZnJvbSBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25QYW4oZXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMucGFuKGV2ZW50Lm1vdmVtZW50WCwgZXZlbnQubW92ZW1lbnRZKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYWcgd2FzIGludm9rZWQgZnJvbSBhbiBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25EcmFnKGV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmRyYWdnaW5nTm9kZTtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZykge1xyXG4gICAgICB0aGlzLmxheW91dC5vbkRyYWcobm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGUucG9zaXRpb24ueCArPSBldmVudC5tb3ZlbWVudFggLyB0aGlzLnpvb21MZXZlbDtcclxuICAgIG5vZGUucG9zaXRpb24ueSArPSBldmVudC5tb3ZlbWVudFkgLyB0aGlzLnpvb21MZXZlbDtcclxuXHJcbiAgICAvLyBtb3ZlIHRoZSBub2RlXHJcbiAgICBjb25zdCB4ID0gbm9kZS5wb3NpdGlvbi54IC0gbm9kZS5kaW1lbnNpb24ud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeSA9IG5vZGUucG9zaXRpb24ueSAtIG5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDI7XHJcbiAgICBub2RlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xyXG5cclxuICAgIGZvciAoY29uc3QgbGluayBvZiB0aGlzLmdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBsaW5rLnRhcmdldCA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIGxpbmsuc291cmNlID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgKGxpbmsudGFyZ2V0IGFzIGFueSkuaWQgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICAobGluay5zb3VyY2UgYXMgYW55KS5pZCA9PT0gbm9kZS5pZFxyXG4gICAgICApIHtcclxuICAgICAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQudXBkYXRlRWRnZSh0aGlzLmdyYXBoLCBsaW5rKTtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcclxuICAgICAgICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxyXG4gICAgICAgICAgICByZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVkcmF3RWRnZShsaW5rKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWRyYXdMaW5lcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICByZWRyYXdFZGdlKGVkZ2U6IEVkZ2UpIHtcclxuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShlZGdlLnBvaW50cyk7XHJcbiAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKGVkZ2UpO1xyXG4gICAgZWRnZS5vbGRMaW5lID0gZWRnZS5saW5lO1xyXG4gICAgZWRnZS5saW5lID0gbGluZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgZW50aXJlIHZpZXcgZm9yIHRoZSBuZXcgcGFuIHBvc2l0aW9uXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHVwZGF0ZVRyYW5zZm9ybSgpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtID0gdG9TVkcodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBjbGlja2VkXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uQ2xpY2soZXZlbnQsIG9yaWdpbmFsRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2ZW50Lm9yaWdFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGNsaWNrZWRcclxuICAgKlxyXG4gICAqL1xyXG4gIG9uRG91YmxlQ2xpY2soZXZlbnQsIG9yaWdpbmFsRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2ZW50Lm9yaWdFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XHJcbiAgICBldmVudC5pc0RvdWJsZUNsaWNrID0gdHJ1ZTtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgZm9jdXNlZFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2V2ZW50LCAuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xyXG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBkZWZvY3VzZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uRGVhY3RpdmF0ZShldmVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xyXG5cclxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGRvbWFpbiBzZXJpZXMgZm9yIHRoZSBub2Rlc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U2VyaWVzRG9tYWluKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGVzXHJcbiAgICAgIC5tYXAoZCA9PiB0aGlzLmdyb3VwUmVzdWx0c0J5KGQpKVxyXG4gICAgICAucmVkdWNlKChub2Rlczogc3RyaW5nW10sIG5vZGUpOiBhbnlbXSA9PiAobm9kZXMuaW5kZXhPZihub2RlKSAhPT0gLTEgPyBub2RlcyA6IG5vZGVzLmNvbmNhdChbbm9kZV0pKSwgW10pXHJcbiAgICAgIC5zb3J0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFja2luZyBmb3IgdGhlIGxpbmtcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdHJhY2tMaW5rQnkoaW5kZXgsIGxpbmspOiBhbnkge1xyXG4gICAgcmV0dXJuIGxpbmsuaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFja2luZyBmb3IgdGhlIG5vZGVcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdHJhY2tOb2RlQnkoaW5kZXgsIG5vZGUpOiBhbnkge1xyXG4gICAgcmV0dXJuIG5vZGUuaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjb2xvcnMgdGhlIG5vZGVzXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHNldENvbG9ycygpOiB2b2lkIHtcclxuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCAnb3JkaW5hbCcsIHRoaXMuc2VyaWVzRG9tYWluLCB0aGlzLmN1c3RvbUNvbG9ycyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBsZWdlbmQgb3B0aW9uc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0TGVnZW5kT3B0aW9ucygpOiBhbnkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2NhbGVUeXBlOiAnb3JkaW5hbCcsXHJcbiAgICAgIGRvbWFpbjogdGhpcy5zZXJpZXNEb21haW4sXHJcbiAgICAgIGNvbG9yczogdGhpcy5jb2xvcnNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBtb3VzZSBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nIGFuZCBkcmFnZ2luZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZU1vdmUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xyXG4gICAgICB0aGlzLm9uUGFuKCRldmVudCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICB0aGlzLm9uRHJhZygkZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggc3RhcnQgZXZlbnQgdG8gZW5hYmxlIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblRvdWNoU3RhcnQoZXZlbnQpIHtcclxuICAgIHRoaXMuX3RvdWNoTGFzdFggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgdGhpcy5fdG91Y2hMYXN0WSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XHJcblxyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZy5cclxuICAgKlxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNobW92ZScsIFsnJGV2ZW50J10pXHJcbiAgb25Ub3VjaE1vdmUoJGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xyXG4gICAgICBjb25zdCBjbGllbnRYID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IGNsaWVudFkgPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgY29uc3QgbW92ZW1lbnRYID0gY2xpZW50WCAtIHRoaXMuX3RvdWNoTGFzdFg7XHJcbiAgICAgIGNvbnN0IG1vdmVtZW50WSA9IGNsaWVudFkgLSB0aGlzLl90b3VjaExhc3RZO1xyXG4gICAgICB0aGlzLl90b3VjaExhc3RYID0gY2xpZW50WDtcclxuICAgICAgdGhpcy5fdG91Y2hMYXN0WSA9IGNsaWVudFk7XHJcblxyXG4gICAgICB0aGlzLnBhbihtb3ZlbWVudFgsIG1vdmVtZW50WSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBlbmQgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25Ub3VjaEVuZChldmVudCkge1xyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG1vdXNlIHVwIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy9kcmFnZ2luZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnKVxyXG4gIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnRW5kKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCh0aGlzLmRyYWdnaW5nTm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbm9kZSBtb3VzZSBkb3duIHRvIGtpY2sgb2ZmIGRyYWdnaW5nXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbk5vZGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQsIG5vZGU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5kcmFnZ2luZ05vZGUgPSBub2RlO1xyXG5cclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KG5vZGUsIGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENlbnRlciB0aGUgZ3JhcGggaW4gdGhlIHZpZXdwb3J0XHJcbiAgICovXHJcbiAgY2VudGVyKCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5UbyhcclxuICAgICAgdGhpcy5kaW1zLndpZHRoIC8gMiAtICh0aGlzLmdyYXBoRGltcy53aWR0aCAqIHRoaXMuem9vbUxldmVsKSAvIDIsXHJcbiAgICAgIHRoaXMuZGltcy5oZWlnaHQgLyAyIC0gKHRoaXMuZ3JhcGhEaW1zLmhlaWdodCAqIHRoaXMuem9vbUxldmVsKSAvIDJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tcyB0byBmaXQgdGhlIGVudGllciBncmFwaFxyXG4gICAqL1xyXG4gIHpvb21Ub0ZpdCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGhlaWdodFpvb20gPSB0aGlzLmRpbXMuaGVpZ2h0IC8gdGhpcy5ncmFwaERpbXMuaGVpZ2h0O1xyXG4gICAgY29uc3Qgd2lkdGhab29tID0gdGhpcy5kaW1zLndpZHRoIC8gdGhpcy5ncmFwaERpbXMud2lkdGg7XHJcbiAgICBjb25zdCB6b29tTGV2ZWwgPSBNYXRoLm1pbihoZWlnaHRab29tLCB3aWR0aFpvb20sIDEpO1xyXG4gICAgaWYgKHpvb21MZXZlbCAhPT0gdGhpcy56b29tTGV2ZWwpIHtcclxuICAgICAgdGhpcy56b29tTGV2ZWwgPSB6b29tTGV2ZWw7XHJcbiAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXN0b3JlWm9vbUJlZm9yZUxvYWQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hdXRvWm9vbSkge1xyXG4gICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy56b29tTGV2ZWwgPSB0aGlzLnpvb21CZWZvcmU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzYXZlWm9vbUJlZm9yZUxvYWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnpvb21CZWZvcmUgPSB0aGlzLnpvb21MZXZlbDtcclxuICB9XHJcbn1cclxuIl19