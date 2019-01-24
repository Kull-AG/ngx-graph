/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var GraphComponent = /** @class */ (function (_super) {
    tslib_1.__extends(GraphComponent, _super);
    function GraphComponent(el, zone, cd, layoutService) {
        var _this = _super.call(this, el, zone, cd) || this;
        _this.el = el;
        _this.zone = zone;
        _this.cd = cd;
        _this.layoutService = layoutService;
        _this.legend = false;
        _this.nodes = [];
        _this.clusters = [];
        _this.links = [];
        _this.activeEntries = [];
        _this.draggingEnabled = true;
        _this.panningEnabled = true;
        _this.enableZoom = true;
        _this.zoomSpeed = 0.1;
        _this.minZoomLevel = 0.1;
        _this.maxZoomLevel = 4.0;
        _this.autoZoom = false;
        _this.panOnZoom = true;
        _this.autoCenter = false;
        _this.activate = new EventEmitter();
        _this.deactivate = new EventEmitter();
        _this.graphSubscription = new Subscription();
        _this.subscriptions = [];
        _this.margin = [0, 0, 0, 0];
        _this.results = [];
        _this.isPanning = false;
        _this.isDragging = false;
        _this.initialized = false;
        _this.graphDims = { width: 0, height: 0 };
        _this._oldLinks = [];
        _this.transformationMatrix = identity();
        _this._touchLastX = null;
        _this._touchLastY = null;
        _this.zoomBefore = 1;
        _this.groupResultsBy = function (node) { return node.label; };
        return _this;
    }
    Object.defineProperty(GraphComponent.prototype, "zoomLevel", {
        /**
         * Get the current zoom level
         */
        get: /**
         * Get the current zoom level
         * @return {?}
         */
        function () {
            return this.transformationMatrix.a;
        },
        /**
         * Set the current zoom level
         */
        set: /**
         * Set the current zoom level
         * @param {?} level
         * @return {?}
         */
        function (level) {
            this.zoomTo(Number(level));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphComponent.prototype, "panOffsetX", {
        /**
         * Get the current `x` position of the graph
         */
        get: /**
         * Get the current `x` position of the graph
         * @return {?}
         */
        function () {
            return this.transformationMatrix.e;
        },
        /**
         * Set the current `x` position of the graph
         */
        set: /**
         * Set the current `x` position of the graph
         * @param {?} x
         * @return {?}
         */
        function (x) {
            this.panTo(Number(x), null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphComponent.prototype, "panOffsetY", {
        /**
         * Get the current `y` position of the graph
         */
        get: /**
         * Get the current `y` position of the graph
         * @return {?}
         */
        function () {
            return this.transformationMatrix.f;
        },
        /**
         * Set the current `y` position of the graph
         */
        set: /**
         * Set the current `y` position of the graph
         * @param {?} y
         * @return {?}
         */
        function (y) {
            this.panTo(null, Number(y));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Angular lifecycle event
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.ngOnInit = /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.update$) {
            this.subscriptions.push(this.update$.subscribe(function () {
                _this.update();
            }));
        }
        if (this.center$) {
            this.subscriptions.push(this.center$.subscribe(function () {
                _this.center();
            }));
        }
        if (this.zoomToFit$) {
            this.subscriptions.push(this.zoomToFit$.subscribe(function () {
                _this.zoomToFit();
            }));
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    GraphComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        console.log(changes);
        var layout = changes.layout, layoutSettings = changes.layoutSettings, nodes = changes.nodes, clusters = changes.clusters, links = changes.links;
        this.setLayout(this.layout);
        if (layoutSettings) {
            this.setLayoutSettings(this.layoutSettings);
        }
        if (nodes || clusters || links) {
            this.update();
        }
    };
    /**
     * @param {?} layout
     * @return {?}
     */
    GraphComponent.prototype.setLayout = /**
     * @param {?} layout
     * @return {?}
     */
    function (layout) {
        this.initialized = false;
        if (!layout) {
            layout = 'dagre';
        }
        if (typeof layout === 'string') {
            this.layout = this.layoutService.getLayout(layout);
            this.setLayoutSettings(this.layoutSettings);
        }
    };
    /**
     * @param {?} settings
     * @return {?}
     */
    GraphComponent.prototype.setLayoutSettings = /**
     * @param {?} settings
     * @return {?}
     */
    function (settings) {
        if (this.layout && typeof this.layout !== 'string') {
            this.layout.settings = settings;
            this.update();
        }
    };
    /**
     * Angular lifecycle event
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.ngOnDestroy = /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var e_1, _a;
        _super.prototype.ngOnDestroy.call(this);
        try {
            for (var _b = tslib_1.__values(this.subscriptions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sub = _c.value;
                sub.unsubscribe();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.subscriptions = null;
    };
    /**
     * Angular lifecycle event
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.ngAfterViewInit = /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var _this = this;
        _super.prototype.ngAfterViewInit.call(this);
        setTimeout(function () { return _this.update(); });
    };
    /**
     * Base class update implementation for the dag graph
     *
     * @memberOf GraphComponent
     */
    /**
     * Base class update implementation for the dag graph
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.update = /**
     * Base class update implementation for the dag graph
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var _this = this;
        _super.prototype.update.call(this);
        if (!this.curve) {
            this.curve = shape.curveBundle.beta(1);
        }
        this.zone.run(function () {
            _this.dims = calculateViewDimensions({
                width: _this.width,
                height: _this.height,
                margins: _this.margin,
                showLegend: _this.legend
            });
            _this.seriesDomain = _this.getSeriesDomain();
            _this.setColors();
            _this.legendOptions = _this.getLegendOptions();
            _this.createGraph();
            // If zoom isn't 1, then nodes sometimes don't render in correct size
            // zooming to 1 fixes this
            _this.saveZoomBeforeLoad();
            _this.zoomLevel = 1;
            _this.updateTransform();
            _this.initialized = true;
        });
    };
    /**
     * Draws the graph using dagre layouts
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Draws the graph using dagre layouts
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.draw = /**
     * Draws the graph using dagre layouts
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.layout || typeof this.layout === 'string') {
            return;
        }
        // Calc view dims for the nodes
        this.applyNodeDimensions();
        // Recalc the layout
        /** @type {?} */
        var result = this.layout.run(this.graph);
        /** @type {?} */
        var result$ = result instanceof Observable ? result : of(result);
        this.graphSubscription.add(result$.subscribe(function (graph) {
            _this.graph = graph;
            _this.tick();
        }));
        result$
            .pipe(first(function (graph) { return graph.nodes.length > 0; }))
            .subscribe(function () { return _this.applyNodeDimensions(); });
        this.restoreZoomBeforeLoad();
    };
    /**
     * @return {?}
     */
    GraphComponent.prototype.tick = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Transposes view options to the node
        this.graph.nodes.map(function (n) {
            n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 || 0) + ")";
            if (!n.data) {
                n.data = {};
            }
            if (!n.data.color) {
                n.data = {
                    color: _this.colors.getColor(_this.groupResultsBy(n))
                };
            }
        });
        (this.graph.clusters || []).map(function (n) {
            n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 || 0) + ")";
            if (!n.data) {
                n.data = {};
            }
            if (!n.data.color) {
                n.data = {
                    color: _this.colors.getColor(_this.groupResultsBy(n))
                };
            }
        });
        // Update the labels to the new positions
        /** @type {?} */
        var newLinks = [];
        var _loop_1 = function (edgeLabelId) {
            /** @type {?} */
            var edgeLabel = this_1.graph.edgeLabels[edgeLabelId];
            /** @type {?} */
            var normKey = edgeLabelId.replace(/[^\w-]*/g, '');
            /** @type {?} */
            var oldLink = this_1._oldLinks.find(function (ol) { return "" + ol.source + ol.target === normKey; });
            if (!oldLink) {
                oldLink = this_1.graph.edges.find(function (nl) { return "" + nl.source + nl.target === normKey; }) || edgeLabel;
            }
            oldLink.oldLine = oldLink.line;
            /** @type {?} */
            var points = edgeLabel.points;
            /** @type {?} */
            var line = this_1.generateLine(points);
            /** @type {?} */
            var newLink = Object.assign({}, oldLink);
            newLink.line = line;
            newLink.points = points;
            /** @type {?} */
            var textPos = points[Math.floor(points.length / 2)];
            if (textPos) {
                newLink.textTransform = "translate(" + (textPos.x || 0) + "," + (textPos.y || 0) + ")";
            }
            newLink.textAngle = 0;
            if (!newLink.oldLine) {
                newLink.oldLine = newLink.line;
            }
            this_1.calcDominantBaseline(newLink);
            newLinks.push(newLink);
        };
        var this_1 = this;
        for (var edgeLabelId in this.graph.edgeLabels) {
            _loop_1(edgeLabelId);
        }
        this.graph.edges = newLinks;
        // Map the old links for animations
        if (this.graph.edges) {
            this._oldLinks = this.graph.edges.map(function (l) {
                /** @type {?} */
                var newL = Object.assign({}, l);
                newL.oldLine = l.line;
                return newL;
            });
        }
        // Calculate the height/width total
        this.graphDims.width = Math.max.apply(Math, tslib_1.__spread(this.graph.nodes.map(function (n) { return n.position.x + n.dimension.width; })));
        this.graphDims.height = Math.max.apply(Math, tslib_1.__spread(this.graph.nodes.map(function (n) { return n.position.y + n.dimension.height; })));
        if (this.autoZoom) {
            this.zoomToFit();
        }
        if (this.autoCenter) {
            // Auto-center when rendering
            this.center();
        }
        requestAnimationFrame(function () { return _this.redrawLines(); });
        this.cd.markForCheck();
    };
    /**
     * Measures the node element and applies the dimensions
     *
     * @memberOf GraphComponent
     */
    /**
     * Measures the node element and applies the dimensions
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.applyNodeDimensions = /**
     * Measures the node element and applies the dimensions
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.nodeElements && this.nodeElements.length) {
            this.nodeElements.map(function (elem) {
                /** @type {?} */
                var nativeElement = elem.nativeElement;
                /** @type {?} */
                var node = _this.graph.nodes.find(function (n) { return n.id === nativeElement.id; });
                // calculate the height
                /** @type {?} */
                var dims;
                try {
                    dims = nativeElement.getBoundingClientRect();
                }
                catch (ex) {
                    // Skip drawing if element is not displayed - Firefox would throw an error here
                    return;
                }
                if (_this.nodeHeight) {
                    node.dimension.height = _this.nodeHeight;
                }
                else {
                    node.dimension.height = dims.height;
                }
                if (_this.nodeMaxHeight) {
                    node.dimension.height = Math.max(node.dimension.height, _this.nodeMaxHeight);
                }
                if (_this.nodeMinHeight) {
                    node.dimension.height = Math.min(node.dimension.height, _this.nodeMinHeight);
                }
                if (_this.nodeWidth) {
                    node.dimension.width = _this.nodeWidth;
                }
                else {
                    // calculate the width
                    if (nativeElement.getElementsByTagName('text').length) {
                        /** @type {?} */
                        var textDims = void 0;
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
                if (_this.nodeMaxWidth) {
                    node.dimension.width = Math.max(node.dimension.width, _this.nodeMaxWidth);
                }
                if (_this.nodeMinWidth) {
                    node.dimension.width = Math.min(node.dimension.width, _this.nodeMinWidth);
                }
            });
        }
    };
    /**
     * Redraws the lines when dragged or viewport updated
     *
     * @memberOf GraphComponent
     */
    /**
     * Redraws the lines when dragged or viewport updated
     *
     * \@memberOf GraphComponent
     * @param {?=} _animate
     * @return {?}
     */
    GraphComponent.prototype.redrawLines = /**
     * Redraws the lines when dragged or viewport updated
     *
     * \@memberOf GraphComponent
     * @param {?=} _animate
     * @return {?}
     */
    function (_animate) {
        var _this = this;
        if (_animate === void 0) { _animate = true; }
        this.linkElements.map(function (linkEl) {
            /** @type {?} */
            var edge = _this.graph.edges.find(function (lin) { return lin.id === linkEl.nativeElement.id; });
            if (edge) {
                /** @type {?} */
                var linkSelection = select(linkEl.nativeElement).select('.line');
                linkSelection
                    .attr('d', edge.oldLine)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.line);
                /** @type {?} */
                var textPathSelection = select(_this.chartElement.nativeElement).select("#" + edge.id);
                textPathSelection
                    .attr('d', edge.oldTextPath)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.textPath);
            }
        });
    };
    /**
     * Creates the dagre graph engine
     *
     * @memberOf GraphComponent
     */
    /**
     * Creates the dagre graph engine
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.createGraph = /**
     * Creates the dagre graph engine
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var _this = this;
        this.graphSubscription.unsubscribe();
        this.graphSubscription = new Subscription();
        /** @type {?} */
        var initializeNode = function (n) {
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
            nodes: tslib_1.__spread(this.nodes).map(initializeNode),
            clusters: tslib_1.__spread((this.clusters || [])).map(initializeNode),
            edges: tslib_1.__spread(this.links).map(function (e) {
                if (!e.id) {
                    e.id = id();
                }
                return e;
            })
        };
        requestAnimationFrame(function () { return _this.draw(); });
    };
    /**
     * Calculate the text directions / flipping
     *
     * @memberOf GraphComponent
     */
    /**
     * Calculate the text directions / flipping
     *
     * \@memberOf GraphComponent
     * @param {?} link
     * @return {?}
     */
    GraphComponent.prototype.calcDominantBaseline = /**
     * Calculate the text directions / flipping
     *
     * \@memberOf GraphComponent
     * @param {?} link
     * @return {?}
     */
    function (link) {
        /** @type {?} */
        var firstPoint = link.points[0];
        /** @type {?} */
        var lastPoint = link.points[link.points.length - 1];
        link.oldTextPath = link.textPath;
        if (lastPoint.x < firstPoint.x) {
            link.dominantBaseline = 'text-before-edge';
            // reverse text path for when its flipped upside down
            link.textPath = this.generateLine(tslib_1.__spread(link.points).reverse());
        }
        else {
            link.dominantBaseline = 'text-after-edge';
            link.textPath = link.line;
        }
    };
    /**
     * Generate the new line path
     *
     * @memberOf GraphComponent
     */
    /**
     * Generate the new line path
     *
     * \@memberOf GraphComponent
     * @param {?} points
     * @return {?}
     */
    GraphComponent.prototype.generateLine = /**
     * Generate the new line path
     *
     * \@memberOf GraphComponent
     * @param {?} points
     * @return {?}
     */
    function (points) {
        /** @type {?} */
        var lineFunction = shape
            .line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .curve(this.curve);
        return lineFunction(points);
    };
    /**
     * Zoom was invoked from event
     *
     * @memberOf GraphComponent
     */
    /**
     * Zoom was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @param {?} direction
     * @return {?}
     */
    GraphComponent.prototype.onZoom = /**
     * Zoom was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @param {?} direction
     * @return {?}
     */
    function ($event, direction) {
        /** @type {?} */
        var zoomFactor = 1 + (direction === 'in' ? this.zoomSpeed : -this.zoomSpeed);
        // Check that zooming wouldn't put us out of bounds
        /** @type {?} */
        var newZoomLevel = this.zoomLevel * zoomFactor;
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
            var mouseX = $event.clientX;
            /** @type {?} */
            var mouseY = $event.clientY;
            // Transform the mouse X/Y into a SVG X/Y
            /** @type {?} */
            var svg = this.chart.nativeElement.querySelector('svg');
            /** @type {?} */
            var svgGroup = svg.querySelector('g.chart');
            /** @type {?} */
            var point = svg.createSVGPoint();
            point.x = mouseX;
            point.y = mouseY;
            /** @type {?} */
            var svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());
            // Panzoom
            /** @type {?} */
            var NO_ZOOM_LEVEL = 1;
            this.pan(svgPoint.x, svgPoint.y, NO_ZOOM_LEVEL);
            this.zoom(zoomFactor);
            this.pan(-svgPoint.x, -svgPoint.y, NO_ZOOM_LEVEL);
        }
        else {
            this.zoom(zoomFactor);
        }
    };
    /**
     * Pan by x/y
     *
     */
    /**
     * Pan by x/y
     *
     * @param {?} x
     * @param {?} y
     * @param {?=} zoomLevel
     * @return {?}
     */
    GraphComponent.prototype.pan = /**
     * Pan by x/y
     *
     * @param {?} x
     * @param {?} y
     * @param {?=} zoomLevel
     * @return {?}
     */
    function (x, y, zoomLevel) {
        if (zoomLevel === void 0) { zoomLevel = this.zoomLevel; }
        this.transformationMatrix = transform(this.transformationMatrix, translate(x / zoomLevel, y / zoomLevel));
        this.updateTransform();
    };
    /**
     * Pan to a fixed x/y
     *
     */
    /**
     * Pan to a fixed x/y
     *
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    GraphComponent.prototype.panTo = /**
     * Pan to a fixed x/y
     *
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    function (x, y) {
        this.transformationMatrix.e = x === null || x === undefined || isNaN(x) ? this.transformationMatrix.e : Number(x);
        this.transformationMatrix.f = y === null || y === undefined || isNaN(y) ? this.transformationMatrix.f : Number(y);
        this.updateTransform();
    };
    /**
     * Zoom by a factor
     *
     */
    /**
     * Zoom by a factor
     *
     * @param {?} factor
     * @return {?}
     */
    GraphComponent.prototype.zoom = /**
     * Zoom by a factor
     *
     * @param {?} factor
     * @return {?}
     */
    function (factor) {
        this.transformationMatrix = transform(this.transformationMatrix, scale(factor, factor));
        this.updateTransform();
    };
    /**
     * Zoom to a fixed level
     *
     */
    /**
     * Zoom to a fixed level
     *
     * @param {?} level
     * @return {?}
     */
    GraphComponent.prototype.zoomTo = /**
     * Zoom to a fixed level
     *
     * @param {?} level
     * @return {?}
     */
    function (level) {
        this.transformationMatrix.a = isNaN(level) ? this.transformationMatrix.a : Number(level);
        this.transformationMatrix.d = isNaN(level) ? this.transformationMatrix.d : Number(level);
        this.updateTransform();
    };
    /**
     * Pan was invoked from event
     *
     * @memberOf GraphComponent
     */
    /**
     * Pan was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    GraphComponent.prototype.onPan = /**
     * Pan was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.pan(event.movementX, event.movementY);
    };
    /**
     * Drag was invoked from an event
     *
     * @memberOf GraphComponent
     */
    /**
     * Drag was invoked from an event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    GraphComponent.prototype.onDrag = /**
     * Drag was invoked from an event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        var e_2, _a;
        if (!this.draggingEnabled) {
            return;
        }
        /** @type {?} */
        var node = this.draggingNode;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDrag) {
            this.layout.onDrag(node, event);
        }
        node.position.x += event.movementX / this.zoomLevel;
        node.position.y += event.movementY / this.zoomLevel;
        // move the node
        /** @type {?} */
        var x = node.position.x - node.dimension.width / 2;
        /** @type {?} */
        var y = node.position.y - node.dimension.height / 2;
        node.transform = "translate(" + x + ", " + y + ")";
        var _loop_2 = function (link) {
            if (link.target === node.id ||
                link.source === node.id ||
                ((/** @type {?} */ (link.target))).id === node.id ||
                ((/** @type {?} */ (link.source))).id === node.id) {
                if (this_2.layout && typeof this_2.layout !== 'string') {
                    /** @type {?} */
                    var result = this_2.layout.updateEdge(this_2.graph, link);
                    /** @type {?} */
                    var result$ = result instanceof Observable ? result : of(result);
                    this_2.graphSubscription.add(result$.subscribe(function (graph) {
                        _this.graph = graph;
                        _this.redrawEdge(link);
                    }));
                }
            }
        };
        var this_2 = this;
        try {
            for (var _b = tslib_1.__values(this.graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
                var link = _c.value;
                _loop_2(link);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.redrawLines(false);
    };
    /**
     * @param {?} edge
     * @return {?}
     */
    GraphComponent.prototype.redrawEdge = /**
     * @param {?} edge
     * @return {?}
     */
    function (edge) {
        /** @type {?} */
        var line = this.generateLine(edge.points);
        this.calcDominantBaseline(edge);
        edge.oldLine = edge.line;
        edge.line = line;
    };
    /**
     * Update the entire view for the new pan position
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Update the entire view for the new pan position
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.updateTransform = /**
     * Update the entire view for the new pan position
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        this.transform = toSVG(this.transformationMatrix);
    };
    /**
     * Node was clicked
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Node was clicked
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    GraphComponent.prototype.onClick = /**
     * Node was clicked
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    function (event, originalEvent) {
        event.origEvent = originalEvent;
        this.select.emit(event);
    };
    /**
     * Node was clicked
     *
     */
    /**
     * Node was clicked
     *
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    GraphComponent.prototype.onDoubleClick = /**
     * Node was clicked
     *
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    function (event, originalEvent) {
        event.origEvent = originalEvent;
        event.isDoubleClick = true;
        this.select.emit(event);
    };
    /**
     * Node was focused
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Node was focused
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    GraphComponent.prototype.onActivate = /**
     * Node was focused
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.activeEntries.indexOf(event) > -1) {
            return;
        }
        this.activeEntries = tslib_1.__spread([event], this.activeEntries);
        this.activate.emit({ value: event, entries: this.activeEntries });
    };
    /**
     * Node was defocused
     *
     * @memberOf GraphComponent
     */
    /**
     * Node was defocused
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    GraphComponent.prototype.onDeactivate = /**
     * Node was defocused
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var idx = this.activeEntries.indexOf(event);
        this.activeEntries.splice(idx, 1);
        this.activeEntries = tslib_1.__spread(this.activeEntries);
        this.deactivate.emit({ value: event, entries: this.activeEntries });
    };
    /**
     * Get the domain series for the nodes
     *
     * @memberOf GraphComponent
     */
    /**
     * Get the domain series for the nodes
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.getSeriesDomain = /**
     * Get the domain series for the nodes
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        var _this = this;
        return this.nodes
            .map(function (d) { return _this.groupResultsBy(d); })
            .reduce(function (nodes, node) { return (nodes.indexOf(node) !== -1 ? nodes : nodes.concat([node])); }, [])
            .sort();
    };
    /**
     * Tracking for the link
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Tracking for the link
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} link
     * @return {?}
     */
    GraphComponent.prototype.trackLinkBy = /**
     * Tracking for the link
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} link
     * @return {?}
     */
    function (index, link) {
        return link.id;
    };
    /**
     * Tracking for the node
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Tracking for the node
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} node
     * @return {?}
     */
    GraphComponent.prototype.trackNodeBy = /**
     * Tracking for the node
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} node
     * @return {?}
     */
    function (index, node) {
        return node.id;
    };
    /**
     * Sets the colors the nodes
     *
     *
     * @memberOf GraphComponent
     */
    /**
     * Sets the colors the nodes
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.setColors = /**
     * Sets the colors the nodes
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
    };
    /**
     * Gets the legend options
     *
     * @memberOf GraphComponent
     */
    /**
     * Gets the legend options
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    GraphComponent.prototype.getLegendOptions = /**
     * Gets the legend options
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    function () {
        return {
            scaleType: 'ordinal',
            domain: this.seriesDomain,
            colors: this.colors
        };
    };
    /**
     * On mouse move event, used for panning and dragging.
     *
     * @memberOf GraphComponent
     */
    /**
     * On mouse move event, used for panning and dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @return {?}
     */
    GraphComponent.prototype.onMouseMove = /**
     * On mouse move event, used for panning and dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        if (this.isPanning && this.panningEnabled) {
            this.onPan($event);
        }
        else if (this.isDragging && this.draggingEnabled) {
            this.onDrag($event);
        }
    };
    /**
     * On touch start event to enable panning.
     *
     * @memberOf GraphComponent
     */
    /**
     * On touch start event to enable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    GraphComponent.prototype.onTouchStart = /**
     * On touch start event to enable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._touchLastX = event.changedTouches[0].clientX;
        this._touchLastY = event.changedTouches[0].clientY;
        this.isPanning = true;
    };
    /**
     * On touch move event, used for panning.
     *
     */
    /**
     * On touch move event, used for panning.
     *
     * @param {?} $event
     * @return {?}
     */
    GraphComponent.prototype.onTouchMove = /**
     * On touch move event, used for panning.
     *
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        if (this.isPanning && this.panningEnabled) {
            /** @type {?} */
            var clientX = $event.changedTouches[0].clientX;
            /** @type {?} */
            var clientY = $event.changedTouches[0].clientY;
            /** @type {?} */
            var movementX = clientX - this._touchLastX;
            /** @type {?} */
            var movementY = clientY - this._touchLastY;
            this._touchLastX = clientX;
            this._touchLastY = clientY;
            this.pan(movementX, movementY);
        }
    };
    /**
     * On touch end event to disable panning.
     *
     * @memberOf GraphComponent
     */
    /**
     * On touch end event to disable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    GraphComponent.prototype.onTouchEnd = /**
     * On touch end event to disable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.isPanning = false;
    };
    /**
     * On mouse up event to disable panning/dragging.
     *
     * @memberOf GraphComponent
     */
    /**
     * On mouse up event to disable panning/dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    GraphComponent.prototype.onMouseUp = /**
     * On mouse up event to disable panning/dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.isDragging = false;
        this.isPanning = false;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragEnd) {
            this.layout.onDragEnd(this.draggingNode, event);
        }
    };
    /**
     * On node mouse down to kick off dragging
     *
     * @memberOf GraphComponent
     */
    /**
     * On node mouse down to kick off dragging
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    GraphComponent.prototype.onNodeMouseDown = /**
     * On node mouse down to kick off dragging
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    function (event, node) {
        if (!this.draggingEnabled) {
            return;
        }
        this.isDragging = true;
        this.draggingNode = node;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragStart) {
            this.layout.onDragStart(node, event);
        }
    };
    /**
     * Center the graph in the viewport
     */
    /**
     * Center the graph in the viewport
     * @return {?}
     */
    GraphComponent.prototype.center = /**
     * Center the graph in the viewport
     * @return {?}
     */
    function () {
        this.panTo(this.dims.width / 2 - (this.graphDims.width * this.zoomLevel) / 2, this.dims.height / 2 - (this.graphDims.height * this.zoomLevel) / 2);
    };
    /**
     * Zooms to fit the entier graph
     */
    /**
     * Zooms to fit the entier graph
     * @return {?}
     */
    GraphComponent.prototype.zoomToFit = /**
     * Zooms to fit the entier graph
     * @return {?}
     */
    function () {
        /** @type {?} */
        var heightZoom = this.dims.height / this.graphDims.height;
        /** @type {?} */
        var widthZoom = this.dims.width / this.graphDims.width;
        /** @type {?} */
        var zoomLevel = Math.min(heightZoom, widthZoom, 1);
        if (zoomLevel !== this.zoomLevel) {
            this.zoomLevel = zoomLevel;
            this.updateTransform();
        }
    };
    /**
     * @return {?}
     */
    GraphComponent.prototype.restoreZoomBeforeLoad = /**
     * @return {?}
     */
    function () {
        if (this.autoZoom) {
            this.zoomToFit();
        }
        else {
            this.zoomLevel = this.zoomBefore;
        }
    };
    /**
     * @return {?}
     */
    GraphComponent.prototype.saveZoomBeforeLoad = /**
     * @return {?}
     */
    function () {
        this.zoomBefore = this.zoomLevel;
    };
    GraphComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-graph',
                    styles: [".graph{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.graph .edge{stroke:#666;fill:none}.graph .edge .edge-label{stroke:none;font-size:12px;fill:#251e1e}.graph .panning-rect{fill:transparent;cursor:move}.graph .node-group .node:focus{outline:0}.graph .cluster rect{opacity:.2}"],
                    template: "\n  <ngx-charts-chart [view]=\"[width, height]\" [showLegend]=\"legend\" [legendOptions]=\"legendOptions\" (legendLabelClick)=\"onClick($event, undefined)\"\n  (legendLabelActivate)=\"onActivate($event)\" (legendLabelDeactivate)=\"onDeactivate($event)\" mouseWheel (mouseWheelUp)=\"onZoom($event, 'in')\"\n  (mouseWheelDown)=\"onZoom($event, 'out')\">\n  <svg:g *ngIf=\"initialized && graph\" [attr.transform]=\"transform\" (touchstart)=\"onTouchStart($event)\" (touchend)=\"onTouchEnd($event)\"\n    class=\"graph chart\">\n    <defs>\n      <ng-template *ngIf=\"defsTemplate\" [ngTemplateOutlet]=\"defsTemplate\">\n      </ng-template>\n      <svg:path class=\"text-path\" *ngFor=\"let link of graph.edges\" [attr.d]=\"link.textPath\" [attr.id]=\"link.id\">\n      </svg:path>\n    </defs>\n    <svg:rect class=\"panning-rect\" [attr.width]=\"dims.width * 100\" [attr.height]=\"dims.height * 100\" [attr.transform]=\"'translate(' + ((-dims.width || 0) * 50) +',' + ((-dims.height || 0) *50) + ')' \"\n      (mousedown)=\"isPanning = true\" />\n      <svg:g class=\"clusters\">\n        <svg:g #clusterElement *ngFor=\"let node of graph.clusters; trackBy: trackNodeBy\" class=\"node-group\" [id]=\"node.id\" [attr.transform]=\"node.transform\"\n          (click)=\"onClick(node,$event)\">\n          <ng-template *ngIf=\"clusterTemplate\" [ngTemplateOutlet]=\"clusterTemplate\" [ngTemplateOutletContext]=\"{ $implicit: node }\">\n          </ng-template>\n          <svg:g *ngIf=\"!clusterTemplate\" class=\"node cluster\">\n            <svg:rect [attr.width]=\"node.dimension.width\" [attr.height]=\"node.dimension.height\" [attr.fill]=\"node.data?.color\" />\n            <svg:text alignment-baseline=\"central\" [attr.x]=\"10\" [attr.y]=\"node.dimension.height / 2\">{{node.label}}</svg:text>\n          </svg:g>\n        </svg:g>\n      </svg:g>\n      <svg:g class=\"links\">\n      <svg:g #linkElement *ngFor=\"let link of graph.edges; trackBy: trackLinkBy\" class=\"link-group\" [id]=\"link.id\">\n        <ng-template *ngIf=\"linkTemplate\" [ngTemplateOutlet]=\"linkTemplate\" [ngTemplateOutletContext]=\"{ $implicit: link }\">\n        </ng-template>\n        <svg:path *ngIf=\"!linkTemplate\" class=\"edge\" [attr.d]=\"link.line\" />\n      </svg:g>\n    </svg:g>\n    <svg:g class=\"nodes\">\n      <svg:g #nodeElement *ngFor=\"let node of graph.nodes; trackBy: trackNodeBy\" class=\"node-group\" [id]=\"node.id\" [attr.transform]=\"node.transform\"\n        (click)=\"onClick(node,$event)\" (mousedown)=\"onNodeMouseDown($event, node)\" (dblclick)=\"onDoubleClick(node,$event)\">\n        <ng-template *ngIf=\"nodeTemplate\" [ngTemplateOutlet]=\"nodeTemplate\" [ngTemplateOutletContext]=\"{ $implicit: node }\">\n        </ng-template>\n        <svg:circle *ngIf=\"!nodeTemplate\" r=\"10\" [attr.cx]=\"node.dimension.width / 2\" [attr.cy]=\"node.dimension.height / 2\" [attr.fill]=\"node.data?.color\"\n        />\n      </svg:g>\n    </svg:g>\n  </svg:g>\n</ngx-charts-chart>\n  ",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    animations: [trigger('link', [ngTransition('* => *', [animate(500, style({ transform: '*' }))])])]
                },] },
    ];
    /** @nocollapse */
    GraphComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: LayoutService }
    ]; };
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
    return GraphComponent;
}(BaseChartComponent));
export { GraphComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLFNBQVMsRUFDVCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixpQkFBaUIsRUFHbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixjQUFjLEVBQ2QsV0FBVyxFQUVYLHVCQUF1QixFQUN4QixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXJGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUl6RCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWpDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7OztBQUtsQyw0QkFPQzs7O0lBTkMsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsbUJBQVU7O0FBR1o7SUFtRG9DLDBDQUFrQjtJQWdJcEQsd0JBQ1UsRUFBYyxFQUNmLElBQVksRUFDWixFQUFxQixFQUNwQixhQUE0QjtRQUp0QyxZQU1FLGtCQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQ3BCO1FBTlMsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNmLFVBQUksR0FBSixJQUFJLENBQVE7UUFDWixRQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNwQixtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWxJdEMsWUFBTSxHQUFZLEtBQUssQ0FBQztRQUd4QixXQUFLLEdBQVcsRUFBRSxDQUFDO1FBR25CLGNBQVEsR0FBa0IsRUFBRSxDQUFDO1FBRzdCLFdBQUssR0FBVyxFQUFFLENBQUM7UUFHbkIsbUJBQWEsR0FBVSxFQUFFLENBQUM7UUFNMUIscUJBQWUsR0FBRyxJQUFJLENBQUM7UUFxQnZCLG9CQUFjLEdBQUcsSUFBSSxDQUFDO1FBR3RCLGdCQUFVLEdBQUcsSUFBSSxDQUFDO1FBR2xCLGVBQVMsR0FBRyxHQUFHLENBQUM7UUFHaEIsa0JBQVksR0FBRyxHQUFHLENBQUM7UUFHbkIsa0JBQVksR0FBRyxHQUFHLENBQUM7UUFHbkIsY0FBUSxHQUFHLEtBQUssQ0FBQztRQUdqQixlQUFTLEdBQUcsSUFBSSxDQUFDO1FBR2pCLGdCQUFVLEdBQUcsS0FBSyxDQUFDO1FBa0JuQixjQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHakQsZ0JBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQXVCbkQsdUJBQWlCLEdBQWlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckQsbUJBQWEsR0FBbUIsRUFBRSxDQUFDO1FBR25DLFlBQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLGFBQU8sR0FBRyxFQUFFLENBQUM7UUFJYixlQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGdCQUFVLEdBQUcsS0FBSyxDQUFDO1FBRW5CLGlCQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXBCLGVBQVMsR0FBUSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3pDLGVBQVMsR0FBVyxFQUFFLENBQUM7UUFDdkIsMEJBQW9CLEdBQVcsUUFBUSxFQUFFLENBQUM7UUFDMUMsaUJBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIsaUJBQVcsR0FBRyxJQUFJLENBQUM7UUFFbkIsZ0JBQVUsR0FBRyxDQUFDLENBQUM7UUFZZixvQkFBYyxHQUEwQixVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLEVBQVYsQ0FBVSxDQUFDOztJQUgzRCxDQUFDO0lBUUQsc0JBQUkscUNBQVM7UUFIYjs7V0FFRzs7Ozs7UUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQ7O1dBRUc7Ozs7OztRQUNILFVBQ2MsS0FBSztZQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUM7OztPQVJBO0lBYUQsc0JBQUksc0NBQVU7UUFIZDs7V0FFRzs7Ozs7UUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQ7O1dBRUc7Ozs7OztRQUNILFVBQ2UsQ0FBQztZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUM7OztPQVJBO0lBYUQsc0JBQUksc0NBQVU7UUFIZDs7V0FFRzs7Ozs7UUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQ7O1dBRUc7Ozs7OztRQUNILFVBQ2UsQ0FBQztZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUM7OztPQVJBO0lBVUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0gsaUNBQVE7Ozs7Ozs7SUFBUjtRQUFBLGlCQXlCQztRQXhCQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUNyQixLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztTQUNIO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDckIsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUNILENBQUM7U0FDSDtRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7Z0JBQ3hCLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FDSCxDQUFDO1NBQ0g7SUFHSCxDQUFDOzs7OztJQUVELG9DQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsSUFBQSx1QkFBTSxFQUFFLHVDQUFjLEVBQUUscUJBQUssRUFBRSwyQkFBUSxFQUFFLHFCQUFLO1FBQ3RELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLElBQUksY0FBYyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDN0M7UUFDRCxJQUFJLEtBQUssSUFBSSxRQUFRLElBQUksS0FBSyxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxrQ0FBUzs7OztJQUFULFVBQVUsTUFBdUI7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sR0FBRyxPQUFPLENBQUM7U0FDbEI7UUFDRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDOzs7OztJQUVELDBDQUFpQjs7OztJQUFqQixVQUFrQixRQUFhO1FBQzdCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSCxvQ0FBVzs7Ozs7OztJQUFYOztRQUNFLGlCQUFNLFdBQVcsV0FBRSxDQUFDOztZQUNwQixLQUFrQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQSxnQkFBQSw0QkFBRTtnQkFBakMsSUFBTSxHQUFHLFdBQUE7Z0JBQ1osR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ25COzs7Ozs7Ozs7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0gsd0NBQWU7Ozs7Ozs7SUFBZjtRQUFBLGlCQUdDO1FBRkMsaUJBQU0sZUFBZSxXQUFFLENBQUM7UUFDeEIsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxFQUFFLEVBQWIsQ0FBYSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDSCwrQkFBTTs7Ozs7O0lBQU47UUFBQSxpQkE0QkM7UUEzQkMsaUJBQU0sTUFBTSxXQUFFLENBQUM7UUFFZixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNaLEtBQUksQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLENBQUM7Z0JBQ2xDLEtBQUssRUFBRSxLQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNO2dCQUNuQixPQUFPLEVBQUUsS0FBSSxDQUFDLE1BQU07Z0JBQ3BCLFVBQVUsRUFBRSxLQUFJLENBQUMsTUFBTTthQUN4QixDQUFDLENBQUM7WUFFSCxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMzQyxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsS0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUU3QyxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkIscUVBQXFFO1lBQ3JFLDBCQUEwQjtZQUMxQixLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixLQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUNuQixLQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0gsNkJBQUk7Ozs7Ozs7SUFBSjtRQUFBLGlCQW1CQztRQWxCQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ25ELE9BQU87U0FDUjtRQUNELCtCQUErQjtRQUMvQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7O1lBR3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDOztZQUNwQyxPQUFPLEdBQUcsTUFBTSxZQUFZLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7WUFDaEQsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLE9BQU87YUFDSixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7YUFDNUMsU0FBUyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCw2QkFBSTs7O0lBQUo7UUFBQSxpQkEyRkM7UUExRkMsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFDcEIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxnQkFDWixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQ3JGLENBQUM7WUFDTixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDWCxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUNiO1lBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUVqQixDQUFDLENBQUMsSUFBSSxHQUFHO29CQUNQLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwRCxDQUFDO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztZQUMvQixDQUFDLENBQUMsU0FBUyxHQUFHLGdCQUNaLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FDckYsQ0FBQztZQUNOLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNYLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQ2I7WUFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBRWpCLENBQUMsQ0FBQyxJQUFJLEdBQUc7b0JBQ1AsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BELENBQUM7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFDOzs7WUFHRyxRQUFRLEdBQUcsRUFBRTtnQ0FDUixXQUFXOztnQkFDZCxTQUFTLEdBQUcsT0FBSyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQzs7Z0JBRTlDLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7O2dCQUMvQyxPQUFPLEdBQUcsT0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFRLEtBQUssT0FBTyxFQUF0QyxDQUFzQyxDQUFDO1lBQy9FLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osT0FBTyxHQUFHLE9BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQVEsS0FBSyxPQUFPLEVBQXRDLENBQXNDLENBQUMsSUFBSSxTQUFTLENBQUM7YUFDNUY7WUFFRCxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7O2dCQUV6QixNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU07O2dCQUN6QixJQUFJLEdBQUcsT0FBSyxZQUFZLENBQUMsTUFBTSxDQUFDOztnQkFFaEMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQztZQUMxQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNwQixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7Z0JBRWxCLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksT0FBTyxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxhQUFhLEdBQUcsZ0JBQWEsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQUcsQ0FBQzthQUMxRTtZQUVELE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUNwQixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDaEM7WUFFRCxPQUFLLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsQ0FBQzs7UUE5QkQsS0FBSyxJQUFNLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7b0JBQXBDLFdBQVc7U0E4QnJCO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBRTVCLG1DQUFtQztRQUNuQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzs7b0JBQy9CLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDdEIsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxtQkFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBaEMsQ0FBZ0MsQ0FBQyxFQUFDLENBQUM7UUFDaEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLG1CQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFqQyxDQUFpQyxDQUFDLEVBQUMsQ0FBQztRQUVsRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLDZCQUE2QjtZQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtRQUVELHFCQUFxQixDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxFQUFFLEVBQWxCLENBQWtCLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7O0lBQ0gsNENBQW1COzs7Ozs7SUFBbkI7UUFBQSxpQkFxREM7UUFwREMsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTs7b0JBQ2xCLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYTs7b0JBQ2xDLElBQUksR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxLQUFLLGFBQWEsQ0FBQyxFQUFFLEVBQXpCLENBQXlCLENBQUM7OztvQkFHOUQsSUFBSTtnQkFDUixJQUFJO29CQUNGLElBQUksR0FBRyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztpQkFDOUM7Z0JBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsK0VBQStFO29CQUMvRSxPQUFPO2lCQUNSO2dCQUNELElBQUksS0FBSSxDQUFDLFVBQVUsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQztpQkFDekM7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDckM7Z0JBRUQsSUFBSSxLQUFJLENBQUMsYUFBYSxFQUFFO29CQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDN0U7Z0JBQ0QsSUFBSSxLQUFJLENBQUMsYUFBYSxFQUFFO29CQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDN0U7Z0JBRUQsSUFBSSxLQUFJLENBQUMsU0FBUyxFQUFFO29CQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDTCxzQkFBc0I7b0JBQ3RCLElBQUksYUFBYSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRTs7NEJBQ2pELFFBQVEsU0FBQTt3QkFDWixJQUFJOzRCQUNGLFFBQVEsR0FBRyxhQUFhLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7eUJBQ3BFO3dCQUFDLE9BQU8sRUFBRSxFQUFFOzRCQUNYLCtFQUErRTs0QkFDL0UsT0FBTzt5QkFDUjt3QkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztxQkFDNUM7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztxQkFDbkM7aUJBQ0Y7Z0JBRUQsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFO29CQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDMUU7Z0JBQ0QsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFO29CQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDMUU7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBQ0gsb0NBQVc7Ozs7Ozs7SUFBWCxVQUFZLFFBQWU7UUFBM0IsaUJBb0JDO1FBcEJXLHlCQUFBLEVBQUEsZUFBZTtRQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU07O2dCQUNwQixJQUFJLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBbEMsQ0FBa0MsQ0FBQztZQUU3RSxJQUFJLElBQUksRUFBRTs7b0JBQ0YsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztnQkFDbEUsYUFBYTtxQkFDVixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ3ZCLFVBQVUsRUFBRTtxQkFDWixRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDNUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O29CQUVsQixpQkFBaUIsR0FBRyxNQUFNLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBSSxJQUFJLENBQUMsRUFBSSxDQUFDO2dCQUN2RixpQkFBaUI7cUJBQ2QsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDO3FCQUMzQixVQUFVLEVBQUU7cUJBQ1osUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzVCLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILG9DQUFXOzs7Ozs7SUFBWDtRQUFBLGlCQThCQztRQTdCQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7O1lBQ3RDLGNBQWMsR0FBRyxVQUFBLENBQUM7WUFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ1QsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUNiO1lBQ0QsQ0FBQyxDQUFDLFNBQVMsR0FBRztnQkFDWixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUUsRUFBRTthQUNYLENBQUM7WUFDRixDQUFDLENBQUMsUUFBUSxHQUFHO2dCQUNYLENBQUMsRUFBRSxDQUFDO2dCQUNKLENBQUMsRUFBRSxDQUFDO2FBQ0wsQ0FBQztZQUNGLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxLQUFLLEVBQUUsaUJBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDO1lBQzFDLFFBQVEsRUFBRSxpQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQztZQUN4RCxLQUFLLEVBQUUsaUJBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBQSxDQUFDO2dCQUMxQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDVCxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO2lCQUNiO2dCQUNELE9BQU8sQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDO1NBQ0gsQ0FBQztRQUVGLHFCQUFxQixDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxFQUFFLEVBQVgsQ0FBVyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBQ0gsNkNBQW9COzs7Ozs7O0lBQXBCLFVBQXFCLElBQUk7O1lBQ2pCLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7WUFDM0IsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUVqQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7WUFFM0MscURBQXFEO1lBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNMLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztZQUMxQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7SUFDSCxxQ0FBWTs7Ozs7OztJQUFaLFVBQWEsTUFBTTs7WUFDWCxZQUFZLEdBQUcsS0FBSzthQUN2QixJQUFJLEVBQU87YUFDWCxDQUFDLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBQzthQUNYLENBQUMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFDO2FBQ1gsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7OztJQUNILCtCQUFNOzs7Ozs7OztJQUFOLFVBQU8sTUFBa0IsRUFBRSxTQUFTOztZQUM1QixVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDOzs7WUFHeEUsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVTtRQUNoRCxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQzFFLE9BQU87U0FDUjtRQUVELHFDQUFxQztRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLE1BQU0sRUFBRTs7O2dCQUUvQixNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU87O2dCQUN2QixNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU87OztnQkFHdkIsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7O2dCQUNuRCxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7O2dCQUV2QyxLQUFLLEdBQUcsR0FBRyxDQUFDLGNBQWMsRUFBRTtZQUNsQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUNqQixLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQzs7Z0JBQ1gsUUFBUSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7Z0JBR25FLGFBQWEsR0FBRyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ25EO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7Ozs7O0lBQ0gsNEJBQUc7Ozs7Ozs7O0lBQUgsVUFBSSxDQUFTLEVBQUUsQ0FBUyxFQUFFLFNBQWtDO1FBQWxDLDBCQUFBLEVBQUEsWUFBb0IsSUFBSSxDQUFDLFNBQVM7UUFDMUQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFMUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7Ozs7Ozs7O0lBQ0gsOEJBQUs7Ozs7Ozs7SUFBTCxVQUFNLENBQVMsRUFBRSxDQUFTO1FBQ3hCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxILElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0gsNkJBQUk7Ozs7OztJQUFKLFVBQUssTUFBYztRQUNqQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFeEYsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7Ozs7Ozs7SUFDSCwrQkFBTTs7Ozs7O0lBQU4sVUFBTyxLQUFhO1FBQ2xCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6RixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBQ0gsOEJBQUs7Ozs7Ozs7SUFBTCxVQUFNLEtBQUs7UUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILCtCQUFNOzs7Ozs7O0lBQU4sVUFBTyxLQUFLO1FBQVosaUJBc0NDOztRQXJDQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN6QixPQUFPO1NBQ1I7O1lBQ0ssSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZO1FBQzlCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7OztZQUc5QyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQzs7WUFDOUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDckQsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFhLENBQUMsVUFBSyxDQUFDLE1BQUcsQ0FBQztnQ0FFOUIsSUFBSTtZQUNiLElBQ0UsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDdkIsQ0FBQyxtQkFBQSxJQUFJLENBQUMsTUFBTSxFQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ25DLENBQUMsbUJBQUEsSUFBSSxDQUFDLE1BQU0sRUFBTyxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQ25DO2dCQUNBLElBQUksT0FBSyxNQUFNLElBQUksT0FBTyxPQUFLLE1BQU0sS0FBSyxRQUFRLEVBQUU7O3dCQUM1QyxNQUFNLEdBQUcsT0FBSyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQUssS0FBSyxFQUFFLElBQUksQ0FBQzs7d0JBQ2pELE9BQU8sR0FBRyxNQUFNLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7b0JBQ2xFLE9BQUssaUJBQWlCLENBQUMsR0FBRyxDQUN4QixPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSzt3QkFDckIsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ25CLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hCLENBQUMsQ0FBQyxDQUNILENBQUM7aUJBQ0g7YUFDRjtRQUNILENBQUM7OztZQWxCRCxLQUFtQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUEsZ0JBQUE7Z0JBQTlCLElBQU0sSUFBSSxXQUFBO3dCQUFKLElBQUk7YUFrQmQ7Ozs7Ozs7OztRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFRCxtQ0FBVTs7OztJQUFWLFVBQVcsSUFBVTs7WUFDYixJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7OztPQUtHOzs7Ozs7OztJQUNILHdDQUFlOzs7Ozs7O0lBQWY7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7Ozs7SUFDSCxnQ0FBTzs7Ozs7Ozs7O0lBQVAsVUFBUSxLQUFLLEVBQUUsYUFBYTtRQUMxQixLQUFLLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7OztJQUNILHNDQUFhOzs7Ozs7O0lBQWIsVUFBYyxLQUFLLEVBQUUsYUFBYTtRQUNoQyxLQUFLLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztRQUNoQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7OztJQUNILG1DQUFVOzs7Ozs7OztJQUFWLFVBQVcsS0FBSztRQUNkLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDMUMsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGFBQWEscUJBQUksS0FBSyxHQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILHFDQUFZOzs7Ozs7O0lBQVosVUFBYSxLQUFLOztZQUNWLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFFN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxhQUFhLG9CQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7O0lBQ0gsd0NBQWU7Ozs7OztJQUFmO1FBQUEsaUJBS0M7UUFKQyxPQUFPLElBQUksQ0FBQyxLQUFLO2FBQ2QsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQzthQUNoQyxNQUFNLENBQUMsVUFBQyxLQUFlLEVBQUUsSUFBSSxJQUFZLE9BQUEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQTNELENBQTJELEVBQUUsRUFBRSxDQUFDO2FBQ3pHLElBQUksRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7OztPQUtHOzs7Ozs7Ozs7O0lBQ0gsb0NBQVc7Ozs7Ozs7OztJQUFYLFVBQVksS0FBSyxFQUFFLElBQUk7UUFDckIsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7OztJQUNILG9DQUFXOzs7Ozs7Ozs7SUFBWCxVQUFZLEtBQUssRUFBRSxJQUFJO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0gsa0NBQVM7Ozs7Ozs7SUFBVDtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDSCx5Q0FBZ0I7Ozs7OztJQUFoQjtRQUNFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3BCLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7SUFFSCxvQ0FBVzs7Ozs7OztJQURYLFVBQ1ksTUFBa0I7UUFDNUIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNwQjthQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7SUFDSCxxQ0FBWTs7Ozs7OztJQUFaLFVBQWEsS0FBSztRQUNoQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ25ELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7OztJQUVILG9DQUFXOzs7Ozs7SUFEWCxVQUNZLE1BQWtCO1FBQzVCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFOztnQkFDbkMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzs7Z0JBQzFDLE9BQU8sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87O2dCQUMxQyxTQUFTLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXOztnQkFDdEMsU0FBUyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVztZQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUUzQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILG1DQUFVOzs7Ozs7O0lBQVYsVUFBVyxLQUFLO1FBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7O0lBRUgsa0NBQVM7Ozs7Ozs7SUFEVCxVQUNVLEtBQWlCO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQzNFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7O0lBQ0gsd0NBQWU7Ozs7Ozs7O0lBQWYsVUFBZ0IsS0FBaUIsRUFBRSxJQUFTO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBRXpCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO1lBQzdFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCwrQkFBTTs7OztJQUFOO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FDUixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUNwRSxDQUFDO0lBQ0osQ0FBQztJQUVEOztPQUVHOzs7OztJQUNILGtDQUFTOzs7O0lBQVQ7O1lBQ1EsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTs7WUFDckQsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSzs7WUFDbEQsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDcEQsSUFBSSxTQUFTLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUMzQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOzs7O0lBRUQsOENBQXFCOzs7SUFBckI7UUFDRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2xCO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDbEM7SUFDSCxDQUFDOzs7O0lBRUQsMkNBQWtCOzs7SUFBbEI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDbkMsQ0FBQzs7Z0JBdi9CRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLE1BQU0sRUFBRSxDQUFDLDZUQUE2VCxDQUFDO29CQUN2VSxRQUFRLEVBQUUsbTdGQTJDVDtvQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25HOzs7O2dCQXJHQyxVQUFVO2dCQVlWLE1BQU07Z0JBQ04saUJBQWlCO2dCQWtCVixhQUFhOzs7eUJBd0VuQixLQUFLO3dCQUdMLEtBQUs7MkJBR0wsS0FBSzt3QkFHTCxLQUFLO2dDQUdMLEtBQUs7d0JBR0wsS0FBSztrQ0FHTCxLQUFLOzZCQUdMLEtBQUs7Z0NBR0wsS0FBSztnQ0FHTCxLQUFLOzRCQUdMLEtBQUs7K0JBR0wsS0FBSzsrQkFHTCxLQUFLO2lDQUdMLEtBQUs7NkJBR0wsS0FBSzs0QkFHTCxLQUFLOytCQUdMLEtBQUs7K0JBR0wsS0FBSzsyQkFHTCxLQUFLOzRCQUdMLEtBQUs7NkJBR0wsS0FBSzswQkFHTCxLQUFLOzBCQUdMLEtBQUs7NkJBR0wsS0FBSzt5QkFHTCxLQUFLO2lDQUdMLEtBQUs7MkJBR0wsTUFBTTs2QkFHTixNQUFNOytCQUdOLFlBQVksU0FBQyxjQUFjOytCQUczQixZQUFZLFNBQUMsY0FBYztrQ0FHM0IsWUFBWSxTQUFDLGlCQUFpQjsrQkFHOUIsWUFBWSxTQUFDLGNBQWM7d0JBRzNCLFNBQVMsU0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFOytCQUc5QyxZQUFZLFNBQUMsYUFBYTsrQkFHMUIsWUFBWSxTQUFDLGFBQWE7aUNBa0MxQixLQUFLOzRCQWFMLEtBQUssU0FBQyxXQUFXOzZCQWVqQixLQUFLLFNBQUMsWUFBWTs2QkFlbEIsS0FBSyxTQUFDLFlBQVk7OEJBZ3FCbEIsWUFBWSxTQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDOzhCQXlCN0MsWUFBWSxTQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDOzRCQTRCN0MsWUFBWSxTQUFDLGtCQUFrQjs7SUE0RGxDLHFCQUFDO0NBQUEsQUF4L0JELENBbURvQyxrQkFBa0IsR0FxOEJyRDtTQXI4QlksY0FBYzs7O0lBQ3pCLGdDQUN3Qjs7SUFFeEIsK0JBQ21COztJQUVuQixrQ0FDNkI7O0lBRTdCLCtCQUNtQjs7SUFFbkIsdUNBQzBCOztJQUUxQiwrQkFDVzs7SUFFWCx5Q0FDdUI7O0lBRXZCLG9DQUNtQjs7SUFFbkIsdUNBQ3NCOztJQUV0Qix1Q0FDc0I7O0lBRXRCLG1DQUNrQjs7SUFFbEIsc0NBQ3FCOztJQUVyQixzQ0FDcUI7O0lBRXJCLHdDQUNzQjs7SUFFdEIsb0NBQ2tCOztJQUVsQixtQ0FDZ0I7O0lBRWhCLHNDQUNtQjs7SUFFbkIsc0NBQ21COztJQUVuQixrQ0FDaUI7O0lBRWpCLG1DQUNpQjs7SUFFakIsb0NBQ21COztJQUVuQixpQ0FDeUI7O0lBRXpCLGlDQUN5Qjs7SUFFekIsb0NBQzRCOztJQUU1QixnQ0FDd0I7O0lBRXhCLHdDQUNvQjs7SUFFcEIsa0NBQ2lEOztJQUVqRCxvQ0FDbUQ7O0lBRW5ELHNDQUMrQjs7SUFFL0Isc0NBQytCOztJQUUvQix5Q0FDa0M7O0lBRWxDLHNDQUMrQjs7SUFFL0IsK0JBQ2tCOztJQUVsQixzQ0FDb0M7O0lBRXBDLHNDQUNvQzs7SUFFcEMsMkNBQXFEOztJQUNyRCx1Q0FBbUM7O0lBQ25DLGdDQUFvQjs7SUFDcEIsOEJBQXFCOztJQUNyQixnQ0FBc0I7O0lBQ3RCLGlDQUFhOztJQUNiLHNDQUFrQjs7SUFDbEIsbUNBQWtCOztJQUNsQix1Q0FBbUI7O0lBQ25CLG1DQUFrQjs7SUFDbEIsb0NBQW1COztJQUNuQixzQ0FBbUI7O0lBQ25CLHFDQUFvQjs7SUFDcEIsK0JBQWE7O0lBQ2IsbUNBQXlDOztJQUN6QyxtQ0FBdUI7O0lBQ3ZCLDhDQUEwQzs7SUFDMUMscUNBQW1COztJQUNuQixxQ0FBbUI7O0lBRW5CLG9DQUFlOztJQVdmLHdDQUMyRDs7Ozs7SUFUekQsNEJBQXNCOztJQUN0Qiw4QkFBbUI7O0lBQ25CLDRCQUE0Qjs7Ozs7SUFDNUIsdUNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVuYW1lIHRyYW5zaXRpb24gZHVlIHRvIGNvbmZsaWN0IHdpdGggZDMgdHJhbnNpdGlvblxyXG5pbXBvcnQgeyBhbmltYXRlLCBzdHlsZSwgdHJhbnNpdGlvbiBhcyBuZ1RyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBDb250ZW50Q2hpbGQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFF1ZXJ5TGlzdCxcclxuICBUZW1wbGF0ZVJlZixcclxuICBWaWV3Q2hpbGQsXHJcbiAgVmlld0NoaWxkcmVuLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG4gIE5nWm9uZSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBPbkNoYW5nZXMsXHJcbiAgU2ltcGxlQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEJhc2VDaGFydENvbXBvbmVudCxcclxuICBDaGFydENvbXBvbmVudCxcclxuICBDb2xvckhlbHBlcixcclxuICBWaWV3RGltZW5zaW9ucyxcclxuICBjYWxjdWxhdGVWaWV3RGltZW5zaW9uc1xyXG59IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0ICogYXMgc2hhcGUgZnJvbSAnZDMtc2hhcGUnO1xyXG5pbXBvcnQgJ2QzLXRyYW5zaXRpb24nO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBpZGVudGl0eSwgc2NhbGUsIHRvU1ZHLCB0cmFuc2Zvcm0sIHRyYW5zbGF0ZSB9IGZyb20gJ3RyYW5zZm9ybWF0aW9uLW1hdHJpeCc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi9tb2RlbHMvbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcblxyXG5jb25zb2xlLmxvZygnRUwgUkVGJywgRWxlbWVudFJlZik7XHJcblxyXG4vKipcclxuICogTWF0cml4XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE1hdHJpeCB7XHJcbiAgYTogbnVtYmVyO1xyXG4gIGI6IG51bWJlcjtcclxuICBjOiBudW1iZXI7XHJcbiAgZDogbnVtYmVyO1xyXG4gIGU6IG51bWJlcjtcclxuICBmOiBudW1iZXI7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdyYXBoJyxcclxuICBzdHlsZXM6IFtgLmdyYXBoey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZ3JhcGggLmVkZ2V7c3Ryb2tlOiM2NjY7ZmlsbDpub25lfS5ncmFwaCAuZWRnZSAuZWRnZS1sYWJlbHtzdHJva2U6bm9uZTtmb250LXNpemU6MTJweDtmaWxsOiMyNTFlMWV9LmdyYXBoIC5wYW5uaW5nLXJlY3R7ZmlsbDp0cmFuc3BhcmVudDtjdXJzb3I6bW92ZX0uZ3JhcGggLm5vZGUtZ3JvdXAgLm5vZGU6Zm9jdXN7b3V0bGluZTowfS5ncmFwaCAuY2x1c3RlciByZWN0e29wYWNpdHk6LjJ9YF0sXHJcbiAgdGVtcGxhdGU6IGBcclxuICA8bmd4LWNoYXJ0cy1jaGFydCBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIiBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIiBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCIgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQsIHVuZGVmaW5lZClcIlxyXG4gIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiIChsZWdlbmRMYWJlbERlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIiBtb3VzZVdoZWVsIChtb3VzZVdoZWVsVXApPVwib25ab29tKCRldmVudCwgJ2luJylcIlxyXG4gIChtb3VzZVdoZWVsRG93bik9XCJvblpvb20oJGV2ZW50LCAnb3V0JylcIj5cclxuICA8c3ZnOmcgKm5nSWY9XCJpbml0aWFsaXplZCAmJiBncmFwaFwiIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxyXG4gICAgY2xhc3M9XCJncmFwaCBjaGFydFwiPlxyXG4gICAgPGRlZnM+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImRlZnNUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRlZnNUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8c3ZnOnBhdGggY2xhc3M9XCJ0ZXh0LXBhdGhcIiAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlc1wiIFthdHRyLmRdPVwibGluay50ZXh0UGF0aFwiIFthdHRyLmlkXT1cImxpbmsuaWRcIj5cclxuICAgICAgPC9zdmc6cGF0aD5cclxuICAgIDwvZGVmcz5cclxuICAgIDxzdmc6cmVjdCBjbGFzcz1cInBhbm5pbmctcmVjdFwiIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKiAxMDBcIiBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKiAxMDBcIiBbYXR0ci50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZSgnICsgKCgtZGltcy53aWR0aCB8fCAwKSAqIDUwKSArJywnICsgKCgtZGltcy5oZWlnaHQgfHwgMCkgKjUwKSArICcpJyBcIlxyXG4gICAgICAobW91c2Vkb3duKT1cImlzUGFubmluZyA9IHRydWVcIiAvPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJjbHVzdGVyc1wiPlxyXG4gICAgICAgIDxzdmc6ZyAjY2x1c3RlckVsZW1lbnQgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGguY2x1c3RlcnM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCIgY2xhc3M9XCJub2RlLWdyb3VwXCIgW2lkXT1cIm5vZGUuaWRcIiBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxyXG4gICAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUgfVwiPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDxzdmc6ZyAqbmdJZj1cIiFjbHVzdGVyVGVtcGxhdGVcIiBjbGFzcz1cIm5vZGUgY2x1c3RlclwiPlxyXG4gICAgICAgICAgICA8c3ZnOnJlY3QgW2F0dHIud2lkdGhdPVwibm9kZS5kaW1lbnNpb24ud2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0XCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCIgLz5cclxuICAgICAgICAgICAgPHN2Zzp0ZXh0IGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIiBbYXR0ci54XT1cIjEwXCIgW2F0dHIueV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCI+e3tub2RlLmxhYmVsfX08L3N2Zzp0ZXh0PlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJsaW5rc1wiPlxyXG4gICAgICA8c3ZnOmcgI2xpbmtFbGVtZW50ICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzOyB0cmFja0J5OiB0cmFja0xpbmtCeVwiIGNsYXNzPVwibGluay1ncm91cFwiIFtpZF09XCJsaW5rLmlkXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBsaW5rIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxzdmc6cGF0aCAqbmdJZj1cIiFsaW5rVGVtcGxhdGVcIiBjbGFzcz1cImVkZ2VcIiBbYXR0ci5kXT1cImxpbmsubGluZVwiIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gICAgPHN2ZzpnIGNsYXNzPVwibm9kZXNcIj5cclxuICAgICAgPHN2ZzpnICNub2RlRWxlbWVudCAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5ub2RlczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIiBjbGFzcz1cIm5vZGUtZ3JvdXBcIiBbaWRdPVwibm9kZS5pZFwiIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCIgKG1vdXNlZG93bik9XCJvbk5vZGVNb3VzZURvd24oJGV2ZW50LCBub2RlKVwiIChkYmxjbGljayk9XCJvbkRvdWJsZUNsaWNrKG5vZGUsJGV2ZW50KVwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8c3ZnOmNpcmNsZSAqbmdJZj1cIiFub2RlVGVtcGxhdGVcIiByPVwiMTBcIiBbYXR0ci5jeF09XCJub2RlLmRpbWVuc2lvbi53aWR0aCAvIDJcIiBbYXR0ci5jeV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCJcclxuICAgICAgICAvPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICA8L3N2ZzpnPlxyXG48L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdsaW5rJywgW25nVHJhbnNpdGlvbignKiA9PiAqJywgW2FuaW1hdGUoNTAwLCBzdHlsZSh7IHRyYW5zZm9ybTogJyonIH0pKV0pXSldXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcmFwaENvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZXM6IE5vZGVbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGlua3M6IEVkZ2VbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY3VydmU6IGFueTtcclxuXHJcbiAgQElucHV0KClcclxuICBkcmFnZ2luZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWF4SGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1pbkhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNaW5XaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNYXhXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbm5pbmdFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBlbmFibGVab29tID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tU3BlZWQgPSAwLjE7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWluWm9vbUxldmVsID0gMC4xO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1heFpvb21MZXZlbCA9IDQuMDtcclxuXHJcbiAgQElucHV0KClcclxuICBhdXRvWm9vbSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbk9uWm9vbSA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYXV0b0NlbnRlciA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHVwZGF0ZSQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICBjZW50ZXIkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgem9vbVRvRml0JDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dDogc3RyaW5nIHwgTGF5b3V0O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dFNldHRpbmdzOiBhbnk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2xpbmtUZW1wbGF0ZScpXHJcbiAgbGlua1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdub2RlVGVtcGxhdGUnKVxyXG4gIG5vZGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnY2x1c3RlclRlbXBsYXRlJylcclxuICBjbHVzdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2RlZnNUZW1wbGF0ZScpXHJcbiAgZGVmc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAVmlld0NoaWxkKENoYXJ0Q29tcG9uZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcclxuICBjaGFydDogRWxlbWVudFJlZjtcclxuXHJcbiAgQFZpZXdDaGlsZHJlbignbm9kZUVsZW1lbnQnKVxyXG4gIG5vZGVFbGVtZW50czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xyXG5cclxuICBAVmlld0NoaWxkcmVuKCdsaW5rRWxlbWVudCcpXHJcbiAgbGlua0VsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XHJcblxyXG4gIGdyYXBoU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XHJcbiAgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcclxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xyXG4gIG1hcmdpbiA9IFswLCAwLCAwLCAwXTtcclxuICByZXN1bHRzID0gW107XHJcbiAgc2VyaWVzRG9tYWluOiBhbnk7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgbGVnZW5kT3B0aW9uczogYW55O1xyXG4gIGlzUGFubmluZyA9IGZhbHNlO1xyXG4gIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICBkcmFnZ2luZ05vZGU6IE5vZGU7XHJcbiAgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICBncmFwaDogR3JhcGg7XHJcbiAgZ3JhcGhEaW1zOiBhbnkgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcclxuICBfb2xkTGlua3M6IEVkZ2VbXSA9IFtdO1xyXG4gIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBNYXRyaXggPSBpZGVudGl0eSgpO1xyXG4gIF90b3VjaExhc3RYID0gbnVsbDtcclxuICBfdG91Y2hMYXN0WSA9IG51bGw7XHJcblxyXG4gIHpvb21CZWZvcmUgPSAxO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXHJcbiAgICBwdWJsaWMgem9uZTogTmdab25lLFxyXG4gICAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgIHByaXZhdGUgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZVxyXG4gICkge1xyXG4gICAgc3VwZXIoZWwsIHpvbmUsIGNkKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZ3JvdXBSZXN1bHRzQnk6IChub2RlOiBhbnkpID0+IHN0cmluZyA9IG5vZGUgPT4gbm9kZS5sYWJlbDtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcclxuICAgKi9cclxuICBnZXQgem9vbUxldmVsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCB6b29tIGxldmVsXHJcbiAgICovXHJcbiAgQElucHV0KCd6b29tTGV2ZWwnKVxyXG4gIHNldCB6b29tTGV2ZWwobGV2ZWwpIHtcclxuICAgIHRoaXMuem9vbVRvKE51bWJlcihsZXZlbCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjdXJyZW50IGB4YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBnZXQgcGFuT2Zmc2V0WCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGN1cnJlbnQgYHhgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIEBJbnB1dCgncGFuT2Zmc2V0WCcpXHJcbiAgc2V0IHBhbk9mZnNldFgoeCkge1xyXG4gICAgdGhpcy5wYW5UbyhOdW1iZXIoeCksIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjdXJyZW50IGB5YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBnZXQgcGFuT2Zmc2V0WSgpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmY7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGN1cnJlbnQgYHlgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIEBJbnB1dCgncGFuT2Zmc2V0WScpXHJcbiAgc2V0IHBhbk9mZnNldFkoeSkge1xyXG4gICAgdGhpcy5wYW5UbyhudWxsLCBOdW1iZXIoeSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy51cGRhdGUkKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG4gICAgICAgIHRoaXMudXBkYXRlJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmNlbnRlciQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy5jZW50ZXIkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNlbnRlcigpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy56b29tVG9GaXQkKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG4gICAgICAgIHRoaXMuem9vbVRvRml0JC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2coY2hhbmdlcyk7XHJcbiAgICBjb25zdCB7IGxheW91dCwgbGF5b3V0U2V0dGluZ3MsIG5vZGVzLCBjbHVzdGVycywgbGlua3MgfSA9IGNoYW5nZXM7XHJcbiAgICB0aGlzLnNldExheW91dCh0aGlzLmxheW91dCk7XHJcbiAgICBpZiAobGF5b3V0U2V0dGluZ3MpIHtcclxuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcclxuICAgIH1cclxuICAgIGlmIChub2RlcyB8fCBjbHVzdGVycyB8fCBsaW5rcykge1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0TGF5b3V0KGxheW91dDogc3RyaW5nIHwgTGF5b3V0KTogdm9pZCB7XHJcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICBpZiAoIWxheW91dCkge1xyXG4gICAgICBsYXlvdXQgPSAnZGFncmUnO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBsYXlvdXQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0ID0gdGhpcy5sYXlvdXRTZXJ2aWNlLmdldExheW91dChsYXlvdXQpO1xyXG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0TGF5b3V0U2V0dGluZ3Moc2V0dGluZ3M6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5sYXlvdXQuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcclxuICAgIGZvciAoY29uc3Qgc3ViIG9mIHRoaXMuc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCYXNlIGNsYXNzIHVwZGF0ZSBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIGRhZyBncmFwaFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgc3VwZXIudXBkYXRlKCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmN1cnZlKSB7XHJcbiAgICAgIHRoaXMuY3VydmUgPSBzaGFwZS5jdXJ2ZUJ1bmRsZS5iZXRhKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xyXG4gICAgICB0aGlzLmRpbXMgPSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyh7XHJcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICBtYXJnaW5zOiB0aGlzLm1hcmdpbixcclxuICAgICAgICBzaG93TGVnZW5kOiB0aGlzLmxlZ2VuZFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuc2VyaWVzRG9tYWluID0gdGhpcy5nZXRTZXJpZXNEb21haW4oKTtcclxuICAgICAgdGhpcy5zZXRDb2xvcnMoKTtcclxuICAgICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XHJcblxyXG4gICAgICB0aGlzLmNyZWF0ZUdyYXBoKCk7XHJcblxyXG4gICAgICAvLyBJZiB6b29tIGlzbid0IDEsIHRoZW4gbm9kZXMgc29tZXRpbWVzIGRvbid0IHJlbmRlciBpbiBjb3JyZWN0IHNpemVcclxuICAgICAgLy8gem9vbWluZyB0byAxIGZpeGVzIHRoaXNcclxuICAgICAgdGhpcy5zYXZlWm9vbUJlZm9yZUxvYWQoKTtcclxuICAgICAgdGhpcy56b29tTGV2ZWwgPSAxO1xyXG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhd3MgdGhlIGdyYXBoIHVzaW5nIGRhZ3JlIGxheW91dHNcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZHJhdygpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5sYXlvdXQgfHwgdHlwZW9mIHRoaXMubGF5b3V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBDYWxjIHZpZXcgZGltcyBmb3IgdGhlIG5vZGVzXHJcbiAgICB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAvLyBSZWNhbGMgdGhlIGxheW91dFxyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQucnVuKHRoaXMuZ3JhcGgpO1xyXG4gICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQocmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xyXG4gICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XHJcbiAgICAgIHRoaXMudGljaygpO1xyXG4gICAgfSkpO1xyXG4gICAgcmVzdWx0JFxyXG4gICAgICAucGlwZShmaXJzdChncmFwaCA9PiBncmFwaC5ub2Rlcy5sZW5ndGggPiAwKSlcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKSk7XHJcblxyXG4gICAgdGhpcy5yZXN0b3JlWm9vbUJlZm9yZUxvYWQoKTtcclxuICB9XHJcblxyXG4gIHRpY2soKSB7XHJcbiAgICAvLyBUcmFuc3Bvc2VzIHZpZXcgb3B0aW9ucyB0byB0aGUgbm9kZVxyXG4gICAgdGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiB7XHJcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke1xyXG4gICAgICAgIG4ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8IDBcclxuICAgICAgICB9KWA7XHJcbiAgICAgIGlmICghbi5kYXRhKSB7XHJcbiAgICAgICAgbi5kYXRhID0ge307XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFuLmRhdGEuY29sb3IpIHtcclxuXHJcbiAgICAgICAgbi5kYXRhID0ge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAodGhpcy5ncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKG4gPT4ge1xyXG4gICAgICBuLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtcclxuICAgICAgICBuLnBvc2l0aW9uLnggLSBuLmRpbWVuc2lvbi53aWR0aCAvIDIgfHwgMH0sICR7bi5wb3NpdGlvbi55IC0gbi5kaW1lbnNpb24uaGVpZ2h0IC8gMiB8fCAwXHJcbiAgICAgICAgfSlgO1xyXG4gICAgICBpZiAoIW4uZGF0YSkge1xyXG4gICAgICAgIG4uZGF0YSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbi5kYXRhLmNvbG9yKSB7XHJcblxyXG4gICAgICAgIG4uZGF0YSA9IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0aGUgbGFiZWxzIHRvIHRoZSBuZXcgcG9zaXRpb25zXHJcbiAgICBjb25zdCBuZXdMaW5rcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBlZGdlTGFiZWxJZCBpbiB0aGlzLmdyYXBoLmVkZ2VMYWJlbHMpIHtcclxuICAgICAgY29uc3QgZWRnZUxhYmVsID0gdGhpcy5ncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcclxuXHJcbiAgICAgIGNvbnN0IG5vcm1LZXkgPSBlZGdlTGFiZWxJZC5yZXBsYWNlKC9bXlxcdy1dKi9nLCAnJyk7XHJcbiAgICAgIGxldCBvbGRMaW5rID0gdGhpcy5fb2xkTGlua3MuZmluZChvbCA9PiBgJHtvbC5zb3VyY2V9JHtvbC50YXJnZXR9YCA9PT0gbm9ybUtleSk7XHJcbiAgICAgIGlmICghb2xkTGluaykge1xyXG4gICAgICAgIG9sZExpbmsgPSB0aGlzLmdyYXBoLmVkZ2VzLmZpbmQobmwgPT4gYCR7bmwuc291cmNlfSR7bmwudGFyZ2V0fWAgPT09IG5vcm1LZXkpIHx8IGVkZ2VMYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgb2xkTGluay5vbGRMaW5lID0gb2xkTGluay5saW5lO1xyXG5cclxuICAgICAgY29uc3QgcG9pbnRzID0gZWRnZUxhYmVsLnBvaW50cztcclxuICAgICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKHBvaW50cyk7XHJcblxyXG4gICAgICBjb25zdCBuZXdMaW5rID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkTGluayk7XHJcbiAgICAgIG5ld0xpbmsubGluZSA9IGxpbmU7XHJcbiAgICAgIG5ld0xpbmsucG9pbnRzID0gcG9pbnRzO1xyXG5cclxuICAgICAgY29uc3QgdGV4dFBvcyA9IHBvaW50c1tNYXRoLmZsb29yKHBvaW50cy5sZW5ndGggLyAyKV07XHJcbiAgICAgIGlmICh0ZXh0UG9zKSB7XHJcbiAgICAgICAgbmV3TGluay50ZXh0VHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RleHRQb3MueCB8fCAwfSwke3RleHRQb3MueSB8fCAwfSlgO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXdMaW5rLnRleHRBbmdsZSA9IDA7XHJcbiAgICAgIGlmICghbmV3TGluay5vbGRMaW5lKSB7XHJcbiAgICAgICAgbmV3TGluay5vbGRMaW5lID0gbmV3TGluay5saW5lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKG5ld0xpbmspO1xyXG4gICAgICBuZXdMaW5rcy5wdXNoKG5ld0xpbmspO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ3JhcGguZWRnZXMgPSBuZXdMaW5rcztcclxuXHJcbiAgICAvLyBNYXAgdGhlIG9sZCBsaW5rcyBmb3IgYW5pbWF0aW9uc1xyXG4gICAgaWYgKHRoaXMuZ3JhcGguZWRnZXMpIHtcclxuICAgICAgdGhpcy5fb2xkTGlua3MgPSB0aGlzLmdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgICBjb25zdCBuZXdMID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgICAgbmV3TC5vbGRMaW5lID0gbC5saW5lO1xyXG4gICAgICAgIHJldHVybiBuZXdMO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgdGhlIGhlaWdodC93aWR0aCB0b3RhbFxyXG4gICAgdGhpcy5ncmFwaERpbXMud2lkdGggPSBNYXRoLm1heCguLi50aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IG4ucG9zaXRpb24ueCArIG4uZGltZW5zaW9uLndpZHRoKSk7XHJcbiAgICB0aGlzLmdyYXBoRGltcy5oZWlnaHQgPSBNYXRoLm1heCguLi50aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IG4ucG9zaXRpb24ueSArIG4uZGltZW5zaW9uLmhlaWdodCkpO1xyXG5cclxuICAgIGlmICh0aGlzLmF1dG9ab29tKSB7XHJcbiAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b0NlbnRlcikge1xyXG4gICAgICAvLyBBdXRvLWNlbnRlciB3aGVuIHJlbmRlcmluZ1xyXG4gICAgICB0aGlzLmNlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnJlZHJhd0xpbmVzKCkpO1xyXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1lYXN1cmVzIHRoZSBub2RlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlIGRpbWVuc2lvbnNcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGFwcGx5Tm9kZURpbWVuc2lvbnMoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5ub2RlRWxlbWVudHMgJiYgdGhpcy5ub2RlRWxlbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMubm9kZUVsZW1lbnRzLm1hcChlbGVtID0+IHtcclxuICAgICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gZWxlbS5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBuYXRpdmVFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBoZWlnaHRcclxuICAgICAgICBsZXQgZGltcztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgZGltcyA9IG5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgIC8vIFNraXAgZHJhd2luZyBpZiBlbGVtZW50IGlzIG5vdCBkaXNwbGF5ZWQgLSBGaXJlZm94IHdvdWxkIHRocm93IGFuIGVycm9yIGhlcmVcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZUhlaWdodCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gdGhpcy5ub2RlSGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBkaW1zLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhIZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWF4KG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWF4SGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbkhlaWdodCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gTWF0aC5taW4obm9kZS5kaW1lbnNpb24uaGVpZ2h0LCB0aGlzLm5vZGVNaW5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZVdpZHRoKSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IHRoaXMubm9kZVdpZHRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHdpZHRoXHJcbiAgICAgICAgICBpZiAobmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBsZXQgdGV4dERpbXM7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgdGV4dERpbXMgPSBuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JylbMF0uZ2V0QkJveCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgIC8vIFNraXAgZHJhd2luZyBpZiBlbGVtZW50IGlzIG5vdCBkaXNwbGF5ZWQgLSBGaXJlZm94IHdvdWxkIHRocm93IGFuIGVycm9yIGhlcmVcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSB0ZXh0RGltcy53aWR0aCArIDIwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBkaW1zLndpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1heFdpZHRoKSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWF4KG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNYXhXaWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNaW5XaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBNYXRoLm1pbihub2RlLmRpbWVuc2lvbi53aWR0aCwgdGhpcy5ub2RlTWluV2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWRyYXdzIHRoZSBsaW5lcyB3aGVuIGRyYWdnZWQgb3Igdmlld3BvcnQgdXBkYXRlZFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgcmVkcmF3TGluZXMoX2FuaW1hdGUgPSB0cnVlKTogdm9pZCB7XHJcbiAgICB0aGlzLmxpbmtFbGVtZW50cy5tYXAobGlua0VsID0+IHtcclxuICAgICAgY29uc3QgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChsaW4gPT4gbGluLmlkID09PSBsaW5rRWwubmF0aXZlRWxlbWVudC5pZCk7XHJcblxyXG4gICAgICBpZiAoZWRnZSkge1xyXG4gICAgICAgIGNvbnN0IGxpbmtTZWxlY3Rpb24gPSBzZWxlY3QobGlua0VsLm5hdGl2ZUVsZW1lbnQpLnNlbGVjdCgnLmxpbmUnKTtcclxuICAgICAgICBsaW5rU2VsZWN0aW9uXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2Uub2xkTGluZSlcclxuICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgIC5kdXJhdGlvbihfYW5pbWF0ZSA/IDUwMCA6IDApXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2UubGluZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRQYXRoU2VsZWN0aW9uID0gc2VsZWN0KHRoaXMuY2hhcnRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnNlbGVjdChgIyR7ZWRnZS5pZH1gKTtcclxuICAgICAgICB0ZXh0UGF0aFNlbGVjdGlvblxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZFRleHRQYXRoKVxyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgLmR1cmF0aW9uKF9hbmltYXRlID8gNTAwIDogMClcclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS50ZXh0UGF0aCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgZGFncmUgZ3JhcGggZW5naW5lXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBjcmVhdGVHcmFwaCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XHJcbiAgICBjb25zdCBpbml0aWFsaXplTm9kZSA9IG4gPT4ge1xyXG4gICAgICBpZiAoIW4uaWQpIHtcclxuICAgICAgICBuLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICBuLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgaGVpZ2h0OiAzMFxyXG4gICAgICB9O1xyXG4gICAgICBuLnBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgICB9O1xyXG4gICAgICBuLmRhdGEgPSBuLmRhdGEgPyBuLmRhdGEgOiB7fTtcclxuICAgICAgcmV0dXJuIG47XHJcbiAgICB9O1xyXG4gICAgdGhpcy5ncmFwaCA9IHtcclxuICAgICAgbm9kZXM6IFsuLi50aGlzLm5vZGVzXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxyXG4gICAgICBjbHVzdGVyczogWy4uLih0aGlzLmNsdXN0ZXJzIHx8IFtdKV0ubWFwKGluaXRpYWxpemVOb2RlKSxcclxuICAgICAgZWRnZXM6IFsuLi50aGlzLmxpbmtzXS5tYXAoZSA9PiB7XHJcbiAgICAgICAgaWYgKCFlLmlkKSB7XHJcbiAgICAgICAgICBlLmlkID0gaWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXcoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGUgdGhlIHRleHQgZGlyZWN0aW9ucyAvIGZsaXBwaW5nXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBjYWxjRG9taW5hbnRCYXNlbGluZShsaW5rKTogdm9pZCB7XHJcbiAgICBjb25zdCBmaXJzdFBvaW50ID0gbGluay5wb2ludHNbMF07XHJcbiAgICBjb25zdCBsYXN0UG9pbnQgPSBsaW5rLnBvaW50c1tsaW5rLnBvaW50cy5sZW5ndGggLSAxXTtcclxuICAgIGxpbmsub2xkVGV4dFBhdGggPSBsaW5rLnRleHRQYXRoO1xyXG5cclxuICAgIGlmIChsYXN0UG9pbnQueCA8IGZpcnN0UG9pbnQueCkge1xyXG4gICAgICBsaW5rLmRvbWluYW50QmFzZWxpbmUgPSAndGV4dC1iZWZvcmUtZWRnZSc7XHJcblxyXG4gICAgICAvLyByZXZlcnNlIHRleHQgcGF0aCBmb3Igd2hlbiBpdHMgZmxpcHBlZCB1cHNpZGUgZG93blxyXG4gICAgICBsaW5rLnRleHRQYXRoID0gdGhpcy5nZW5lcmF0ZUxpbmUoWy4uLmxpbmsucG9pbnRzXS5yZXZlcnNlKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGluay5kb21pbmFudEJhc2VsaW5lID0gJ3RleHQtYWZ0ZXItZWRnZSc7XHJcbiAgICAgIGxpbmsudGV4dFBhdGggPSBsaW5rLmxpbmU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZSB0aGUgbmV3IGxpbmUgcGF0aFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2VuZXJhdGVMaW5lKHBvaW50cyk6IGFueSB7XHJcbiAgICBjb25zdCBsaW5lRnVuY3Rpb24gPSBzaGFwZVxyXG4gICAgICAubGluZTxhbnk+KClcclxuICAgICAgLngoZCA9PiBkLngpXHJcbiAgICAgIC55KGQgPT4gZC55KVxyXG4gICAgICAuY3VydmUodGhpcy5jdXJ2ZSk7XHJcbiAgICByZXR1cm4gbGluZUZ1bmN0aW9uKHBvaW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIHdhcyBpbnZva2VkIGZyb20gZXZlbnRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uWm9vbSgkZXZlbnQ6IE1vdXNlRXZlbnQsIGRpcmVjdGlvbik6IHZvaWQge1xyXG4gICAgY29uc3Qgem9vbUZhY3RvciA9IDEgKyAoZGlyZWN0aW9uID09PSAnaW4nID8gdGhpcy56b29tU3BlZWQgOiAtdGhpcy56b29tU3BlZWQpO1xyXG5cclxuICAgIC8vIENoZWNrIHRoYXQgem9vbWluZyB3b3VsZG4ndCBwdXQgdXMgb3V0IG9mIGJvdW5kc1xyXG4gICAgY29uc3QgbmV3Wm9vbUxldmVsID0gdGhpcy56b29tTGV2ZWwgKiB6b29tRmFjdG9yO1xyXG4gICAgaWYgKG5ld1pvb21MZXZlbCA8PSB0aGlzLm1pblpvb21MZXZlbCB8fCBuZXdab29tTGV2ZWwgPj0gdGhpcy5tYXhab29tTGV2ZWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGlmIHpvb21pbmcgaXMgZW5hYmxlZCBvciBub3RcclxuICAgIGlmICghdGhpcy5lbmFibGVab29tKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5wYW5Pblpvb20gPT09IHRydWUgJiYgJGV2ZW50KSB7XHJcbiAgICAgIC8vIEFic29sdXRlIG1vdXNlIFgvWSBvbiB0aGUgc2NyZWVuXHJcbiAgICAgIGNvbnN0IG1vdXNlWCA9ICRldmVudC5jbGllbnRYO1xyXG4gICAgICBjb25zdCBtb3VzZVkgPSAkZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgIC8vIFRyYW5zZm9ybSB0aGUgbW91c2UgWC9ZIGludG8gYSBTVkcgWC9ZXHJcbiAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuY2hhcnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuICAgICAgY29uc3Qgc3ZnR3JvdXAgPSBzdmcucXVlcnlTZWxlY3RvcignZy5jaGFydCcpO1xyXG5cclxuICAgICAgY29uc3QgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgcG9pbnQueCA9IG1vdXNlWDtcclxuICAgICAgcG9pbnQueSA9IG1vdXNlWTtcclxuICAgICAgY29uc3Qgc3ZnUG9pbnQgPSBwb2ludC5tYXRyaXhUcmFuc2Zvcm0oc3ZnR3JvdXAuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcclxuXHJcbiAgICAgIC8vIFBhbnpvb21cclxuICAgICAgY29uc3QgTk9fWk9PTV9MRVZFTCA9IDE7XHJcbiAgICAgIHRoaXMucGFuKHN2Z1BvaW50LngsIHN2Z1BvaW50LnksIE5PX1pPT01fTEVWRUwpO1xyXG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XHJcbiAgICAgIHRoaXMucGFuKC1zdmdQb2ludC54LCAtc3ZnUG9pbnQueSwgTk9fWk9PTV9MRVZFTCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gYnkgeC95XHJcbiAgICpcclxuICAgKi9cclxuICBwYW4oeDogbnVtYmVyLCB5OiBudW1iZXIsIHpvb21MZXZlbDogbnVtYmVyID0gdGhpcy56b29tTGV2ZWwpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdHJhbnNsYXRlKHggLyB6b29tTGV2ZWwsIHkgLyB6b29tTGV2ZWwpKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIHRvIGEgZml4ZWQgeC95XHJcbiAgICpcclxuICAgKi9cclxuICBwYW5Ubyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lID0geCA9PT0gbnVsbCB8fCB4ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmUgOiBOdW1iZXIoeCk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmYgPSB5ID09PSBudWxsIHx8IHkgPT09IHVuZGVmaW5lZCB8fCBpc05hTih5KSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZiA6IE51bWJlcih5KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSBieSBhIGZhY3RvclxyXG4gICAqXHJcbiAgICovXHJcbiAgem9vbShmYWN0b3I6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCBzY2FsZShmYWN0b3IsIGZhY3RvcikpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIHRvIGEgZml4ZWQgbGV2ZWxcclxuICAgKlxyXG4gICAqL1xyXG4gIHpvb21UbyhsZXZlbDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmEgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmEgOiBOdW1iZXIobGV2ZWwpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5kID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5kIDogTnVtYmVyKGxldmVsKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIHdhcyBpbnZva2VkIGZyb20gZXZlbnRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uUGFuKGV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLnBhbihldmVudC5tb3ZlbWVudFgsIGV2ZW50Lm1vdmVtZW50WSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEcmFnIHdhcyBpbnZva2VkIGZyb20gYW4gZXZlbnRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uRHJhZyhldmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5kcmFnZ2luZ05vZGU7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWcpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnKG5vZGUsIGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBub2RlLnBvc2l0aW9uLnggKz0gZXZlbnQubW92ZW1lbnRYIC8gdGhpcy56b29tTGV2ZWw7XHJcbiAgICBub2RlLnBvc2l0aW9uLnkgKz0gZXZlbnQubW92ZW1lbnRZIC8gdGhpcy56b29tTGV2ZWw7XHJcblxyXG4gICAgLy8gbW92ZSB0aGUgbm9kZVxyXG4gICAgY29uc3QgeCA9IG5vZGUucG9zaXRpb24ueCAtIG5vZGUuZGltZW5zaW9uLndpZHRoIC8gMjtcclxuICAgIGNvbnN0IHkgPSBub2RlLnBvc2l0aW9uLnkgLSBub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyO1xyXG4gICAgbm9kZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGxpbmsgb2YgdGhpcy5ncmFwaC5lZGdlcykge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbGluay50YXJnZXQgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICBsaW5rLnNvdXJjZSA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIChsaW5rLnRhcmdldCBhcyBhbnkpLmlkID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgKGxpbmsuc291cmNlIGFzIGFueSkuaWQgPT09IG5vZGUuaWRcclxuICAgICAgKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnVwZGF0ZUVkZ2UodGhpcy5ncmFwaCwgbGluayk7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQkID0gcmVzdWx0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSA/IHJlc3VsdCA6IG9mKHJlc3VsdCk7XHJcbiAgICAgICAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLmFkZChcclxuICAgICAgICAgICAgcmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcclxuICAgICAgICAgICAgICB0aGlzLnJlZHJhd0VkZ2UobGluayk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVkcmF3TGluZXMoZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcmVkcmF3RWRnZShlZGdlOiBFZGdlKSB7XHJcbiAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUoZWRnZS5wb2ludHMpO1xyXG4gICAgdGhpcy5jYWxjRG9taW5hbnRCYXNlbGluZShlZGdlKTtcclxuICAgIGVkZ2Uub2xkTGluZSA9IGVkZ2UubGluZTtcclxuICAgIGVkZ2UubGluZSA9IGxpbmU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdGhlIGVudGlyZSB2aWV3IGZvciB0aGUgbmV3IHBhbiBwb3NpdGlvblxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB1cGRhdGVUcmFuc2Zvcm0oKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9IHRvU1ZHKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgY2xpY2tlZFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkNsaWNrKGV2ZW50LCBvcmlnaW5hbEV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5vcmlnRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBjbGlja2VkXHJcbiAgICpcclxuICAgKi9cclxuICBvbkRvdWJsZUNsaWNrKGV2ZW50LCBvcmlnaW5hbEV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5vcmlnRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xyXG4gICAgZXZlbnQuaXNEb3VibGVDbGljayA9IHRydWU7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGZvY3VzZWRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25BY3RpdmF0ZShldmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlRW50cmllcy5pbmRleE9mKGV2ZW50KSA+IC0xKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtldmVudCwgLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBldmVudCwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgZGVmb2N1c2VkXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkRlYWN0aXZhdGUoZXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5pbmRleE9mKGV2ZW50KTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuXHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBldmVudCwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBkb21haW4gc2VyaWVzIGZvciB0aGUgbm9kZXNcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldFNlcmllc0RvbWFpbigpOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2Rlc1xyXG4gICAgICAubWFwKGQgPT4gdGhpcy5ncm91cFJlc3VsdHNCeShkKSlcclxuICAgICAgLnJlZHVjZSgobm9kZXM6IHN0cmluZ1tdLCBub2RlKTogYW55W10gPT4gKG5vZGVzLmluZGV4T2Yobm9kZSkgIT09IC0xID8gbm9kZXMgOiBub2Rlcy5jb25jYXQoW25vZGVdKSksIFtdKVxyXG4gICAgICAuc29ydCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhY2tpbmcgZm9yIHRoZSBsaW5rXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHRyYWNrTGlua0J5KGluZGV4LCBsaW5rKTogYW55IHtcclxuICAgIHJldHVybiBsaW5rLmlkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhY2tpbmcgZm9yIHRoZSBub2RlXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHRyYWNrTm9kZUJ5KGluZGV4LCBub2RlKTogYW55IHtcclxuICAgIHJldHVybiBub2RlLmlkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY29sb3JzIHRoZSBub2Rlc1xyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBzZXRDb2xvcnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgJ29yZGluYWwnLCB0aGlzLnNlcmllc0RvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgbGVnZW5kIG9wdGlvbnNcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldExlZ2VuZE9wdGlvbnMoKTogYW55IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjYWxlVHlwZTogJ29yZGluYWwnLFxyXG4gICAgICBkb21haW46IHRoaXMuc2VyaWVzRG9tYWluLFxyXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbW91c2UgbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZyBhbmQgZHJhZ2dpbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZW1vdmUnLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2VNb3ZlKCRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNQYW5uaW5nICYmIHRoaXMucGFubmluZ0VuYWJsZWQpIHtcclxuICAgICAgdGhpcy5vblBhbigkZXZlbnQpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcclxuICAgICAgdGhpcy5vbkRyYWcoJGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIHRvdWNoIHN0YXJ0IGV2ZW50IHRvIGVuYWJsZSBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XHJcbiAgICB0aGlzLl90b3VjaExhc3RYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgIHRoaXMuX3RvdWNoTGFzdFkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG5cclxuICAgIHRoaXMuaXNQYW5uaW5nID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIHRvdWNoIG1vdmUgZXZlbnQsIHVzZWQgZm9yIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaG1vdmUnLCBbJyRldmVudCddKVxyXG4gIG9uVG91Y2hNb3ZlKCRldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNQYW5uaW5nICYmIHRoaXMucGFubmluZ0VuYWJsZWQpIHtcclxuICAgICAgY29uc3QgY2xpZW50WCA9ICRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBjbGllbnRZID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGNvbnN0IG1vdmVtZW50WCA9IGNsaWVudFggLSB0aGlzLl90b3VjaExhc3RYO1xyXG4gICAgICBjb25zdCBtb3ZlbWVudFkgPSBjbGllbnRZIC0gdGhpcy5fdG91Y2hMYXN0WTtcclxuICAgICAgdGhpcy5fdG91Y2hMYXN0WCA9IGNsaWVudFg7XHJcbiAgICAgIHRoaXMuX3RvdWNoTGFzdFkgPSBjbGllbnRZO1xyXG5cclxuICAgICAgdGhpcy5wYW4obW92ZW1lbnRYLCBtb3ZlbWVudFkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggZW5kIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uVG91Y2hFbmQoZXZlbnQpIHtcclxuICAgIHRoaXMuaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBtb3VzZSB1cCBldmVudCB0byBkaXNhYmxlIHBhbm5pbmcvZHJhZ2dpbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZXVwJylcclxuICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCkge1xyXG4gICAgICB0aGlzLmxheW91dC5vbkRyYWdFbmQodGhpcy5kcmFnZ2luZ05vZGUsIGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG5vZGUgbW91c2UgZG93biB0byBraWNrIG9mZiBkcmFnZ2luZ1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25Ob2RlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50LCBub2RlOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuZHJhZ2dpbmdOb2RlID0gbm9kZTtcclxuXHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdTdGFydCkge1xyXG4gICAgICB0aGlzLmxheW91dC5vbkRyYWdTdGFydChub2RlLCBldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDZW50ZXIgdGhlIGdyYXBoIGluIHRoZSB2aWV3cG9ydFxyXG4gICAqL1xyXG4gIGNlbnRlcigpOiB2b2lkIHtcclxuICAgIHRoaXMucGFuVG8oXHJcbiAgICAgIHRoaXMuZGltcy53aWR0aCAvIDIgLSAodGhpcy5ncmFwaERpbXMud2lkdGggKiB0aGlzLnpvb21MZXZlbCkgLyAyLFxyXG4gICAgICB0aGlzLmRpbXMuaGVpZ2h0IC8gMiAtICh0aGlzLmdyYXBoRGltcy5oZWlnaHQgKiB0aGlzLnpvb21MZXZlbCkgLyAyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbXMgdG8gZml0IHRoZSBlbnRpZXIgZ3JhcGhcclxuICAgKi9cclxuICB6b29tVG9GaXQoKTogdm9pZCB7XHJcbiAgICBjb25zdCBoZWlnaHRab29tID0gdGhpcy5kaW1zLmhlaWdodCAvIHRoaXMuZ3JhcGhEaW1zLmhlaWdodDtcclxuICAgIGNvbnN0IHdpZHRoWm9vbSA9IHRoaXMuZGltcy53aWR0aCAvIHRoaXMuZ3JhcGhEaW1zLndpZHRoO1xyXG4gICAgY29uc3Qgem9vbUxldmVsID0gTWF0aC5taW4oaGVpZ2h0Wm9vbSwgd2lkdGhab29tLCAxKTtcclxuICAgIGlmICh6b29tTGV2ZWwgIT09IHRoaXMuem9vbUxldmVsKSB7XHJcbiAgICAgIHRoaXMuem9vbUxldmVsID0gem9vbUxldmVsO1xyXG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzdG9yZVpvb21CZWZvcmVMb2FkKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuYXV0b1pvb20pIHtcclxuICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuem9vbUxldmVsID0gdGhpcy56b29tQmVmb3JlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2F2ZVpvb21CZWZvcmVMb2FkKCk6IHZvaWQge1xyXG4gICAgdGhpcy56b29tQmVmb3JlID0gdGhpcy56b29tTGV2ZWw7XHJcbiAgfVxyXG59XHJcbiJdfQ==