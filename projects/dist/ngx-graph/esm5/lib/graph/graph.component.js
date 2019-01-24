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
        result$.pipe(first(function (graph) { return graph.nodes.length > 0; })).subscribe(function () { return _this.applyNodeDimensions(); });
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
            n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 ||
                0) + ")";
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
            n.transform = "translate(" + (n.position.x - n.dimension.width / 2 || 0) + ", " + (n.position.y - n.dimension.height / 2 ||
                0) + ")";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLFNBQVMsRUFDVCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixpQkFBaUIsRUFHbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixjQUFjLEVBQ2QsV0FBVyxFQUVYLHVCQUF1QixFQUN4QixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXJGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUl6RCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWpDLE9BQU8sQ0FBQyxHQUFHLENBQUMs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bkIsd0NBQzJEOzs7OztJQVR6RCw0QkFBc0I7O0lBQ3RCLDhCQUFtQjs7SUFDbkIsNEJBQTRCOzs7OztJQUM1Qix1Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyByZW5hbWUgdHJhbnNpdGlvbiBkdWUgdG8gY29uZmxpY3Qgd2l0aCBkMyB0cmFuc2l0aW9uXHJcbmltcG9ydCB7IGFuaW1hdGUsIHN0eWxlLCB0cmFuc2l0aW9uIGFzIG5nVHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIENvbnRlbnRDaGlsZCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgUXVlcnlMaXN0LFxyXG4gIFRlbXBsYXRlUmVmLFxyXG4gIFZpZXdDaGlsZCxcclxuICBWaWV3Q2hpbGRyZW4sXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgTmdab25lLFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgQmFzZUNoYXJ0Q29tcG9uZW50LFxyXG4gIENoYXJ0Q29tcG9uZW50LFxyXG4gIENvbG9ySGVscGVyLFxyXG4gIFZpZXdEaW1lbnNpb25zLFxyXG4gIGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zXHJcbn0gZnJvbSAnQHN3aW1sYW5lL25neC1jaGFydHMnO1xyXG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBzaGFwZSBmcm9tICdkMy1zaGFwZSc7XHJcbmltcG9ydCAnZDMtdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGlkZW50aXR5LCBzY2FsZSwgdG9TVkcsIHRyYW5zZm9ybSwgdHJhbnNsYXRlIH0gZnJvbSAndHJhbnNmb3JtYXRpb24tbWF0cml4JztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL2xheW91dHMvbGF5b3V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uL21vZGVscy9ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcclxuXHJcbmNvbnNvbGUubG9nKCdFTCBSRUYnLCBFbGVtZW50UmVmKTtcclxuXHJcbi8qKlxyXG4gKiBNYXRyaXhcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWF0cml4IHtcclxuICBhOiBudW1iZXI7XHJcbiAgYjogbnVtYmVyO1xyXG4gIGM6IG51bWJlcjtcclxuICBkOiBudW1iZXI7XHJcbiAgZTogbnVtYmVyO1xyXG4gIGY6IG51bWJlcjtcclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZ3JhcGgnLFxyXG4gIHN0eWxlczogW2AuZ3JhcGh7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5ncmFwaCAuZWRnZXtzdHJva2U6IzY2NjtmaWxsOm5vbmV9LmdyYXBoIC5lZGdlIC5lZGdlLWxhYmVse3N0cm9rZTpub25lO2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzI1MWUxZX0uZ3JhcGggLnBhbm5pbmctcmVjdHtmaWxsOnRyYW5zcGFyZW50O2N1cnNvcjptb3ZlfS5ncmFwaCAubm9kZS1ncm91cCAubm9kZTpmb2N1c3tvdXRsaW5lOjB9LmdyYXBoIC5jbHVzdGVyIHJlY3R7b3BhY2l0eTouMn1gXSxcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxuZ3gtY2hhcnRzLWNoYXJ0IFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiIFtzaG93TGVnZW5kXT1cImxlZ2VuZFwiIFtsZWdlbmRPcHRpb25zXT1cImxlZ2VuZE9wdGlvbnNcIiAobGVnZW5kTGFiZWxDbGljayk9XCJvbkNsaWNrKCRldmVudCwgdW5kZWZpbmVkKVwiXHJcbiAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCIgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiIG1vdXNlV2hlZWwgKG1vdXNlV2hlZWxVcCk9XCJvblpvb20oJGV2ZW50LCAnaW4nKVwiXHJcbiAgKG1vdXNlV2hlZWxEb3duKT1cIm9uWm9vbSgkZXZlbnQsICdvdXQnKVwiPlxyXG4gIDxzdmc6ZyAqbmdJZj1cImluaXRpYWxpemVkICYmIGdyYXBoXCIgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQpXCIgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiXHJcbiAgICBjbGFzcz1cImdyYXBoIGNoYXJ0XCI+XHJcbiAgICA8ZGVmcz5cclxuICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwiZGVmc1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGVmc1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxzdmc6cGF0aCBjbGFzcz1cInRleHQtcGF0aFwiICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzXCIgW2F0dHIuZF09XCJsaW5rLnRleHRQYXRoXCIgW2F0dHIuaWRdPVwibGluay5pZFwiPlxyXG4gICAgICA8L3N2ZzpwYXRoPlxyXG4gICAgPC9kZWZzPlxyXG4gICAgPHN2ZzpyZWN0IGNsYXNzPVwicGFubmluZy1yZWN0XCIgW2F0dHIud2lkdGhdPVwiZGltcy53aWR0aCAqIDEwMFwiIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodCAqIDEwMFwiIFthdHRyLnRyYW5zZm9ybV09XCIndHJhbnNsYXRlKCcgKyAoKC1kaW1zLndpZHRoIHx8IDApICogNTApICsnLCcgKyAoKC1kaW1zLmhlaWdodCB8fCAwKSAqNTApICsgJyknIFwiXHJcbiAgICAgIChtb3VzZWRvd24pPVwiaXNQYW5uaW5nID0gdHJ1ZVwiIC8+XHJcbiAgICAgIDxzdmc6ZyBjbGFzcz1cImNsdXN0ZXJzXCI+XHJcbiAgICAgICAgPHN2ZzpnICNjbHVzdGVyRWxlbWVudCAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5jbHVzdGVyczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIiBjbGFzcz1cIm5vZGUtZ3JvdXBcIiBbaWRdPVwibm9kZS5pZFwiIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXHJcbiAgICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlLCRldmVudClcIj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImNsdXN0ZXJUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNsdXN0ZXJUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHN2ZzpnICpuZ0lmPVwiIWNsdXN0ZXJUZW1wbGF0ZVwiIGNsYXNzPVwibm9kZSBjbHVzdGVyXCI+XHJcbiAgICAgICAgICAgIDxzdmc6cmVjdCBbYXR0ci53aWR0aF09XCJub2RlLmRpbWVuc2lvbi53aWR0aFwiIFthdHRyLmhlaWdodF09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHRcIiBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIiAvPlxyXG4gICAgICAgICAgICA8c3ZnOnRleHQgYWxpZ25tZW50LWJhc2VsaW5lPVwiY2VudHJhbFwiIFthdHRyLnhdPVwiMTBcIiBbYXR0ci55XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIj57e25vZGUubGFiZWx9fTwvc3ZnOnRleHQ+XHJcbiAgICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDxzdmc6ZyBjbGFzcz1cImxpbmtzXCI+XHJcbiAgICAgIDxzdmc6ZyAjbGlua0VsZW1lbnQgKm5nRm9yPVwibGV0IGxpbmsgb2YgZ3JhcGguZWRnZXM7IHRyYWNrQnk6IHRyYWNrTGlua0J5XCIgY2xhc3M9XCJsaW5rLWdyb3VwXCIgW2lkXT1cImxpbmsuaWRcIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJsaW5rVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJsaW5rVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IGxpbmsgfVwiPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPHN2ZzpwYXRoICpuZ0lmPVwiIWxpbmtUZW1wbGF0ZVwiIGNsYXNzPVwiZWRnZVwiIFthdHRyLmRdPVwibGluay5saW5lXCIgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgICA8c3ZnOmcgY2xhc3M9XCJub2Rlc1wiPlxyXG4gICAgICA8c3ZnOmcgI25vZGVFbGVtZW50ICpuZ0Zvcj1cImxldCBub2RlIG9mIGdyYXBoLm5vZGVzOyB0cmFja0J5OiB0cmFja05vZGVCeVwiIGNsYXNzPVwibm9kZS1ncm91cFwiIFtpZF09XCJub2RlLmlkXCIgW2F0dHIudHJhbnNmb3JtXT1cIm5vZGUudHJhbnNmb3JtXCJcclxuICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlLCRldmVudClcIiAobW91c2Vkb3duKT1cIm9uTm9kZU1vdXNlRG93bigkZXZlbnQsIG5vZGUpXCIgKGRibGNsaWNrKT1cIm9uRG91YmxlQ2xpY2sobm9kZSwkZXZlbnQpXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwibm9kZVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibm9kZVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxzdmc6Y2lyY2xlICpuZ0lmPVwiIW5vZGVUZW1wbGF0ZVwiIHI9XCIxMFwiIFthdHRyLmN4XT1cIm5vZGUuZGltZW5zaW9uLndpZHRoIC8gMlwiIFthdHRyLmN5XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIiBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIDwvc3ZnOmc+XHJcbjwvbmd4LWNoYXJ0cy1jaGFydD5cclxuICBgLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ2xpbmsnLCBbbmdUcmFuc2l0aW9uKCcqID0+IConLCBbYW5pbWF0ZSg1MDAsIHN0eWxlKHsgdHJhbnNmb3JtOiAnKicgfSkpXSldKV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdyYXBoQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KClcclxuICBsZWdlbmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlczogTm9kZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY2x1c3RlcnM6IENsdXN0ZXJOb2RlW10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBsaW5rczogRWRnZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBjdXJ2ZTogYW55O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGRyYWdnaW5nRW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNYXhIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWluSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZVdpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1pbldpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1heFdpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGFubmluZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGVuYWJsZVpvb20gPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHpvb21TcGVlZCA9IDAuMTtcclxuXHJcbiAgQElucHV0KClcclxuICBtaW5ab29tTGV2ZWwgPSAwLjE7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWF4Wm9vbUxldmVsID0gNC4wO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGF1dG9ab29tID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGFuT25ab29tID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBhdXRvQ2VudGVyID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdXBkYXRlJDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNlbnRlciQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tVG9GaXQkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQ7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGF5b3V0U2V0dGluZ3M6IGFueTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnbGlua1RlbXBsYXRlJylcclxuICBsaW5rVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ25vZGVUZW1wbGF0ZScpXHJcbiAgbm9kZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdjbHVzdGVyVGVtcGxhdGUnKVxyXG4gIGNsdXN0ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnZGVmc1RlbXBsYXRlJylcclxuICBkZWZzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBWaWV3Q2hpbGQoQ2hhcnRDb21wb25lbnQsIHsgcmVhZDogRWxlbWVudFJlZiB9KVxyXG4gIGNoYXJ0OiBFbGVtZW50UmVmO1xyXG5cclxuICBAVmlld0NoaWxkcmVuKCdub2RlRWxlbWVudCcpXHJcbiAgbm9kZUVsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XHJcblxyXG4gIEBWaWV3Q2hpbGRyZW4oJ2xpbmtFbGVtZW50JylcclxuICBsaW5rRWxlbWVudHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcclxuXHJcbiAgZ3JhcGhTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuICBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xyXG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XHJcbiAgZGltczogVmlld0RpbWVuc2lvbnM7XHJcbiAgbWFyZ2luID0gWzAsIDAsIDAsIDBdO1xyXG4gIHJlc3VsdHMgPSBbXTtcclxuICBzZXJpZXNEb21haW46IGFueTtcclxuICB0cmFuc2Zvcm06IHN0cmluZztcclxuICBsZWdlbmRPcHRpb25zOiBhbnk7XHJcbiAgaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gIGRyYWdnaW5nTm9kZTogTm9kZTtcclxuICBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gIGdyYXBoOiBHcmFwaDtcclxuICBncmFwaERpbXM6IGFueSA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xyXG4gIF9vbGRMaW5rczogRWRnZVtdID0gW107XHJcbiAgdHJhbnNmb3JtYXRpb25NYXRyaXg6IE1hdHJpeCA9IGlkZW50aXR5KCk7XHJcbiAgX3RvdWNoTGFzdFggPSBudWxsO1xyXG4gIF90b3VjaExhc3RZID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxyXG4gICAgcHVibGljIHpvbmU6IE5nWm9uZSxcclxuICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2VcclxuICApIHtcclxuICAgIHN1cGVyKGVsLCB6b25lLCBjZCk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIGdyb3VwUmVzdWx0c0J5OiAobm9kZTogYW55KSA9PiBzdHJpbmcgPSBub2RlID0+IG5vZGUubGFiZWw7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCB6b29tIGxldmVsXHJcbiAgICovXHJcbiAgZ2V0IHpvb21MZXZlbCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmE7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxyXG4gICAqL1xyXG4gIEBJbnB1dCgnem9vbUxldmVsJylcclxuICBzZXQgem9vbUxldmVsKGxldmVsKSB7XHJcbiAgICB0aGlzLnpvb21UbyhOdW1iZXIobGV2ZWwpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgZ2V0IHBhbk9mZnNldFgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IGB4YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBASW5wdXQoJ3Bhbk9mZnNldFgnKVxyXG4gIHNldCBwYW5PZmZzZXRYKHgpIHtcclxuICAgIHRoaXMucGFuVG8oTnVtYmVyKHgpLCBudWxsKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgZ2V0IHBhbk9mZnNldFkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IGB5YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBASW5wdXQoJ3Bhbk9mZnNldFknKVxyXG4gIHNldCBwYW5PZmZzZXRZKHkpIHtcclxuICAgIHRoaXMucGFuVG8obnVsbCwgTnVtYmVyKHkpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudXBkYXRlJCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLnVwZGF0ZSQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jZW50ZXIkKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG4gICAgICAgIHRoaXMuY2VudGVyJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jZW50ZXIoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuem9vbVRvRml0JCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLnpvb21Ub0ZpdCQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKGNoYW5nZXMpO1xyXG4gICAgY29uc3QgeyBsYXlvdXQsIGxheW91dFNldHRpbmdzLCBub2RlcywgY2x1c3RlcnMsIGxpbmtzIH0gPSBjaGFuZ2VzO1xyXG4gICAgdGhpcy5zZXRMYXlvdXQodGhpcy5sYXlvdXQpO1xyXG4gICAgaWYgKGxheW91dFNldHRpbmdzKSB7XHJcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZXMgfHwgY2x1c3RlcnMgfHwgbGlua3MpIHtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExheW91dChsYXlvdXQ6IHN0cmluZyB8IExheW91dCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgaWYgKCFsYXlvdXQpIHtcclxuICAgICAgbGF5b3V0ID0gJ2RhZ3JlJztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbGF5b3V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmxheW91dCA9IHRoaXMubGF5b3V0U2VydmljZS5nZXRMYXlvdXQobGF5b3V0KTtcclxuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExheW91dFNldHRpbmdzKHNldHRpbmdzOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0LnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XHJcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQmFzZSBjbGFzcyB1cGRhdGUgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBkYWcgZ3JhcGhcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLnVwZGF0ZSgpO1xyXG5cclxuICAgIGlmICghdGhpcy5jdXJ2ZSkge1xyXG4gICAgICB0aGlzLmN1cnZlID0gc2hhcGUuY3VydmVCdW5kbGUuYmV0YSgxKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXHJcbiAgICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnNlcmllc0RvbWFpbiA9IHRoaXMuZ2V0U2VyaWVzRG9tYWluKCk7XHJcbiAgICAgIHRoaXMuc2V0Q29sb3JzKCk7XHJcbiAgICAgIHRoaXMubGVnZW5kT3B0aW9ucyA9IHRoaXMuZ2V0TGVnZW5kT3B0aW9ucygpO1xyXG5cclxuICAgICAgdGhpcy5jcmVhdGVHcmFwaCgpO1xyXG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhd3MgdGhlIGdyYXBoIHVzaW5nIGRhZ3JlIGxheW91dHNcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZHJhdygpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5sYXlvdXQgfHwgdHlwZW9mIHRoaXMubGF5b3V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBDYWxjIHZpZXcgZGltcyBmb3IgdGhlIG5vZGVzXHJcbiAgICB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAvLyBSZWNhbGMgdGhlIGxheW91dFxyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQucnVuKHRoaXMuZ3JhcGgpO1xyXG4gICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgIHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcclxuICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XHJcbiAgICAgICAgdGhpcy50aWNrKCk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gICAgcmVzdWx0JC5waXBlKGZpcnN0KGdyYXBoID0+IGdyYXBoLm5vZGVzLmxlbmd0aCA+IDApKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCkpO1xyXG4gIH1cclxuXHJcbiAgdGljaygpIHtcclxuICAgIC8vIFRyYW5zcG9zZXMgdmlldyBvcHRpb25zIHRvIHRoZSBub2RlXHJcbiAgICB0aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7bi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHxcclxuICAgICAgICAwfSlgO1xyXG4gICAgICBpZiAoIW4uZGF0YSkge1xyXG4gICAgICAgIG4uZGF0YSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCFuLmRhdGEuY29sb3Ipe1xyXG4gICAgICAgIFxyXG4gICAgICAgIG4uZGF0YSA9IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgKHRoaXMuZ3JhcGguY2x1c3RlcnMgfHwgW10pLm1hcChuID0+IHtcclxuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7bi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHxcclxuICAgICAgICAwfSlgO1xyXG4gICAgICBpZiAoIW4uZGF0YSkge1xyXG4gICAgICAgIG4uZGF0YSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCFuLmRhdGEuY29sb3Ipe1xyXG4gICAgICAgIFxyXG4gICAgICBuLmRhdGEgPSB7XHJcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdGhlIGxhYmVscyB0byB0aGUgbmV3IHBvc2l0aW9uc1xyXG4gICAgY29uc3QgbmV3TGlua3MgPSBbXTtcclxuICAgIGZvciAoY29uc3QgZWRnZUxhYmVsSWQgaW4gdGhpcy5ncmFwaC5lZGdlTGFiZWxzKSB7XHJcbiAgICAgIGNvbnN0IGVkZ2VMYWJlbCA9IHRoaXMuZ3JhcGguZWRnZUxhYmVsc1tlZGdlTGFiZWxJZF07XHJcblxyXG4gICAgICBjb25zdCBub3JtS2V5ID0gZWRnZUxhYmVsSWQucmVwbGFjZSgvW15cXHctXSovZywgJycpO1xyXG4gICAgICBsZXQgb2xkTGluayA9IHRoaXMuX29sZExpbmtzLmZpbmQob2wgPT4gYCR7b2wuc291cmNlfSR7b2wudGFyZ2V0fWAgPT09IG5vcm1LZXkpO1xyXG4gICAgICBpZiAoIW9sZExpbmspIHtcclxuICAgICAgICBvbGRMaW5rID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKG5sID0+IGAke25sLnNvdXJjZX0ke25sLnRhcmdldH1gID09PSBub3JtS2V5KSB8fCBlZGdlTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9sZExpbmsub2xkTGluZSA9IG9sZExpbmsubGluZTtcclxuXHJcbiAgICAgIGNvbnN0IHBvaW50cyA9IGVkZ2VMYWJlbC5wb2ludHM7XHJcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShwb2ludHMpO1xyXG5cclxuICAgICAgY29uc3QgbmV3TGluayA9IE9iamVjdC5hc3NpZ24oe30sIG9sZExpbmspO1xyXG4gICAgICBuZXdMaW5rLmxpbmUgPSBsaW5lO1xyXG4gICAgICBuZXdMaW5rLnBvaW50cyA9IHBvaW50cztcclxuXHJcbiAgICAgIGNvbnN0IHRleHRQb3MgPSBwb2ludHNbTWF0aC5mbG9vcihwb2ludHMubGVuZ3RoIC8gMildO1xyXG4gICAgICBpZiAodGV4dFBvcykge1xyXG4gICAgICAgIG5ld0xpbmsudGV4dFRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0ZXh0UG9zLnggfHwgMH0sJHt0ZXh0UG9zLnkgfHwgMH0pYDtcclxuICAgICAgfVxyXG5cclxuICAgICAgbmV3TGluay50ZXh0QW5nbGUgPSAwO1xyXG4gICAgICBpZiAoIW5ld0xpbmsub2xkTGluZSkge1xyXG4gICAgICAgIG5ld0xpbmsub2xkTGluZSA9IG5ld0xpbmsubGluZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jYWxjRG9taW5hbnRCYXNlbGluZShuZXdMaW5rKTtcclxuICAgICAgbmV3TGlua3MucHVzaChuZXdMaW5rKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdyYXBoLmVkZ2VzID0gbmV3TGlua3M7XHJcblxyXG4gICAgLy8gTWFwIHRoZSBvbGQgbGlua3MgZm9yIGFuaW1hdGlvbnNcclxuICAgIGlmICh0aGlzLmdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuX29sZExpbmtzID0gdGhpcy5ncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3TCA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICAgIG5ld0wub2xkTGluZSA9IGwubGluZTtcclxuICAgICAgICByZXR1cm4gbmV3TDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBoZWlnaHQvd2lkdGggdG90YWxcclxuICAgIHRoaXMuZ3JhcGhEaW1zLndpZHRoID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnggKyBuLmRpbWVuc2lvbi53aWR0aCkpO1xyXG4gICAgdGhpcy5ncmFwaERpbXMuaGVpZ2h0ID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnkgKyBuLmRpbWVuc2lvbi5oZWlnaHQpKTtcclxuXHJcbiAgICBpZiAodGhpcy5hdXRvWm9vbSkge1xyXG4gICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmF1dG9DZW50ZXIpIHtcclxuICAgICAgLy8gQXV0by1jZW50ZXIgd2hlbiByZW5kZXJpbmdcclxuICAgICAgdGhpcy5jZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5yZWRyYXdMaW5lcygpKTtcclxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNZWFzdXJlcyB0aGUgbm9kZSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZSBkaW1lbnNpb25zXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBhcHBseU5vZGVEaW1lbnNpb25zKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubm9kZUVsZW1lbnRzICYmIHRoaXMubm9kZUVsZW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm5vZGVFbGVtZW50cy5tYXAoZWxlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IGVsZW0ubmF0aXZlRWxlbWVudDtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gbmF0aXZlRWxlbWVudC5pZCk7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0XHJcbiAgICAgICAgbGV0IGRpbXM7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGRpbXMgPSBuYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVIZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IHRoaXMubm9kZUhlaWdodDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gZGltcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4SGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1heEhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNaW5IZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWluSGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVXaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSB0aGlzLm5vZGVXaWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSB3aWR0aFxyXG4gICAgICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGV0IHRleHREaW1zO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIHRleHREaW1zID0gbmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpWzBdLmdldEJCb3goKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gdGV4dERpbXMud2lkdGggKyAyMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gZGltcy53aWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhXaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi53aWR0aCwgdGhpcy5ub2RlTWF4V2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWluV2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5taW4obm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1pbldpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVkcmF3cyB0aGUgbGluZXMgd2hlbiBkcmFnZ2VkIG9yIHZpZXdwb3J0IHVwZGF0ZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHJlZHJhd0xpbmVzKF9hbmltYXRlID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgdGhpcy5saW5rRWxlbWVudHMubWFwKGxpbmtFbCA9PiB7XHJcbiAgICAgIGNvbnN0IGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzLmZpbmQobGluID0+IGxpbi5pZCA9PT0gbGlua0VsLm5hdGl2ZUVsZW1lbnQuaWQpO1xyXG5cclxuICAgICAgaWYgKGVkZ2UpIHtcclxuICAgICAgICBjb25zdCBsaW5rU2VsZWN0aW9uID0gc2VsZWN0KGxpbmtFbC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoJy5saW5lJyk7XHJcbiAgICAgICAgbGlua1NlbGVjdGlvblxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZExpbmUpXHJcbiAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLmxpbmUpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0UGF0aFNlbGVjdGlvbiA9IHNlbGVjdCh0aGlzLmNoYXJ0RWxlbWVudC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoYCMke2VkZ2UuaWR9YCk7XHJcbiAgICAgICAgdGV4dFBhdGhTZWxlY3Rpb25cclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRUZXh0UGF0aClcclxuICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgIC5kdXJhdGlvbihfYW5pbWF0ZSA/IDUwMCA6IDApXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2UudGV4dFBhdGgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGRhZ3JlIGdyYXBoIGVuZ2luZVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgY3JlYXRlR3JhcGgoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xyXG4gICAgY29uc3QgaW5pdGlhbGl6ZU5vZGUgPSBuID0+IHtcclxuICAgICAgaWYgKCFuLmlkKSB7XHJcbiAgICAgICAgbi5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgbi5kaW1lbnNpb24gPSB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIGhlaWdodDogMzBcclxuICAgICAgfTtcclxuICAgICAgbi5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgICAgfTtcclxuICAgICAgbi5kYXRhID0gbi5kYXRhID8gbi5kYXRhIDoge307XHJcbiAgICAgIHJldHVybiBuO1xyXG4gICAgfTtcclxuICAgIHRoaXMuZ3JhcGggPSB7XHJcbiAgICAgIG5vZGVzOiBbLi4udGhpcy5ub2Rlc10ubWFwKGluaXRpYWxpemVOb2RlKSxcclxuICAgICAgY2x1c3RlcnM6IFsuLi4odGhpcy5jbHVzdGVycyB8fCBbXSldLm1hcChpbml0aWFsaXplTm9kZSksXHJcbiAgICAgIGVkZ2VzOiBbLi4udGhpcy5saW5rc10ubWFwKGUgPT4ge1xyXG4gICAgICAgIGlmICghZS5pZCkge1xyXG4gICAgICAgICAgZS5pZCA9IGlkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlO1xyXG4gICAgICB9KVxyXG4gICAgfTtcclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3KCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlIHRoZSB0ZXh0IGRpcmVjdGlvbnMgLyBmbGlwcGluZ1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgY2FsY0RvbWluYW50QmFzZWxpbmUobGluayk6IHZvaWQge1xyXG4gICAgY29uc3QgZmlyc3RQb2ludCA9IGxpbmsucG9pbnRzWzBdO1xyXG4gICAgY29uc3QgbGFzdFBvaW50ID0gbGluay5wb2ludHNbbGluay5wb2ludHMubGVuZ3RoIC0gMV07XHJcbiAgICBsaW5rLm9sZFRleHRQYXRoID0gbGluay50ZXh0UGF0aDtcclxuXHJcbiAgICBpZiAobGFzdFBvaW50LnggPCBmaXJzdFBvaW50LngpIHtcclxuICAgICAgbGluay5kb21pbmFudEJhc2VsaW5lID0gJ3RleHQtYmVmb3JlLWVkZ2UnO1xyXG5cclxuICAgICAgLy8gcmV2ZXJzZSB0ZXh0IHBhdGggZm9yIHdoZW4gaXRzIGZsaXBwZWQgdXBzaWRlIGRvd25cclxuICAgICAgbGluay50ZXh0UGF0aCA9IHRoaXMuZ2VuZXJhdGVMaW5lKFsuLi5saW5rLnBvaW50c10ucmV2ZXJzZSgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWFmdGVyLWVkZ2UnO1xyXG4gICAgICBsaW5rLnRleHRQYXRoID0gbGluay5saW5lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2VuZXJhdGUgdGhlIG5ldyBsaW5lIHBhdGhcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdlbmVyYXRlTGluZShwb2ludHMpOiBhbnkge1xyXG4gICAgY29uc3QgbGluZUZ1bmN0aW9uID0gc2hhcGVcclxuICAgICAgLmxpbmU8YW55PigpXHJcbiAgICAgIC54KGQgPT4gZC54KVxyXG4gICAgICAueShkID0+IGQueSlcclxuICAgICAgLmN1cnZlKHRoaXMuY3VydmUpO1xyXG4gICAgcmV0dXJuIGxpbmVGdW5jdGlvbihwb2ludHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblpvb20oJGV2ZW50OiBNb3VzZUV2ZW50LCBkaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgIGNvbnN0IHpvb21GYWN0b3IgPSAxICsgKGRpcmVjdGlvbiA9PT0gJ2luJyA/IHRoaXMuem9vbVNwZWVkIDogLXRoaXMuem9vbVNwZWVkKTtcclxuXHJcbiAgICAvLyBDaGVjayB0aGF0IHpvb21pbmcgd291bGRuJ3QgcHV0IHVzIG91dCBvZiBib3VuZHNcclxuICAgIGNvbnN0IG5ld1pvb21MZXZlbCA9IHRoaXMuem9vbUxldmVsICogem9vbUZhY3RvcjtcclxuICAgIGlmIChuZXdab29tTGV2ZWwgPD0gdGhpcy5taW5ab29tTGV2ZWwgfHwgbmV3Wm9vbUxldmVsID49IHRoaXMubWF4Wm9vbUxldmVsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB6b29taW5nIGlzIGVuYWJsZWQgb3Igbm90XHJcbiAgICBpZiAoIXRoaXMuZW5hYmxlWm9vbSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGFuT25ab29tID09PSB0cnVlICYmICRldmVudCkge1xyXG4gICAgICAvLyBBYnNvbHV0ZSBtb3VzZSBYL1kgb24gdGhlIHNjcmVlblxyXG4gICAgICBjb25zdCBtb3VzZVggPSAkZXZlbnQuY2xpZW50WDtcclxuICAgICAgY29uc3QgbW91c2VZID0gJGV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgICAvLyBUcmFuc2Zvcm0gdGhlIG1vdXNlIFgvWSBpbnRvIGEgU1ZHIFgvWVxyXG4gICAgICBjb25zdCBzdmcgPSB0aGlzLmNoYXJ0Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XHJcbiAgICAgIGNvbnN0IHN2Z0dyb3VwID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2cuY2hhcnQnKTtcclxuXHJcbiAgICAgIGNvbnN0IHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgIHBvaW50LnggPSBtb3VzZVg7XHJcbiAgICAgIHBvaW50LnkgPSBtb3VzZVk7XHJcbiAgICAgIGNvbnN0IHN2Z1BvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKHN2Z0dyb3VwLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XHJcblxyXG4gICAgICAvLyBQYW56b29tXHJcbiAgICAgIGNvbnN0IE5PX1pPT01fTEVWRUwgPSAxO1xyXG4gICAgICB0aGlzLnBhbihzdmdQb2ludC54LCBzdmdQb2ludC55LCBOT19aT09NX0xFVkVMKTtcclxuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xyXG4gICAgICB0aGlzLnBhbigtc3ZnUG9pbnQueCwgLXN2Z1BvaW50LnksIE5PX1pPT01fTEVWRUwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIGJ5IHgveVxyXG4gICAqXHJcbiAgICovXHJcbiAgcGFuKHg6IG51bWJlciwgeTogbnVtYmVyLCB6b29tTGV2ZWw6IG51bWJlciA9IHRoaXMuem9vbUxldmVsKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRyYW5zbGF0ZSh4IC8gem9vbUxldmVsLCB5IC8gem9vbUxldmVsKSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiB0byBhIGZpeGVkIHgveVxyXG4gICAqXHJcbiAgICovXHJcbiAgcGFuVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZSA9IHggPT09IG51bGwgfHwgeCA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHgpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lIDogTnVtYmVyKHgpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mID0geSA9PT0gbnVsbCB8fCB5ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeSkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmYgOiBOdW1iZXIoeSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gYnkgYSBmYWN0b3JcclxuICAgKlxyXG4gICAqL1xyXG4gIHpvb20oZmFjdG9yOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgc2NhbGUoZmFjdG9yLCBmYWN0b3IpKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSB0byBhIGZpeGVkIGxldmVsXHJcbiAgICpcclxuICAgKi9cclxuICB6b29tVG8obGV2ZWw6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hIDogTnVtYmVyKGxldmVsKTtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA6IE51bWJlcihsZXZlbCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblBhbihldmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW4oZXZlbnQubW92ZW1lbnRYLCBldmVudC5tb3ZlbWVudFkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhZyB3YXMgaW52b2tlZCBmcm9tIGFuIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkRyYWcoZXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZHJhZ2dpbmdOb2RlO1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZyhub2RlLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZS5wb3NpdGlvbi54ICs9IGV2ZW50Lm1vdmVtZW50WCAvIHRoaXMuem9vbUxldmVsO1xyXG4gICAgbm9kZS5wb3NpdGlvbi55ICs9IGV2ZW50Lm1vdmVtZW50WSAvIHRoaXMuem9vbUxldmVsO1xyXG5cclxuICAgIC8vIG1vdmUgdGhlIG5vZGVcclxuICAgIGNvbnN0IHggPSBub2RlLnBvc2l0aW9uLnggLSBub2RlLmRpbWVuc2lvbi53aWR0aCAvIDI7XHJcbiAgICBjb25zdCB5ID0gbm9kZS5wb3NpdGlvbi55IC0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMjtcclxuICAgIG5vZGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3h9LCAke3l9KWA7XHJcblxyXG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHRoaXMuZ3JhcGguZWRnZXMpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGxpbmsudGFyZ2V0ID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgbGluay5zb3VyY2UgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICAobGluay50YXJnZXQgYXMgYW55KS5pZCA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIChsaW5rLnNvdXJjZSBhcyBhbnkpLmlkID09PSBub2RlLmlkXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmxheW91dC51cGRhdGVFZGdlKHRoaXMuZ3JhcGgsIGxpbmspO1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xyXG4gICAgICAgICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgICAgICAgIHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZWRyYXdFZGdlKGxpbmspO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZHJhd0xpbmVzKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHJlZHJhd0VkZ2UoZWRnZTogRWRnZSkge1xyXG4gICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKGVkZ2UucG9pbnRzKTtcclxuICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUoZWRnZSk7XHJcbiAgICBlZGdlLm9sZExpbmUgPSBlZGdlLmxpbmU7XHJcbiAgICBlZGdlLmxpbmUgPSBsaW5lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBlbnRpcmUgdmlldyBmb3IgdGhlIG5ldyBwYW4gcG9zaXRpb25cclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdXBkYXRlVHJhbnNmb3JtKCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSB0b1NWRyh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGNsaWNrZWRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25DbGljayhldmVudCwgb3JpZ2luYWxFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQub3JpZ0V2ZW50ID0gb3JpZ2luYWxFdmVudDtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgY2xpY2tlZFxyXG4gICAqXHJcbiAgICovXHJcbiAgb25Eb3VibGVDbGljayhldmVudCwgb3JpZ2luYWxFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQub3JpZ0V2ZW50ID0gb3JpZ2luYWxFdmVudDtcclxuICAgIGV2ZW50LmlzRG91YmxlQ2xpY2sgPSB0cnVlO1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBmb2N1c2VkXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uQWN0aXZhdGUoZXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCkgPiAtMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbZXZlbnQsIC4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGRlZm9jdXNlZFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25EZWFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCk7XHJcblxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcblxyXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgZG9tYWluIHNlcmllcyBmb3IgdGhlIG5vZGVzXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRTZXJpZXNEb21haW4oKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZXNcclxuICAgICAgLm1hcChkID0+IHRoaXMuZ3JvdXBSZXN1bHRzQnkoZCkpXHJcbiAgICAgIC5yZWR1Y2UoKG5vZGVzOiBzdHJpbmdbXSwgbm9kZSk6IGFueVtdID0+IChub2Rlcy5pbmRleE9mKG5vZGUpICE9PSAtMSA/IG5vZGVzIDogbm9kZXMuY29uY2F0KFtub2RlXSkpLCBbXSlcclxuICAgICAgLnNvcnQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbGlua1xyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB0cmFja0xpbmtCeShpbmRleCwgbGluayk6IGFueSB7XHJcbiAgICByZXR1cm4gbGluay5pZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbm9kZVxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB0cmFja05vZGVCeShpbmRleCwgbm9kZSk6IGFueSB7XHJcbiAgICByZXR1cm4gbm9kZS5pZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGNvbG9ycyB0aGUgbm9kZXNcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgc2V0Q29sb3JzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsICdvcmRpbmFsJywgdGhpcy5zZXJpZXNEb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGxlZ2VuZCBvcHRpb25zXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRMZWdlbmRPcHRpb25zKCk6IGFueSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzY2FsZVR5cGU6ICdvcmRpbmFsJyxcclxuICAgICAgZG9tYWluOiB0aGlzLnNlcmllc0RvbWFpbixcclxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9yc1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG1vdXNlIG1vdmUgZXZlbnQsIHVzZWQgZm9yIHBhbm5pbmcgYW5kIGRyYWdnaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlTW92ZSgkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMub25QYW4oJGV2ZW50KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMub25EcmFnKCRldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBzdGFydCBldmVudCB0byBlbmFibGUgcGFubmluZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uVG91Y2hTdGFydChldmVudCkge1xyXG4gICAgdGhpcy5fdG91Y2hMYXN0WCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICB0aGlzLl90b3VjaExhc3RZID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcclxuXHJcbiAgICB0aGlzLmlzUGFubmluZyA9IHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2htb3ZlJywgWyckZXZlbnQnXSlcclxuICBvblRvdWNoTW92ZSgkZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XHJcbiAgICAgIGNvbnN0IGNsaWVudFggPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgY2xpZW50WSA9ICRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBjb25zdCBtb3ZlbWVudFggPSBjbGllbnRYIC0gdGhpcy5fdG91Y2hMYXN0WDtcclxuICAgICAgY29uc3QgbW92ZW1lbnRZID0gY2xpZW50WSAtIHRoaXMuX3RvdWNoTGFzdFk7XHJcbiAgICAgIHRoaXMuX3RvdWNoTGFzdFggPSBjbGllbnRYO1xyXG4gICAgICB0aGlzLl90b3VjaExhc3RZID0gY2xpZW50WTtcclxuXHJcbiAgICAgIHRoaXMucGFuKG1vdmVtZW50WCwgbW92ZW1lbnRZKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIHRvdWNoIGVuZCBldmVudCB0byBkaXNhYmxlIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblRvdWNoRW5kKGV2ZW50KSB7XHJcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbW91c2UgdXAgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nL2RyYWdnaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcpXHJcbiAgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdFbmQpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnRW5kKHRoaXMuZHJhZ2dpbmdOb2RlLCBldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBub2RlIG1vdXNlIGRvd24gdG8ga2ljayBvZmYgZHJhZ2dpbmdcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uTm9kZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCwgbm9kZTogYW55KTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICB0aGlzLmRyYWdnaW5nTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQobm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2VudGVyIHRoZSBncmFwaCBpbiB0aGUgdmlld3BvcnRcclxuICAgKi9cclxuICBjZW50ZXIoKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhblRvKFxyXG4gICAgICB0aGlzLmRpbXMud2lkdGggLyAyIC0gKHRoaXMuZ3JhcGhEaW1zLndpZHRoICogdGhpcy56b29tTGV2ZWwpIC8gMixcclxuICAgICAgdGhpcy5kaW1zLmhlaWdodCAvIDIgLSAodGhpcy5ncmFwaERpbXMuaGVpZ2h0ICogdGhpcy56b29tTGV2ZWwpIC8gMlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb21zIHRvIGZpdCB0aGUgZW50aWVyIGdyYXBoXHJcbiAgICovXHJcbiAgem9vbVRvRml0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgaGVpZ2h0Wm9vbSA9IHRoaXMuZGltcy5oZWlnaHQgLyB0aGlzLmdyYXBoRGltcy5oZWlnaHQ7XHJcbiAgICBjb25zdCB3aWR0aFpvb20gPSB0aGlzLmRpbXMud2lkdGggLyB0aGlzLmdyYXBoRGltcy53aWR0aDtcclxuICAgIGNvbnN0IHpvb21MZXZlbCA9IE1hdGgubWluKGhlaWdodFpvb20sIHdpZHRoWm9vbSwgMSk7XHJcbiAgICBpZiAoem9vbUxldmVsICE9PSB0aGlzLnpvb21MZXZlbCkge1xyXG4gICAgICB0aGlzLnpvb21MZXZlbCA9IHpvb21MZXZlbDtcclxuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19