import { __extends, __values, __spread, __assign } from 'tslib';
import { layout, graphlib } from 'dagre';
import { forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { Subject, Observable, Subscription, of } from 'rxjs';
import { Injectable, ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewChildren, ViewEncapsulation, NgZone, ChangeDetectorRef, Directive, NgModule } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { BaseChartComponent, ChartComponent, ColorHelper, calculateViewDimensions, ChartCommonModule, NgxChartsModule } from '@swimlane/ngx-charts';
import { select } from 'd3-selection';
import { curveBundle, line } from 'd3-shape';
import 'd3-transition';
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
/**
 * @param {?} maybeNode
 * @return {?}
 */
function toD3Node(maybeNode) {
    if (typeof maybeNode === 'string') {
        return {
            id: maybeNode,
            x: 0,
            y: 0
        };
    }
    return maybeNode;
}
var D3ForceDirectedLayout = /** @class */ (function () {
    function D3ForceDirectedLayout() {
        this.defaultSettings = {
            force: forceSimulation()
                .force('charge', forceManyBody().strength(-150))
                .force('collide', forceCollide(5)),
            forceLink: forceLink()
                .id(function (node) { return node.id; })
                .distance(function () { return 100; })
        };
        this.settings = {};
        this.outputGraph$ = new Subject();
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.run = /**
     * @param {?} graph
     * @return {?}
     */
    function (graph) {
        var _this = this;
        this.inputGraph = graph;
        this.d3Graph = {
            nodes: (/** @type {?} */ (__spread(this.inputGraph.nodes.map(function (n) { return (__assign({}, n)); })))),
            edges: (/** @type {?} */ (__spread(this.inputGraph.edges.map(function (e) { return (__assign({}, e)); }))))
        };
        this.outputGraph = {
            nodes: [],
            edges: [],
            edgeLabels: []
        };
        this.outputGraph$.next(this.outputGraph);
        this.settings = Object.assign({}, this.defaultSettings, this.settings);
        if (this.settings.force) {
            this.settings.force
                .nodes(this.d3Graph.nodes)
                .force('link', this.settings.forceLink.links(this.d3Graph.edges))
                .alpha(0.5)
                .restart()
                .on('tick', function () {
                _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    };
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.updateEdge = /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    function (graph, edge) {
        var _this = this;
        /** @type {?} */
        var settings = Object.assign({}, this.defaultSettings, this.settings);
        if (settings.force) {
            settings.force
                .nodes(this.d3Graph.nodes)
                .force('link', settings.forceLink.links(this.d3Graph.edges))
                .alpha(0.5)
                .restart()
                .on('tick', function () {
                _this.outputGraph$.next(_this.d3GraphToOutputGraph(_this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    };
    /**
     * @param {?} d3Graph
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.d3GraphToOutputGraph = /**
     * @param {?} d3Graph
     * @return {?}
     */
    function (d3Graph) {
        this.outputGraph.nodes = this.d3Graph.nodes.map(function (node) { return (__assign({}, node, { id: node.id || id(), position: {
                x: node.x,
                y: node.y
            }, dimension: {
                width: (node.dimension && node.dimension.width) || 20,
                height: (node.dimension && node.dimension.height) || 20
            }, transform: "translate(" + (node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0) + ", " + (node.y -
                ((node.dimension && node.dimension.height) || 20) / 2 || 0) + ")" })); });
        this.outputGraph.edges = this.d3Graph.edges.map(function (edge) { return (__assign({}, edge, { source: toD3Node(edge.source).id, target: toD3Node(edge.target).id, points: [
                {
                    x: toD3Node(edge.source).x,
                    y: toD3Node(edge.source).y
                },
                {
                    x: toD3Node(edge.target).x,
                    y: toD3Node(edge.target).y
                }
            ] })); });
        this.outputGraph.edgeLabels = this.outputGraph.edges;
        return this.outputGraph;
    };
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.onDragStart = /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    function (draggingNode, $event) {
        this.settings.force.alphaTarget(0.3).restart();
        /** @type {?} */
        var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
        if (!node) {
            return;
        }
        this.draggingStart = { x: $event.x - node.x, y: $event.y - node.y };
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    };
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.onDrag = /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    function (draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
        if (!node) {
            return;
        }
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    };
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    D3ForceDirectedLayout.prototype.onDragEnd = /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    function (draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        var node = this.d3Graph.nodes.find(function (d3Node) { return d3Node.id === draggingNode.id; });
        if (!node) {
            return;
        }
        this.settings.force.alphaTarget(0);
        node.fx = undefined;
        node.fy = undefined;
    };
    return D3ForceDirectedLayout;
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
    d3: D3ForceDirectedLayout
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWdyYXBoLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi91dGlscy9pZC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZUNsdXN0ZXIudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZDNGb3JjZURpcmVjdGVkLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9sYXlvdXRzL2xheW91dC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL21vdXNlLXdoZWVsLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvZ3JhcGgubW9kdWxlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9uZ3gtZ3JhcGgubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNhY2hlID0ge307XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGEgc2hvcnQgaWQuXHJcbiAqXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaWQoKTogc3RyaW5nIHtcclxuICBsZXQgbmV3SWQgPSAoJzAwMDAnICsgKChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMzYsIDQpKSA8PCAwKS50b1N0cmluZygzNikpLnNsaWNlKC00KTtcclxuXHJcbiAgbmV3SWQgPSBgYSR7bmV3SWR9YDtcclxuXHJcbiAgLy8gZW5zdXJlIG5vdCBhbHJlYWR5IHVzZWRcclxuICBpZiAoIWNhY2hlW25ld0lkXSkge1xyXG4gICAgY2FjaGVbbmV3SWRdID0gdHJ1ZTtcclxuICAgIHJldHVybiBuZXdJZDtcclxuICB9XHJcblxyXG4gIHJldHVybiBpZCgpO1xyXG59XHJcbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcblxyXG5leHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XHJcbiAgTEVGVF9UT19SSUdIVCA9ICdMUicsXHJcbiAgUklHSFRfVE9fTEVGVCA9ICdSTCcsXHJcbiAgVE9QX1RPX0JPVFRPTSA9ICdUQicsXHJcbiAgQk9UVE9NX1RPX1RPTSA9ICdCVCdcclxufVxyXG5leHBvcnQgZW51bSBBbGlnbm1lbnQge1xyXG4gIENFTlRFUiA9ICdDJyxcclxuICBVUF9MRUZUID0gJ1VMJyxcclxuICBVUF9SSUdIVCA9ICdVUicsXHJcbiAgRE9XTl9MRUZUID0gJ0RMJyxcclxuICBET1dOX1JJR0hUID0gJ0RSJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlU2V0dGluZ3Mge1xyXG4gIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb247XHJcbiAgbWFyZ2luWD86IG51bWJlcjtcclxuICBtYXJnaW5ZPzogbnVtYmVyO1xyXG4gIGVkZ2VQYWRkaW5nPzogbnVtYmVyO1xyXG4gIHJhbmtQYWRkaW5nPzogbnVtYmVyO1xyXG4gIG5vZGVQYWRkaW5nPzogbnVtYmVyO1xyXG4gIGFsaWduPzogQWxpZ25tZW50O1xyXG4gIGFjeWNsaWNlcj86ICdncmVlZHknIHwgdW5kZWZpbmVkO1xyXG4gIHJhbmtlcj86ICduZXR3b3JrLXNpbXBsZXgnIHwgJ3RpZ2h0LXRyZWUnIHwgJ2xvbmdlc3QtcGF0aCc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdyZUxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XHJcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge1xyXG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXHJcbiAgICBtYXJnaW5YOiAyMCxcclxuICAgIG1hcmdpblk6IDIwLFxyXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcclxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXHJcbiAgICBub2RlUGFkZGluZzogNTBcclxuICB9O1xyXG4gIHNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge307XHJcblxyXG4gIGRhZ3JlR3JhcGg6IGFueTtcclxuICBkYWdyZU5vZGVzOiBhbnk7XHJcbiAgZGFncmVFZGdlczogYW55O1xyXG5cclxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xyXG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcclxuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xyXG5cclxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XHJcblxyXG4gICAgZm9yIChjb25zdCBkYWdyZU5vZGVJZCBpbiB0aGlzLmRhZ3JlR3JhcGguX25vZGVzKSB7XHJcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbZGFncmVOb2RlSWRdO1xyXG4gICAgICBjb25zdCBub2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGRhZ3JlTm9kZS5pZCk7XHJcbiAgICAgIG5vZGUucG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogZGFncmVOb2RlLngsXHJcbiAgICAgICAgeTogZGFncmVOb2RlLnlcclxuICAgICAgfTtcclxuICAgICAgbm9kZS5kaW1lbnNpb24gPSB7XHJcbiAgICAgICAgd2lkdGg6IGRhZ3JlTm9kZS53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGRhZ3JlTm9kZS5oZWlnaHRcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcclxuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xyXG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxyXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbi55IDw9IHRhcmdldE5vZGUucG9zaXRpb24ueSA/IC0xIDogMTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nUG9pbnQgPSB7XHJcbiAgICAgIHg6IHNvdXJjZU5vZGUucG9zaXRpb24ueCxcclxuICAgICAgeTogc291cmNlTm9kZS5wb3NpdGlvbi55IC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XHJcbiAgICAgIHg6IHRhcmdldE5vZGUucG9zaXRpb24ueCxcclxuICAgICAgeTogdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGdlbmVyYXRlIG5ldyBwb2ludHNcclxuICAgIGVkZ2UucG9pbnRzID0gW3N0YXJ0aW5nUG9pbnQsIGVuZGluZ1BvaW50XTtcclxuICAgIFxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKCk7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XHJcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxyXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxyXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxyXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcclxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXHJcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxyXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXHJcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxyXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlclxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLyogZW1wdHkgKi9cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XHJcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcclxuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XHJcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcclxuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xyXG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdMaW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xyXG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcclxuICAgICAgICBub2RlLndpZHRoID0gMjA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xyXG4gICAgICAgIG5vZGUuaGVpZ2h0ID0gMzA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgRGFncmVTZXR0aW5ncywgT3JpZW50YXRpb24gfSBmcm9tICcuL2RhZ3JlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdyZUNsdXN0ZXJMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHtcclxuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxyXG4gICAgbWFyZ2luWDogMjAsXHJcbiAgICBtYXJnaW5ZOiAyMCxcclxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXHJcbiAgICByYW5rUGFkZGluZzogMTAwLFxyXG4gICAgbm9kZVBhZGRpbmc6IDUwXHJcbiAgfTtcclxuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBkYWdyZUdyYXBoOiBhbnk7XHJcbiAgZGFncmVOb2RlczogTm9kZVtdO1xyXG4gIGRhZ3JlQ2x1c3RlcnM6IENsdXN0ZXJOb2RlW107XHJcbiAgZGFncmVFZGdlczogYW55O1xyXG5cclxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xyXG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcclxuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xyXG5cclxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XHJcblxyXG4gICAgY29uc3QgZGFncmVUb091dHB1dCA9IG5vZGUgPT4ge1xyXG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW25vZGUuaWRdO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLm5vZGUsXHJcbiAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgIHg6IGRhZ3JlTm9kZS54LFxyXG4gICAgICAgICAgeTogZGFncmVOb2RlLnlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpbWVuc2lvbjoge1xyXG4gICAgICAgICAgd2lkdGg6IGRhZ3JlTm9kZS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgICBncmFwaC5jbHVzdGVycyA9IChncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKGRhZ3JlVG9PdXRwdXQpO1xyXG4gICAgZ3JhcGgubm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAoZGFncmVUb091dHB1dCk7XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG5cclxuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cclxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb24ueSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiBzb3VyY2VOb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHNvdXJjZU5vZGUucG9zaXRpb24ueSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiB0YXJnZXROb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXHJcbiAgICBlZGdlLnBvaW50cyA9IFtzdGFydGluZ1BvaW50LCBlbmRpbmdQb2ludF07XHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoeyBjb21wb3VuZDogdHJ1ZSB9KTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcclxuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXHJcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXHJcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXHJcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxyXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcclxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXHJcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcclxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXHJcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvKiBlbXB0eSAqL1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKChuOiBOb2RlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xyXG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XHJcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xyXG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XHJcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlQ2x1c3RlcnMgPSBncmFwaC5jbHVzdGVycyB8fCBbXTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcclxuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3TGluaztcclxuICAgIH0pO1xyXG5cclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBjbHVzdGVyIG9mIHRoaXMuZGFncmVDbHVzdGVycykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShjbHVzdGVyLmlkLCBjbHVzdGVyKTtcclxuICAgICAgY2x1c3Rlci5jaGlsZE5vZGVJZHMuZm9yRWFjaChjaGlsZE5vZGVJZCA9PiB7XHJcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldFBhcmVudChjaGlsZE5vZGVJZCwgY2x1c3Rlci5pZCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcblxyXG5leHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XHJcbiAgTEVGVF9UT19SSUdIVCA9ICdMUicsXHJcbiAgUklHSFRfVE9fTEVGVCA9ICdSTCcsXHJcbiAgVE9QX1RPX0JPVFRPTSA9ICdUQicsXHJcbiAgQk9UVE9NX1RPX1RPTSA9ICdCVCdcclxufVxyXG5leHBvcnQgZW51bSBBbGlnbm1lbnQge1xyXG4gIENFTlRFUiA9ICdDJyxcclxuICBVUF9MRUZUID0gJ1VMJyxcclxuICBVUF9SSUdIVCA9ICdVUicsXHJcbiAgRE9XTl9MRUZUID0gJ0RMJyxcclxuICBET1dOX1JJR0hUID0gJ0RSJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlU2V0dGluZ3Mge1xyXG4gIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb247XHJcbiAgbWFyZ2luWD86IG51bWJlcjtcclxuICBtYXJnaW5ZPzogbnVtYmVyO1xyXG4gIGVkZ2VQYWRkaW5nPzogbnVtYmVyO1xyXG4gIHJhbmtQYWRkaW5nPzogbnVtYmVyO1xyXG4gIG5vZGVQYWRkaW5nPzogbnVtYmVyO1xyXG4gIGFsaWduPzogQWxpZ25tZW50O1xyXG4gIGFjeWNsaWNlcj86ICdncmVlZHknIHwgdW5kZWZpbmVkO1xyXG4gIHJhbmtlcj86ICduZXR3b3JrLXNpbXBsZXgnIHwgJ3RpZ2h0LXRyZWUnIHwgJ2xvbmdlc3QtcGF0aCc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVOb2Rlc09ubHlTZXR0aW5ncyBleHRlbmRzIERhZ3JlU2V0dGluZ3Mge1xyXG4gIGN1cnZlRGlzdGFuY2U/OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfRURHRV9OQU1FID0gJ1xceDAwJztcclxuY29uc3QgR1JBUEhfTk9ERSA9ICdcXHgwMCc7XHJcbmNvbnN0IEVER0VfS0VZX0RFTElNID0gJ1xceDAxJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdyZU5vZGVzT25seUxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XHJcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZU5vZGVzT25seVNldHRpbmdzID0ge1xyXG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXHJcbiAgICBtYXJnaW5YOiAyMCxcclxuICAgIG1hcmdpblk6IDIwLFxyXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcclxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXHJcbiAgICBub2RlUGFkZGluZzogNTAsXHJcbiAgICBjdXJ2ZURpc3RhbmNlOiAyMFxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgZGFncmVHcmFwaDogYW55O1xyXG4gIGRhZ3JlTm9kZXM6IGFueTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcclxuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcclxuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiBkYWdyZU5vZGUueCxcclxuICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICB9O1xyXG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIGdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRWRnZShncmFwaCwgZWRnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG4gICAgY29uc3QgcmFua0F4aXM6ICd4JyB8ICd5JyA9IHRoaXMuc2V0dGluZ3Mub3JpZW50YXRpb24gPT09ICdCVCcgfHwgdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ1RCJyA/ICd5JyA6ICd4JztcclxuICAgIGNvbnN0IG9yZGVyQXhpczogJ3gnIHwgJ3knID0gcmFua0F4aXMgPT09ICd5JyA/ICd4JyA6ICd5JztcclxuICAgIGNvbnN0IHJhbmtEaW1lbnNpb24gPSByYW5rQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxyXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICBbb3JkZXJBeGlzXTogc291cmNlTm9kZS5wb3NpdGlvbltvcmRlckF4aXNdLFxyXG4gICAgICBbcmFua0F4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XHJcbiAgICAgIFtvcmRlckF4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXHJcbiAgICAgIFtyYW5rQXhpc106IHRhcmdldE5vZGUucG9zaXRpb25bcmFua0F4aXNdICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uW3JhbmtEaW1lbnNpb25dIC8gMilcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgY3VydmVEaXN0YW5jZSA9IHRoaXMuc2V0dGluZ3MuY3VydmVEaXN0YW5jZSB8fCB0aGlzLmRlZmF1bHRTZXR0aW5ncy5jdXJ2ZURpc3RhbmNlO1xyXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xyXG4gICAgZWRnZS5wb2ludHMgPSBbXHJcbiAgICAgIHN0YXJ0aW5nUG9pbnQsXHJcbiAgICAgIHtcclxuICAgICAgICBbb3JkZXJBeGlzXTogc3RhcnRpbmdQb2ludFtvcmRlckF4aXNdLFxyXG4gICAgICAgIFtyYW5rQXhpc106IHN0YXJ0aW5nUG9pbnRbcmFua0F4aXNdIC0gZGlyICogY3VydmVEaXN0YW5jZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgW29yZGVyQXhpc106IGVuZGluZ1BvaW50W29yZGVyQXhpc10sXHJcbiAgICAgICAgW3JhbmtBeGlzXTogZW5kaW5nUG9pbnRbcmFua0F4aXNdICsgZGlyICogY3VydmVEaXN0YW5jZVxyXG4gICAgICB9LFxyXG4gICAgICBlbmRpbmdQb2ludFxyXG4gICAgXTtcclxuICAgIGNvbnN0IGVkZ2VMYWJlbElkID0gYCR7ZWRnZS5zb3VyY2V9JHtFREdFX0tFWV9ERUxJTX0ke2VkZ2UudGFyZ2V0fSR7RURHRV9LRVlfREVMSU19JHtERUZBVUxUX0VER0VfTkFNRX1gO1xyXG4gICAgY29uc3QgbWF0Y2hpbmdFZGdlTGFiZWwgPSBncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcclxuICAgIGlmIChtYXRjaGluZ0VkZ2VMYWJlbCkge1xyXG4gICAgICBtYXRjaGluZ0VkZ2VMYWJlbC5wb2ludHMgPSBlZGdlLnBvaW50cztcclxuICAgIH1cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcclxuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCgpO1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xyXG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcclxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcclxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcclxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXHJcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxyXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcclxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxyXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcclxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXJcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8qIGVtcHR5ICovXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAobiA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xyXG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XHJcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xyXG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XHJcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcclxuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3TGluaztcclxuICAgIH0pO1xyXG5cclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcclxuICAgICAgaWYgKCFub2RlLndpZHRoKSB7XHJcbiAgICAgICAgbm9kZS53aWR0aCA9IDIwO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbm9kZS5oZWlnaHQpIHtcclxuICAgICAgICBub2RlLmhlaWdodCA9IDMwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgdGhpcy5kYWdyZUVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XHJcbmltcG9ydCB7IGZvcmNlQ29sbGlkZSwgZm9yY2VMaW5rLCBmb3JjZU1hbnlCb2R5LCBmb3JjZVNpbXVsYXRpb24gfSBmcm9tICdkMy1mb3JjZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRDNGb3JjZURpcmVjdGVkU2V0dGluZ3Mge1xyXG4gIGZvcmNlPzogYW55O1xyXG4gIGZvcmNlTGluaz86IGFueTtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIEQzTm9kZSB7XHJcbiAgaWQ/OiBzdHJpbmc7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcjtcclxuICB3aWR0aD86IG51bWJlcjtcclxuICBoZWlnaHQ/OiBudW1iZXI7XHJcbiAgZng/OiBudW1iZXI7XHJcbiAgZnk/OiBudW1iZXI7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBEM0VkZ2Uge1xyXG4gIHNvdXJjZTogc3RyaW5nIHwgRDNOb2RlO1xyXG4gIHRhcmdldDogc3RyaW5nIHwgRDNOb2RlO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgRDNHcmFwaCB7XHJcbiAgbm9kZXM6IEQzTm9kZVtdO1xyXG4gIGVkZ2VzOiBEM0VkZ2VbXTtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIE1lcmdlZE5vZGUgZXh0ZW5kcyBEM05vZGUsIE5vZGUge1xyXG4gIGlkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0QzTm9kZShtYXliZU5vZGU6IHN0cmluZyB8IEQzTm9kZSk6IEQzTm9kZSB7XHJcbiAgaWYgKHR5cGVvZiBtYXliZU5vZGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpZDogbWF5YmVOb2RlLFxyXG4gICAgICB4OiAwLFxyXG4gICAgICB5OiAwXHJcbiAgICB9O1xyXG4gIH1cclxuICByZXR1cm4gbWF5YmVOb2RlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRDNGb3JjZURpcmVjdGVkTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcclxuICBkZWZhdWx0U2V0dGluZ3M6IEQzRm9yY2VEaXJlY3RlZFNldHRpbmdzID0ge1xyXG4gICAgZm9yY2U6IGZvcmNlU2ltdWxhdGlvbjxhbnk+KClcclxuICAgICAgLmZvcmNlKCdjaGFyZ2UnLCBmb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoLTE1MCkpXHJcbiAgICAgIC5mb3JjZSgnY29sbGlkZScsIGZvcmNlQ29sbGlkZSg1KSksXHJcbiAgICBmb3JjZUxpbms6IGZvcmNlTGluazxhbnksIGFueT4oKVxyXG4gICAgICAuaWQobm9kZSA9PiBub2RlLmlkKVxyXG4gICAgICAuZGlzdGFuY2UoKCkgPT4gMTAwKVxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IEQzRm9yY2VEaXJlY3RlZFNldHRpbmdzID0ge307XHJcblxyXG4gIGlucHV0R3JhcGg6IEdyYXBoO1xyXG4gIG91dHB1dEdyYXBoOiBHcmFwaDtcclxuICBkM0dyYXBoOiBEM0dyYXBoO1xyXG4gIG91dHB1dEdyYXBoJDogU3ViamVjdDxHcmFwaD4gPSBuZXcgU3ViamVjdCgpO1xyXG5cclxuICBkcmFnZ2luZ1N0YXJ0OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH07XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XHJcbiAgICB0aGlzLmlucHV0R3JhcGggPSBncmFwaDtcclxuICAgIHRoaXMuZDNHcmFwaCA9IHtcclxuICAgICAgbm9kZXM6IFsuLi50aGlzLmlucHV0R3JhcGgubm9kZXMubWFwKG4gPT4gKHsgLi4ubiB9KSldIGFzIGFueSxcclxuICAgICAgZWRnZXM6IFsuLi50aGlzLmlucHV0R3JhcGguZWRnZXMubWFwKGUgPT4gKHsgLi4uZSB9KSldIGFzIGFueVxyXG4gICAgfTtcclxuICAgIHRoaXMub3V0cHV0R3JhcGggPSB7XHJcbiAgICAgIG5vZGVzOiBbXSxcclxuICAgICAgZWRnZXM6IFtdLFxyXG4gICAgICBlZGdlTGFiZWxzOiBbXVxyXG4gICAgfTtcclxuICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5vdXRwdXRHcmFwaCk7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZm9yY2UpIHtcclxuICAgICAgdGhpcy5zZXR0aW5ncy5mb3JjZVxyXG4gICAgICAgIC5ub2Rlcyh0aGlzLmQzR3JhcGgubm9kZXMpXHJcbiAgICAgICAgLmZvcmNlKCdsaW5rJywgdGhpcy5zZXR0aW5ncy5mb3JjZUxpbmsubGlua3ModGhpcy5kM0dyYXBoLmVkZ2VzKSlcclxuICAgICAgICAuYWxwaGEoMC41KVxyXG4gICAgICAgIC5yZXN0YXJ0KClcclxuICAgICAgICAub24oJ3RpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMuZDNHcmFwaFRvT3V0cHV0R3JhcGgodGhpcy5kM0dyYXBoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBPYnNlcnZhYmxlPEdyYXBoPiB7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIGlmIChzZXR0aW5ncy5mb3JjZSkge1xyXG4gICAgICBzZXR0aW5ncy5mb3JjZVxyXG4gICAgICAgIC5ub2Rlcyh0aGlzLmQzR3JhcGgubm9kZXMpXHJcbiAgICAgICAgLmZvcmNlKCdsaW5rJywgc2V0dGluZ3MuZm9yY2VMaW5rLmxpbmtzKHRoaXMuZDNHcmFwaC5lZGdlcykpXHJcbiAgICAgICAgLmFscGhhKDAuNSlcclxuICAgICAgICAucmVzdGFydCgpXHJcbiAgICAgICAgLm9uKCd0aWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLmQzR3JhcGhUb091dHB1dEdyYXBoKHRoaXMuZDNHcmFwaCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoJC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIGQzR3JhcGhUb091dHB1dEdyYXBoKGQzR3JhcGg6IEQzR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLm91dHB1dEdyYXBoLm5vZGVzID0gdGhpcy5kM0dyYXBoLm5vZGVzLm1hcCgobm9kZTogTWVyZ2VkTm9kZSkgPT4gKHtcclxuICAgICAgLi4ubm9kZSxcclxuICAgICAgaWQ6IG5vZGUuaWQgfHwgaWQoKSxcclxuICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICB4OiBub2RlLngsXHJcbiAgICAgICAgeTogbm9kZS55XHJcbiAgICAgIH0sXHJcbiAgICAgIGRpbWVuc2lvbjoge1xyXG4gICAgICAgIHdpZHRoOiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwLFxyXG4gICAgICAgIGhlaWdodDogKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLmhlaWdodCkgfHwgMjBcclxuICAgICAgfSxcclxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7bm9kZS54IC0gKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjApIC8gMiB8fCAwfSwgJHtub2RlLnkgLVxyXG4gICAgICAgICgobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMCkgLyAyIHx8IDB9KWBcclxuICAgIH0pKTtcclxuXHJcbiAgICB0aGlzLm91dHB1dEdyYXBoLmVkZ2VzID0gdGhpcy5kM0dyYXBoLmVkZ2VzLm1hcChlZGdlID0+ICh7XHJcbiAgICAgIC4uLmVkZ2UsXHJcbiAgICAgIHNvdXJjZTogdG9EM05vZGUoZWRnZS5zb3VyY2UpLmlkLFxyXG4gICAgICB0YXJnZXQ6IHRvRDNOb2RlKGVkZ2UudGFyZ2V0KS5pZCxcclxuICAgICAgcG9pbnRzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgeDogdG9EM05vZGUoZWRnZS5zb3VyY2UpLngsXHJcbiAgICAgICAgICB5OiB0b0QzTm9kZShlZGdlLnNvdXJjZSkueVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgeDogdG9EM05vZGUoZWRnZS50YXJnZXQpLngsXHJcbiAgICAgICAgICB5OiB0b0QzTm9kZShlZGdlLnRhcmdldCkueVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZUxhYmVscyA9IHRoaXMub3V0cHV0R3JhcGguZWRnZXM7XHJcbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaDtcclxuICB9XHJcblxyXG4gIG9uRHJhZ1N0YXJ0KGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLnNldHRpbmdzLmZvcmNlLmFscGhhVGFyZ2V0KDAuMykucmVzdGFydCgpO1xyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XHJcbiAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kcmFnZ2luZ1N0YXJ0ID0geyB4OiAkZXZlbnQueCAtIG5vZGUueCwgeTogJGV2ZW50LnkgLSBub2RlLnkgfTtcclxuICAgIG5vZGUuZnggPSAkZXZlbnQueCAtIHRoaXMuZHJhZ2dpbmdTdGFydC54O1xyXG4gICAgbm9kZS5meSA9ICRldmVudC55IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lnk7XHJcbiAgfVxyXG5cclxuICBvbkRyYWcoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICghZHJhZ2dpbmdOb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmQzR3JhcGgubm9kZXMuZmluZChkM05vZGUgPT4gZDNOb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xyXG4gICAgaWYgKCFub2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIG5vZGUuZnggPSAkZXZlbnQueCAtIHRoaXMuZHJhZ2dpbmdTdGFydC54O1xyXG4gICAgbm9kZS5meSA9ICRldmVudC55IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lnk7XHJcbiAgfVxyXG5cclxuICBvbkRyYWdFbmQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICghZHJhZ2dpbmdOb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmQzR3JhcGgubm9kZXMuZmluZChkM05vZGUgPT4gZDNOb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xyXG4gICAgaWYgKCFub2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldHRpbmdzLmZvcmNlLmFscGhhVGFyZ2V0KDApO1xyXG4gICAgbm9kZS5meCA9IHVuZGVmaW5lZDtcclxuICAgIG5vZGUuZnkgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IERhZ3JlTGF5b3V0IH0gZnJvbSAnLi9kYWdyZSc7XHJcbmltcG9ydCB7IERhZ3JlQ2x1c3RlckxheW91dCB9IGZyb20gJy4vZGFncmVDbHVzdGVyJztcclxuaW1wb3J0IHsgRGFncmVOb2Rlc09ubHlMYXlvdXQgfSBmcm9tICcuL2RhZ3JlTm9kZXNPbmx5JztcclxuaW1wb3J0IHsgRDNGb3JjZURpcmVjdGVkTGF5b3V0IH0gZnJvbSAnLi9kM0ZvcmNlRGlyZWN0ZWQnO1xyXG5cclxuY29uc3QgbGF5b3V0cyA9IHtcclxuICBkYWdyZTogRGFncmVMYXlvdXQsXHJcbiAgZGFncmVDbHVzdGVyOiBEYWdyZUNsdXN0ZXJMYXlvdXQsXHJcbiAgZGFncmVOb2Rlc09ubHk6IERhZ3JlTm9kZXNPbmx5TGF5b3V0LFxyXG4gIGQzOiBEM0ZvcmNlRGlyZWN0ZWRMYXlvdXRcclxufTtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExheW91dFNlcnZpY2Uge1xyXG4gIGdldExheW91dChuYW1lOiBzdHJpbmcpOiBMYXlvdXQge1xyXG4gICAgaWYgKGxheW91dHNbbmFtZV0pIHtcclxuICAgICAgcmV0dXJuIG5ldyBsYXlvdXRzW25hbWVdKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbGF5b3V0IHR5cGUgJyR7bmFtZX0nYCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIHJlbmFtZSB0cmFuc2l0aW9uIGR1ZSB0byBjb25mbGljdCB3aXRoIGQzIHRyYW5zaXRpb25cclxuaW1wb3J0IHsgYW5pbWF0ZSwgc3R5bGUsIHRyYW5zaXRpb24gYXMgbmdUcmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7XHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgQ29udGVudENoaWxkLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEhvc3RMaXN0ZW5lcixcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25Jbml0LFxyXG4gIE91dHB1dCxcclxuICBRdWVyeUxpc3QsXHJcbiAgVGVtcGxhdGVSZWYsXHJcbiAgVmlld0NoaWxkLFxyXG4gIFZpZXdDaGlsZHJlbixcclxuICBWaWV3RW5jYXBzdWxhdGlvbixcclxuICBOZ1pvbmUsXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICBCYXNlQ2hhcnRDb21wb25lbnQsXHJcbiAgQ2hhcnRDb21wb25lbnQsXHJcbiAgQ29sb3JIZWxwZXIsXHJcbiAgVmlld0RpbWVuc2lvbnMsXHJcbiAgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnNcclxufSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XHJcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XHJcbmltcG9ydCAqIGFzIHNoYXBlIGZyb20gJ2QzLXNoYXBlJztcclxuaW1wb3J0ICdkMy10cmFuc2l0aW9uJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCBvZiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgaWRlbnRpdHksIHNjYWxlLCB0b1NWRywgdHJhbnNmb3JtLCB0cmFuc2xhdGUgfSBmcm9tICd0cmFuc2Zvcm1hdGlvbi1tYXRyaXgnO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4vbGF5b3V0cy9sYXlvdXQuc2VydmljZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcbmltcG9ydCB7IE5vZGUsIENsdXN0ZXJOb2RlIH0gZnJvbSAnLi4vbW9kZWxzL25vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vdXRpbHMvaWQnO1xyXG5cclxuY29uc29sZS5sb2coJ0VMIFJFRicsIEVsZW1lbnRSZWYpO1xyXG5cclxuLyoqXHJcbiAqIE1hdHJpeFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNYXRyaXgge1xyXG4gIGE6IG51bWJlcjtcclxuICBiOiBudW1iZXI7XHJcbiAgYzogbnVtYmVyO1xyXG4gIGQ6IG51bWJlcjtcclxuICBlOiBudW1iZXI7XHJcbiAgZjogbnVtYmVyO1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1ncmFwaCcsXHJcbiAgc3R5bGVzOiBbYC5ncmFwaHstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmdyYXBoIC5lZGdle3N0cm9rZTojNjY2O2ZpbGw6bm9uZX0uZ3JhcGggLmVkZ2UgLmVkZ2UtbGFiZWx7c3Ryb2tlOm5vbmU7Zm9udC1zaXplOjEycHg7ZmlsbDojMjUxZTFlfS5ncmFwaCAucGFubmluZy1yZWN0e2ZpbGw6dHJhbnNwYXJlbnQ7Y3Vyc29yOm1vdmV9LmdyYXBoIC5ub2RlLWdyb3VwIC5ub2RlOmZvY3Vze291dGxpbmU6MH0uZ3JhcGggLmNsdXN0ZXIgcmVjdHtvcGFjaXR5Oi4yfWBdLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPG5neC1jaGFydHMtY2hhcnQgW3ZpZXddPVwiW3dpZHRoLCBoZWlnaHRdXCIgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCIgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiIChsZWdlbmRMYWJlbENsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCB1bmRlZmluZWQpXCJcclxuICAobGVnZW5kTGFiZWxBY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIiAobGVnZW5kTGFiZWxEZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCIgbW91c2VXaGVlbCAobW91c2VXaGVlbFVwKT1cIm9uWm9vbSgkZXZlbnQsICdpbicpXCJcclxuICAobW91c2VXaGVlbERvd24pPVwib25ab29tKCRldmVudCwgJ291dCcpXCI+XHJcbiAgPHN2ZzpnICpuZ0lmPVwiaW5pdGlhbGl6ZWQgJiYgZ3JhcGhcIiBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCIgKHRvdWNoc3RhcnQpPVwib25Ub3VjaFN0YXJ0KCRldmVudClcIiAodG91Y2hlbmQpPVwib25Ub3VjaEVuZCgkZXZlbnQpXCJcclxuICAgIGNsYXNzPVwiZ3JhcGggY2hhcnRcIj5cclxuICAgIDxkZWZzPlxyXG4gICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJkZWZzVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJkZWZzVGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPHN2ZzpwYXRoIGNsYXNzPVwidGV4dC1wYXRoXCIgKm5nRm9yPVwibGV0IGxpbmsgb2YgZ3JhcGguZWRnZXNcIiBbYXR0ci5kXT1cImxpbmsudGV4dFBhdGhcIiBbYXR0ci5pZF09XCJsaW5rLmlkXCI+XHJcbiAgICAgIDwvc3ZnOnBhdGg+XHJcbiAgICA8L2RlZnM+XHJcbiAgICA8c3ZnOnJlY3QgY2xhc3M9XCJwYW5uaW5nLXJlY3RcIiBbYXR0ci53aWR0aF09XCJkaW1zLndpZHRoICogMTAwXCIgW2F0dHIuaGVpZ2h0XT1cImRpbXMuaGVpZ2h0ICogMTAwXCIgW2F0dHIudHJhbnNmb3JtXT1cIid0cmFuc2xhdGUoJyArICgoLWRpbXMud2lkdGggfHwgMCkgKiA1MCkgKycsJyArICgoLWRpbXMuaGVpZ2h0IHx8IDApICo1MCkgKyAnKScgXCJcclxuICAgICAgKG1vdXNlZG93bik9XCJpc1Bhbm5pbmcgPSB0cnVlXCIgLz5cclxuICAgICAgPHN2ZzpnIGNsYXNzPVwiY2x1c3RlcnNcIj5cclxuICAgICAgICA8c3ZnOmcgI2NsdXN0ZXJFbGVtZW50ICpuZ0Zvcj1cImxldCBub2RlIG9mIGdyYXBoLmNsdXN0ZXJzOyB0cmFja0J5OiB0cmFja05vZGVCeVwiIGNsYXNzPVwibm9kZS1ncm91cFwiIFtpZF09XCJub2RlLmlkXCIgW2F0dHIudHJhbnNmb3JtXT1cIm5vZGUudHJhbnNmb3JtXCJcclxuICAgICAgICAgIChjbGljayk9XCJvbkNsaWNrKG5vZGUsJGV2ZW50KVwiPlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwiY2x1c3RlclRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiY2x1c3RlclRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlIH1cIj5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgICA8c3ZnOmcgKm5nSWY9XCIhY2x1c3RlclRlbXBsYXRlXCIgY2xhc3M9XCJub2RlIGNsdXN0ZXJcIj5cclxuICAgICAgICAgICAgPHN2ZzpyZWN0IFthdHRyLndpZHRoXT1cIm5vZGUuZGltZW5zaW9uLndpZHRoXCIgW2F0dHIuaGVpZ2h0XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodFwiIFthdHRyLmZpbGxdPVwibm9kZS5kYXRhPy5jb2xvclwiIC8+XHJcbiAgICAgICAgICAgIDxzdmc6dGV4dCBhbGlnbm1lbnQtYmFzZWxpbmU9XCJjZW50cmFsXCIgW2F0dHIueF09XCIxMFwiIFthdHRyLnldPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMlwiPnt7bm9kZS5sYWJlbH19PC9zdmc6dGV4dD5cclxuICAgICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgICAgPHN2ZzpnIGNsYXNzPVwibGlua3NcIj5cclxuICAgICAgPHN2ZzpnICNsaW5rRWxlbWVudCAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlczsgdHJhY2tCeTogdHJhY2tMaW5rQnlcIiBjbGFzcz1cImxpbmstZ3JvdXBcIiBbaWRdPVwibGluay5pZFwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImxpbmtUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxpbmtUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbGluayB9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8c3ZnOnBhdGggKm5nSWY9XCIhbGlua1RlbXBsYXRlXCIgY2xhc3M9XCJlZGdlXCIgW2F0dHIuZF09XCJsaW5rLmxpbmVcIiAvPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICAgIDxzdmc6ZyBjbGFzcz1cIm5vZGVzXCI+XHJcbiAgICAgIDxzdmc6ZyAjbm9kZUVsZW1lbnQgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGgubm9kZXM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCIgY2xhc3M9XCJub2RlLWdyb3VwXCIgW2lkXT1cIm5vZGUuaWRcIiBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxyXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKG5vZGUsJGV2ZW50KVwiIChtb3VzZWRvd24pPVwib25Ob2RlTW91c2VEb3duKCRldmVudCwgbm9kZSlcIiAoZGJsY2xpY2spPVwib25Eb3VibGVDbGljayhub2RlLCRldmVudClcIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJub2RlVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJub2RlVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUgfVwiPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPHN2ZzpjaXJjbGUgKm5nSWY9XCIhbm9kZVRlbXBsYXRlXCIgcj1cIjEwXCIgW2F0dHIuY3hdPVwibm9kZS5kaW1lbnNpb24ud2lkdGggLyAyXCIgW2F0dHIuY3ldPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMlwiIFthdHRyLmZpbGxdPVwibm9kZS5kYXRhPy5jb2xvclwiXHJcbiAgICAgICAgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgPC9zdmc6Zz5cclxuPC9uZ3gtY2hhcnRzLWNoYXJ0PlxyXG4gIGAsXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBhbmltYXRpb25zOiBbdHJpZ2dlcignbGluaycsIFtuZ1RyYW5zaXRpb24oJyogPT4gKicsIFthbmltYXRlKDUwMCwgc3R5bGUoeyB0cmFuc2Zvcm06ICcqJyB9KSldKV0pXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgR3JhcGhDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKVxyXG4gIGxlZ2VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVzOiBOb2RlW10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBjbHVzdGVyczogQ2x1c3Rlck5vZGVbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxpbmtzOiBFZGdlW10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBhY3RpdmVFbnRyaWVzOiBhbnlbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGN1cnZlOiBhbnk7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZHJhZ2dpbmdFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1heEhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNaW5IZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlV2lkdGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWluV2lkdGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWF4V2lkdGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBwYW5uaW5nRW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZW5hYmxlWm9vbSA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgem9vbVNwZWVkID0gMC4xO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1pblpvb21MZXZlbCA9IDAuMTtcclxuXHJcbiAgQElucHV0KClcclxuICBtYXhab29tTGV2ZWwgPSA0LjA7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYXV0b1pvb20gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBwYW5Pblpvb20gPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGF1dG9DZW50ZXIgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICB1cGRhdGUkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY2VudGVyJDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHpvb21Ub0ZpdCQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICBsYXlvdXQ6IHN0cmluZyB8IExheW91dDtcclxuXHJcbiAgQElucHV0KClcclxuICBsYXlvdXRTZXR0aW5nczogYW55O1xyXG5cclxuICBAT3V0cHV0KClcclxuICBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGRlYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAQ29udGVudENoaWxkKCdsaW5rVGVtcGxhdGUnKVxyXG4gIGxpbmtUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnbm9kZVRlbXBsYXRlJylcclxuICBub2RlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2NsdXN0ZXJUZW1wbGF0ZScpXHJcbiAgY2x1c3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdkZWZzVGVtcGxhdGUnKVxyXG4gIGRlZnNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQFZpZXdDaGlsZChDaGFydENvbXBvbmVudCwgeyByZWFkOiBFbGVtZW50UmVmIH0pXHJcbiAgY2hhcnQ6IEVsZW1lbnRSZWY7XHJcblxyXG4gIEBWaWV3Q2hpbGRyZW4oJ25vZGVFbGVtZW50JylcclxuICBub2RlRWxlbWVudHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcclxuXHJcbiAgQFZpZXdDaGlsZHJlbignbGlua0VsZW1lbnQnKVxyXG4gIGxpbmtFbGVtZW50czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xyXG5cclxuICBncmFwaFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xyXG4gIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XHJcbiAgY29sb3JzOiBDb2xvckhlbHBlcjtcclxuICBkaW1zOiBWaWV3RGltZW5zaW9ucztcclxuICBtYXJnaW4gPSBbMCwgMCwgMCwgMF07XHJcbiAgcmVzdWx0cyA9IFtdO1xyXG4gIHNlcmllc0RvbWFpbjogYW55O1xyXG4gIHRyYW5zZm9ybTogc3RyaW5nO1xyXG4gIGxlZ2VuZE9wdGlvbnM6IGFueTtcclxuICBpc1Bhbm5pbmcgPSBmYWxzZTtcclxuICBpc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgZHJhZ2dpbmdOb2RlOiBOb2RlO1xyXG4gIGluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgZ3JhcGg6IEdyYXBoO1xyXG4gIGdyYXBoRGltczogYW55ID0geyB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XHJcbiAgX29sZExpbmtzOiBFZGdlW10gPSBbXTtcclxuICB0cmFuc2Zvcm1hdGlvbk1hdHJpeDogTWF0cml4ID0gaWRlbnRpdHkoKTtcclxuICBfdG91Y2hMYXN0WCA9IG51bGw7XHJcbiAgX3RvdWNoTGFzdFkgPSBudWxsO1xyXG5cclxuICB6b29tQmVmb3JlID0gMTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxyXG4gICAgcHVibGljIHpvbmU6IE5nWm9uZSxcclxuICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2VcclxuICApIHtcclxuICAgIHN1cGVyKGVsLCB6b25lLCBjZCk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIGdyb3VwUmVzdWx0c0J5OiAobm9kZTogYW55KSA9PiBzdHJpbmcgPSBub2RlID0+IG5vZGUubGFiZWw7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCB6b29tIGxldmVsXHJcbiAgICovXHJcbiAgZ2V0IHpvb21MZXZlbCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmE7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxyXG4gICAqL1xyXG4gIEBJbnB1dCgnem9vbUxldmVsJylcclxuICBzZXQgem9vbUxldmVsKGxldmVsKSB7XHJcbiAgICB0aGlzLnpvb21UbyhOdW1iZXIobGV2ZWwpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgZ2V0IHBhbk9mZnNldFgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IGB4YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBASW5wdXQoJ3Bhbk9mZnNldFgnKVxyXG4gIHNldCBwYW5PZmZzZXRYKHgpIHtcclxuICAgIHRoaXMucGFuVG8oTnVtYmVyKHgpLCBudWxsKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgZ2V0IHBhbk9mZnNldFkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IGB5YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBASW5wdXQoJ3Bhbk9mZnNldFknKVxyXG4gIHNldCBwYW5PZmZzZXRZKHkpIHtcclxuICAgIHRoaXMucGFuVG8obnVsbCwgTnVtYmVyKHkpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudXBkYXRlJCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLnVwZGF0ZSQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jZW50ZXIkKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG4gICAgICAgIHRoaXMuY2VudGVyJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jZW50ZXIoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuem9vbVRvRml0JCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLnpvb21Ub0ZpdCQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKGNoYW5nZXMpO1xyXG4gICAgY29uc3QgeyBsYXlvdXQsIGxheW91dFNldHRpbmdzLCBub2RlcywgY2x1c3RlcnMsIGxpbmtzIH0gPSBjaGFuZ2VzO1xyXG4gICAgdGhpcy5zZXRMYXlvdXQodGhpcy5sYXlvdXQpO1xyXG4gICAgaWYgKGxheW91dFNldHRpbmdzKSB7XHJcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZXMgfHwgY2x1c3RlcnMgfHwgbGlua3MpIHtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExheW91dChsYXlvdXQ6IHN0cmluZyB8IExheW91dCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgaWYgKCFsYXlvdXQpIHtcclxuICAgICAgbGF5b3V0ID0gJ2RhZ3JlJztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbGF5b3V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmxheW91dCA9IHRoaXMubGF5b3V0U2VydmljZS5nZXRMYXlvdXQobGF5b3V0KTtcclxuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExheW91dFNldHRpbmdzKHNldHRpbmdzOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0LnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XHJcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQmFzZSBjbGFzcyB1cGRhdGUgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBkYWcgZ3JhcGhcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLnVwZGF0ZSgpO1xyXG5cclxuICAgIGlmICghdGhpcy5jdXJ2ZSkge1xyXG4gICAgICB0aGlzLmN1cnZlID0gc2hhcGUuY3VydmVCdW5kbGUuYmV0YSgxKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXHJcbiAgICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnNlcmllc0RvbWFpbiA9IHRoaXMuZ2V0U2VyaWVzRG9tYWluKCk7XHJcbiAgICAgIHRoaXMuc2V0Q29sb3JzKCk7XHJcbiAgICAgIHRoaXMubGVnZW5kT3B0aW9ucyA9IHRoaXMuZ2V0TGVnZW5kT3B0aW9ucygpO1xyXG5cclxuICAgICAgdGhpcy5jcmVhdGVHcmFwaCgpO1xyXG5cclxuICAgICAgLy8gSWYgem9vbSBpc24ndCAxLCB0aGVuIG5vZGVzIHNvbWV0aW1lcyBkb24ndCByZW5kZXIgaW4gY29ycmVjdCBzaXplXHJcbiAgICAgIC8vIHpvb21pbmcgdG8gMSBmaXhlcyB0aGlzXHJcbiAgICAgIHRoaXMuc2F2ZVpvb21CZWZvcmVMb2FkKCk7XHJcbiAgICAgIHRoaXMuem9vbUxldmVsID0gMTtcclxuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYXdzIHRoZSBncmFwaCB1c2luZyBkYWdyZSBsYXlvdXRzXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGRyYXcoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMubGF5b3V0IHx8IHR5cGVvZiB0aGlzLmxheW91dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gQ2FsYyB2aWV3IGRpbXMgZm9yIHRoZSBub2Rlc1xyXG4gICAgdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCk7XHJcblxyXG4gICAgLy8gUmVjYWxjIHRoZSBsYXlvdXRcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnJ1bih0aGlzLmdyYXBoKTtcclxuICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcclxuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcclxuICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xyXG4gICAgICB0aGlzLnRpY2soKTtcclxuICAgIH0pKTtcclxuICAgIHJlc3VsdCRcclxuICAgICAgLnBpcGUoZmlyc3QoZ3JhcGggPT4gZ3JhcGgubm9kZXMubGVuZ3RoID4gMCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCkpO1xyXG5cclxuICAgIHRoaXMucmVzdG9yZVpvb21CZWZvcmVMb2FkKCk7XHJcbiAgfVxyXG5cclxuICB0aWNrKCkge1xyXG4gICAgLy8gVHJhbnNwb3NlcyB2aWV3IG9wdGlvbnMgdG8gdGhlIG5vZGVcclxuICAgIHRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xyXG4gICAgICBuLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtcclxuICAgICAgICBuLnBvc2l0aW9uLnggLSBuLmRpbWVuc2lvbi53aWR0aCAvIDIgfHwgMH0sICR7bi5wb3NpdGlvbi55IC0gbi5kaW1lbnNpb24uaGVpZ2h0IC8gMiB8fCAwXHJcbiAgICAgICAgfSlgO1xyXG4gICAgICBpZiAoIW4uZGF0YSkge1xyXG4gICAgICAgIG4uZGF0YSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbi5kYXRhLmNvbG9yKSB7XHJcblxyXG4gICAgICAgIG4uZGF0YSA9IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgKHRoaXMuZ3JhcGguY2x1c3RlcnMgfHwgW10pLm1hcChuID0+IHtcclxuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7XHJcbiAgICAgICAgbi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHwgMFxyXG4gICAgICAgIH0pYDtcclxuICAgICAgaWYgKCFuLmRhdGEpIHtcclxuICAgICAgICBuLmRhdGEgPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIW4uZGF0YS5jb2xvcikge1xyXG5cclxuICAgICAgICBuLmRhdGEgPSB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnMuZ2V0Q29sb3IodGhpcy5ncm91cFJlc3VsdHNCeShuKSlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdGhlIGxhYmVscyB0byB0aGUgbmV3IHBvc2l0aW9uc1xyXG4gICAgY29uc3QgbmV3TGlua3MgPSBbXTtcclxuICAgIGZvciAoY29uc3QgZWRnZUxhYmVsSWQgaW4gdGhpcy5ncmFwaC5lZGdlTGFiZWxzKSB7XHJcbiAgICAgIGNvbnN0IGVkZ2VMYWJlbCA9IHRoaXMuZ3JhcGguZWRnZUxhYmVsc1tlZGdlTGFiZWxJZF07XHJcblxyXG4gICAgICBjb25zdCBub3JtS2V5ID0gZWRnZUxhYmVsSWQucmVwbGFjZSgvW15cXHctXSovZywgJycpO1xyXG4gICAgICBsZXQgb2xkTGluayA9IHRoaXMuX29sZExpbmtzLmZpbmQob2wgPT4gYCR7b2wuc291cmNlfSR7b2wudGFyZ2V0fWAgPT09IG5vcm1LZXkpO1xyXG4gICAgICBpZiAoIW9sZExpbmspIHtcclxuICAgICAgICBvbGRMaW5rID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKG5sID0+IGAke25sLnNvdXJjZX0ke25sLnRhcmdldH1gID09PSBub3JtS2V5KSB8fCBlZGdlTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9sZExpbmsub2xkTGluZSA9IG9sZExpbmsubGluZTtcclxuXHJcbiAgICAgIGNvbnN0IHBvaW50cyA9IGVkZ2VMYWJlbC5wb2ludHM7XHJcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShwb2ludHMpO1xyXG5cclxuICAgICAgY29uc3QgbmV3TGluayA9IE9iamVjdC5hc3NpZ24oe30sIG9sZExpbmspO1xyXG4gICAgICBuZXdMaW5rLmxpbmUgPSBsaW5lO1xyXG4gICAgICBuZXdMaW5rLnBvaW50cyA9IHBvaW50cztcclxuXHJcbiAgICAgIGNvbnN0IHRleHRQb3MgPSBwb2ludHNbTWF0aC5mbG9vcihwb2ludHMubGVuZ3RoIC8gMildO1xyXG4gICAgICBpZiAodGV4dFBvcykge1xyXG4gICAgICAgIG5ld0xpbmsudGV4dFRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0ZXh0UG9zLnggfHwgMH0sJHt0ZXh0UG9zLnkgfHwgMH0pYDtcclxuICAgICAgfVxyXG5cclxuICAgICAgbmV3TGluay50ZXh0QW5nbGUgPSAwO1xyXG4gICAgICBpZiAoIW5ld0xpbmsub2xkTGluZSkge1xyXG4gICAgICAgIG5ld0xpbmsub2xkTGluZSA9IG5ld0xpbmsubGluZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jYWxjRG9taW5hbnRCYXNlbGluZShuZXdMaW5rKTtcclxuICAgICAgbmV3TGlua3MucHVzaChuZXdMaW5rKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdyYXBoLmVkZ2VzID0gbmV3TGlua3M7XHJcblxyXG4gICAgLy8gTWFwIHRoZSBvbGQgbGlua3MgZm9yIGFuaW1hdGlvbnNcclxuICAgIGlmICh0aGlzLmdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuX29sZExpbmtzID0gdGhpcy5ncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3TCA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICAgIG5ld0wub2xkTGluZSA9IGwubGluZTtcclxuICAgICAgICByZXR1cm4gbmV3TDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBoZWlnaHQvd2lkdGggdG90YWxcclxuICAgIHRoaXMuZ3JhcGhEaW1zLndpZHRoID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnggKyBuLmRpbWVuc2lvbi53aWR0aCkpO1xyXG4gICAgdGhpcy5ncmFwaERpbXMuaGVpZ2h0ID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnkgKyBuLmRpbWVuc2lvbi5oZWlnaHQpKTtcclxuXHJcbiAgICBpZiAodGhpcy5hdXRvWm9vbSkge1xyXG4gICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmF1dG9DZW50ZXIpIHtcclxuICAgICAgLy8gQXV0by1jZW50ZXIgd2hlbiByZW5kZXJpbmdcclxuICAgICAgdGhpcy5jZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5yZWRyYXdMaW5lcygpKTtcclxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNZWFzdXJlcyB0aGUgbm9kZSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZSBkaW1lbnNpb25zXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBhcHBseU5vZGVEaW1lbnNpb25zKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubm9kZUVsZW1lbnRzICYmIHRoaXMubm9kZUVsZW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm5vZGVFbGVtZW50cy5tYXAoZWxlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IGVsZW0ubmF0aXZlRWxlbWVudDtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gbmF0aXZlRWxlbWVudC5pZCk7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0XHJcbiAgICAgICAgbGV0IGRpbXM7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGRpbXMgPSBuYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVIZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IHRoaXMubm9kZUhlaWdodDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gZGltcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4SGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1heEhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNaW5IZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWluSGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVXaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSB0aGlzLm5vZGVXaWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSB3aWR0aFxyXG4gICAgICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGV0IHRleHREaW1zO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIHRleHREaW1zID0gbmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpWzBdLmdldEJCb3goKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gdGV4dERpbXMud2lkdGggKyAyMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gZGltcy53aWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhXaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi53aWR0aCwgdGhpcy5ub2RlTWF4V2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWluV2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5taW4obm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1pbldpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVkcmF3cyB0aGUgbGluZXMgd2hlbiBkcmFnZ2VkIG9yIHZpZXdwb3J0IHVwZGF0ZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHJlZHJhd0xpbmVzKF9hbmltYXRlID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgdGhpcy5saW5rRWxlbWVudHMubWFwKGxpbmtFbCA9PiB7XHJcbiAgICAgIGNvbnN0IGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzLmZpbmQobGluID0+IGxpbi5pZCA9PT0gbGlua0VsLm5hdGl2ZUVsZW1lbnQuaWQpO1xyXG5cclxuICAgICAgaWYgKGVkZ2UpIHtcclxuICAgICAgICBjb25zdCBsaW5rU2VsZWN0aW9uID0gc2VsZWN0KGxpbmtFbC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoJy5saW5lJyk7XHJcbiAgICAgICAgbGlua1NlbGVjdGlvblxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZExpbmUpXHJcbiAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLmxpbmUpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0UGF0aFNlbGVjdGlvbiA9IHNlbGVjdCh0aGlzLmNoYXJ0RWxlbWVudC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoYCMke2VkZ2UuaWR9YCk7XHJcbiAgICAgICAgdGV4dFBhdGhTZWxlY3Rpb25cclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRUZXh0UGF0aClcclxuICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgIC5kdXJhdGlvbihfYW5pbWF0ZSA/IDUwMCA6IDApXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2UudGV4dFBhdGgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGRhZ3JlIGdyYXBoIGVuZ2luZVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgY3JlYXRlR3JhcGgoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xyXG4gICAgY29uc3QgaW5pdGlhbGl6ZU5vZGUgPSBuID0+IHtcclxuICAgICAgaWYgKCFuLmlkKSB7XHJcbiAgICAgICAgbi5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgbi5kaW1lbnNpb24gPSB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIGhlaWdodDogMzBcclxuICAgICAgfTtcclxuICAgICAgbi5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgICAgfTtcclxuICAgICAgbi5kYXRhID0gbi5kYXRhID8gbi5kYXRhIDoge307XHJcbiAgICAgIHJldHVybiBuO1xyXG4gICAgfTtcclxuICAgIHRoaXMuZ3JhcGggPSB7XHJcbiAgICAgIG5vZGVzOiBbLi4udGhpcy5ub2Rlc10ubWFwKGluaXRpYWxpemVOb2RlKSxcclxuICAgICAgY2x1c3RlcnM6IFsuLi4odGhpcy5jbHVzdGVycyB8fCBbXSldLm1hcChpbml0aWFsaXplTm9kZSksXHJcbiAgICAgIGVkZ2VzOiBbLi4udGhpcy5saW5rc10ubWFwKGUgPT4ge1xyXG4gICAgICAgIGlmICghZS5pZCkge1xyXG4gICAgICAgICAgZS5pZCA9IGlkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlO1xyXG4gICAgICB9KVxyXG4gICAgfTtcclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3KCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlIHRoZSB0ZXh0IGRpcmVjdGlvbnMgLyBmbGlwcGluZ1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgY2FsY0RvbWluYW50QmFzZWxpbmUobGluayk6IHZvaWQge1xyXG4gICAgY29uc3QgZmlyc3RQb2ludCA9IGxpbmsucG9pbnRzWzBdO1xyXG4gICAgY29uc3QgbGFzdFBvaW50ID0gbGluay5wb2ludHNbbGluay5wb2ludHMubGVuZ3RoIC0gMV07XHJcbiAgICBsaW5rLm9sZFRleHRQYXRoID0gbGluay50ZXh0UGF0aDtcclxuXHJcbiAgICBpZiAobGFzdFBvaW50LnggPCBmaXJzdFBvaW50LngpIHtcclxuICAgICAgbGluay5kb21pbmFudEJhc2VsaW5lID0gJ3RleHQtYmVmb3JlLWVkZ2UnO1xyXG5cclxuICAgICAgLy8gcmV2ZXJzZSB0ZXh0IHBhdGggZm9yIHdoZW4gaXRzIGZsaXBwZWQgdXBzaWRlIGRvd25cclxuICAgICAgbGluay50ZXh0UGF0aCA9IHRoaXMuZ2VuZXJhdGVMaW5lKFsuLi5saW5rLnBvaW50c10ucmV2ZXJzZSgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWFmdGVyLWVkZ2UnO1xyXG4gICAgICBsaW5rLnRleHRQYXRoID0gbGluay5saW5lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2VuZXJhdGUgdGhlIG5ldyBsaW5lIHBhdGhcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdlbmVyYXRlTGluZShwb2ludHMpOiBhbnkge1xyXG4gICAgY29uc3QgbGluZUZ1bmN0aW9uID0gc2hhcGVcclxuICAgICAgLmxpbmU8YW55PigpXHJcbiAgICAgIC54KGQgPT4gZC54KVxyXG4gICAgICAueShkID0+IGQueSlcclxuICAgICAgLmN1cnZlKHRoaXMuY3VydmUpO1xyXG4gICAgcmV0dXJuIGxpbmVGdW5jdGlvbihwb2ludHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblpvb20oJGV2ZW50OiBNb3VzZUV2ZW50LCBkaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgIGNvbnN0IHpvb21GYWN0b3IgPSAxICsgKGRpcmVjdGlvbiA9PT0gJ2luJyA/IHRoaXMuem9vbVNwZWVkIDogLXRoaXMuem9vbVNwZWVkKTtcclxuXHJcbiAgICAvLyBDaGVjayB0aGF0IHpvb21pbmcgd291bGRuJ3QgcHV0IHVzIG91dCBvZiBib3VuZHNcclxuICAgIGNvbnN0IG5ld1pvb21MZXZlbCA9IHRoaXMuem9vbUxldmVsICogem9vbUZhY3RvcjtcclxuICAgIGlmIChuZXdab29tTGV2ZWwgPD0gdGhpcy5taW5ab29tTGV2ZWwgfHwgbmV3Wm9vbUxldmVsID49IHRoaXMubWF4Wm9vbUxldmVsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB6b29taW5nIGlzIGVuYWJsZWQgb3Igbm90XHJcbiAgICBpZiAoIXRoaXMuZW5hYmxlWm9vbSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGFuT25ab29tID09PSB0cnVlICYmICRldmVudCkge1xyXG4gICAgICAvLyBBYnNvbHV0ZSBtb3VzZSBYL1kgb24gdGhlIHNjcmVlblxyXG4gICAgICBjb25zdCBtb3VzZVggPSAkZXZlbnQuY2xpZW50WDtcclxuICAgICAgY29uc3QgbW91c2VZID0gJGV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgICAvLyBUcmFuc2Zvcm0gdGhlIG1vdXNlIFgvWSBpbnRvIGEgU1ZHIFgvWVxyXG4gICAgICBjb25zdCBzdmcgPSB0aGlzLmNoYXJ0Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XHJcbiAgICAgIGNvbnN0IHN2Z0dyb3VwID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2cuY2hhcnQnKTtcclxuXHJcbiAgICAgIGNvbnN0IHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgIHBvaW50LnggPSBtb3VzZVg7XHJcbiAgICAgIHBvaW50LnkgPSBtb3VzZVk7XHJcbiAgICAgIGNvbnN0IHN2Z1BvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKHN2Z0dyb3VwLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XHJcblxyXG4gICAgICAvLyBQYW56b29tXHJcbiAgICAgIGNvbnN0IE5PX1pPT01fTEVWRUwgPSAxO1xyXG4gICAgICB0aGlzLnBhbihzdmdQb2ludC54LCBzdmdQb2ludC55LCBOT19aT09NX0xFVkVMKTtcclxuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xyXG4gICAgICB0aGlzLnBhbigtc3ZnUG9pbnQueCwgLXN2Z1BvaW50LnksIE5PX1pPT01fTEVWRUwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIGJ5IHgveVxyXG4gICAqXHJcbiAgICovXHJcbiAgcGFuKHg6IG51bWJlciwgeTogbnVtYmVyLCB6b29tTGV2ZWw6IG51bWJlciA9IHRoaXMuem9vbUxldmVsKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRyYW5zbGF0ZSh4IC8gem9vbUxldmVsLCB5IC8gem9vbUxldmVsKSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiB0byBhIGZpeGVkIHgveVxyXG4gICAqXHJcbiAgICovXHJcbiAgcGFuVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZSA9IHggPT09IG51bGwgfHwgeCA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHgpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lIDogTnVtYmVyKHgpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mID0geSA9PT0gbnVsbCB8fCB5ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeSkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmYgOiBOdW1iZXIoeSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gYnkgYSBmYWN0b3JcclxuICAgKlxyXG4gICAqL1xyXG4gIHpvb20oZmFjdG9yOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgc2NhbGUoZmFjdG9yLCBmYWN0b3IpKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSB0byBhIGZpeGVkIGxldmVsXHJcbiAgICpcclxuICAgKi9cclxuICB6b29tVG8obGV2ZWw6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hIDogTnVtYmVyKGxldmVsKTtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA6IE51bWJlcihsZXZlbCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblBhbihldmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW4oZXZlbnQubW92ZW1lbnRYLCBldmVudC5tb3ZlbWVudFkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhZyB3YXMgaW52b2tlZCBmcm9tIGFuIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkRyYWcoZXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZHJhZ2dpbmdOb2RlO1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZyhub2RlLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZS5wb3NpdGlvbi54ICs9IGV2ZW50Lm1vdmVtZW50WCAvIHRoaXMuem9vbUxldmVsO1xyXG4gICAgbm9kZS5wb3NpdGlvbi55ICs9IGV2ZW50Lm1vdmVtZW50WSAvIHRoaXMuem9vbUxldmVsO1xyXG5cclxuICAgIC8vIG1vdmUgdGhlIG5vZGVcclxuICAgIGNvbnN0IHggPSBub2RlLnBvc2l0aW9uLnggLSBub2RlLmRpbWVuc2lvbi53aWR0aCAvIDI7XHJcbiAgICBjb25zdCB5ID0gbm9kZS5wb3NpdGlvbi55IC0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMjtcclxuICAgIG5vZGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3h9LCAke3l9KWA7XHJcblxyXG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHRoaXMuZ3JhcGguZWRnZXMpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGxpbmsudGFyZ2V0ID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgbGluay5zb3VyY2UgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICAobGluay50YXJnZXQgYXMgYW55KS5pZCA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIChsaW5rLnNvdXJjZSBhcyBhbnkpLmlkID09PSBub2RlLmlkXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmxheW91dC51cGRhdGVFZGdlKHRoaXMuZ3JhcGgsIGxpbmspO1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xyXG4gICAgICAgICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgICAgICAgIHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZWRyYXdFZGdlKGxpbmspO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZHJhd0xpbmVzKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHJlZHJhd0VkZ2UoZWRnZTogRWRnZSkge1xyXG4gICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKGVkZ2UucG9pbnRzKTtcclxuICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUoZWRnZSk7XHJcbiAgICBlZGdlLm9sZExpbmUgPSBlZGdlLmxpbmU7XHJcbiAgICBlZGdlLmxpbmUgPSBsaW5lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBlbnRpcmUgdmlldyBmb3IgdGhlIG5ldyBwYW4gcG9zaXRpb25cclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdXBkYXRlVHJhbnNmb3JtKCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSB0b1NWRyh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGNsaWNrZWRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25DbGljayhldmVudCwgb3JpZ2luYWxFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQub3JpZ0V2ZW50ID0gb3JpZ2luYWxFdmVudDtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgY2xpY2tlZFxyXG4gICAqXHJcbiAgICovXHJcbiAgb25Eb3VibGVDbGljayhldmVudCwgb3JpZ2luYWxFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQub3JpZ0V2ZW50ID0gb3JpZ2luYWxFdmVudDtcclxuICAgIGV2ZW50LmlzRG91YmxlQ2xpY2sgPSB0cnVlO1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBmb2N1c2VkXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uQWN0aXZhdGUoZXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCkgPiAtMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbZXZlbnQsIC4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGRlZm9jdXNlZFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25EZWFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCk7XHJcblxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcblxyXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgZG9tYWluIHNlcmllcyBmb3IgdGhlIG5vZGVzXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRTZXJpZXNEb21haW4oKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZXNcclxuICAgICAgLm1hcChkID0+IHRoaXMuZ3JvdXBSZXN1bHRzQnkoZCkpXHJcbiAgICAgIC5yZWR1Y2UoKG5vZGVzOiBzdHJpbmdbXSwgbm9kZSk6IGFueVtdID0+IChub2Rlcy5pbmRleE9mKG5vZGUpICE9PSAtMSA/IG5vZGVzIDogbm9kZXMuY29uY2F0KFtub2RlXSkpLCBbXSlcclxuICAgICAgLnNvcnQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbGlua1xyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB0cmFja0xpbmtCeShpbmRleCwgbGluayk6IGFueSB7XHJcbiAgICByZXR1cm4gbGluay5pZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbm9kZVxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB0cmFja05vZGVCeShpbmRleCwgbm9kZSk6IGFueSB7XHJcbiAgICByZXR1cm4gbm9kZS5pZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGNvbG9ycyB0aGUgbm9kZXNcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgc2V0Q29sb3JzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsICdvcmRpbmFsJywgdGhpcy5zZXJpZXNEb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGxlZ2VuZCBvcHRpb25zXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRMZWdlbmRPcHRpb25zKCk6IGFueSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzY2FsZVR5cGU6ICdvcmRpbmFsJyxcclxuICAgICAgZG9tYWluOiB0aGlzLnNlcmllc0RvbWFpbixcclxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9yc1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG1vdXNlIG1vdmUgZXZlbnQsIHVzZWQgZm9yIHBhbm5pbmcgYW5kIGRyYWdnaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlTW92ZSgkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMub25QYW4oJGV2ZW50KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMub25EcmFnKCRldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBzdGFydCBldmVudCB0byBlbmFibGUgcGFubmluZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uVG91Y2hTdGFydChldmVudCkge1xyXG4gICAgdGhpcy5fdG91Y2hMYXN0WCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICB0aGlzLl90b3VjaExhc3RZID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcclxuXHJcbiAgICB0aGlzLmlzUGFubmluZyA9IHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2htb3ZlJywgWyckZXZlbnQnXSlcclxuICBvblRvdWNoTW92ZSgkZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XHJcbiAgICAgIGNvbnN0IGNsaWVudFggPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgY2xpZW50WSA9ICRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBjb25zdCBtb3ZlbWVudFggPSBjbGllbnRYIC0gdGhpcy5fdG91Y2hMYXN0WDtcclxuICAgICAgY29uc3QgbW92ZW1lbnRZID0gY2xpZW50WSAtIHRoaXMuX3RvdWNoTGFzdFk7XHJcbiAgICAgIHRoaXMuX3RvdWNoTGFzdFggPSBjbGllbnRYO1xyXG4gICAgICB0aGlzLl90b3VjaExhc3RZID0gY2xpZW50WTtcclxuXHJcbiAgICAgIHRoaXMucGFuKG1vdmVtZW50WCwgbW92ZW1lbnRZKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIHRvdWNoIGVuZCBldmVudCB0byBkaXNhYmxlIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblRvdWNoRW5kKGV2ZW50KSB7XHJcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbW91c2UgdXAgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nL2RyYWdnaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcpXHJcbiAgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdFbmQpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnRW5kKHRoaXMuZHJhZ2dpbmdOb2RlLCBldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBub2RlIG1vdXNlIGRvd24gdG8ga2ljayBvZmYgZHJhZ2dpbmdcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uTm9kZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCwgbm9kZTogYW55KTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICB0aGlzLmRyYWdnaW5nTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQobm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2VudGVyIHRoZSBncmFwaCBpbiB0aGUgdmlld3BvcnRcclxuICAgKi9cclxuICBjZW50ZXIoKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhblRvKFxyXG4gICAgICB0aGlzLmRpbXMud2lkdGggLyAyIC0gKHRoaXMuZ3JhcGhEaW1zLndpZHRoICogdGhpcy56b29tTGV2ZWwpIC8gMixcclxuICAgICAgdGhpcy5kaW1zLmhlaWdodCAvIDIgLSAodGhpcy5ncmFwaERpbXMuaGVpZ2h0ICogdGhpcy56b29tTGV2ZWwpIC8gMlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb21zIHRvIGZpdCB0aGUgZW50aWVyIGdyYXBoXHJcbiAgICovXHJcbiAgem9vbVRvRml0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgaGVpZ2h0Wm9vbSA9IHRoaXMuZGltcy5oZWlnaHQgLyB0aGlzLmdyYXBoRGltcy5oZWlnaHQ7XHJcbiAgICBjb25zdCB3aWR0aFpvb20gPSB0aGlzLmRpbXMud2lkdGggLyB0aGlzLmdyYXBoRGltcy53aWR0aDtcclxuICAgIGNvbnN0IHpvb21MZXZlbCA9IE1hdGgubWluKGhlaWdodFpvb20sIHdpZHRoWm9vbSwgMSk7XHJcbiAgICBpZiAoem9vbUxldmVsICE9PSB0aGlzLnpvb21MZXZlbCkge1xyXG4gICAgICB0aGlzLnpvb21MZXZlbCA9IHpvb21MZXZlbDtcclxuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc3RvcmVab29tQmVmb3JlTG9hZCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmF1dG9ab29tKSB7XHJcbiAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnpvb21MZXZlbCA9IHRoaXMuem9vbUJlZm9yZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNhdmVab29tQmVmb3JlTG9hZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuem9vbUJlZm9yZSA9IHRoaXMuem9vbUxldmVsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIE91dHB1dCwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBNb3VzZXdoZWVsIGRpcmVjdGl2ZVxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vU29kaGFuYUxpYnJhcnkvYW5ndWxhcjItZXhhbXBsZXMvYmxvYi9tYXN0ZXIvYXBwL21vdXNlV2hlZWxEaXJlY3RpdmUvbW91c2V3aGVlbC5kaXJlY3RpdmUudHNcclxuICpcclxuICogQGV4cG9ydFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW21vdXNlV2hlZWxdJyB9KVxyXG5leHBvcnQgY2xhc3MgTW91c2VXaGVlbERpcmVjdGl2ZSB7XHJcbiAgQE91dHB1dCgpXHJcbiAgbW91c2VXaGVlbFVwID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKVxyXG4gIG1vdXNlV2hlZWxEb3duID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxDaHJvbWUoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZVdoZWVsRmlyZWZveChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ29ubW91c2V3aGVlbCcsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZVdoZWVsSUUoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XHJcbiAgfVxyXG5cclxuICBtb3VzZVdoZWVsRnVuYyhldmVudDogYW55KTogdm9pZCB7XHJcbiAgICBpZiAod2luZG93LmV2ZW50KSB7XHJcbiAgICAgIGV2ZW50ID0gd2luZG93LmV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlbHRhID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIGV2ZW50LndoZWVsRGVsdGEgfHwgLWV2ZW50LmRldGFpbCkpO1xyXG4gICAgaWYgKGRlbHRhID4gMCkge1xyXG4gICAgICB0aGlzLm1vdXNlV2hlZWxVcC5lbWl0KGV2ZW50KTtcclxuICAgIH0gZWxzZSBpZiAoZGVsdGEgPCAwKSB7XHJcbiAgICAgIHRoaXMubW91c2VXaGVlbERvd24uZW1pdChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZm9yIElFXHJcbiAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8vIGZvciBDaHJvbWUgYW5kIEZpcmVmb3hcclxuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBHcmFwaENvbXBvbmVudCB9IGZyb20gJy4vZ3JhcGguY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2hhcnRDb21tb25Nb2R1bGUgfSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XHJcbmltcG9ydCB7IE1vdXNlV2hlZWxEaXJlY3RpdmUgfSBmcm9tICcuL21vdXNlLXdoZWVsLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL2xheW91dHMvbGF5b3V0LnNlcnZpY2UnO1xyXG5leHBvcnQgeyBHcmFwaENvbXBvbmVudCB9O1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbQ2hhcnRDb21tb25Nb2R1bGVdLFxyXG4gIGRlY2xhcmF0aW9uczogW0dyYXBoQ29tcG9uZW50LCBNb3VzZVdoZWVsRGlyZWN0aXZlXSxcclxuICBleHBvcnRzOiBbR3JhcGhDb21wb25lbnQsIE1vdXNlV2hlZWxEaXJlY3RpdmVdLFxyXG4gIHByb3ZpZGVyczogW0xheW91dFNlcnZpY2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcmFwaE1vZHVsZSB7fVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBHcmFwaE1vZHVsZSB9IGZyb20gJy4vZ3JhcGgvZ3JhcGgubW9kdWxlJztcclxuaW1wb3J0IHsgTmd4Q2hhcnRzTW9kdWxlIH0gZnJvbSAnQHN3aW1sYW5lL25neC1jaGFydHMnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9tb2RlbHMvaW5kZXgnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbTmd4Q2hhcnRzTW9kdWxlXSxcclxuICBleHBvcnRzOiBbR3JhcGhNb2R1bGVdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hHcmFwaE1vZHVsZSB7fVxyXG4iXSwibmFtZXMiOlsiZGFncmUubGF5b3V0IiwiZGFncmUuZ3JhcGhsaWIiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiT3JpZW50YXRpb24iLCJ0c2xpYl8xLl9fZXh0ZW5kcyIsImxheW91dCIsInNoYXBlLmN1cnZlQnVuZGxlIiwibGluZSIsInRzbGliXzEuX19zcHJlYWQiLCJzaGFwZVxyXG4gICAgICAgICAgICAubGluZSIsIm5nVHJhbnNpdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU0sS0FBSyxHQUFHLEVBQUU7Ozs7OztBQU1oQixTQUFnQixFQUFFOztRQUNaLEtBQUssR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRGLEtBQUssR0FBRyxNQUFJLEtBQU8sQ0FBQzs7SUFHcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNqQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLEVBQUUsRUFBRSxDQUFDO0NBQ2I7Ozs7Ozs7O0lDWEMsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTs7QUFzQnRCO0lBQUE7UUFDRSxvQkFBZSxHQUFrQjtZQUMvQixXQUFXLEVBQUUsV0FBVyxDQUFDLGFBQWE7WUFDdEMsT0FBTyxFQUFFLEVBQUU7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