import { __extends, __values, __spread, __assign } from 'tslib';
import { layout, graphlib } from 'dagre';
import { Injectable, ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewChildren, ViewEncapsulation, NgZone, ChangeDetectorRef, Directive, NgModule } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { BaseChartComponent, ChartComponent, ColorHelper, calculateViewDimensions, ChartCommonModule, NgxChartsModule } from '@swimlane/ngx-charts';
import { select } from 'd3-selection';
import { curveBundle, line } from 'd3-shape';
import 'd3-transition';
import { Observable, Subscription, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { identity, scale, toSVG, transform, translate } from 'transformation-matrix';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var cache = {};
/**
 * Generates a short id.
 *
 * @return {?}
 */
function id() {
    /** @type {?} */
    var newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    newId = "a" + newId;
    // ensure not already used
    if (!cache[newId]) {
        cache[newId] = true;
        return newId;
    }
    return id();
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var Orientation = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
var DagreLayout = /** @class */ (function () {
    function DagreLayout() {
        this.defaultSettings = {
            orientation: Orientation.LEFT_TO_RIGHT,
            marginX: 20,
            marginY: 20,
            edgePadding: 100,
            rankPadding: 100,
            nodePadding: 50
        };
        this.settings = {};
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    DagreLayout.prototype.run = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        var _loop_1 = function (dagreNodeId) {
            /** @type {?} */
            var dagreNode = this_1.dagreGraph._nodes[dagreNodeId];
            /** @type {?} */
            var node = graph.nodes.find(function (n) { return n.id === dagreNode.id; });
            node.position = {
                x: dagreNode.x,
                y: dagreNode.y
            };
            node.dimension = {
                width: dagreNode.width,
                height: dagreNode.height
            };
        };
        var this_1 = this;
        for (var dagreNodeId in this.dagreGraph._nodes) {
            _loop_1(dagreNodeId);
        }
        return graph;
    };
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    DagreLayout.prototype.updateEdge = /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    function (graph, edge) {
        /** @type {?} */
        var sourceNode = graph.nodes.find(function (n) { return n.id === edge.source; });
        /** @type {?} */
        var targetNode = graph.nodes.find(function (n) { return n.id === edge.target; });
        // determine new arrow position
        /** @type {?} */
        var dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        /** @type {?} */
        var startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
        };
        /** @type {?} */
        var endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
        };
        // generate new points
        edge.points = [startingPoint, endingPoint];
        return graph;
    };
    /**
     * @param {?} graph
     * @return {?}
     */
    DagreLayout.prototype.createDagreGraph = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        var e_1, _a, e_2, _b;
        this.dagreGraph = new graphlib.Graph();
        /** @type {?} */
        var settings = Object.assign({}, this.defaultSettings, this.settings);
        this.dagreGraph.setGraph({
            rankdir: settings.orientation,
            marginx: settings.marginX,
            marginy: settings.marginY,
            edgesep: settings.edgePadding,
            ranksep: settings.rankPadding,
            nodesep: settings.nodePadding,
            align: settings.align,
            acyclicer: settings.acyclicer,
            ranker: settings.ranker
        });
        // Default to assigning a new object as a label for each new edge.
        this.dagreGraph.setDefaultEdgeLabel(function () {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map(function (n) {
            /** @type {?} */
            var node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreEdges = graph.edges.map(function (l) {
            /** @type {?} */
            var newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        try {
            for (var _c = __values(this.dagreNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                var node = _d.value;
                if (!node.width) {
                    node.width = 20;
                }
                if (!node.height) {
                    node.height = 30;
                }
                // update dagre
                this.dagreGraph.setNode(node.id, node);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // update dagre
            for (var _e = __values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
                var edge = _f.value;
                this.dagreGraph.setEdge(edge.source, edge.target);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this.dagreGraph;
    };
    return DagreLayout;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var DagreClusterLayout = /** @class */ (function () {
    function DagreClusterLayout() {
        this.defaultSettings = {
            orientation: Orientation.LEFT_TO_RIGHT,
            marginX: 20,
            marginY: 20,
            edgePadding: 100,
            rankPadding: 100,
            nodePadding: 50
        };
        this.settings = {};
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    DagreClusterLayout.prototype.run = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        var _this = this;
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        /** @type {?} */
        var dagreToOutput = function (node) {
            /** @type {?} */
            var dagreNode = _this.dagreGraph._nodes[node.id];
            return __assign({}, node, { position: {
                    x: dagreNode.x,
                    y: dagreNode.y
                }, dimension: {
                    width: dagreNode.width,
                    height: dagreNode.height
                } });
        };
        graph.clusters = (graph.clusters || []).map(dagreToOutput);
        graph.nodes = graph.nodes.map(dagreToOutput);
        return graph;
    };
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    DagreClusterLayout.prototype.updateEdge = /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    function (graph, edge) {
        /** @type {?} */
        var sourceNode = graph.nodes.find(function (n) { return n.id === edge.source; });
        /** @type {?} */
        var targetNode = graph.nodes.find(function (n) { return n.id === edge.target; });
        // determine new arrow position
        /** @type {?} */
        var dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        /** @type {?} */
        var startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
        };
        /** @type {?} */
        var endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
        };
        // generate new points
        edge.points = [startingPoint, endingPoint];
        return graph;
    };
    /**
     * @param {?} graph
     * @return {?}
     */
    DagreClusterLayout.prototype.createDagreGraph = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        var _this = this;
        var e_1, _a, e_2, _b, e_3, _c;
        this.dagreGraph = new graphlib.Graph({ compound: true });
        /** @type {?} */
        var settings = Object.assign({}, this.defaultSettings, this.settings);
        this.dagreGraph.setGraph({
            rankdir: settings.orientation,
            marginx: settings.marginX,
            marginy: settings.marginY,
            edgesep: settings.edgePadding,
            ranksep: settings.rankPadding,
            nodesep: settings.nodePadding,
            align: settings.align,
            acyclicer: settings.acyclicer,
            ranker: settings.ranker
        });
        // Default to assigning a new object as a label for each new edge.
        this.dagreGraph.setDefaultEdgeLabel(function () {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map(function (n) {
            /** @type {?} */
            var node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreClusters = graph.clusters || [];
        this.dagreEdges = graph.edges.map(function (l) {
            /** @type {?} */
            var newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        try {
            for (var _d = __values(this.dagreNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
                var node = _e.value;
                this.dagreGraph.setNode(node.id, node);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var _loop_1 = function (cluster) {
            this_1.dagreGraph.setNode(cluster.id, cluster);
            cluster.childNodeIds.forEach(function (childNodeId) {
                _this.dagreGraph.setParent(childNodeId, cluster.id);
            });
        };
        var this_1 = this;
        try {
            for (var _f = __values(this.dagreClusters), _g = _f.next(); !_g.done; _g = _f.next()) {
                var cluster = _g.value;
                _loop_1(cluster);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            // update dagre
            for (var _h = __values(this.dagreEdges), _j = _h.next(); !_j.done; _j = _h.next()) {
                var edge = _j.value;
                this.dagreGraph.setEdge(edge.source, edge.target);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return this.dagreGraph;
    };
    return DagreClusterLayout;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var Orientation$1 = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
/** @type {?} */
var DEFAULT_EDGE_NAME = '\x00';
/** @type {?} */
var EDGE_KEY_DELIM = '\x01';
var DagreNodesOnlyLayout = /** @class */ (function () {
    function DagreNodesOnlyLayout() {
        this.defaultSettings = {
            orientation: Orientation$1.LEFT_TO_RIGHT,
            marginX: 20,
            marginY: 20,
            edgePadding: 100,
            rankPadding: 100,
            nodePadding: 50,
            curveDistance: 20
        };
        this.settings = {};
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    DagreNodesOnlyLayout.prototype.run = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        var e_1, _a;
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        var _loop_1 = function (dagreNodeId) {
            /** @type {?} */
            var dagreNode = this_1.dagreGraph._nodes[dagreNodeId];
            /** @type {?} */
            var node = graph.nodes.find(function (n) { return n.id === dagreNode.id; });
            node.position = {
                x: dagreNode.x,
                y: dagreNode.y
            };
            node.dimension = {
                width: dagreNode.width,
                height: dagreNode.height
            };
        };
        var this_1 = this;
        for (var dagreNodeId in this.dagreGraph._nodes) {
            _loop_1(dagreNodeId);
        }
        try {
            for (var _b = __values(graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
                var edge = _c.value;
                this.updateEdge(graph, edge);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return graph;
    };
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    DagreNodesOnlyLayout.prototype.updateEdge = /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    function (graph, edge) {
        var _a, _b, _c, _d;
        /** @type {?} */
        var sourceNode = graph.nodes.find(function (n) { return n.id === edge.source; });
        /** @type {?} */
        var targetNode = graph.nodes.find(function (n) { return n.id === edge.target; });
        /** @type {?} */
        var rankAxis = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x';
        /** @type {?} */
        var orderAxis = rankAxis === 'y' ? 'x' : 'y';
        /** @type {?} */
        var rankDimension = rankAxis === 'y' ? 'height' : 'width';
        // determine new arrow position
        /** @type {?} */
        var dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
        /** @type {?} */
        var startingPoint = (_a = {},
            _a[orderAxis] = sourceNode.position[orderAxis],
            _a[rankAxis] = sourceNode.position[rankAxis] - dir * (sourceNode.dimension[rankDimension] / 2),
            _a);
        /** @type {?} */
        var endingPoint = (_b = {},
            _b[orderAxis] = targetNode.position[orderAxis],
            _b[rankAxis] = targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2),
            _b);
        /** @type {?} */
        var curveDistance = this.settings.curveDistance || this.defaultSettings.curveDistance;
        // generate new points
        edge.points = [
            startingPoint,
            (_c = {},
                _c[orderAxis] = startingPoint[orderAxis],
                _c[rankAxis] = startingPoint[rankAxis] - dir * curveDistance,
                _c),
            (_d = {},
                _d[orderAxis] = endingPoint[orderAxis],
                _d[rankAxis] = endingPoint[rankAxis] + dir * curveDistance,
                _d),
            endingPoint
        ];
        /** @type {?} */
        var edgeLabelId = "" + edge.source + EDGE_KEY_DELIM + edge.target + EDGE_KEY_DELIM + DEFAULT_EDGE_NAME;
        /** @type {?} */
        var matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
        if (matchingEdgeLabel) {
            matchingEdgeLabel.points = edge.points;
        }
        return graph;
    };
    /**
     * @param {?} graph
     * @return {?}
     */
    DagreNodesOnlyLayout.prototype.createDagreGraph = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        var e_2, _a, e_3, _b;
        this.dagreGraph = new graphlib.Graph();
        /** @type {?} */
        var settings = Object.assign({}, this.defaultSettings, this.settings);
        this.dagreGraph.setGraph({
            rankdir: settings.orientation,
            marginx: settings.marginX,
            marginy: settings.marginY,
            edgesep: settings.edgePadding,
            ranksep: settings.rankPadding,
            nodesep: settings.nodePadding,
            align: settings.align,
            acyclicer: settings.acyclicer,
            ranker: settings.ranker
        });
        // Default to assigning a new object as a label for each new edge.
        this.dagreGraph.setDefaultEdgeLabel(function () {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map(function (n) {
            /** @type {?} */
            var node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreEdges = graph.edges.map(function (l) {
            /** @type {?} */
            var newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        try {
            for (var _c = __values(this.dagreNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                var node = _d.value;
                if (!node.width) {
                    node.width = 20;
                }
                if (!node.height) {
                    node.height = 30;
                }
                // update dagre
                this.dagreGraph.setNode(node.id, node);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            // update dagre
            for (var _e = __values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
                var edge = _f.value;
                this.dagreGraph.setEdge(edge.source, edge.target);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return this.dagreGraph;
    };
    return DagreNodesOnlyLayout;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var layouts = {
    dagre: DagreLayout,
    dagreCluster: DagreClusterLayout,
    dagreNodesOnly: DagreNodesOnlyLayout,
};
var LayoutService = /** @class */ (function () {
    function LayoutService() {
    }
    /**
     * @param {?} name
     * @return {?}
     */
    LayoutService.prototype.getLayout = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (layouts[name]) {
            return new layouts[name]();
        }
        else {
            throw new Error("Unknown layout type '" + name + "'");
        }
    };
    LayoutService.decorators = [
        { type: Injectable },
    ];
    return LayoutService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
console.log('EL REF', ElementRef);
var GraphComponent = /** @class */ (function (_super) {
    __extends(GraphComponent, _super);
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
        var layout$$1 = changes.layout, layoutSettings = changes.layoutSettings, nodes = changes.nodes, clusters = changes.clusters, links = changes.links;
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
    function (layout$$1) {
        this.initialized = false;
        if (!layout$$1) {
            layout$$1 = 'dagre';
        }
        if (typeof layout$$1 === 'string') {
            this.layout = this.layoutService.getLayout(layout$$1);
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
            for (var _b = __values(this.subscriptions), _c = _b.next(); !_c.done; _c = _b.next()) {
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
            this.curve = curveBundle.beta(1);
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
            var line$$1 = this_1.generateLine(points);
            /** @type {?} */
            var newLink = Object.assign({}, oldLink);
            newLink.line = line$$1;
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
        this.graphDims.width = Math.max.apply(Math, __spread(this.graph.nodes.map(function (n) { return n.position.x + n.dimension.width; })));
        this.graphDims.height = Math.max.apply(Math, __spread(this.graph.nodes.map(function (n) { return n.position.y + n.dimension.height; })));
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
            nodes: __spread(this.nodes).map(initializeNode),
            clusters: __spread((this.clusters || [])).map(initializeNode),
            edges: __spread(this.links).map(function (e) {
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
            link.textPath = this.generateLine(__spread(link.points).reverse());
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
        var lineFunction = line()
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
            for (var _b = __values(this.graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
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
        var line$$1 = this.generateLine(edge.points);
        this.calcDominantBaseline(edge);
        edge.oldLine = edge.line;
        edge.line = line$$1;
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
        this.activeEntries = __spread([event], this.activeEntries);
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
        this.activeEntries = __spread(this.activeEntries);
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
                    animations: [trigger('link', [transition('* => *', [animate(500, style({ transform: '*' }))])])]
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Mousewheel directive
 * https://github.com/SodhanaLibrary/angular2-examples/blob/master/app/mouseWheelDirective/mousewheel.directive.ts
 *
 * @export
 */
var MouseWheelDirective = /** @class */ (function () {
    function MouseWheelDirective() {
        this.mouseWheelUp = new EventEmitter();
        this.mouseWheelDown = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    MouseWheelDirective.prototype.onMouseWheelChrome = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.mouseWheelFunc(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MouseWheelDirective.prototype.onMouseWheelFirefox = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.mouseWheelFunc(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MouseWheelDirective.prototype.onMouseWheelIE = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.mouseWheelFunc(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MouseWheelDirective.prototype.mouseWheelFunc = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (window.event) {
            event = window.event;
        }
        /** @type {?} */
        var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
        if (delta > 0) {
            this.mouseWheelUp.emit(event);
        }
        else if (delta < 0) {
            this.mouseWheelDown.emit(event);
        }
        // for IE
        event.returnValue = false;
        // for Chrome and Firefox
        if (event.preventDefault) {
            event.preventDefault();
        }
    };
    MouseWheelDirective.decorators = [
        { type: Directive, args: [{ selector: '[mouseWheel]' },] },
    ];
    MouseWheelDirective.propDecorators = {
        mouseWheelUp: [{ type: Output }],
        mouseWheelDown: [{ type: Output }],
        onMouseWheelChrome: [{ type: HostListener, args: ['mousewheel', ['$event'],] }],
        onMouseWheelFirefox: [{ type: HostListener, args: ['DOMMouseScroll', ['$event'],] }],
        onMouseWheelIE: [{ type: HostListener, args: ['onmousewheel', ['$event'],] }]
    };
    return MouseWheelDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var GraphModule = /** @class */ (function () {
    function GraphModule() {
    }
    GraphModule.decorators = [
        { type: NgModule, args: [{
                    imports: [ChartCommonModule],
                    declarations: [GraphComponent, MouseWheelDirective],
                    exports: [GraphComponent, MouseWheelDirective],
                    providers: [LayoutService]
                },] },
    ];
    return GraphModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxGraphModule = /** @class */ (function () {
    function NgxGraphModule() {
    }
    NgxGraphModule.decorators = [
        { type: NgModule, args: [{
                    imports: [NgxChartsModule],
                    exports: [GraphModule]
                },] },
    ];
    return NgxGraphModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxGraphModule, GraphComponent as ɵa, GraphModule as ɵb, LayoutService as ɵc, MouseWheelDirective as ɵd };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWdyYXBoLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi91dGlscy9pZC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZUNsdXN0ZXIudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvbGF5b3V0LnNlcnZpY2UudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2dyYXBoLmNvbXBvbmVudC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbW91c2Utd2hlZWwuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9ncmFwaC5tb2R1bGUudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL25neC1ncmFwaC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY2FjaGUgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBzaG9ydCBpZC5cclxuICpcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpZCgpOiBzdHJpbmcge1xyXG4gIGxldCBuZXdJZCA9ICgnMDAwMCcgKyAoKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygzNiwgNCkpIDw8IDApLnRvU3RyaW5nKDM2KSkuc2xpY2UoLTQpO1xyXG5cclxuICBuZXdJZCA9IGBhJHtuZXdJZH1gO1xyXG5cclxuICAvLyBlbnN1cmUgbm90IGFscmVhZHkgdXNlZFxyXG4gIGlmICghY2FjaGVbbmV3SWRdKSB7XHJcbiAgICBjYWNoZVtuZXdJZF0gPSB0cnVlO1xyXG4gICAgcmV0dXJuIG5ld0lkO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlkKCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XHJcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuXHJcbmV4cG9ydCBlbnVtIE9yaWVudGF0aW9uIHtcclxuICBMRUZUX1RPX1JJR0hUID0gJ0xSJyxcclxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcclxuICBUT1BfVE9fQk9UVE9NID0gJ1RCJyxcclxuICBCT1RUT01fVE9fVE9NID0gJ0JUJ1xyXG59XHJcbmV4cG9ydCBlbnVtIEFsaWdubWVudCB7XHJcbiAgQ0VOVEVSID0gJ0MnLFxyXG4gIFVQX0xFRlQgPSAnVUwnLFxyXG4gIFVQX1JJR0hUID0gJ1VSJyxcclxuICBET1dOX0xFRlQgPSAnREwnLFxyXG4gIERPV05fUklHSFQgPSAnRFInXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XHJcbiAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbjtcclxuICBtYXJnaW5YPzogbnVtYmVyO1xyXG4gIG1hcmdpblk/OiBudW1iZXI7XHJcbiAgZWRnZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgcmFua1BhZGRpbmc/OiBudW1iZXI7XHJcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgYWxpZ24/OiBBbGlnbm1lbnQ7XHJcbiAgYWN5Y2xpY2VyPzogJ2dyZWVkeScgfCB1bmRlZmluZWQ7XHJcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERhZ3JlTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcclxuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7XHJcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcclxuICAgIG1hcmdpblg6IDIwLFxyXG4gICAgbWFyZ2luWTogMjAsXHJcbiAgICBlZGdlUGFkZGluZzogMTAwLFxyXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcclxuICAgIG5vZGVQYWRkaW5nOiA1MFxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgZGFncmVHcmFwaDogYW55O1xyXG4gIGRhZ3JlTm9kZXM6IGFueTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcclxuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcclxuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiBkYWdyZU5vZGUueCxcclxuICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICB9O1xyXG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xyXG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XHJcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXHJcbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ID8gLTEgOiAxO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcclxuICAgICAgeDogc291cmNlTm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgLSBkaXIgKiAoc291cmNlTm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcclxuICAgICAgeDogdGFyZ2V0Tm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiB0YXJnZXROb2RlLnBvc2l0aW9uLnkgKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcblxyXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xyXG4gICAgZWRnZS5wb2ludHMgPSBbc3RhcnRpbmdQb2ludCwgZW5kaW5nUG9pbnRdO1xyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKCk7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XHJcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxyXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxyXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxyXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcclxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXHJcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxyXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXHJcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxyXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlclxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLyogZW1wdHkgKi9cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XHJcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcclxuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XHJcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcclxuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xyXG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdMaW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xyXG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcclxuICAgICAgICBub2RlLndpZHRoID0gMjA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xyXG4gICAgICAgIG5vZGUuaGVpZ2h0ID0gMzA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgRGFncmVTZXR0aW5ncywgT3JpZW50YXRpb24gfSBmcm9tICcuL2RhZ3JlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdyZUNsdXN0ZXJMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHtcclxuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxyXG4gICAgbWFyZ2luWDogMjAsXHJcbiAgICBtYXJnaW5ZOiAyMCxcclxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXHJcbiAgICByYW5rUGFkZGluZzogMTAwLFxyXG4gICAgbm9kZVBhZGRpbmc6IDUwXHJcbiAgfTtcclxuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBkYWdyZUdyYXBoOiBhbnk7XHJcbiAgZGFncmVOb2RlczogTm9kZVtdO1xyXG4gIGRhZ3JlQ2x1c3RlcnM6IENsdXN0ZXJOb2RlW107XHJcbiAgZGFncmVFZGdlczogYW55O1xyXG5cclxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xyXG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcclxuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xyXG5cclxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XHJcblxyXG4gICAgY29uc3QgZGFncmVUb091dHB1dCA9IG5vZGUgPT4ge1xyXG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW25vZGUuaWRdO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLm5vZGUsXHJcbiAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgIHg6IGRhZ3JlTm9kZS54LFxyXG4gICAgICAgICAgeTogZGFncmVOb2RlLnlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpbWVuc2lvbjoge1xyXG4gICAgICAgICAgd2lkdGg6IGRhZ3JlTm9kZS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgICBncmFwaC5jbHVzdGVycyA9IChncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKGRhZ3JlVG9PdXRwdXQpO1xyXG4gICAgZ3JhcGgubm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAoZGFncmVUb091dHB1dCk7XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG5cclxuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cclxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb24ueSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiBzb3VyY2VOb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHNvdXJjZU5vZGUucG9zaXRpb24ueSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiB0YXJnZXROb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXHJcbiAgICBlZGdlLnBvaW50cyA9IFtzdGFydGluZ1BvaW50LCBlbmRpbmdQb2ludF07XHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoeyBjb21wb3VuZDogdHJ1ZSB9KTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcclxuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXHJcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXHJcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXHJcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxyXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcclxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXHJcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcclxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXHJcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvKiBlbXB0eSAqL1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKChuOiBOb2RlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xyXG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XHJcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xyXG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XHJcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlQ2x1c3RlcnMgPSBncmFwaC5jbHVzdGVycyB8fCBbXTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcclxuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3TGluaztcclxuICAgIH0pO1xyXG5cclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBjbHVzdGVyIG9mIHRoaXMuZGFncmVDbHVzdGVycykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShjbHVzdGVyLmlkLCBjbHVzdGVyKTtcclxuICAgICAgY2x1c3Rlci5jaGlsZE5vZGVJZHMuZm9yRWFjaChjaGlsZE5vZGVJZCA9PiB7XHJcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldFBhcmVudChjaGlsZE5vZGVJZCwgY2x1c3Rlci5pZCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcblxyXG5leHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XHJcbiAgTEVGVF9UT19SSUdIVCA9ICdMUicsXHJcbiAgUklHSFRfVE9fTEVGVCA9ICdSTCcsXHJcbiAgVE9QX1RPX0JPVFRPTSA9ICdUQicsXHJcbiAgQk9UVE9NX1RPX1RPTSA9ICdCVCdcclxufVxyXG5leHBvcnQgZW51bSBBbGlnbm1lbnQge1xyXG4gIENFTlRFUiA9ICdDJyxcclxuICBVUF9MRUZUID0gJ1VMJyxcclxuICBVUF9SSUdIVCA9ICdVUicsXHJcbiAgRE9XTl9MRUZUID0gJ0RMJyxcclxuICBET1dOX1JJR0hUID0gJ0RSJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlU2V0dGluZ3Mge1xyXG4gIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb247XHJcbiAgbWFyZ2luWD86IG51bWJlcjtcclxuICBtYXJnaW5ZPzogbnVtYmVyO1xyXG4gIGVkZ2VQYWRkaW5nPzogbnVtYmVyO1xyXG4gIHJhbmtQYWRkaW5nPzogbnVtYmVyO1xyXG4gIG5vZGVQYWRkaW5nPzogbnVtYmVyO1xyXG4gIGFsaWduPzogQWxpZ25tZW50O1xyXG4gIGFjeWNsaWNlcj86ICdncmVlZHknIHwgdW5kZWZpbmVkO1xyXG4gIHJhbmtlcj86ICduZXR3b3JrLXNpbXBsZXgnIHwgJ3RpZ2h0LXRyZWUnIHwgJ2xvbmdlc3QtcGF0aCc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVOb2Rlc09ubHlTZXR0aW5ncyBleHRlbmRzIERhZ3JlU2V0dGluZ3Mge1xyXG4gIGN1cnZlRGlzdGFuY2U/OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfRURHRV9OQU1FID0gJ1xceDAwJztcclxuY29uc3QgR1JBUEhfTk9ERSA9ICdcXHgwMCc7XHJcbmNvbnN0IEVER0VfS0VZX0RFTElNID0gJ1xceDAxJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdyZU5vZGVzT25seUxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XHJcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZU5vZGVzT25seVNldHRpbmdzID0ge1xyXG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXHJcbiAgICBtYXJnaW5YOiAyMCxcclxuICAgIG1hcmdpblk6IDIwLFxyXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcclxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXHJcbiAgICBub2RlUGFkZGluZzogNTAsXHJcbiAgICBjdXJ2ZURpc3RhbmNlOiAyMFxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgZGFncmVHcmFwaDogYW55O1xyXG4gIGRhZ3JlTm9kZXM6IGFueTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcclxuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcclxuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiBkYWdyZU5vZGUueCxcclxuICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICB9O1xyXG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIGdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRWRnZShncmFwaCwgZWRnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG4gICAgY29uc3QgcmFua0F4aXM6ICd4JyB8ICd5JyA9IHRoaXMuc2V0dGluZ3Mub3JpZW50YXRpb24gPT09ICdCVCcgfHwgdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ1RCJyA/ICd5JyA6ICd4JztcclxuICAgIGNvbnN0IG9yZGVyQXhpczogJ3gnIHwgJ3knID0gcmFua0F4aXMgPT09ICd5JyA/ICd4JyA6ICd5JztcclxuICAgIGNvbnN0IHJhbmtEaW1lbnNpb24gPSByYW5rQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxyXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICBbb3JkZXJBeGlzXTogc291cmNlTm9kZS5wb3NpdGlvbltvcmRlckF4aXNdLFxyXG4gICAgICBbcmFua0F4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XHJcbiAgICAgIFtvcmRlckF4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXHJcbiAgICAgIFtyYW5rQXhpc106IHRhcmdldE5vZGUucG9zaXRpb25bcmFua0F4aXNdICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uW3JhbmtEaW1lbnNpb25dIC8gMilcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgY3VydmVEaXN0YW5jZSA9IHRoaXMuc2V0dGluZ3MuY3VydmVEaXN0YW5jZSB8fCB0aGlzLmRlZmF1bHRTZXR0aW5ncy5jdXJ2ZURpc3RhbmNlO1xyXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xyXG4gICAgZWRnZS5wb2ludHMgPSBbXHJcbiAgICAgIHN0YXJ0aW5nUG9pbnQsXHJcbiAgICAgIHtcclxuICAgICAgICBbb3JkZXJBeGlzXTogc3RhcnRpbmdQb2ludFtvcmRlckF4aXNdLFxyXG4gICAgICAgIFtyYW5rQXhpc106IHN0YXJ0aW5nUG9pbnRbcmFua0F4aXNdIC0gZGlyICogY3VydmVEaXN0YW5jZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgW29yZGVyQXhpc106IGVuZGluZ1BvaW50W29yZGVyQXhpc10sXHJcbiAgICAgICAgW3JhbmtBeGlzXTogZW5kaW5nUG9pbnRbcmFua0F4aXNdICsgZGlyICogY3VydmVEaXN0YW5jZVxyXG4gICAgICB9LFxyXG4gICAgICBlbmRpbmdQb2ludFxyXG4gICAgXTtcclxuICAgIGNvbnN0IGVkZ2VMYWJlbElkID0gYCR7ZWRnZS5zb3VyY2V9JHtFREdFX0tFWV9ERUxJTX0ke2VkZ2UudGFyZ2V0fSR7RURHRV9LRVlfREVMSU19JHtERUZBVUxUX0VER0VfTkFNRX1gO1xyXG4gICAgY29uc3QgbWF0Y2hpbmdFZGdlTGFiZWwgPSBncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcclxuICAgIGlmIChtYXRjaGluZ0VkZ2VMYWJlbCkge1xyXG4gICAgICBtYXRjaGluZ0VkZ2VMYWJlbC5wb2ludHMgPSBlZGdlLnBvaW50cztcclxuICAgIH1cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcclxuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCgpO1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xyXG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcclxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcclxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcclxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXHJcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxyXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcclxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxyXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcclxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXJcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8qIGVtcHR5ICovXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAobiA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xyXG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XHJcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xyXG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XHJcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcclxuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3TGluaztcclxuICAgIH0pO1xyXG5cclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcclxuICAgICAgaWYgKCFub2RlLndpZHRoKSB7XHJcbiAgICAgICAgbm9kZS53aWR0aCA9IDIwO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbm9kZS5oZWlnaHQpIHtcclxuICAgICAgICBub2RlLmhlaWdodCA9IDMwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgdGhpcy5kYWdyZUVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgRGFncmVMYXlvdXQgfSBmcm9tICcuL2RhZ3JlJztcclxuaW1wb3J0IHsgRGFncmVDbHVzdGVyTGF5b3V0IH0gZnJvbSAnLi9kYWdyZUNsdXN0ZXInO1xyXG5pbXBvcnQgeyBEYWdyZU5vZGVzT25seUxheW91dCB9IGZyb20gJy4vZGFncmVOb2Rlc09ubHknO1xyXG5cclxuY29uc3QgbGF5b3V0cyA9IHtcclxuICBkYWdyZTogRGFncmVMYXlvdXQsXHJcbiAgZGFncmVDbHVzdGVyOiBEYWdyZUNsdXN0ZXJMYXlvdXQsXHJcbiAgZGFncmVOb2Rlc09ubHk6IERhZ3JlTm9kZXNPbmx5TGF5b3V0LFxyXG59O1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTGF5b3V0U2VydmljZSB7XHJcbiAgZ2V0TGF5b3V0KG5hbWU6IHN0cmluZyk6IExheW91dCB7XHJcbiAgICBpZiAobGF5b3V0c1tuYW1lXSkge1xyXG4gICAgICByZXR1cm4gbmV3IGxheW91dHNbbmFtZV0oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBsYXlvdXQgdHlwZSAnJHtuYW1lfSdgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gcmVuYW1lIHRyYW5zaXRpb24gZHVlIHRvIGNvbmZsaWN0IHdpdGggZDMgdHJhbnNpdGlvblxyXG5pbXBvcnQgeyBhbmltYXRlLCBzdHlsZSwgdHJhbnNpdGlvbiBhcyBuZ1RyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBDb250ZW50Q2hpbGQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFF1ZXJ5TGlzdCxcclxuICBUZW1wbGF0ZVJlZixcclxuICBWaWV3Q2hpbGQsXHJcbiAgVmlld0NoaWxkcmVuLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG4gIE5nWm9uZSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBPbkNoYW5nZXMsXHJcbiAgU2ltcGxlQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEJhc2VDaGFydENvbXBvbmVudCxcclxuICBDaGFydENvbXBvbmVudCxcclxuICBDb2xvckhlbHBlcixcclxuICBWaWV3RGltZW5zaW9ucyxcclxuICBjYWxjdWxhdGVWaWV3RGltZW5zaW9uc1xyXG59IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0ICogYXMgc2hhcGUgZnJvbSAnZDMtc2hhcGUnO1xyXG5pbXBvcnQgJ2QzLXRyYW5zaXRpb24nO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBpZGVudGl0eSwgc2NhbGUsIHRvU1ZHLCB0cmFuc2Zvcm0sIHRyYW5zbGF0ZSB9IGZyb20gJ3RyYW5zZm9ybWF0aW9uLW1hdHJpeCc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi9tb2RlbHMvbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcblxyXG5jb25zb2xlLmxvZygnRUwgUkVGJywgRWxlbWVudFJlZik7XHJcblxyXG4vKipcclxuICogTWF0cml4XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE1hdHJpeCB7XHJcbiAgYTogbnVtYmVyO1xyXG4gIGI6IG51bWJlcjtcclxuICBjOiBudW1iZXI7XHJcbiAgZDogbnVtYmVyO1xyXG4gIGU6IG51bWJlcjtcclxuICBmOiBudW1iZXI7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdyYXBoJyxcclxuICBzdHlsZXM6IFtgLmdyYXBoey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZ3JhcGggLmVkZ2V7c3Ryb2tlOiM2NjY7ZmlsbDpub25lfS5ncmFwaCAuZWRnZSAuZWRnZS1sYWJlbHtzdHJva2U6bm9uZTtmb250LXNpemU6MTJweDtmaWxsOiMyNTFlMWV9LmdyYXBoIC5wYW5uaW5nLXJlY3R7ZmlsbDp0cmFuc3BhcmVudDtjdXJzb3I6bW92ZX0uZ3JhcGggLm5vZGUtZ3JvdXAgLm5vZGU6Zm9jdXN7b3V0bGluZTowfS5ncmFwaCAuY2x1c3RlciByZWN0e29wYWNpdHk6LjJ9YF0sXHJcbiAgdGVtcGxhdGU6IGBcclxuICA8bmd4LWNoYXJ0cy1jaGFydCBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIiBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIiBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCIgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQsIHVuZGVmaW5lZClcIlxyXG4gIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiIChsZWdlbmRMYWJlbERlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIiBtb3VzZVdoZWVsIChtb3VzZVdoZWVsVXApPVwib25ab29tKCRldmVudCwgJ2luJylcIlxyXG4gIChtb3VzZVdoZWVsRG93bik9XCJvblpvb20oJGV2ZW50LCAnb3V0JylcIj5cclxuICA8c3ZnOmcgKm5nSWY9XCJpbml0aWFsaXplZCAmJiBncmFwaFwiIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxyXG4gICAgY2xhc3M9XCJncmFwaCBjaGFydFwiPlxyXG4gICAgPGRlZnM+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImRlZnNUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRlZnNUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8c3ZnOnBhdGggY2xhc3M9XCJ0ZXh0LXBhdGhcIiAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlc1wiIFthdHRyLmRdPVwibGluay50ZXh0UGF0aFwiIFthdHRyLmlkXT1cImxpbmsuaWRcIj5cclxuICAgICAgPC9zdmc6cGF0aD5cclxuICAgIDwvZGVmcz5cclxuICAgIDxzdmc6cmVjdCBjbGFzcz1cInBhbm5pbmctcmVjdFwiIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKiAxMDBcIiBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKiAxMDBcIiBbYXR0ci50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZSgnICsgKCgtZGltcy53aWR0aCB8fCAwKSAqIDUwKSArJywnICsgKCgtZGltcy5oZWlnaHQgfHwgMCkgKjUwKSArICcpJyBcIlxyXG4gICAgICAobW91c2Vkb3duKT1cImlzUGFubmluZyA9IHRydWVcIiAvPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJjbHVzdGVyc1wiPlxyXG4gICAgICAgIDxzdmc6ZyAjY2x1c3RlckVsZW1lbnQgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGguY2x1c3RlcnM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCIgY2xhc3M9XCJub2RlLWdyb3VwXCIgW2lkXT1cIm5vZGUuaWRcIiBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxyXG4gICAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUgfVwiPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDxzdmc6ZyAqbmdJZj1cIiFjbHVzdGVyVGVtcGxhdGVcIiBjbGFzcz1cIm5vZGUgY2x1c3RlclwiPlxyXG4gICAgICAgICAgICA8c3ZnOnJlY3QgW2F0dHIud2lkdGhdPVwibm9kZS5kaW1lbnNpb24ud2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0XCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCIgLz5cclxuICAgICAgICAgICAgPHN2Zzp0ZXh0IGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIiBbYXR0ci54XT1cIjEwXCIgW2F0dHIueV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCI+e3tub2RlLmxhYmVsfX08L3N2Zzp0ZXh0PlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJsaW5rc1wiPlxyXG4gICAgICA8c3ZnOmcgI2xpbmtFbGVtZW50ICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzOyB0cmFja0J5OiB0cmFja0xpbmtCeVwiIGNsYXNzPVwibGluay1ncm91cFwiIFtpZF09XCJsaW5rLmlkXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBsaW5rIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxzdmc6cGF0aCAqbmdJZj1cIiFsaW5rVGVtcGxhdGVcIiBjbGFzcz1cImVkZ2VcIiBbYXR0ci5kXT1cImxpbmsubGluZVwiIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gICAgPHN2ZzpnIGNsYXNzPVwibm9kZXNcIj5cclxuICAgICAgPHN2ZzpnICNub2RlRWxlbWVudCAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5ub2RlczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIiBjbGFzcz1cIm5vZGUtZ3JvdXBcIiBbaWRdPVwibm9kZS5pZFwiIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCIgKG1vdXNlZG93bik9XCJvbk5vZGVNb3VzZURvd24oJGV2ZW50LCBub2RlKVwiIChkYmxjbGljayk9XCJvbkRvdWJsZUNsaWNrKG5vZGUsJGV2ZW50KVwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8c3ZnOmNpcmNsZSAqbmdJZj1cIiFub2RlVGVtcGxhdGVcIiByPVwiMTBcIiBbYXR0ci5jeF09XCJub2RlLmRpbWVuc2lvbi53aWR0aCAvIDJcIiBbYXR0ci5jeV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCJcclxuICAgICAgICAvPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICA8L3N2ZzpnPlxyXG48L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdsaW5rJywgW25nVHJhbnNpdGlvbignKiA9PiAqJywgW2FuaW1hdGUoNTAwLCBzdHlsZSh7IHRyYW5zZm9ybTogJyonIH0pKV0pXSldXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcmFwaENvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZXM6IE5vZGVbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGlua3M6IEVkZ2VbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY3VydmU6IGFueTtcclxuXHJcbiAgQElucHV0KClcclxuICBkcmFnZ2luZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWF4SGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1pbkhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNaW5XaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNYXhXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbm5pbmdFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBlbmFibGVab29tID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tU3BlZWQgPSAwLjE7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWluWm9vbUxldmVsID0gMC4xO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1heFpvb21MZXZlbCA9IDQuMDtcclxuXHJcbiAgQElucHV0KClcclxuICBhdXRvWm9vbSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbk9uWm9vbSA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYXV0b0NlbnRlciA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHVwZGF0ZSQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICBjZW50ZXIkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgem9vbVRvRml0JDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dDogc3RyaW5nIHwgTGF5b3V0O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dFNldHRpbmdzOiBhbnk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2xpbmtUZW1wbGF0ZScpXHJcbiAgbGlua1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdub2RlVGVtcGxhdGUnKVxyXG4gIG5vZGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnY2x1c3RlclRlbXBsYXRlJylcclxuICBjbHVzdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2RlZnNUZW1wbGF0ZScpXHJcbiAgZGVmc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAVmlld0NoaWxkKENoYXJ0Q29tcG9uZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcclxuICBjaGFydDogRWxlbWVudFJlZjtcclxuXHJcbiAgQFZpZXdDaGlsZHJlbignbm9kZUVsZW1lbnQnKVxyXG4gIG5vZGVFbGVtZW50czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xyXG5cclxuICBAVmlld0NoaWxkcmVuKCdsaW5rRWxlbWVudCcpXHJcbiAgbGlua0VsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XHJcblxyXG4gIGdyYXBoU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XHJcbiAgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcclxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xyXG4gIG1hcmdpbiA9IFswLCAwLCAwLCAwXTtcclxuICByZXN1bHRzID0gW107XHJcbiAgc2VyaWVzRG9tYWluOiBhbnk7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgbGVnZW5kT3B0aW9uczogYW55O1xyXG4gIGlzUGFubmluZyA9IGZhbHNlO1xyXG4gIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICBkcmFnZ2luZ05vZGU6IE5vZGU7XHJcbiAgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICBncmFwaDogR3JhcGg7XHJcbiAgZ3JhcGhEaW1zOiBhbnkgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcclxuICBfb2xkTGlua3M6IEVkZ2VbXSA9IFtdO1xyXG4gIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBNYXRyaXggPSBpZGVudGl0eSgpO1xyXG4gIF90b3VjaExhc3RYID0gbnVsbDtcclxuICBfdG91Y2hMYXN0WSA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcclxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXHJcbiAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgcHJpdmF0ZSBsYXlvdXRTZXJ2aWNlOiBMYXlvdXRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICBzdXBlcihlbCwgem9uZSwgY2QpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBncm91cFJlc3VsdHNCeTogKG5vZGU6IGFueSkgPT4gc3RyaW5nID0gbm9kZSA9PiBub2RlLmxhYmVsO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxyXG4gICAqL1xyXG4gIGdldCB6b29tTGV2ZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcclxuICAgKi9cclxuICBASW5wdXQoJ3pvb21MZXZlbCcpXHJcbiAgc2V0IHpvb21MZXZlbChsZXZlbCkge1xyXG4gICAgdGhpcy56b29tVG8oTnVtYmVyKGxldmVsKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHhgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIGdldCBwYW5PZmZzZXRYKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgQElucHV0KCdwYW5PZmZzZXRYJylcclxuICBzZXQgcGFuT2Zmc2V0WCh4KSB7XHJcbiAgICB0aGlzLnBhblRvKE51bWJlcih4KSwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHlgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIGdldCBwYW5PZmZzZXRZKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgQElucHV0KCdwYW5PZmZzZXRZJylcclxuICBzZXQgcGFuT2Zmc2V0WSh5KSB7XHJcbiAgICB0aGlzLnBhblRvKG51bGwsIE51bWJlcih5KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnVwZGF0ZSQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy51cGRhdGUkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY2VudGVyJCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLmNlbnRlciQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2VudGVyKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnpvb21Ub0ZpdCQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy56b29tVG9GaXQkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZyhjaGFuZ2VzKTtcclxuICAgIGNvbnN0IHsgbGF5b3V0LCBsYXlvdXRTZXR0aW5ncywgbm9kZXMsIGNsdXN0ZXJzLCBsaW5rcyB9ID0gY2hhbmdlcztcclxuICAgIHRoaXMuc2V0TGF5b3V0KHRoaXMubGF5b3V0KTtcclxuICAgIGlmIChsYXlvdXRTZXR0aW5ncykge1xyXG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgaWYgKG5vZGVzIHx8IGNsdXN0ZXJzIHx8IGxpbmtzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMYXlvdXQobGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgIGlmICghbGF5b3V0KSB7XHJcbiAgICAgIGxheW91dCA9ICdkYWdyZSc7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGxheW91dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5sYXlvdXQgPSB0aGlzLmxheW91dFNlcnZpY2UuZ2V0TGF5b3V0KGxheW91dCk7XHJcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMYXlvdXRTZXR0aW5ncyhzZXR0aW5nczogYW55KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmxheW91dC5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xyXG4gICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhc2UgY2xhc3MgdXBkYXRlIGltcGxlbWVudGF0aW9uIGZvciB0aGUgZGFnIGdyYXBoXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBzdXBlci51cGRhdGUoKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuY3VydmUpIHtcclxuICAgICAgdGhpcy5jdXJ2ZSA9IHNoYXBlLmN1cnZlQnVuZGxlLmJldGEoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luLFxyXG4gICAgICAgIHNob3dMZWdlbmQ6IHRoaXMubGVnZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zZXJpZXNEb21haW4gPSB0aGlzLmdldFNlcmllc0RvbWFpbigpO1xyXG4gICAgICB0aGlzLnNldENvbG9ycygpO1xyXG4gICAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcclxuXHJcbiAgICAgIHRoaXMuY3JlYXRlR3JhcGgoKTtcclxuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYXdzIHRoZSBncmFwaCB1c2luZyBkYWdyZSBsYXlvdXRzXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGRyYXcoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMubGF5b3V0IHx8IHR5cGVvZiB0aGlzLmxheW91dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gQ2FsYyB2aWV3IGRpbXMgZm9yIHRoZSBub2Rlc1xyXG4gICAgdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCk7XHJcblxyXG4gICAgLy8gUmVjYWxjIHRoZSBsYXlvdXRcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnJ1bih0aGlzLmdyYXBoKTtcclxuICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcclxuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxyXG4gICAgICByZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xyXG4gICAgICAgIHRoaXMudGljaygpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICAgIHJlc3VsdCQucGlwZShmaXJzdChncmFwaCA9PiBncmFwaC5ub2Rlcy5sZW5ndGggPiAwKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpKTtcclxuICB9XHJcblxyXG4gIHRpY2soKSB7XHJcbiAgICAvLyBUcmFuc3Bvc2VzIHZpZXcgb3B0aW9ucyB0byB0aGUgbm9kZVxyXG4gICAgdGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiB7XHJcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke24ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8XHJcbiAgICAgICAgMH0pYDtcclxuICAgICAgaWYgKCFuLmRhdGEpIHtcclxuICAgICAgICBuLmRhdGEgPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBpZighbi5kYXRhLmNvbG9yKXtcclxuICAgICAgICBcclxuICAgICAgICBuLmRhdGEgPSB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnMuZ2V0Q29sb3IodGhpcy5ncm91cFJlc3VsdHNCeShuKSlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICh0aGlzLmdyYXBoLmNsdXN0ZXJzIHx8IFtdKS5tYXAobiA9PiB7XHJcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke24ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8XHJcbiAgICAgICAgMH0pYDtcclxuICAgICAgaWYgKCFuLmRhdGEpIHtcclxuICAgICAgICBuLmRhdGEgPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBpZighbi5kYXRhLmNvbG9yKXtcclxuICAgICAgICBcclxuICAgICAgbi5kYXRhID0ge1xyXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVXBkYXRlIHRoZSBsYWJlbHMgdG8gdGhlIG5ldyBwb3NpdGlvbnNcclxuICAgIGNvbnN0IG5ld0xpbmtzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGVkZ2VMYWJlbElkIGluIHRoaXMuZ3JhcGguZWRnZUxhYmVscykge1xyXG4gICAgICBjb25zdCBlZGdlTGFiZWwgPSB0aGlzLmdyYXBoLmVkZ2VMYWJlbHNbZWRnZUxhYmVsSWRdO1xyXG5cclxuICAgICAgY29uc3Qgbm9ybUtleSA9IGVkZ2VMYWJlbElkLnJlcGxhY2UoL1teXFx3LV0qL2csICcnKTtcclxuICAgICAgbGV0IG9sZExpbmsgPSB0aGlzLl9vbGRMaW5rcy5maW5kKG9sID0+IGAke29sLnNvdXJjZX0ke29sLnRhcmdldH1gID09PSBub3JtS2V5KTtcclxuICAgICAgaWYgKCFvbGRMaW5rKSB7XHJcbiAgICAgICAgb2xkTGluayA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChubCA9PiBgJHtubC5zb3VyY2V9JHtubC50YXJnZXR9YCA9PT0gbm9ybUtleSkgfHwgZWRnZUxhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvbGRMaW5rLm9sZExpbmUgPSBvbGRMaW5rLmxpbmU7XHJcblxyXG4gICAgICBjb25zdCBwb2ludHMgPSBlZGdlTGFiZWwucG9pbnRzO1xyXG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUocG9pbnRzKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld0xpbmsgPSBPYmplY3QuYXNzaWduKHt9LCBvbGRMaW5rKTtcclxuICAgICAgbmV3TGluay5saW5lID0gbGluZTtcclxuICAgICAgbmV3TGluay5wb2ludHMgPSBwb2ludHM7XHJcblxyXG4gICAgICBjb25zdCB0ZXh0UG9zID0gcG9pbnRzW01hdGguZmxvb3IocG9pbnRzLmxlbmd0aCAvIDIpXTtcclxuICAgICAgaWYgKHRleHRQb3MpIHtcclxuICAgICAgICBuZXdMaW5rLnRleHRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGV4dFBvcy54IHx8IDB9LCR7dGV4dFBvcy55IHx8IDB9KWA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5ld0xpbmsudGV4dEFuZ2xlID0gMDtcclxuICAgICAgaWYgKCFuZXdMaW5rLm9sZExpbmUpIHtcclxuICAgICAgICBuZXdMaW5rLm9sZExpbmUgPSBuZXdMaW5rLmxpbmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUobmV3TGluayk7XHJcbiAgICAgIG5ld0xpbmtzLnB1c2gobmV3TGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ncmFwaC5lZGdlcyA9IG5ld0xpbmtzO1xyXG5cclxuICAgIC8vIE1hcCB0aGUgb2xkIGxpbmtzIGZvciBhbmltYXRpb25zXHJcbiAgICBpZiAodGhpcy5ncmFwaC5lZGdlcykge1xyXG4gICAgICB0aGlzLl9vbGRMaW5rcyA9IHRoaXMuZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld0wgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgICBuZXdMLm9sZExpbmUgPSBsLmxpbmU7XHJcbiAgICAgICAgcmV0dXJuIG5ld0w7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSB0aGUgaGVpZ2h0L3dpZHRoIHRvdGFsXHJcbiAgICB0aGlzLmdyYXBoRGltcy53aWR0aCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi54ICsgbi5kaW1lbnNpb24ud2lkdGgpKTtcclxuICAgIHRoaXMuZ3JhcGhEaW1zLmhlaWdodCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi55ICsgbi5kaW1lbnNpb24uaGVpZ2h0KSk7XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b1pvb20pIHtcclxuICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hdXRvQ2VudGVyKSB7XHJcbiAgICAgIC8vIEF1dG8tY2VudGVyIHdoZW4gcmVuZGVyaW5nXHJcbiAgICAgIHRoaXMuY2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMucmVkcmF3TGluZXMoKSk7XHJcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWVhc3VyZXMgdGhlIG5vZGUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGUgZGltZW5zaW9uc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgYXBwbHlOb2RlRGltZW5zaW9ucygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm5vZGVFbGVtZW50cyAmJiB0aGlzLm5vZGVFbGVtZW50cy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5ub2RlRWxlbWVudHMubWFwKGVsZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBlbGVtLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5hdGl2ZUVsZW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGhlaWdodFxyXG4gICAgICAgIGxldCBkaW1zO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBkaW1zID0gbmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlSGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSB0aGlzLm5vZGVIZWlnaHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IGRpbXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1heEhlaWdodCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24uaGVpZ2h0LCB0aGlzLm5vZGVNYXhIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWluSGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1pbihub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1pbkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlV2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gdGhpcy5ub2RlV2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGhcclxuICAgICAgICAgIGlmIChuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0RGltcztcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICB0ZXh0RGltcyA9IG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKVswXS5nZXRCQm94KCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IHRleHREaW1zLndpZHRoICsgMjA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IGRpbXMud2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4V2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1heFdpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbldpZHRoKSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNaW5XaWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZHJhd3MgdGhlIGxpbmVzIHdoZW4gZHJhZ2dlZCBvciB2aWV3cG9ydCB1cGRhdGVkXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICByZWRyYXdMaW5lcyhfYW5pbWF0ZSA9IHRydWUpOiB2b2lkIHtcclxuICAgIHRoaXMubGlua0VsZW1lbnRzLm1hcChsaW5rRWwgPT4ge1xyXG4gICAgICBjb25zdCBlZGdlID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKGxpbiA9PiBsaW4uaWQgPT09IGxpbmtFbC5uYXRpdmVFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgIGlmIChlZGdlKSB7XHJcbiAgICAgICAgY29uc3QgbGlua1NlbGVjdGlvbiA9IHNlbGVjdChsaW5rRWwubmF0aXZlRWxlbWVudCkuc2VsZWN0KCcubGluZScpO1xyXG4gICAgICAgIGxpbmtTZWxlY3Rpb25cclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRMaW5lKVxyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgLmR1cmF0aW9uKF9hbmltYXRlID8gNTAwIDogMClcclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5saW5lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dFBhdGhTZWxlY3Rpb24gPSBzZWxlY3QodGhpcy5jaGFydEVsZW1lbnQubmF0aXZlRWxlbWVudCkuc2VsZWN0KGAjJHtlZGdlLmlkfWApO1xyXG4gICAgICAgIHRleHRQYXRoU2VsZWN0aW9uXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2Uub2xkVGV4dFBhdGgpXHJcbiAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLnRleHRQYXRoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBkYWdyZSBncmFwaCBlbmdpbmVcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNyZWF0ZUdyYXBoKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuICAgIGNvbnN0IGluaXRpYWxpemVOb2RlID0gbiA9PiB7XHJcbiAgICAgIGlmICghbi5pZCkge1xyXG4gICAgICAgIG4uaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIG4uZGltZW5zaW9uID0ge1xyXG4gICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICBoZWlnaHQ6IDMwXHJcbiAgICAgIH07XHJcbiAgICAgIG4ucG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICAgIH07XHJcbiAgICAgIG4uZGF0YSA9IG4uZGF0YSA/IG4uZGF0YSA6IHt9O1xyXG4gICAgICByZXR1cm4gbjtcclxuICAgIH07XHJcbiAgICB0aGlzLmdyYXBoID0ge1xyXG4gICAgICBub2RlczogWy4uLnRoaXMubm9kZXNdLm1hcChpbml0aWFsaXplTm9kZSksXHJcbiAgICAgIGNsdXN0ZXJzOiBbLi4uKHRoaXMuY2x1c3RlcnMgfHwgW10pXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxyXG4gICAgICBlZGdlczogWy4uLnRoaXMubGlua3NdLm1hcChlID0+IHtcclxuICAgICAgICBpZiAoIWUuaWQpIHtcclxuICAgICAgICAgIGUuaWQgPSBpZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZTtcclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhdygpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZSB0aGUgdGV4dCBkaXJlY3Rpb25zIC8gZmxpcHBpbmdcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNhbGNEb21pbmFudEJhc2VsaW5lKGxpbmspOiB2b2lkIHtcclxuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBsaW5rLnBvaW50c1swXTtcclxuICAgIGNvbnN0IGxhc3RQb2ludCA9IGxpbmsucG9pbnRzW2xpbmsucG9pbnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgbGluay5vbGRUZXh0UGF0aCA9IGxpbmsudGV4dFBhdGg7XHJcblxyXG4gICAgaWYgKGxhc3RQb2ludC54IDwgZmlyc3RQb2ludC54KSB7XHJcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWJlZm9yZS1lZGdlJztcclxuXHJcbiAgICAgIC8vIHJldmVyc2UgdGV4dCBwYXRoIGZvciB3aGVuIGl0cyBmbGlwcGVkIHVwc2lkZSBkb3duXHJcbiAgICAgIGxpbmsudGV4dFBhdGggPSB0aGlzLmdlbmVyYXRlTGluZShbLi4ubGluay5wb2ludHNdLnJldmVyc2UoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsaW5rLmRvbWluYW50QmFzZWxpbmUgPSAndGV4dC1hZnRlci1lZGdlJztcclxuICAgICAgbGluay50ZXh0UGF0aCA9IGxpbmsubGluZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIHRoZSBuZXcgbGluZSBwYXRoXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZW5lcmF0ZUxpbmUocG9pbnRzKTogYW55IHtcclxuICAgIGNvbnN0IGxpbmVGdW5jdGlvbiA9IHNoYXBlXHJcbiAgICAgIC5saW5lPGFueT4oKVxyXG4gICAgICAueChkID0+IGQueClcclxuICAgICAgLnkoZCA9PiBkLnkpXHJcbiAgICAgIC5jdXJ2ZSh0aGlzLmN1cnZlKTtcclxuICAgIHJldHVybiBsaW5lRnVuY3Rpb24ocG9pbnRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gd2FzIGludm9rZWQgZnJvbSBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25ab29tKCRldmVudDogTW91c2VFdmVudCwgZGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICBjb25zdCB6b29tRmFjdG9yID0gMSArIChkaXJlY3Rpb24gPT09ICdpbicgPyB0aGlzLnpvb21TcGVlZCA6IC10aGlzLnpvb21TcGVlZCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgdGhhdCB6b29taW5nIHdvdWxkbid0IHB1dCB1cyBvdXQgb2YgYm91bmRzXHJcbiAgICBjb25zdCBuZXdab29tTGV2ZWwgPSB0aGlzLnpvb21MZXZlbCAqIHpvb21GYWN0b3I7XHJcbiAgICBpZiAobmV3Wm9vbUxldmVsIDw9IHRoaXMubWluWm9vbUxldmVsIHx8IG5ld1pvb21MZXZlbCA+PSB0aGlzLm1heFpvb21MZXZlbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgem9vbWluZyBpcyBlbmFibGVkIG9yIG5vdFxyXG4gICAgaWYgKCF0aGlzLmVuYWJsZVpvb20pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBhbk9uWm9vbSA9PT0gdHJ1ZSAmJiAkZXZlbnQpIHtcclxuICAgICAgLy8gQWJzb2x1dGUgbW91c2UgWC9ZIG9uIHRoZSBzY3JlZW5cclxuICAgICAgY29uc3QgbW91c2VYID0gJGV2ZW50LmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG1vdXNlWSA9ICRldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgLy8gVHJhbnNmb3JtIHRoZSBtb3VzZSBYL1kgaW50byBhIFNWRyBYL1lcclxuICAgICAgY29uc3Qgc3ZnID0gdGhpcy5jaGFydC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG4gICAgICBjb25zdCBzdmdHcm91cCA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdnLmNoYXJ0Jyk7XHJcblxyXG4gICAgICBjb25zdCBwb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICBwb2ludC54ID0gbW91c2VYO1xyXG4gICAgICBwb2ludC55ID0gbW91c2VZO1xyXG4gICAgICBjb25zdCBzdmdQb2ludCA9IHBvaW50Lm1hdHJpeFRyYW5zZm9ybShzdmdHcm91cC5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xyXG5cclxuICAgICAgLy8gUGFuem9vbVxyXG4gICAgICBjb25zdCBOT19aT09NX0xFVkVMID0gMTtcclxuICAgICAgdGhpcy5wYW4oc3ZnUG9pbnQueCwgc3ZnUG9pbnQueSwgTk9fWk9PTV9MRVZFTCk7XHJcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcclxuICAgICAgdGhpcy5wYW4oLXN2Z1BvaW50LngsIC1zdmdQb2ludC55LCBOT19aT09NX0xFVkVMKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiBieSB4L3lcclxuICAgKlxyXG4gICAqL1xyXG4gIHBhbih4OiBudW1iZXIsIHk6IG51bWJlciwgem9vbUxldmVsOiBudW1iZXIgPSB0aGlzLnpvb21MZXZlbCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0cmFuc2xhdGUoeCAvIHpvb21MZXZlbCwgeSAvIHpvb21MZXZlbCkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gdG8gYSBmaXhlZCB4L3lcclxuICAgKlxyXG4gICAqL1xyXG4gIHBhblRvKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmUgPSB4ID09PSBudWxsIHx8IHggPT09IHVuZGVmaW5lZCB8fCBpc05hTih4KSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZSA6IE51bWJlcih4KTtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZiA9IHkgPT09IG51bGwgfHwgeSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHkpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mIDogTnVtYmVyKHkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIGJ5IGEgZmFjdG9yXHJcbiAgICpcclxuICAgKi9cclxuICB6b29tKGZhY3RvcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHNjYWxlKGZhY3RvciwgZmFjdG9yKSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gdG8gYSBmaXhlZCBsZXZlbFxyXG4gICAqXHJcbiAgICovXHJcbiAgem9vbVRvKGxldmVsOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA6IE51bWJlcihsZXZlbCk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgOiBOdW1iZXIobGV2ZWwpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gd2FzIGludm9rZWQgZnJvbSBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25QYW4oZXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMucGFuKGV2ZW50Lm1vdmVtZW50WCwgZXZlbnQubW92ZW1lbnRZKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYWcgd2FzIGludm9rZWQgZnJvbSBhbiBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25EcmFnKGV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmRyYWdnaW5nTm9kZTtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZykge1xyXG4gICAgICB0aGlzLmxheW91dC5vbkRyYWcobm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGUucG9zaXRpb24ueCArPSBldmVudC5tb3ZlbWVudFggLyB0aGlzLnpvb21MZXZlbDtcclxuICAgIG5vZGUucG9zaXRpb24ueSArPSBldmVudC5tb3ZlbWVudFkgLyB0aGlzLnpvb21MZXZlbDtcclxuXHJcbiAgICAvLyBtb3ZlIHRoZSBub2RlXHJcbiAgICBjb25zdCB4ID0gbm9kZS5wb3NpdGlvbi54IC0gbm9kZS5kaW1lbnNpb24ud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeSA9IG5vZGUucG9zaXRpb24ueSAtIG5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDI7XHJcbiAgICBub2RlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xyXG5cclxuICAgIGZvciAoY29uc3QgbGluayBvZiB0aGlzLmdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBsaW5rLnRhcmdldCA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIGxpbmsuc291cmNlID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgKGxpbmsudGFyZ2V0IGFzIGFueSkuaWQgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICAobGluay5zb3VyY2UgYXMgYW55KS5pZCA9PT0gbm9kZS5pZFxyXG4gICAgICApIHtcclxuICAgICAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQudXBkYXRlRWRnZSh0aGlzLmdyYXBoLCBsaW5rKTtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcclxuICAgICAgICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxyXG4gICAgICAgICAgICByZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVkcmF3RWRnZShsaW5rKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWRyYXdMaW5lcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICByZWRyYXdFZGdlKGVkZ2U6IEVkZ2UpIHtcclxuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShlZGdlLnBvaW50cyk7XHJcbiAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKGVkZ2UpO1xyXG4gICAgZWRnZS5vbGRMaW5lID0gZWRnZS5saW5lO1xyXG4gICAgZWRnZS5saW5lID0gbGluZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgZW50aXJlIHZpZXcgZm9yIHRoZSBuZXcgcGFuIHBvc2l0aW9uXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHVwZGF0ZVRyYW5zZm9ybSgpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtID0gdG9TVkcodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBjbGlja2VkXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uQ2xpY2soZXZlbnQsIG9yaWdpbmFsRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2ZW50Lm9yaWdFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGNsaWNrZWRcclxuICAgKlxyXG4gICAqL1xyXG4gIG9uRG91YmxlQ2xpY2soZXZlbnQsIG9yaWdpbmFsRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2ZW50Lm9yaWdFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XHJcbiAgICBldmVudC5pc0RvdWJsZUNsaWNrID0gdHJ1ZTtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgZm9jdXNlZFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2V2ZW50LCAuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xyXG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBkZWZvY3VzZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uRGVhY3RpdmF0ZShldmVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xyXG5cclxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGRvbWFpbiBzZXJpZXMgZm9yIHRoZSBub2Rlc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U2VyaWVzRG9tYWluKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGVzXHJcbiAgICAgIC5tYXAoZCA9PiB0aGlzLmdyb3VwUmVzdWx0c0J5KGQpKVxyXG4gICAgICAucmVkdWNlKChub2Rlczogc3RyaW5nW10sIG5vZGUpOiBhbnlbXSA9PiAobm9kZXMuaW5kZXhPZihub2RlKSAhPT0gLTEgPyBub2RlcyA6IG5vZGVzLmNvbmNhdChbbm9kZV0pKSwgW10pXHJcbiAgICAgIC5zb3J0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFja2luZyBmb3IgdGhlIGxpbmtcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdHJhY2tMaW5rQnkoaW5kZXgsIGxpbmspOiBhbnkge1xyXG4gICAgcmV0dXJuIGxpbmsuaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFja2luZyBmb3IgdGhlIG5vZGVcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdHJhY2tOb2RlQnkoaW5kZXgsIG5vZGUpOiBhbnkge1xyXG4gICAgcmV0dXJuIG5vZGUuaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjb2xvcnMgdGhlIG5vZGVzXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHNldENvbG9ycygpOiB2b2lkIHtcclxuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCAnb3JkaW5hbCcsIHRoaXMuc2VyaWVzRG9tYWluLCB0aGlzLmN1c3RvbUNvbG9ycyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBsZWdlbmQgb3B0aW9uc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0TGVnZW5kT3B0aW9ucygpOiBhbnkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2NhbGVUeXBlOiAnb3JkaW5hbCcsXHJcbiAgICAgIGRvbWFpbjogdGhpcy5zZXJpZXNEb21haW4sXHJcbiAgICAgIGNvbG9yczogdGhpcy5jb2xvcnNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBtb3VzZSBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nIGFuZCBkcmFnZ2luZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZU1vdmUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xyXG4gICAgICB0aGlzLm9uUGFuKCRldmVudCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICB0aGlzLm9uRHJhZygkZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggc3RhcnQgZXZlbnQgdG8gZW5hYmxlIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblRvdWNoU3RhcnQoZXZlbnQpIHtcclxuICAgIHRoaXMuX3RvdWNoTGFzdFggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgdGhpcy5fdG91Y2hMYXN0WSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XHJcblxyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZy5cclxuICAgKlxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNobW92ZScsIFsnJGV2ZW50J10pXHJcbiAgb25Ub3VjaE1vdmUoJGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xyXG4gICAgICBjb25zdCBjbGllbnRYID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IGNsaWVudFkgPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgY29uc3QgbW92ZW1lbnRYID0gY2xpZW50WCAtIHRoaXMuX3RvdWNoTGFzdFg7XHJcbiAgICAgIGNvbnN0IG1vdmVtZW50WSA9IGNsaWVudFkgLSB0aGlzLl90b3VjaExhc3RZO1xyXG4gICAgICB0aGlzLl90b3VjaExhc3RYID0gY2xpZW50WDtcclxuICAgICAgdGhpcy5fdG91Y2hMYXN0WSA9IGNsaWVudFk7XHJcblxyXG4gICAgICB0aGlzLnBhbihtb3ZlbWVudFgsIG1vdmVtZW50WSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBlbmQgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25Ub3VjaEVuZChldmVudCkge1xyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG1vdXNlIHVwIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy9kcmFnZ2luZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnKVxyXG4gIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnRW5kKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCh0aGlzLmRyYWdnaW5nTm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbm9kZSBtb3VzZSBkb3duIHRvIGtpY2sgb2ZmIGRyYWdnaW5nXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbk5vZGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQsIG5vZGU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5kcmFnZ2luZ05vZGUgPSBub2RlO1xyXG5cclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KG5vZGUsIGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENlbnRlciB0aGUgZ3JhcGggaW4gdGhlIHZpZXdwb3J0XHJcbiAgICovXHJcbiAgY2VudGVyKCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5UbyhcclxuICAgICAgdGhpcy5kaW1zLndpZHRoIC8gMiAtICh0aGlzLmdyYXBoRGltcy53aWR0aCAqIHRoaXMuem9vbUxldmVsKSAvIDIsXHJcbiAgICAgIHRoaXMuZGltcy5oZWlnaHQgLyAyIC0gKHRoaXMuZ3JhcGhEaW1zLmhlaWdodCAqIHRoaXMuem9vbUxldmVsKSAvIDJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tcyB0byBmaXQgdGhlIGVudGllciBncmFwaFxyXG4gICAqL1xyXG4gIHpvb21Ub0ZpdCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGhlaWdodFpvb20gPSB0aGlzLmRpbXMuaGVpZ2h0IC8gdGhpcy5ncmFwaERpbXMuaGVpZ2h0O1xyXG4gICAgY29uc3Qgd2lkdGhab29tID0gdGhpcy5kaW1zLndpZHRoIC8gdGhpcy5ncmFwaERpbXMud2lkdGg7XHJcbiAgICBjb25zdCB6b29tTGV2ZWwgPSBNYXRoLm1pbihoZWlnaHRab29tLCB3aWR0aFpvb20sIDEpO1xyXG4gICAgaWYgKHpvb21MZXZlbCAhPT0gdGhpcy56b29tTGV2ZWwpIHtcclxuICAgICAgdGhpcy56b29tTGV2ZWwgPSB6b29tTGV2ZWw7XHJcbiAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgT3V0cHV0LCBIb3N0TGlzdGVuZXIsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLyoqXHJcbiAqIE1vdXNld2hlZWwgZGlyZWN0aXZlXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Tb2RoYW5hTGlicmFyeS9hbmd1bGFyMi1leGFtcGxlcy9ibG9iL21hc3Rlci9hcHAvbW91c2VXaGVlbERpcmVjdGl2ZS9tb3VzZXdoZWVsLmRpcmVjdGl2ZS50c1xyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqL1xyXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbW91c2VXaGVlbF0nIH0pXHJcbmV4cG9ydCBjbGFzcyBNb3VzZVdoZWVsRGlyZWN0aXZlIHtcclxuICBAT3V0cHV0KClcclxuICBtb3VzZVdoZWVsVXAgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpXHJcbiAgbW91c2VXaGVlbERvd24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2VXaGVlbENocm9tZShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxGaXJlZm94KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignb25tb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxJRShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIG1vdXNlV2hlZWxGdW5jKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh3aW5kb3cuZXZlbnQpIHtcclxuICAgICAgZXZlbnQgPSB3aW5kb3cuZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVsdGEgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZXZlbnQud2hlZWxEZWx0YSB8fCAtZXZlbnQuZGV0YWlsKSk7XHJcbiAgICBpZiAoZGVsdGEgPiAwKSB7XHJcbiAgICAgIHRoaXMubW91c2VXaGVlbFVwLmVtaXQoZXZlbnQpO1xyXG4gICAgfSBlbHNlIGlmIChkZWx0YSA8IDApIHtcclxuICAgICAgdGhpcy5tb3VzZVdoZWVsRG93bi5lbWl0KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3IgSUVcclxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcblxyXG4gICAgLy8gZm9yIENocm9tZSBhbmQgRmlyZWZveFxyXG4gICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEdyYXBoQ29tcG9uZW50IH0gZnJvbSAnLi9ncmFwaC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDaGFydENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuaW1wb3J0IHsgTW91c2VXaGVlbERpcmVjdGl2ZSB9IGZyb20gJy4vbW91c2Utd2hlZWwuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4vbGF5b3V0cy9sYXlvdXQuc2VydmljZSc7XHJcbmV4cG9ydCB7IEdyYXBoQ29tcG9uZW50IH07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtDaGFydENvbW1vbk1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbR3JhcGhDb21wb25lbnQsIE1vdXNlV2hlZWxEaXJlY3RpdmVdLFxyXG4gIGV4cG9ydHM6IFtHcmFwaENvbXBvbmVudCwgTW91c2VXaGVlbERpcmVjdGl2ZV0sXHJcbiAgcHJvdmlkZXJzOiBbTGF5b3V0U2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdyYXBoTW9kdWxlIHt9XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEdyYXBoTW9kdWxlIH0gZnJvbSAnLi9ncmFwaC9ncmFwaC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBOZ3hDaGFydHNNb2R1bGUgfSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL21vZGVscy9pbmRleCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtOZ3hDaGFydHNNb2R1bGVdLFxyXG4gIGV4cG9ydHM6IFtHcmFwaE1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdyYXBoTW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6WyJkYWdyZS5sYXlvdXQiLCJkYWdyZS5ncmFwaGxpYiIsInRzbGliXzEuX192YWx1ZXMiLCJPcmllbnRhdGlvbiIsInRzbGliXzEuX19leHRlbmRzIiwibGF5b3V0Iiwic2hhcGUuY3VydmVCdW5kbGUiLCJsaW5lIiwidHNsaWJfMS5fX3NwcmVhZCIsInNoYXBlXHJcbiAgICAgICAgICAgIC5saW5lIiwibmdUcmFuc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFNLEtBQUssR0FBRyxFQUFFOzs7Ozs7QUFNaEIsU0FBZ0IsRUFBRTs7UUFDWixLQUFLLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RixLQUFLLEdBQUcsTUFBSSxLQUFPLENBQUM7O0lBR3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDakIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxFQUFFLEVBQUUsQ0FBQztDQUNiOzs7Ozs7OztJQ1hDLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0Is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