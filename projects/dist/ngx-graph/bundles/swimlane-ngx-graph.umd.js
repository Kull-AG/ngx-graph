(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('dagre'), require('d3-force'), require('rxjs'), require('@angular/core'), require('@angular/animations'), require('@swimlane/ngx-charts'), require('d3-selection'), require('d3-shape'), require('d3-transition'), require('rxjs/operators'), require('transformation-matrix')) :
    typeof define === 'function' && define.amd ? define('@swimlane/ngx-graph', ['exports', 'dagre', 'd3-force', 'rxjs', '@angular/core', '@angular/animations', '@swimlane/ngx-charts', 'd3-selection', 'd3-shape', 'd3-transition', 'rxjs/operators', 'transformation-matrix'], factory) :
    (factory((global.swimlane = global.swimlane || {}, global.swimlane['ngx-graph'] = {}),null,null,global.rxjs,global.ng.core,global.ng.animations,null,null,null,null,global.rxjs.operators,null));
}(this, (function (exports,dagre,d3Force,rxjs,core,animations,ngxCharts,d3Selection,shape,d3Transition,operators,transformationMatrix) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

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
                dagre.layout(this.dagreGraph);
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
                this.dagreGraph = new dagre.graphlib.Graph();
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
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return))
                            _a.call(_c);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                try {
                    // update dagre
                    for (var _e = __values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var edge = _f.value;
                        this.dagreGraph.setEdge(edge.source, edge.target);
                    }
                }
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return))
                            _b.call(_e);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
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
                dagre.layout(this.dagreGraph);
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
                this.dagreGraph = new dagre.graphlib.Graph({ compound: true });
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
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return))
                            _a.call(_d);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
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
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return))
                            _b.call(_f);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
                }
                try {
                    // update dagre
                    for (var _h = __values(this.dagreEdges), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var edge = _j.value;
                        this.dagreGraph.setEdge(edge.source, edge.target);
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_j && !_j.done && (_c = _h.return))
                            _c.call(_h);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
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
                dagre.layout(this.dagreGraph);
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
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
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
                this.dagreGraph = new dagre.graphlib.Graph();
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
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return))
                            _a.call(_c);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
                }
                try {
                    // update dagre
                    for (var _e = __values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var edge = _f.value;
                        this.dagreGraph.setEdge(edge.source, edge.target);
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return))
                            _b.call(_e);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
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
                force: d3Force.forceSimulation()
                    .force('charge', d3Force.forceManyBody().strength(-150))
                    .force('collide', d3Force.forceCollide(5)),
                forceLink: d3Force.forceLink()
                    .id(function (node) { return node.id; })
                    .distance(function () { return 100; })
            };
            this.settings = {};
            this.outputGraph$ = new rxjs.Subject();
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
                    nodes: ( /** @type {?} */(__spread(this.inputGraph.nodes.map(function (n) { return (__assign({}, n)); })))),
                    edges: ( /** @type {?} */(__spread(this.inputGraph.edges.map(function (e) { return (__assign({}, e)); }))))
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
                this.outputGraph.nodes = this.d3Graph.nodes.map(function (node) {
                    return (__assign({}, node, { id: node.id || id(), position: {
                            x: node.x,
                            y: node.y
                        }, dimension: {
                            width: (node.dimension && node.dimension.width) || 20,
                            height: (node.dimension && node.dimension.height) || 20
                        }, transform: "translate(" + (node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0) + ", " + (node.y -
                            ((node.dimension && node.dimension.height) || 20) / 2 || 0) + ")" }));
                });
                this.outputGraph.edges = this.d3Graph.edges.map(function (edge) {
                    return (__assign({}, edge, { source: toD3Node(edge.source).id, target: toD3Node(edge.target).id, points: [
                            {
                                x: toD3Node(edge.source).x,
                                y: toD3Node(edge.source).y
                            },
                            {
                                x: toD3Node(edge.target).x,
                                y: toD3Node(edge.target).y
                            }
                        ] }));
                });
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
            { type: core.Injectable },
        ];
        return LayoutService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    console.log('EL REF', core.ElementRef);
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
            _this.activate = new core.EventEmitter();
            _this.deactivate = new core.EventEmitter();
            _this.graphSubscription = new rxjs.Subscription();
            _this.subscriptions = [];
            _this.margin = [0, 0, 0, 0];
            _this.results = [];
            _this.isPanning = false;
            _this.isDragging = false;
            _this.initialized = false;
            _this.graphDims = { width: 0, height: 0 };
            _this._oldLinks = [];
            _this.transformationMatrix = transformationMatrix.identity();
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
             */ function () {
                return this.transformationMatrix.a;
            },
            /**
             * Set the current zoom level
             */
            set: /**
             * Set the current zoom level
             * @param {?} level
             * @return {?}
             */ function (level) {
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
             */ function () {
                return this.transformationMatrix.e;
            },
            /**
             * Set the current `x` position of the graph
             */
            set: /**
             * Set the current `x` position of the graph
             * @param {?} x
             * @return {?}
             */ function (x) {
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
             */ function () {
                return this.transformationMatrix.f;
            },
            /**
             * Set the current `y` position of the graph
             */
            set: /**
             * Set the current `y` position of the graph
             * @param {?} y
             * @return {?}
             */ function (y) {
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
                    for (var _b = __values(this.subscriptions), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var sub = _c.value;
                        sub.unsubscribe();
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
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
                    _this.dims = ngxCharts.calculateViewDimensions({
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
                var result$ = result instanceof rxjs.Observable ? result : rxjs.of(result);
                this.graphSubscription.add(result$.subscribe(function (graph) {
                    _this.graph = graph;
                    _this.tick();
                }));
                result$
                    .pipe(operators.first(function (graph) { return graph.nodes.length > 0; }))
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
                if (_animate === void 0) {
                    _animate = true;
                }
                this.linkElements.map(function (linkEl) {
                    /** @type {?} */
                    var edge = _this.graph.edges.find(function (lin) { return lin.id === linkEl.nativeElement.id; });
                    if (edge) {
                        /** @type {?} */
                        var linkSelection = d3Selection.select(linkEl.nativeElement).select('.line');
                        linkSelection
                            .attr('d', edge.oldLine)
                            .transition()
                            .duration(_animate ? 500 : 0)
                            .attr('d', edge.line);
                        /** @type {?} */
                        var textPathSelection = d3Selection.select(_this.chartElement.nativeElement).select("#" + edge.id);
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
                this.graphSubscription = new rxjs.Subscription();
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
                var lineFunction = shape.line()
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
                if (zoomLevel === void 0) {
                    zoomLevel = this.zoomLevel;
                }
                this.transformationMatrix = transformationMatrix.transform(this.transformationMatrix, transformationMatrix.translate(x / zoomLevel, y / zoomLevel));
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
                this.transformationMatrix = transformationMatrix.transform(this.transformationMatrix, transformationMatrix.scale(factor, factor));
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
                        (( /** @type {?} */(link.target))).id === node.id ||
                        (( /** @type {?} */(link.source))).id === node.id) {
                        if (this_2.layout && typeof this_2.layout !== 'string') {
                            /** @type {?} */
                            var result = this_2.layout.updateEdge(this_2.graph, link);
                            /** @type {?} */
                            var result$ = result instanceof rxjs.Observable ? result : rxjs.of(result);
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
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
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
                this.transform = transformationMatrix.toSVG(this.transformationMatrix);
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
                this.colors = new ngxCharts.ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
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
            { type: core.Component, args: [{
                        selector: 'ngx-graph',
                        styles: [".graph{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.graph .edge{stroke:#666;fill:none}.graph .edge .edge-label{stroke:none;font-size:12px;fill:#251e1e}.graph .panning-rect{fill:transparent;cursor:move}.graph .node-group .node:focus{outline:0}.graph .cluster rect{opacity:.2}"],
                        template: "\n  <ngx-charts-chart [view]=\"[width, height]\" [showLegend]=\"legend\" [legendOptions]=\"legendOptions\" (legendLabelClick)=\"onClick($event, undefined)\"\n  (legendLabelActivate)=\"onActivate($event)\" (legendLabelDeactivate)=\"onDeactivate($event)\" mouseWheel (mouseWheelUp)=\"onZoom($event, 'in')\"\n  (mouseWheelDown)=\"onZoom($event, 'out')\">\n  <svg:g *ngIf=\"initialized && graph\" [attr.transform]=\"transform\" (touchstart)=\"onTouchStart($event)\" (touchend)=\"onTouchEnd($event)\"\n    class=\"graph chart\">\n    <defs>\n      <ng-template *ngIf=\"defsTemplate\" [ngTemplateOutlet]=\"defsTemplate\">\n      </ng-template>\n      <svg:path class=\"text-path\" *ngFor=\"let link of graph.edges\" [attr.d]=\"link.textPath\" [attr.id]=\"link.id\">\n      </svg:path>\n    </defs>\n    <svg:rect class=\"panning-rect\" [attr.width]=\"dims.width * 100\" [attr.height]=\"dims.height * 100\" [attr.transform]=\"'translate(' + ((-dims.width || 0) * 50) +',' + ((-dims.height || 0) *50) + ')' \"\n      (mousedown)=\"isPanning = true\" />\n      <svg:g class=\"clusters\">\n        <svg:g #clusterElement *ngFor=\"let node of graph.clusters; trackBy: trackNodeBy\" class=\"node-group\" [id]=\"node.id\" [attr.transform]=\"node.transform\"\n          (click)=\"onClick(node,$event)\">\n          <ng-template *ngIf=\"clusterTemplate\" [ngTemplateOutlet]=\"clusterTemplate\" [ngTemplateOutletContext]=\"{ $implicit: node }\">\n          </ng-template>\n          <svg:g *ngIf=\"!clusterTemplate\" class=\"node cluster\">\n            <svg:rect [attr.width]=\"node.dimension.width\" [attr.height]=\"node.dimension.height\" [attr.fill]=\"node.data?.color\" />\n            <svg:text alignment-baseline=\"central\" [attr.x]=\"10\" [attr.y]=\"node.dimension.height / 2\">{{node.label}}</svg:text>\n          </svg:g>\n        </svg:g>\n      </svg:g>\n      <svg:g class=\"links\">\n      <svg:g #linkElement *ngFor=\"let link of graph.edges; trackBy: trackLinkBy\" class=\"link-group\" [id]=\"link.id\">\n        <ng-template *ngIf=\"linkTemplate\" [ngTemplateOutlet]=\"linkTemplate\" [ngTemplateOutletContext]=\"{ $implicit: link }\">\n        </ng-template>\n        <svg:path *ngIf=\"!linkTemplate\" class=\"edge\" [attr.d]=\"link.line\" />\n      </svg:g>\n    </svg:g>\n    <svg:g class=\"nodes\">\n      <svg:g #nodeElement *ngFor=\"let node of graph.nodes; trackBy: trackNodeBy\" class=\"node-group\" [id]=\"node.id\" [attr.transform]=\"node.transform\"\n        (click)=\"onClick(node,$event)\" (mousedown)=\"onNodeMouseDown($event, node)\" (dblclick)=\"onDoubleClick(node,$event)\">\n        <ng-template *ngIf=\"nodeTemplate\" [ngTemplateOutlet]=\"nodeTemplate\" [ngTemplateOutletContext]=\"{ $implicit: node }\">\n        </ng-template>\n        <svg:circle *ngIf=\"!nodeTemplate\" r=\"10\" [attr.cx]=\"node.dimension.width / 2\" [attr.cy]=\"node.dimension.height / 2\" [attr.fill]=\"node.data?.color\"\n        />\n      </svg:g>\n    </svg:g>\n  </svg:g>\n</ngx-charts-chart>\n  ",
                        encapsulation: core.ViewEncapsulation.None,
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        animations: [animations.trigger('link', [animations.transition('* => *', [animations.animate(500, animations.style({ transform: '*' }))])])]
                    },] },
        ];
        /** @nocollapse */
        GraphComponent.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.NgZone },
                { type: core.ChangeDetectorRef },
                { type: LayoutService }
            ];
        };
        GraphComponent.propDecorators = {
            legend: [{ type: core.Input }],
            nodes: [{ type: core.Input }],
            clusters: [{ type: core.Input }],
            links: [{ type: core.Input }],
            activeEntries: [{ type: core.Input }],
            curve: [{ type: core.Input }],
            draggingEnabled: [{ type: core.Input }],
            nodeHeight: [{ type: core.Input }],
            nodeMaxHeight: [{ type: core.Input }],
            nodeMinHeight: [{ type: core.Input }],
            nodeWidth: [{ type: core.Input }],
            nodeMinWidth: [{ type: core.Input }],
            nodeMaxWidth: [{ type: core.Input }],
            panningEnabled: [{ type: core.Input }],
            enableZoom: [{ type: core.Input }],
            zoomSpeed: [{ type: core.Input }],
            minZoomLevel: [{ type: core.Input }],
            maxZoomLevel: [{ type: core.Input }],
            autoZoom: [{ type: core.Input }],
            panOnZoom: [{ type: core.Input }],
            autoCenter: [{ type: core.Input }],
            update$: [{ type: core.Input }],
            center$: [{ type: core.Input }],
            zoomToFit$: [{ type: core.Input }],
            layout: [{ type: core.Input }],
            layoutSettings: [{ type: core.Input }],
            activate: [{ type: core.Output }],
            deactivate: [{ type: core.Output }],
            linkTemplate: [{ type: core.ContentChild, args: ['linkTemplate',] }],
            nodeTemplate: [{ type: core.ContentChild, args: ['nodeTemplate',] }],
            clusterTemplate: [{ type: core.ContentChild, args: ['clusterTemplate',] }],
            defsTemplate: [{ type: core.ContentChild, args: ['defsTemplate',] }],
            chart: [{ type: core.ViewChild, args: [ngxCharts.ChartComponent, { read: core.ElementRef },] }],
            nodeElements: [{ type: core.ViewChildren, args: ['nodeElement',] }],
            linkElements: [{ type: core.ViewChildren, args: ['linkElement',] }],
            groupResultsBy: [{ type: core.Input }],
            zoomLevel: [{ type: core.Input, args: ['zoomLevel',] }],
            panOffsetX: [{ type: core.Input, args: ['panOffsetX',] }],
            panOffsetY: [{ type: core.Input, args: ['panOffsetY',] }],
            onMouseMove: [{ type: core.HostListener, args: ['document:mousemove', ['$event'],] }],
            onTouchMove: [{ type: core.HostListener, args: ['document:touchmove', ['$event'],] }],
            onMouseUp: [{ type: core.HostListener, args: ['document:mouseup',] }]
        };
        return GraphComponent;
    }(ngxCharts.BaseChartComponent));

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
            this.mouseWheelUp = new core.EventEmitter();
            this.mouseWheelDown = new core.EventEmitter();
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
            { type: core.Directive, args: [{ selector: '[mouseWheel]' },] },
        ];
        MouseWheelDirective.propDecorators = {
            mouseWheelUp: [{ type: core.Output }],
            mouseWheelDown: [{ type: core.Output }],
            onMouseWheelChrome: [{ type: core.HostListener, args: ['mousewheel', ['$event'],] }],
            onMouseWheelFirefox: [{ type: core.HostListener, args: ['DOMMouseScroll', ['$event'],] }],
            onMouseWheelIE: [{ type: core.HostListener, args: ['onmousewheel', ['$event'],] }]
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
            { type: core.NgModule, args: [{
                        imports: [ngxCharts.ChartCommonModule],
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
    var NgxGraphModule = /** @class */ (function () {
        function NgxGraphModule() {
        }
        NgxGraphModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [ngxCharts.NgxChartsModule],
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

    exports.NgxGraphModule = NgxGraphModule;
    exports.ɵa = GraphComponent;
    exports.ɵb = GraphModule;
    exports.ɵc = LayoutService;
    exports.ɵd = MouseWheelDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWdyYXBoLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi91dGlscy9pZC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZUNsdXN0ZXIudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZDNGb3JjZURpcmVjdGVkLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9sYXlvdXRzL2xheW91dC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL21vdXNlLXdoZWVsLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvZ3JhcGgubW9kdWxlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9uZ3gtZ3JhcGgubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiY29uc3QgY2FjaGUgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBzaG9ydCBpZC5cclxuICpcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpZCgpOiBzdHJpbmcge1xyXG4gIGxldCBuZXdJZCA9ICgnMDAwMCcgKyAoKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygzNiwgNCkpIDw8IDApLnRvU3RyaW5nKDM2KSkuc2xpY2UoLTQpO1xyXG5cclxuICBuZXdJZCA9IGBhJHtuZXdJZH1gO1xyXG5cclxuICAvLyBlbnN1cmUgbm90IGFscmVhZHkgdXNlZFxyXG4gIGlmICghY2FjaGVbbmV3SWRdKSB7XHJcbiAgICBjYWNoZVtuZXdJZF0gPSB0cnVlO1xyXG4gICAgcmV0dXJuIG5ld0lkO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlkKCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XHJcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuXHJcbmV4cG9ydCBlbnVtIE9yaWVudGF0aW9uIHtcclxuICBMRUZUX1RPX1JJR0hUID0gJ0xSJyxcclxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcclxuICBUT1BfVE9fQk9UVE9NID0gJ1RCJyxcclxuICBCT1RUT01fVE9fVE9NID0gJ0JUJ1xyXG59XHJcbmV4cG9ydCBlbnVtIEFsaWdubWVudCB7XHJcbiAgQ0VOVEVSID0gJ0MnLFxyXG4gIFVQX0xFRlQgPSAnVUwnLFxyXG4gIFVQX1JJR0hUID0gJ1VSJyxcclxuICBET1dOX0xFRlQgPSAnREwnLFxyXG4gIERPV05fUklHSFQgPSAnRFInXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XHJcbiAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbjtcclxuICBtYXJnaW5YPzogbnVtYmVyO1xyXG4gIG1hcmdpblk/OiBudW1iZXI7XHJcbiAgZWRnZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgcmFua1BhZGRpbmc/OiBudW1iZXI7XHJcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgYWxpZ24/OiBBbGlnbm1lbnQ7XHJcbiAgYWN5Y2xpY2VyPzogJ2dyZWVkeScgfCB1bmRlZmluZWQ7XHJcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERhZ3JlTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcclxuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7XHJcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcclxuICAgIG1hcmdpblg6IDIwLFxyXG4gICAgbWFyZ2luWTogMjAsXHJcbiAgICBlZGdlUGFkZGluZzogMTAwLFxyXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcclxuICAgIG5vZGVQYWRkaW5nOiA1MFxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgZGFncmVHcmFwaDogYW55O1xyXG4gIGRhZ3JlTm9kZXM6IGFueTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcclxuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcclxuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiBkYWdyZU5vZGUueCxcclxuICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICB9O1xyXG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xyXG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XHJcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXHJcbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ID8gLTEgOiAxO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcclxuICAgICAgeDogc291cmNlTm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgLSBkaXIgKiAoc291cmNlTm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcclxuICAgICAgeDogdGFyZ2V0Tm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiB0YXJnZXROb2RlLnBvc2l0aW9uLnkgKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcblxyXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xyXG4gICAgZWRnZS5wb2ludHMgPSBbc3RhcnRpbmdQb2ludCwgZW5kaW5nUG9pbnRdO1xyXG4gICAgXHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoKTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcclxuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXHJcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXHJcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXHJcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxyXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcclxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXHJcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcclxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXHJcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvKiBlbXB0eSAqL1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xyXG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcclxuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xyXG4gICAgICBub2RlLmhlaWdodCA9IG4uZGltZW5zaW9uLmhlaWdodDtcclxuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xyXG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XHJcbiAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICBjb25zdCBuZXdMaW5rOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XHJcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ld0xpbms7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XHJcbiAgICAgIGlmICghbm9kZS53aWR0aCkge1xyXG4gICAgICAgIG5vZGUud2lkdGggPSAyMDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIW5vZGUuaGVpZ2h0KSB7XHJcbiAgICAgICAgbm9kZS5oZWlnaHQgPSAzMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcbmltcG9ydCB7IE5vZGUsIENsdXN0ZXJOb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL25vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBEYWdyZVNldHRpbmdzLCBPcmllbnRhdGlvbiB9IGZyb20gJy4vZGFncmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ3JlQ2x1c3RlckxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XHJcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge1xyXG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXHJcbiAgICBtYXJnaW5YOiAyMCxcclxuICAgIG1hcmdpblk6IDIwLFxyXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcclxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXHJcbiAgICBub2RlUGFkZGluZzogNTBcclxuICB9O1xyXG4gIHNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge307XHJcblxyXG4gIGRhZ3JlR3JhcGg6IGFueTtcclxuICBkYWdyZU5vZGVzOiBOb2RlW107XHJcbiAgZGFncmVDbHVzdGVyczogQ2x1c3Rlck5vZGVbXTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBjb25zdCBkYWdyZVRvT3V0cHV0ID0gbm9kZSA9PiB7XHJcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbbm9kZS5pZF07XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4ubm9kZSxcclxuICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgeDogZGFncmVOb2RlLngsXHJcbiAgICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGltZW5zaW9uOiB7XHJcbiAgICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICAgIGdyYXBoLmNsdXN0ZXJzID0gKGdyYXBoLmNsdXN0ZXJzIHx8IFtdKS5tYXAoZGFncmVUb091dHB1dCk7XHJcbiAgICBncmFwaC5ub2RlcyA9IGdyYXBoLm5vZGVzLm1hcChkYWdyZVRvT3V0cHV0KTtcclxuXHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcclxuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xyXG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxyXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbi55IDw9IHRhcmdldE5vZGUucG9zaXRpb24ueSA/IC0xIDogMTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nUG9pbnQgPSB7XHJcbiAgICAgIHg6IHNvdXJjZU5vZGUucG9zaXRpb24ueCxcclxuICAgICAgeTogc291cmNlTm9kZS5wb3NpdGlvbi55IC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XHJcbiAgICAgIHg6IHRhcmdldE5vZGUucG9zaXRpb24ueCxcclxuICAgICAgeTogdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGdlbmVyYXRlIG5ldyBwb2ludHNcclxuICAgIGVkZ2UucG9pbnRzID0gW3N0YXJ0aW5nUG9pbnQsIGVuZGluZ1BvaW50XTtcclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcclxuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCh7IGNvbXBvdW5kOiB0cnVlIH0pO1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xyXG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcclxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcclxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcclxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXHJcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxyXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcclxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxyXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcclxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXJcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8qIGVtcHR5ICovXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAoKG46IE5vZGUpID0+IHtcclxuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XHJcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcclxuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XHJcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcclxuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVDbHVzdGVycyA9IGdyYXBoLmNsdXN0ZXJzIHx8IFtdO1xyXG5cclxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xyXG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdMaW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGNsdXN0ZXIgb2YgdGhpcy5kYWdyZUNsdXN0ZXJzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKGNsdXN0ZXIuaWQsIGNsdXN0ZXIpO1xyXG4gICAgICBjbHVzdGVyLmNoaWxkTm9kZUlkcy5mb3JFYWNoKGNoaWxkTm9kZUlkID0+IHtcclxuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0UGFyZW50KGNoaWxkTm9kZUlkLCBjbHVzdGVyLmlkKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgdGhpcy5kYWdyZUVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XHJcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuXHJcbmV4cG9ydCBlbnVtIE9yaWVudGF0aW9uIHtcclxuICBMRUZUX1RPX1JJR0hUID0gJ0xSJyxcclxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcclxuICBUT1BfVE9fQk9UVE9NID0gJ1RCJyxcclxuICBCT1RUT01fVE9fVE9NID0gJ0JUJ1xyXG59XHJcbmV4cG9ydCBlbnVtIEFsaWdubWVudCB7XHJcbiAgQ0VOVEVSID0gJ0MnLFxyXG4gIFVQX0xFRlQgPSAnVUwnLFxyXG4gIFVQX1JJR0hUID0gJ1VSJyxcclxuICBET1dOX0xFRlQgPSAnREwnLFxyXG4gIERPV05fUklHSFQgPSAnRFInXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XHJcbiAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbjtcclxuICBtYXJnaW5YPzogbnVtYmVyO1xyXG4gIG1hcmdpblk/OiBudW1iZXI7XHJcbiAgZWRnZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgcmFua1BhZGRpbmc/OiBudW1iZXI7XHJcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgYWxpZ24/OiBBbGlnbm1lbnQ7XHJcbiAgYWN5Y2xpY2VyPzogJ2dyZWVkeScgfCB1bmRlZmluZWQ7XHJcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEYWdyZU5vZGVzT25seVNldHRpbmdzIGV4dGVuZHMgRGFncmVTZXR0aW5ncyB7XHJcbiAgY3VydmVEaXN0YW5jZT86IG51bWJlcjtcclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9FREdFX05BTUUgPSAnXFx4MDAnO1xyXG5jb25zdCBHUkFQSF9OT0RFID0gJ1xceDAwJztcclxuY29uc3QgRURHRV9LRVlfREVMSU0gPSAnXFx4MDEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ3JlTm9kZXNPbmx5TGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcclxuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7XHJcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcclxuICAgIG1hcmdpblg6IDIwLFxyXG4gICAgbWFyZ2luWTogMjAsXHJcbiAgICBlZGdlUGFkZGluZzogMTAwLFxyXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcclxuICAgIG5vZGVQYWRkaW5nOiA1MCxcclxuICAgIGN1cnZlRGlzdGFuY2U6IDIwXHJcbiAgfTtcclxuICBzZXR0aW5nczogRGFncmVOb2Rlc09ubHlTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBkYWdyZUdyYXBoOiBhbnk7XHJcbiAgZGFncmVOb2RlczogYW55O1xyXG4gIGRhZ3JlRWRnZXM6IGFueTtcclxuXHJcbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcclxuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XHJcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcclxuXHJcbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xyXG5cclxuICAgIGZvciAoY29uc3QgZGFncmVOb2RlSWQgaW4gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlcykge1xyXG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW2RhZ3JlTm9kZUlkXTtcclxuICAgICAgY29uc3Qgbm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBkYWdyZU5vZGUuaWQpO1xyXG4gICAgICBub2RlLnBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IGRhZ3JlTm9kZS54LFxyXG4gICAgICAgIHk6IGRhZ3JlTm9kZS55XHJcbiAgICAgIH07XHJcbiAgICAgIG5vZGUuZGltZW5zaW9uID0ge1xyXG4gICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgZ3JhcGguZWRnZXMpIHtcclxuICAgICAgdGhpcy51cGRhdGVFZGdlKGdyYXBoLCBlZGdlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcclxuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xyXG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XHJcbiAgICBjb25zdCByYW5rQXhpczogJ3gnIHwgJ3knID0gdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ0JUJyB8fCB0aGlzLnNldHRpbmdzLm9yaWVudGF0aW9uID09PSAnVEInID8gJ3knIDogJ3gnO1xyXG4gICAgY29uc3Qgb3JkZXJBeGlzOiAneCcgfCAneScgPSByYW5rQXhpcyA9PT0gJ3knID8gJ3gnIDogJ3knO1xyXG4gICAgY29uc3QgcmFua0RpbWVuc2lvbiA9IHJhbmtBeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXHJcbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSA/IC0xIDogMTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nUG9pbnQgPSB7XHJcbiAgICAgIFtvcmRlckF4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXHJcbiAgICAgIFtyYW5rQXhpc106IHNvdXJjZU5vZGUucG9zaXRpb25bcmFua0F4aXNdIC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uW3JhbmtEaW1lbnNpb25dIC8gMilcclxuICAgIH07XHJcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcclxuICAgICAgW29yZGVyQXhpc106IHRhcmdldE5vZGUucG9zaXRpb25bb3JkZXJBeGlzXSxcclxuICAgICAgW3JhbmtBeGlzXTogdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb25bcmFua0RpbWVuc2lvbl0gLyAyKVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjdXJ2ZURpc3RhbmNlID0gdGhpcy5zZXR0aW5ncy5jdXJ2ZURpc3RhbmNlIHx8IHRoaXMuZGVmYXVsdFNldHRpbmdzLmN1cnZlRGlzdGFuY2U7XHJcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXHJcbiAgICBlZGdlLnBvaW50cyA9IFtcclxuICAgICAgc3RhcnRpbmdQb2ludCxcclxuICAgICAge1xyXG4gICAgICAgIFtvcmRlckF4aXNdOiBzdGFydGluZ1BvaW50W29yZGVyQXhpc10sXHJcbiAgICAgICAgW3JhbmtBeGlzXTogc3RhcnRpbmdQb2ludFtyYW5rQXhpc10gLSBkaXIgKiBjdXJ2ZURpc3RhbmNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBbb3JkZXJBeGlzXTogZW5kaW5nUG9pbnRbb3JkZXJBeGlzXSxcclxuICAgICAgICBbcmFua0F4aXNdOiBlbmRpbmdQb2ludFtyYW5rQXhpc10gKyBkaXIgKiBjdXJ2ZURpc3RhbmNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGVuZGluZ1BvaW50XHJcbiAgICBdO1xyXG4gICAgY29uc3QgZWRnZUxhYmVsSWQgPSBgJHtlZGdlLnNvdXJjZX0ke0VER0VfS0VZX0RFTElNfSR7ZWRnZS50YXJnZXR9JHtFREdFX0tFWV9ERUxJTX0ke0RFRkFVTFRfRURHRV9OQU1FfWA7XHJcbiAgICBjb25zdCBtYXRjaGluZ0VkZ2VMYWJlbCA9IGdyYXBoLmVkZ2VMYWJlbHNbZWRnZUxhYmVsSWRdO1xyXG4gICAgaWYgKG1hdGNoaW5nRWRnZUxhYmVsKSB7XHJcbiAgICAgIG1hdGNoaW5nRWRnZUxhYmVsLnBvaW50cyA9IGVkZ2UucG9pbnRzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKCk7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XHJcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxyXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxyXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxyXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcclxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXHJcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxyXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXHJcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxyXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlclxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLyogZW1wdHkgKi9cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XHJcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcclxuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XHJcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcclxuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xyXG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdMaW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xyXG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcclxuICAgICAgICBub2RlLndpZHRoID0gMjA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xyXG4gICAgICAgIG5vZGUuaGVpZ2h0ID0gMzA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL25vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0IHsgZm9yY2VDb2xsaWRlLCBmb3JjZUxpbmssIGZvcmNlTWFueUJvZHksIGZvcmNlU2ltdWxhdGlvbiB9IGZyb20gJ2QzLWZvcmNlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyB7XHJcbiAgZm9yY2U/OiBhbnk7XHJcbiAgZm9yY2VMaW5rPzogYW55O1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgRDNOb2RlIHtcclxuICBpZD86IHN0cmluZztcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG4gIHdpZHRoPzogbnVtYmVyO1xyXG4gIGhlaWdodD86IG51bWJlcjtcclxuICBmeD86IG51bWJlcjtcclxuICBmeT86IG51bWJlcjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIEQzRWRnZSB7XHJcbiAgc291cmNlOiBzdHJpbmcgfCBEM05vZGU7XHJcbiAgdGFyZ2V0OiBzdHJpbmcgfCBEM05vZGU7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBEM0dyYXBoIHtcclxuICBub2RlczogRDNOb2RlW107XHJcbiAgZWRnZXM6IEQzRWRnZVtdO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVyZ2VkTm9kZSBleHRlbmRzIEQzTm9kZSwgTm9kZSB7XHJcbiAgaWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvRDNOb2RlKG1heWJlTm9kZTogc3RyaW5nIHwgRDNOb2RlKTogRDNOb2RlIHtcclxuICBpZiAodHlwZW9mIG1heWJlTm9kZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlkOiBtYXliZU5vZGUsXHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgfVxyXG4gIHJldHVybiBtYXliZU5vZGU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEM0ZvcmNlRGlyZWN0ZWRMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRDNGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7XHJcbiAgICBmb3JjZTogZm9yY2VTaW11bGF0aW9uPGFueT4oKVxyXG4gICAgICAuZm9yY2UoJ2NoYXJnZScsIGZvcmNlTWFueUJvZHkoKS5zdHJlbmd0aCgtMTUwKSlcclxuICAgICAgLmZvcmNlKCdjb2xsaWRlJywgZm9yY2VDb2xsaWRlKDUpKSxcclxuICAgIGZvcmNlTGluazogZm9yY2VMaW5rPGFueSwgYW55PigpXHJcbiAgICAgIC5pZChub2RlID0+IG5vZGUuaWQpXHJcbiAgICAgIC5kaXN0YW5jZSgoKSA9PiAxMDApXHJcbiAgfTtcclxuICBzZXR0aW5nczogRDNGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgaW5wdXRHcmFwaDogR3JhcGg7XHJcbiAgb3V0cHV0R3JhcGg6IEdyYXBoO1xyXG4gIGQzR3JhcGg6IEQzR3JhcGg7XHJcbiAgb3V0cHV0R3JhcGgkOiBTdWJqZWN0PEdyYXBoPiA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG4gIGRyYWdnaW5nU3RhcnQ6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuXHJcbiAgcnVuKGdyYXBoOiBHcmFwaCk6IE9ic2VydmFibGU8R3JhcGg+IHtcclxuICAgIHRoaXMuaW5wdXRHcmFwaCA9IGdyYXBoO1xyXG4gICAgdGhpcy5kM0dyYXBoID0ge1xyXG4gICAgICBub2RlczogWy4uLnRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5tYXAobiA9PiAoeyAuLi5uIH0pKV0gYXMgYW55LFxyXG4gICAgICBlZGdlczogWy4uLnRoaXMuaW5wdXRHcmFwaC5lZGdlcy5tYXAoZSA9PiAoeyAuLi5lIH0pKV0gYXMgYW55XHJcbiAgICB9O1xyXG4gICAgdGhpcy5vdXRwdXRHcmFwaCA9IHtcclxuICAgICAgbm9kZXM6IFtdLFxyXG4gICAgICBlZGdlczogW10sXHJcbiAgICAgIGVkZ2VMYWJlbHM6IFtdXHJcbiAgICB9O1xyXG4gICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLm91dHB1dEdyYXBoKTtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5mb3JjZSkge1xyXG4gICAgICB0aGlzLnNldHRpbmdzLmZvcmNlXHJcbiAgICAgICAgLm5vZGVzKHRoaXMuZDNHcmFwaC5ub2RlcylcclxuICAgICAgICAuZm9yY2UoJ2xpbmsnLCB0aGlzLnNldHRpbmdzLmZvcmNlTGluay5saW5rcyh0aGlzLmQzR3JhcGguZWRnZXMpKVxyXG4gICAgICAgIC5hbHBoYSgwLjUpXHJcbiAgICAgICAgLnJlc3RhcnQoKVxyXG4gICAgICAgIC5vbigndGljaycsICgpID0+IHtcclxuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5kM0dyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmQzR3JhcGgpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IE9ic2VydmFibGU8R3JhcGg+IHtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgaWYgKHNldHRpbmdzLmZvcmNlKSB7XHJcbiAgICAgIHNldHRpbmdzLmZvcmNlXHJcbiAgICAgICAgLm5vZGVzKHRoaXMuZDNHcmFwaC5ub2RlcylcclxuICAgICAgICAuZm9yY2UoJ2xpbmsnLCBzZXR0aW5ncy5mb3JjZUxpbmsubGlua3ModGhpcy5kM0dyYXBoLmVkZ2VzKSlcclxuICAgICAgICAuYWxwaGEoMC41KVxyXG4gICAgICAgIC5yZXN0YXJ0KClcclxuICAgICAgICAub24oJ3RpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMuZDNHcmFwaFRvT3V0cHV0R3JhcGgodGhpcy5kM0dyYXBoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgZDNHcmFwaFRvT3V0cHV0R3JhcGgoZDNHcmFwaDogRDNHcmFwaCk6IEdyYXBoIHtcclxuICAgIHRoaXMub3V0cHV0R3JhcGgubm9kZXMgPSB0aGlzLmQzR3JhcGgubm9kZXMubWFwKChub2RlOiBNZXJnZWROb2RlKSA9PiAoe1xyXG4gICAgICAuLi5ub2RlLFxyXG4gICAgICBpZDogbm9kZS5pZCB8fCBpZCgpLFxyXG4gICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgIHg6IG5vZGUueCxcclxuICAgICAgICB5OiBub2RlLnlcclxuICAgICAgfSxcclxuICAgICAgZGltZW5zaW9uOiB7XHJcbiAgICAgICAgd2lkdGg6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjAsXHJcbiAgICAgICAgaGVpZ2h0OiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMFxyXG4gICAgICB9LFxyXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtub2RlLnggLSAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCkgLyAyIHx8IDB9LCAke25vZGUueSAtXHJcbiAgICAgICAgKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwKSAvIDIgfHwgMH0pYFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZXMgPSB0aGlzLmQzR3JhcGguZWRnZXMubWFwKGVkZ2UgPT4gKHtcclxuICAgICAgLi4uZWRnZSxcclxuICAgICAgc291cmNlOiB0b0QzTm9kZShlZGdlLnNvdXJjZSkuaWQsXHJcbiAgICAgIHRhcmdldDogdG9EM05vZGUoZWRnZS50YXJnZXQpLmlkLFxyXG4gICAgICBwb2ludHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB4OiB0b0QzTm9kZShlZGdlLnNvdXJjZSkueCxcclxuICAgICAgICAgIHk6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS55XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB4OiB0b0QzTm9kZShlZGdlLnRhcmdldCkueCxcclxuICAgICAgICAgIHk6IHRvRDNOb2RlKGVkZ2UudGFyZ2V0KS55XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlTGFiZWxzID0gdGhpcy5vdXRwdXRHcmFwaC5lZGdlcztcclxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoO1xyXG4gIH1cclxuXHJcbiAgb25EcmFnU3RhcnQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UuYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcclxuICAgIGlmICghbm9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmRyYWdnaW5nU3RhcnQgPSB7IHg6ICRldmVudC54IC0gbm9kZS54LCB5OiAkZXZlbnQueSAtIG5vZGUueSB9O1xyXG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XHJcbiAgICBub2RlLmZ5ID0gJGV2ZW50LnkgLSB0aGlzLmRyYWdnaW5nU3RhcnQueTtcclxuICB9XHJcblxyXG4gIG9uRHJhZyhkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XHJcbiAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XHJcbiAgICBub2RlLmZ5ID0gJGV2ZW50LnkgLSB0aGlzLmRyYWdnaW5nU3RhcnQueTtcclxuICB9XHJcblxyXG4gIG9uRHJhZ0VuZChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XHJcbiAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UuYWxwaGFUYXJnZXQoMCk7XHJcbiAgICBub2RlLmZ4ID0gdW5kZWZpbmVkO1xyXG4gICAgbm9kZS5meSA9IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgRGFncmVMYXlvdXQgfSBmcm9tICcuL2RhZ3JlJztcclxuaW1wb3J0IHsgRGFncmVDbHVzdGVyTGF5b3V0IH0gZnJvbSAnLi9kYWdyZUNsdXN0ZXInO1xyXG5pbXBvcnQgeyBEYWdyZU5vZGVzT25seUxheW91dCB9IGZyb20gJy4vZGFncmVOb2Rlc09ubHknO1xyXG5pbXBvcnQgeyBEM0ZvcmNlRGlyZWN0ZWRMYXlvdXQgfSBmcm9tICcuL2QzRm9yY2VEaXJlY3RlZCc7XHJcblxyXG5jb25zdCBsYXlvdXRzID0ge1xyXG4gIGRhZ3JlOiBEYWdyZUxheW91dCxcclxuICBkYWdyZUNsdXN0ZXI6IERhZ3JlQ2x1c3RlckxheW91dCxcclxuICBkYWdyZU5vZGVzT25seTogRGFncmVOb2Rlc09ubHlMYXlvdXQsXHJcbiAgZDM6IEQzRm9yY2VEaXJlY3RlZExheW91dFxyXG59O1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTGF5b3V0U2VydmljZSB7XHJcbiAgZ2V0TGF5b3V0KG5hbWU6IHN0cmluZyk6IExheW91dCB7XHJcbiAgICBpZiAobGF5b3V0c1tuYW1lXSkge1xyXG4gICAgICByZXR1cm4gbmV3IGxheW91dHNbbmFtZV0oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBsYXlvdXQgdHlwZSAnJHtuYW1lfSdgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gcmVuYW1lIHRyYW5zaXRpb24gZHVlIHRvIGNvbmZsaWN0IHdpdGggZDMgdHJhbnNpdGlvblxyXG5pbXBvcnQgeyBhbmltYXRlLCBzdHlsZSwgdHJhbnNpdGlvbiBhcyBuZ1RyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBDb250ZW50Q2hpbGQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFF1ZXJ5TGlzdCxcclxuICBUZW1wbGF0ZVJlZixcclxuICBWaWV3Q2hpbGQsXHJcbiAgVmlld0NoaWxkcmVuLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG4gIE5nWm9uZSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBPbkNoYW5nZXMsXHJcbiAgU2ltcGxlQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEJhc2VDaGFydENvbXBvbmVudCxcclxuICBDaGFydENvbXBvbmVudCxcclxuICBDb2xvckhlbHBlcixcclxuICBWaWV3RGltZW5zaW9ucyxcclxuICBjYWxjdWxhdGVWaWV3RGltZW5zaW9uc1xyXG59IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0ICogYXMgc2hhcGUgZnJvbSAnZDMtc2hhcGUnO1xyXG5pbXBvcnQgJ2QzLXRyYW5zaXRpb24nO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBpZGVudGl0eSwgc2NhbGUsIHRvU1ZHLCB0cmFuc2Zvcm0sIHRyYW5zbGF0ZSB9IGZyb20gJ3RyYW5zZm9ybWF0aW9uLW1hdHJpeCc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi9tb2RlbHMvbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcblxyXG5jb25zb2xlLmxvZygnRUwgUkVGJywgRWxlbWVudFJlZik7XHJcblxyXG4vKipcclxuICogTWF0cml4XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE1hdHJpeCB7XHJcbiAgYTogbnVtYmVyO1xyXG4gIGI6IG51bWJlcjtcclxuICBjOiBudW1iZXI7XHJcbiAgZDogbnVtYmVyO1xyXG4gIGU6IG51bWJlcjtcclxuICBmOiBudW1iZXI7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdyYXBoJyxcclxuICBzdHlsZXM6IFtgLmdyYXBoey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZ3JhcGggLmVkZ2V7c3Ryb2tlOiM2NjY7ZmlsbDpub25lfS5ncmFwaCAuZWRnZSAuZWRnZS1sYWJlbHtzdHJva2U6bm9uZTtmb250LXNpemU6MTJweDtmaWxsOiMyNTFlMWV9LmdyYXBoIC5wYW5uaW5nLXJlY3R7ZmlsbDp0cmFuc3BhcmVudDtjdXJzb3I6bW92ZX0uZ3JhcGggLm5vZGUtZ3JvdXAgLm5vZGU6Zm9jdXN7b3V0bGluZTowfS5ncmFwaCAuY2x1c3RlciByZWN0e29wYWNpdHk6LjJ9YF0sXHJcbiAgdGVtcGxhdGU6IGBcclxuICA8bmd4LWNoYXJ0cy1jaGFydCBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIiBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIiBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCIgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQsIHVuZGVmaW5lZClcIlxyXG4gIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiIChsZWdlbmRMYWJlbERlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIiBtb3VzZVdoZWVsIChtb3VzZVdoZWVsVXApPVwib25ab29tKCRldmVudCwgJ2luJylcIlxyXG4gIChtb3VzZVdoZWVsRG93bik9XCJvblpvb20oJGV2ZW50LCAnb3V0JylcIj5cclxuICA8c3ZnOmcgKm5nSWY9XCJpbml0aWFsaXplZCAmJiBncmFwaFwiIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxyXG4gICAgY2xhc3M9XCJncmFwaCBjaGFydFwiPlxyXG4gICAgPGRlZnM+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImRlZnNUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRlZnNUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8c3ZnOnBhdGggY2xhc3M9XCJ0ZXh0LXBhdGhcIiAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlc1wiIFthdHRyLmRdPVwibGluay50ZXh0UGF0aFwiIFthdHRyLmlkXT1cImxpbmsuaWRcIj5cclxuICAgICAgPC9zdmc6cGF0aD5cclxuICAgIDwvZGVmcz5cclxuICAgIDxzdmc6cmVjdCBjbGFzcz1cInBhbm5pbmctcmVjdFwiIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKiAxMDBcIiBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKiAxMDBcIiBbYXR0ci50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZSgnICsgKCgtZGltcy53aWR0aCB8fCAwKSAqIDUwKSArJywnICsgKCgtZGltcy5oZWlnaHQgfHwgMCkgKjUwKSArICcpJyBcIlxyXG4gICAgICAobW91c2Vkb3duKT1cImlzUGFubmluZyA9IHRydWVcIiAvPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJjbHVzdGVyc1wiPlxyXG4gICAgICAgIDxzdmc6ZyAjY2x1c3RlckVsZW1lbnQgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGguY2x1c3RlcnM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCIgY2xhc3M9XCJub2RlLWdyb3VwXCIgW2lkXT1cIm5vZGUuaWRcIiBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxyXG4gICAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUgfVwiPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDxzdmc6ZyAqbmdJZj1cIiFjbHVzdGVyVGVtcGxhdGVcIiBjbGFzcz1cIm5vZGUgY2x1c3RlclwiPlxyXG4gICAgICAgICAgICA8c3ZnOnJlY3QgW2F0dHIud2lkdGhdPVwibm9kZS5kaW1lbnNpb24ud2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0XCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCIgLz5cclxuICAgICAgICAgICAgPHN2Zzp0ZXh0IGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIiBbYXR0ci54XT1cIjEwXCIgW2F0dHIueV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCI+e3tub2RlLmxhYmVsfX08L3N2Zzp0ZXh0PlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJsaW5rc1wiPlxyXG4gICAgICA8c3ZnOmcgI2xpbmtFbGVtZW50ICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzOyB0cmFja0J5OiB0cmFja0xpbmtCeVwiIGNsYXNzPVwibGluay1ncm91cFwiIFtpZF09XCJsaW5rLmlkXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBsaW5rIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxzdmc6cGF0aCAqbmdJZj1cIiFsaW5rVGVtcGxhdGVcIiBjbGFzcz1cImVkZ2VcIiBbYXR0ci5kXT1cImxpbmsubGluZVwiIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gICAgPHN2ZzpnIGNsYXNzPVwibm9kZXNcIj5cclxuICAgICAgPHN2ZzpnICNub2RlRWxlbWVudCAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5ub2RlczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIiBjbGFzcz1cIm5vZGUtZ3JvdXBcIiBbaWRdPVwibm9kZS5pZFwiIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCIgKG1vdXNlZG93bik9XCJvbk5vZGVNb3VzZURvd24oJGV2ZW50LCBub2RlKVwiIChkYmxjbGljayk9XCJvbkRvdWJsZUNsaWNrKG5vZGUsJGV2ZW50KVwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8c3ZnOmNpcmNsZSAqbmdJZj1cIiFub2RlVGVtcGxhdGVcIiByPVwiMTBcIiBbYXR0ci5jeF09XCJub2RlLmRpbWVuc2lvbi53aWR0aCAvIDJcIiBbYXR0ci5jeV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCJcclxuICAgICAgICAvPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICA8L3N2ZzpnPlxyXG48L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdsaW5rJywgW25nVHJhbnNpdGlvbignKiA9PiAqJywgW2FuaW1hdGUoNTAwLCBzdHlsZSh7IHRyYW5zZm9ybTogJyonIH0pKV0pXSldXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcmFwaENvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZXM6IE5vZGVbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGlua3M6IEVkZ2VbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY3VydmU6IGFueTtcclxuXHJcbiAgQElucHV0KClcclxuICBkcmFnZ2luZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWF4SGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1pbkhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNaW5XaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNYXhXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbm5pbmdFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBlbmFibGVab29tID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tU3BlZWQgPSAwLjE7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWluWm9vbUxldmVsID0gMC4xO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1heFpvb21MZXZlbCA9IDQuMDtcclxuXHJcbiAgQElucHV0KClcclxuICBhdXRvWm9vbSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbk9uWm9vbSA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYXV0b0NlbnRlciA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHVwZGF0ZSQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICBjZW50ZXIkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgem9vbVRvRml0JDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dDogc3RyaW5nIHwgTGF5b3V0O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dFNldHRpbmdzOiBhbnk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2xpbmtUZW1wbGF0ZScpXHJcbiAgbGlua1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdub2RlVGVtcGxhdGUnKVxyXG4gIG5vZGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnY2x1c3RlclRlbXBsYXRlJylcclxuICBjbHVzdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2RlZnNUZW1wbGF0ZScpXHJcbiAgZGVmc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAVmlld0NoaWxkKENoYXJ0Q29tcG9uZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcclxuICBjaGFydDogRWxlbWVudFJlZjtcclxuXHJcbiAgQFZpZXdDaGlsZHJlbignbm9kZUVsZW1lbnQnKVxyXG4gIG5vZGVFbGVtZW50czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xyXG5cclxuICBAVmlld0NoaWxkcmVuKCdsaW5rRWxlbWVudCcpXHJcbiAgbGlua0VsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XHJcblxyXG4gIGdyYXBoU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XHJcbiAgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcclxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xyXG4gIG1hcmdpbiA9IFswLCAwLCAwLCAwXTtcclxuICByZXN1bHRzID0gW107XHJcbiAgc2VyaWVzRG9tYWluOiBhbnk7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgbGVnZW5kT3B0aW9uczogYW55O1xyXG4gIGlzUGFubmluZyA9IGZhbHNlO1xyXG4gIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICBkcmFnZ2luZ05vZGU6IE5vZGU7XHJcbiAgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICBncmFwaDogR3JhcGg7XHJcbiAgZ3JhcGhEaW1zOiBhbnkgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcclxuICBfb2xkTGlua3M6IEVkZ2VbXSA9IFtdO1xyXG4gIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBNYXRyaXggPSBpZGVudGl0eSgpO1xyXG4gIF90b3VjaExhc3RYID0gbnVsbDtcclxuICBfdG91Y2hMYXN0WSA9IG51bGw7XHJcblxyXG4gIHpvb21CZWZvcmUgPSAxO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXHJcbiAgICBwdWJsaWMgem9uZTogTmdab25lLFxyXG4gICAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgIHByaXZhdGUgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZVxyXG4gICkge1xyXG4gICAgc3VwZXIoZWwsIHpvbmUsIGNkKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZ3JvdXBSZXN1bHRzQnk6IChub2RlOiBhbnkpID0+IHN0cmluZyA9IG5vZGUgPT4gbm9kZS5sYWJlbDtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcclxuICAgKi9cclxuICBnZXQgem9vbUxldmVsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCB6b29tIGxldmVsXHJcbiAgICovXHJcbiAgQElucHV0KCd6b29tTGV2ZWwnKVxyXG4gIHNldCB6b29tTGV2ZWwobGV2ZWwpIHtcclxuICAgIHRoaXMuem9vbVRvKE51bWJlcihsZXZlbCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjdXJyZW50IGB4YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBnZXQgcGFuT2Zmc2V0WCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGN1cnJlbnQgYHhgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIEBJbnB1dCgncGFuT2Zmc2V0WCcpXHJcbiAgc2V0IHBhbk9mZnNldFgoeCkge1xyXG4gICAgdGhpcy5wYW5UbyhOdW1iZXIoeCksIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjdXJyZW50IGB5YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBnZXQgcGFuT2Zmc2V0WSgpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmY7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGN1cnJlbnQgYHlgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIEBJbnB1dCgncGFuT2Zmc2V0WScpXHJcbiAgc2V0IHBhbk9mZnNldFkoeSkge1xyXG4gICAgdGhpcy5wYW5UbyhudWxsLCBOdW1iZXIoeSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy51cGRhdGUkKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG4gICAgICAgIHRoaXMudXBkYXRlJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmNlbnRlciQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy5jZW50ZXIkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNlbnRlcigpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy56b29tVG9GaXQkKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG4gICAgICAgIHRoaXMuem9vbVRvRml0JC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2coY2hhbmdlcyk7XHJcbiAgICBjb25zdCB7IGxheW91dCwgbGF5b3V0U2V0dGluZ3MsIG5vZGVzLCBjbHVzdGVycywgbGlua3MgfSA9IGNoYW5nZXM7XHJcbiAgICB0aGlzLnNldExheW91dCh0aGlzLmxheW91dCk7XHJcbiAgICBpZiAobGF5b3V0U2V0dGluZ3MpIHtcclxuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcclxuICAgIH1cclxuICAgIGlmIChub2RlcyB8fCBjbHVzdGVycyB8fCBsaW5rcykge1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0TGF5b3V0KGxheW91dDogc3RyaW5nIHwgTGF5b3V0KTogdm9pZCB7XHJcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICBpZiAoIWxheW91dCkge1xyXG4gICAgICBsYXlvdXQgPSAnZGFncmUnO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBsYXlvdXQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0ID0gdGhpcy5sYXlvdXRTZXJ2aWNlLmdldExheW91dChsYXlvdXQpO1xyXG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0TGF5b3V0U2V0dGluZ3Moc2V0dGluZ3M6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5sYXlvdXQuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcclxuICAgIGZvciAoY29uc3Qgc3ViIG9mIHRoaXMuc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCYXNlIGNsYXNzIHVwZGF0ZSBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIGRhZyBncmFwaFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgc3VwZXIudXBkYXRlKCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmN1cnZlKSB7XHJcbiAgICAgIHRoaXMuY3VydmUgPSBzaGFwZS5jdXJ2ZUJ1bmRsZS5iZXRhKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xyXG4gICAgICB0aGlzLmRpbXMgPSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyh7XHJcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICBtYXJnaW5zOiB0aGlzLm1hcmdpbixcclxuICAgICAgICBzaG93TGVnZW5kOiB0aGlzLmxlZ2VuZFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuc2VyaWVzRG9tYWluID0gdGhpcy5nZXRTZXJpZXNEb21haW4oKTtcclxuICAgICAgdGhpcy5zZXRDb2xvcnMoKTtcclxuICAgICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XHJcblxyXG4gICAgICB0aGlzLmNyZWF0ZUdyYXBoKCk7XHJcblxyXG4gICAgICAvLyBJZiB6b29tIGlzbid0IDEsIHRoZW4gbm9kZXMgc29tZXRpbWVzIGRvbid0IHJlbmRlciBpbiBjb3JyZWN0IHNpemVcclxuICAgICAgLy8gem9vbWluZyB0byAxIGZpeGVzIHRoaXNcclxuICAgICAgdGhpcy5zYXZlWm9vbUJlZm9yZUxvYWQoKTtcclxuICAgICAgdGhpcy56b29tTGV2ZWwgPSAxO1xyXG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhd3MgdGhlIGdyYXBoIHVzaW5nIGRhZ3JlIGxheW91dHNcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZHJhdygpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5sYXlvdXQgfHwgdHlwZW9mIHRoaXMubGF5b3V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBDYWxjIHZpZXcgZGltcyBmb3IgdGhlIG5vZGVzXHJcbiAgICB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAvLyBSZWNhbGMgdGhlIGxheW91dFxyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQucnVuKHRoaXMuZ3JhcGgpO1xyXG4gICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQocmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xyXG4gICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XHJcbiAgICAgIHRoaXMudGljaygpO1xyXG4gICAgfSkpO1xyXG4gICAgcmVzdWx0JFxyXG4gICAgICAucGlwZShmaXJzdChncmFwaCA9PiBncmFwaC5ub2Rlcy5sZW5ndGggPiAwKSlcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKSk7XHJcblxyXG4gICAgdGhpcy5yZXN0b3JlWm9vbUJlZm9yZUxvYWQoKTtcclxuICB9XHJcblxyXG4gIHRpY2soKSB7XHJcbiAgICAvLyBUcmFuc3Bvc2VzIHZpZXcgb3B0aW9ucyB0byB0aGUgbm9kZVxyXG4gICAgdGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiB7XHJcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke1xyXG4gICAgICAgIG4ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8IDBcclxuICAgICAgICB9KWA7XHJcbiAgICAgIGlmICghbi5kYXRhKSB7XHJcbiAgICAgICAgbi5kYXRhID0ge307XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFuLmRhdGEuY29sb3IpIHtcclxuXHJcbiAgICAgICAgbi5kYXRhID0ge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAodGhpcy5ncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKG4gPT4ge1xyXG4gICAgICBuLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtcclxuICAgICAgICBuLnBvc2l0aW9uLnggLSBuLmRpbWVuc2lvbi53aWR0aCAvIDIgfHwgMH0sICR7bi5wb3NpdGlvbi55IC0gbi5kaW1lbnNpb24uaGVpZ2h0IC8gMiB8fCAwXHJcbiAgICAgICAgfSlgO1xyXG4gICAgICBpZiAoIW4uZGF0YSkge1xyXG4gICAgICAgIG4uZGF0YSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbi5kYXRhLmNvbG9yKSB7XHJcblxyXG4gICAgICAgIG4uZGF0YSA9IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0aGUgbGFiZWxzIHRvIHRoZSBuZXcgcG9zaXRpb25zXHJcbiAgICBjb25zdCBuZXdMaW5rcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBlZGdlTGFiZWxJZCBpbiB0aGlzLmdyYXBoLmVkZ2VMYWJlbHMpIHtcclxuICAgICAgY29uc3QgZWRnZUxhYmVsID0gdGhpcy5ncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcclxuXHJcbiAgICAgIGNvbnN0IG5vcm1LZXkgPSBlZGdlTGFiZWxJZC5yZXBsYWNlKC9bXlxcdy1dKi9nLCAnJyk7XHJcbiAgICAgIGxldCBvbGRMaW5rID0gdGhpcy5fb2xkTGlua3MuZmluZChvbCA9PiBgJHtvbC5zb3VyY2V9JHtvbC50YXJnZXR9YCA9PT0gbm9ybUtleSk7XHJcbiAgICAgIGlmICghb2xkTGluaykge1xyXG4gICAgICAgIG9sZExpbmsgPSB0aGlzLmdyYXBoLmVkZ2VzLmZpbmQobmwgPT4gYCR7bmwuc291cmNlfSR7bmwudGFyZ2V0fWAgPT09IG5vcm1LZXkpIHx8IGVkZ2VMYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgb2xkTGluay5vbGRMaW5lID0gb2xkTGluay5saW5lO1xyXG5cclxuICAgICAgY29uc3QgcG9pbnRzID0gZWRnZUxhYmVsLnBvaW50cztcclxuICAgICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKHBvaW50cyk7XHJcblxyXG4gICAgICBjb25zdCBuZXdMaW5rID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkTGluayk7XHJcbiAgICAgIG5ld0xpbmsubGluZSA9IGxpbmU7XHJcbiAgICAgIG5ld0xpbmsucG9pbnRzID0gcG9pbnRzO1xyXG5cclxuICAgICAgY29uc3QgdGV4dFBvcyA9IHBvaW50c1tNYXRoLmZsb29yKHBvaW50cy5sZW5ndGggLyAyKV07XHJcbiAgICAgIGlmICh0ZXh0UG9zKSB7XHJcbiAgICAgICAgbmV3TGluay50ZXh0VHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RleHRQb3MueCB8fCAwfSwke3RleHRQb3MueSB8fCAwfSlgO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXdMaW5rLnRleHRBbmdsZSA9IDA7XHJcbiAgICAgIGlmICghbmV3TGluay5vbGRMaW5lKSB7XHJcbiAgICAgICAgbmV3TGluay5vbGRMaW5lID0gbmV3TGluay5saW5lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKG5ld0xpbmspO1xyXG4gICAgICBuZXdMaW5rcy5wdXNoKG5ld0xpbmspO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ3JhcGguZWRnZXMgPSBuZXdMaW5rcztcclxuXHJcbiAgICAvLyBNYXAgdGhlIG9sZCBsaW5rcyBmb3IgYW5pbWF0aW9uc1xyXG4gICAgaWYgKHRoaXMuZ3JhcGguZWRnZXMpIHtcclxuICAgICAgdGhpcy5fb2xkTGlua3MgPSB0aGlzLmdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgICBjb25zdCBuZXdMID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgICAgbmV3TC5vbGRMaW5lID0gbC5saW5lO1xyXG4gICAgICAgIHJldHVybiBuZXdMO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgdGhlIGhlaWdodC93aWR0aCB0b3RhbFxyXG4gICAgdGhpcy5ncmFwaERpbXMud2lkdGggPSBNYXRoLm1heCguLi50aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IG4ucG9zaXRpb24ueCArIG4uZGltZW5zaW9uLndpZHRoKSk7XHJcbiAgICB0aGlzLmdyYXBoRGltcy5oZWlnaHQgPSBNYXRoLm1heCguLi50aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IG4ucG9zaXRpb24ueSArIG4uZGltZW5zaW9uLmhlaWdodCkpO1xyXG5cclxuICAgIGlmICh0aGlzLmF1dG9ab29tKSB7XHJcbiAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b0NlbnRlcikge1xyXG4gICAgICAvLyBBdXRvLWNlbnRlciB3aGVuIHJlbmRlcmluZ1xyXG4gICAgICB0aGlzLmNlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnJlZHJhd0xpbmVzKCkpO1xyXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1lYXN1cmVzIHRoZSBub2RlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlIGRpbWVuc2lvbnNcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGFwcGx5Tm9kZURpbWVuc2lvbnMoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5ub2RlRWxlbWVudHMgJiYgdGhpcy5ub2RlRWxlbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMubm9kZUVsZW1lbnRzLm1hcChlbGVtID0+IHtcclxuICAgICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gZWxlbS5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBuYXRpdmVFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBoZWlnaHRcclxuICAgICAgICBsZXQgZGltcztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgZGltcyA9IG5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgIC8vIFNraXAgZHJhd2luZyBpZiBlbGVtZW50IGlzIG5vdCBkaXNwbGF5ZWQgLSBGaXJlZm94IHdvdWxkIHRocm93IGFuIGVycm9yIGhlcmVcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZUhlaWdodCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gdGhpcy5ub2RlSGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBkaW1zLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhIZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWF4KG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWF4SGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbkhlaWdodCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gTWF0aC5taW4obm9kZS5kaW1lbnNpb24uaGVpZ2h0LCB0aGlzLm5vZGVNaW5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZVdpZHRoKSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IHRoaXMubm9kZVdpZHRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHdpZHRoXHJcbiAgICAgICAgICBpZiAobmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBsZXQgdGV4dERpbXM7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgdGV4dERpbXMgPSBuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JylbMF0uZ2V0QkJveCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgIC8vIFNraXAgZHJhd2luZyBpZiBlbGVtZW50IGlzIG5vdCBkaXNwbGF5ZWQgLSBGaXJlZm94IHdvdWxkIHRocm93IGFuIGVycm9yIGhlcmVcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSB0ZXh0RGltcy53aWR0aCArIDIwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBkaW1zLndpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1heFdpZHRoKSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWF4KG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNYXhXaWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNaW5XaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBNYXRoLm1pbihub2RlLmRpbWVuc2lvbi53aWR0aCwgdGhpcy5ub2RlTWluV2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWRyYXdzIHRoZSBsaW5lcyB3aGVuIGRyYWdnZWQgb3Igdmlld3BvcnQgdXBkYXRlZFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgcmVkcmF3TGluZXMoX2FuaW1hdGUgPSB0cnVlKTogdm9pZCB7XHJcbiAgICB0aGlzLmxpbmtFbGVtZW50cy5tYXAobGlua0VsID0+IHtcclxuICAgICAgY29uc3QgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChsaW4gPT4gbGluLmlkID09PSBsaW5rRWwubmF0aXZlRWxlbWVudC5pZCk7XHJcblxyXG4gICAgICBpZiAoZWRnZSkge1xyXG4gICAgICAgIGNvbnN0IGxpbmtTZWxlY3Rpb24gPSBzZWxlY3QobGlua0VsLm5hdGl2ZUVsZW1lbnQpLnNlbGVjdCgnLmxpbmUnKTtcclxuICAgICAgICBsaW5rU2VsZWN0aW9uXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2Uub2xkTGluZSlcclxuICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgIC5kdXJhdGlvbihfYW5pbWF0ZSA/IDUwMCA6IDApXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2UubGluZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRQYXRoU2VsZWN0aW9uID0gc2VsZWN0KHRoaXMuY2hhcnRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnNlbGVjdChgIyR7ZWRnZS5pZH1gKTtcclxuICAgICAgICB0ZXh0UGF0aFNlbGVjdGlvblxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZFRleHRQYXRoKVxyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgLmR1cmF0aW9uKF9hbmltYXRlID8gNTAwIDogMClcclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS50ZXh0UGF0aCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgZGFncmUgZ3JhcGggZW5naW5lXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBjcmVhdGVHcmFwaCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XHJcbiAgICBjb25zdCBpbml0aWFsaXplTm9kZSA9IG4gPT4ge1xyXG4gICAgICBpZiAoIW4uaWQpIHtcclxuICAgICAgICBuLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICBuLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgaGVpZ2h0OiAzMFxyXG4gICAgICB9O1xyXG4gICAgICBuLnBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgICB9O1xyXG4gICAgICBuLmRhdGEgPSBuLmRhdGEgPyBuLmRhdGEgOiB7fTtcclxuICAgICAgcmV0dXJuIG47XHJcbiAgICB9O1xyXG4gICAgdGhpcy5ncmFwaCA9IHtcclxuICAgICAgbm9kZXM6IFsuLi50aGlzLm5vZGVzXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxyXG4gICAgICBjbHVzdGVyczogWy4uLih0aGlzLmNsdXN0ZXJzIHx8IFtdKV0ubWFwKGluaXRpYWxpemVOb2RlKSxcclxuICAgICAgZWRnZXM6IFsuLi50aGlzLmxpbmtzXS5tYXAoZSA9PiB7XHJcbiAgICAgICAgaWYgKCFlLmlkKSB7XHJcbiAgICAgICAgICBlLmlkID0gaWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXcoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGUgdGhlIHRleHQgZGlyZWN0aW9ucyAvIGZsaXBwaW5nXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBjYWxjRG9taW5hbnRCYXNlbGluZShsaW5rKTogdm9pZCB7XHJcbiAgICBjb25zdCBmaXJzdFBvaW50ID0gbGluay5wb2ludHNbMF07XHJcbiAgICBjb25zdCBsYXN0UG9pbnQgPSBsaW5rLnBvaW50c1tsaW5rLnBvaW50cy5sZW5ndGggLSAxXTtcclxuICAgIGxpbmsub2xkVGV4dFBhdGggPSBsaW5rLnRleHRQYXRoO1xyXG5cclxuICAgIGlmIChsYXN0UG9pbnQueCA8IGZpcnN0UG9pbnQueCkge1xyXG4gICAgICBsaW5rLmRvbWluYW50QmFzZWxpbmUgPSAndGV4dC1iZWZvcmUtZWRnZSc7XHJcblxyXG4gICAgICAvLyByZXZlcnNlIHRleHQgcGF0aCBmb3Igd2hlbiBpdHMgZmxpcHBlZCB1cHNpZGUgZG93blxyXG4gICAgICBsaW5rLnRleHRQYXRoID0gdGhpcy5nZW5lcmF0ZUxpbmUoWy4uLmxpbmsucG9pbnRzXS5yZXZlcnNlKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGluay5kb21pbmFudEJhc2VsaW5lID0gJ3RleHQtYWZ0ZXItZWRnZSc7XHJcbiAgICAgIGxpbmsudGV4dFBhdGggPSBsaW5rLmxpbmU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZSB0aGUgbmV3IGxpbmUgcGF0aFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2VuZXJhdGVMaW5lKHBvaW50cyk6IGFueSB7XHJcbiAgICBjb25zdCBsaW5lRnVuY3Rpb24gPSBzaGFwZVxyXG4gICAgICAubGluZTxhbnk+KClcclxuICAgICAgLngoZCA9PiBkLngpXHJcbiAgICAgIC55KGQgPT4gZC55KVxyXG4gICAgICAuY3VydmUodGhpcy5jdXJ2ZSk7XHJcbiAgICByZXR1cm4gbGluZUZ1bmN0aW9uKHBvaW50cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIHdhcyBpbnZva2VkIGZyb20gZXZlbnRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uWm9vbSgkZXZlbnQ6IE1vdXNlRXZlbnQsIGRpcmVjdGlvbik6IHZvaWQge1xyXG4gICAgY29uc3Qgem9vbUZhY3RvciA9IDEgKyAoZGlyZWN0aW9uID09PSAnaW4nID8gdGhpcy56b29tU3BlZWQgOiAtdGhpcy56b29tU3BlZWQpO1xyXG5cclxuICAgIC8vIENoZWNrIHRoYXQgem9vbWluZyB3b3VsZG4ndCBwdXQgdXMgb3V0IG9mIGJvdW5kc1xyXG4gICAgY29uc3QgbmV3Wm9vbUxldmVsID0gdGhpcy56b29tTGV2ZWwgKiB6b29tRmFjdG9yO1xyXG4gICAgaWYgKG5ld1pvb21MZXZlbCA8PSB0aGlzLm1pblpvb21MZXZlbCB8fCBuZXdab29tTGV2ZWwgPj0gdGhpcy5tYXhab29tTGV2ZWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGlmIHpvb21pbmcgaXMgZW5hYmxlZCBvciBub3RcclxuICAgIGlmICghdGhpcy5lbmFibGVab29tKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5wYW5Pblpvb20gPT09IHRydWUgJiYgJGV2ZW50KSB7XHJcbiAgICAgIC8vIEFic29sdXRlIG1vdXNlIFgvWSBvbiB0aGUgc2NyZWVuXHJcbiAgICAgIGNvbnN0IG1vdXNlWCA9ICRldmVudC5jbGllbnRYO1xyXG4gICAgICBjb25zdCBtb3VzZVkgPSAkZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgIC8vIFRyYW5zZm9ybSB0aGUgbW91c2UgWC9ZIGludG8gYSBTVkcgWC9ZXHJcbiAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuY2hhcnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcclxuICAgICAgY29uc3Qgc3ZnR3JvdXAgPSBzdmcucXVlcnlTZWxlY3RvcignZy5jaGFydCcpO1xyXG5cclxuICAgICAgY29uc3QgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgcG9pbnQueCA9IG1vdXNlWDtcclxuICAgICAgcG9pbnQueSA9IG1vdXNlWTtcclxuICAgICAgY29uc3Qgc3ZnUG9pbnQgPSBwb2ludC5tYXRyaXhUcmFuc2Zvcm0oc3ZnR3JvdXAuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcclxuXHJcbiAgICAgIC8vIFBhbnpvb21cclxuICAgICAgY29uc3QgTk9fWk9PTV9MRVZFTCA9IDE7XHJcbiAgICAgIHRoaXMucGFuKHN2Z1BvaW50LngsIHN2Z1BvaW50LnksIE5PX1pPT01fTEVWRUwpO1xyXG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XHJcbiAgICAgIHRoaXMucGFuKC1zdmdQb2ludC54LCAtc3ZnUG9pbnQueSwgTk9fWk9PTV9MRVZFTCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnpvb20oem9vbUZhY3Rvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gYnkgeC95XHJcbiAgICpcclxuICAgKi9cclxuICBwYW4oeDogbnVtYmVyLCB5OiBudW1iZXIsIHpvb21MZXZlbDogbnVtYmVyID0gdGhpcy56b29tTGV2ZWwpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdHJhbnNsYXRlKHggLyB6b29tTGV2ZWwsIHkgLyB6b29tTGV2ZWwpKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIHRvIGEgZml4ZWQgeC95XHJcbiAgICpcclxuICAgKi9cclxuICBwYW5Ubyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lID0geCA9PT0gbnVsbCB8fCB4ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmUgOiBOdW1iZXIoeCk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmYgPSB5ID09PSBudWxsIHx8IHkgPT09IHVuZGVmaW5lZCB8fCBpc05hTih5KSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZiA6IE51bWJlcih5KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSBieSBhIGZhY3RvclxyXG4gICAqXHJcbiAgICovXHJcbiAgem9vbShmYWN0b3I6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCBzY2FsZShmYWN0b3IsIGZhY3RvcikpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIHRvIGEgZml4ZWQgbGV2ZWxcclxuICAgKlxyXG4gICAqL1xyXG4gIHpvb21UbyhsZXZlbDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmEgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmEgOiBOdW1iZXIobGV2ZWwpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5kID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5kIDogTnVtYmVyKGxldmVsKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIHdhcyBpbnZva2VkIGZyb20gZXZlbnRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uUGFuKGV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLnBhbihldmVudC5tb3ZlbWVudFgsIGV2ZW50Lm1vdmVtZW50WSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEcmFnIHdhcyBpbnZva2VkIGZyb20gYW4gZXZlbnRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uRHJhZyhldmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5kcmFnZ2luZ05vZGU7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWcpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnKG5vZGUsIGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBub2RlLnBvc2l0aW9uLnggKz0gZXZlbnQubW92ZW1lbnRYIC8gdGhpcy56b29tTGV2ZWw7XHJcbiAgICBub2RlLnBvc2l0aW9uLnkgKz0gZXZlbnQubW92ZW1lbnRZIC8gdGhpcy56b29tTGV2ZWw7XHJcblxyXG4gICAgLy8gbW92ZSB0aGUgbm9kZVxyXG4gICAgY29uc3QgeCA9IG5vZGUucG9zaXRpb24ueCAtIG5vZGUuZGltZW5zaW9uLndpZHRoIC8gMjtcclxuICAgIGNvbnN0IHkgPSBub2RlLnBvc2l0aW9uLnkgLSBub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyO1xyXG4gICAgbm9kZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGxpbmsgb2YgdGhpcy5ncmFwaC5lZGdlcykge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbGluay50YXJnZXQgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICBsaW5rLnNvdXJjZSA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIChsaW5rLnRhcmdldCBhcyBhbnkpLmlkID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgKGxpbmsuc291cmNlIGFzIGFueSkuaWQgPT09IG5vZGUuaWRcclxuICAgICAgKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnVwZGF0ZUVkZ2UodGhpcy5ncmFwaCwgbGluayk7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQkID0gcmVzdWx0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSA/IHJlc3VsdCA6IG9mKHJlc3VsdCk7XHJcbiAgICAgICAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLmFkZChcclxuICAgICAgICAgICAgcmVzdWx0JC5zdWJzY3JpYmUoZ3JhcGggPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcclxuICAgICAgICAgICAgICB0aGlzLnJlZHJhd0VkZ2UobGluayk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVkcmF3TGluZXMoZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcmVkcmF3RWRnZShlZGdlOiBFZGdlKSB7XHJcbiAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUoZWRnZS5wb2ludHMpO1xyXG4gICAgdGhpcy5jYWxjRG9taW5hbnRCYXNlbGluZShlZGdlKTtcclxuICAgIGVkZ2Uub2xkTGluZSA9IGVkZ2UubGluZTtcclxuICAgIGVkZ2UubGluZSA9IGxpbmU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdGhlIGVudGlyZSB2aWV3IGZvciB0aGUgbmV3IHBhbiBwb3NpdGlvblxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB1cGRhdGVUcmFuc2Zvcm0oKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9IHRvU1ZHKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgY2xpY2tlZFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkNsaWNrKGV2ZW50LCBvcmlnaW5hbEV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5vcmlnRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBjbGlja2VkXHJcbiAgICpcclxuICAgKi9cclxuICBvbkRvdWJsZUNsaWNrKGV2ZW50LCBvcmlnaW5hbEV2ZW50KTogdm9pZCB7XHJcbiAgICBldmVudC5vcmlnRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xyXG4gICAgZXZlbnQuaXNEb3VibGVDbGljayA9IHRydWU7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGZvY3VzZWRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25BY3RpdmF0ZShldmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlRW50cmllcy5pbmRleE9mKGV2ZW50KSA+IC0xKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtldmVudCwgLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBldmVudCwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgZGVmb2N1c2VkXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkRlYWN0aXZhdGUoZXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5pbmRleE9mKGV2ZW50KTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuXHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBldmVudCwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBkb21haW4gc2VyaWVzIGZvciB0aGUgbm9kZXNcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldFNlcmllc0RvbWFpbigpOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2Rlc1xyXG4gICAgICAubWFwKGQgPT4gdGhpcy5ncm91cFJlc3VsdHNCeShkKSlcclxuICAgICAgLnJlZHVjZSgobm9kZXM6IHN0cmluZ1tdLCBub2RlKTogYW55W10gPT4gKG5vZGVzLmluZGV4T2Yobm9kZSkgIT09IC0xID8gbm9kZXMgOiBub2Rlcy5jb25jYXQoW25vZGVdKSksIFtdKVxyXG4gICAgICAuc29ydCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhY2tpbmcgZm9yIHRoZSBsaW5rXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHRyYWNrTGlua0J5KGluZGV4LCBsaW5rKTogYW55IHtcclxuICAgIHJldHVybiBsaW5rLmlkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhY2tpbmcgZm9yIHRoZSBub2RlXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHRyYWNrTm9kZUJ5KGluZGV4LCBub2RlKTogYW55IHtcclxuICAgIHJldHVybiBub2RlLmlkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY29sb3JzIHRoZSBub2Rlc1xyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBzZXRDb2xvcnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgJ29yZGluYWwnLCB0aGlzLnNlcmllc0RvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgbGVnZW5kIG9wdGlvbnNcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldExlZ2VuZE9wdGlvbnMoKTogYW55IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjYWxlVHlwZTogJ29yZGluYWwnLFxyXG4gICAgICBkb21haW46IHRoaXMuc2VyaWVzRG9tYWluLFxyXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbW91c2UgbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZyBhbmQgZHJhZ2dpbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZW1vdmUnLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2VNb3ZlKCRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNQYW5uaW5nICYmIHRoaXMucGFubmluZ0VuYWJsZWQpIHtcclxuICAgICAgdGhpcy5vblBhbigkZXZlbnQpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcclxuICAgICAgdGhpcy5vbkRyYWcoJGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIHRvdWNoIHN0YXJ0IGV2ZW50IHRvIGVuYWJsZSBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XHJcbiAgICB0aGlzLl90b3VjaExhc3RYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgIHRoaXMuX3RvdWNoTGFzdFkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG5cclxuICAgIHRoaXMuaXNQYW5uaW5nID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIHRvdWNoIG1vdmUgZXZlbnQsIHVzZWQgZm9yIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaG1vdmUnLCBbJyRldmVudCddKVxyXG4gIG9uVG91Y2hNb3ZlKCRldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNQYW5uaW5nICYmIHRoaXMucGFubmluZ0VuYWJsZWQpIHtcclxuICAgICAgY29uc3QgY2xpZW50WCA9ICRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBjbGllbnRZID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGNvbnN0IG1vdmVtZW50WCA9IGNsaWVudFggLSB0aGlzLl90b3VjaExhc3RYO1xyXG4gICAgICBjb25zdCBtb3ZlbWVudFkgPSBjbGllbnRZIC0gdGhpcy5fdG91Y2hMYXN0WTtcclxuICAgICAgdGhpcy5fdG91Y2hMYXN0WCA9IGNsaWVudFg7XHJcbiAgICAgIHRoaXMuX3RvdWNoTGFzdFkgPSBjbGllbnRZO1xyXG5cclxuICAgICAgdGhpcy5wYW4obW92ZW1lbnRYLCBtb3ZlbWVudFkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggZW5kIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uVG91Y2hFbmQoZXZlbnQpIHtcclxuICAgIHRoaXMuaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBtb3VzZSB1cCBldmVudCB0byBkaXNhYmxlIHBhbm5pbmcvZHJhZ2dpbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZXVwJylcclxuICBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCkge1xyXG4gICAgICB0aGlzLmxheW91dC5vbkRyYWdFbmQodGhpcy5kcmFnZ2luZ05vZGUsIGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG5vZGUgbW91c2UgZG93biB0byBraWNrIG9mZiBkcmFnZ2luZ1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25Ob2RlTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50LCBub2RlOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuZHJhZ2dpbmdOb2RlID0gbm9kZTtcclxuXHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdTdGFydCkge1xyXG4gICAgICB0aGlzLmxheW91dC5vbkRyYWdTdGFydChub2RlLCBldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDZW50ZXIgdGhlIGdyYXBoIGluIHRoZSB2aWV3cG9ydFxyXG4gICAqL1xyXG4gIGNlbnRlcigpOiB2b2lkIHtcclxuICAgIHRoaXMucGFuVG8oXHJcbiAgICAgIHRoaXMuZGltcy53aWR0aCAvIDIgLSAodGhpcy5ncmFwaERpbXMud2lkdGggKiB0aGlzLnpvb21MZXZlbCkgLyAyLFxyXG4gICAgICB0aGlzLmRpbXMuaGVpZ2h0IC8gMiAtICh0aGlzLmdyYXBoRGltcy5oZWlnaHQgKiB0aGlzLnpvb21MZXZlbCkgLyAyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbXMgdG8gZml0IHRoZSBlbnRpZXIgZ3JhcGhcclxuICAgKi9cclxuICB6b29tVG9GaXQoKTogdm9pZCB7XHJcbiAgICBjb25zdCBoZWlnaHRab29tID0gdGhpcy5kaW1zLmhlaWdodCAvIHRoaXMuZ3JhcGhEaW1zLmhlaWdodDtcclxuICAgIGNvbnN0IHdpZHRoWm9vbSA9IHRoaXMuZGltcy53aWR0aCAvIHRoaXMuZ3JhcGhEaW1zLndpZHRoO1xyXG4gICAgY29uc3Qgem9vbUxldmVsID0gTWF0aC5taW4oaGVpZ2h0Wm9vbSwgd2lkdGhab29tLCAxKTtcclxuICAgIGlmICh6b29tTGV2ZWwgIT09IHRoaXMuem9vbUxldmVsKSB7XHJcbiAgICAgIHRoaXMuem9vbUxldmVsID0gem9vbUxldmVsO1xyXG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzdG9yZVpvb21CZWZvcmVMb2FkKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuYXV0b1pvb20pIHtcclxuICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuem9vbUxldmVsID0gdGhpcy56b29tQmVmb3JlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2F2ZVpvb21CZWZvcmVMb2FkKCk6IHZvaWQge1xyXG4gICAgdGhpcy56b29tQmVmb3JlID0gdGhpcy56b29tTGV2ZWw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgT3V0cHV0LCBIb3N0TGlzdGVuZXIsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLyoqXHJcbiAqIE1vdXNld2hlZWwgZGlyZWN0aXZlXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Tb2RoYW5hTGlicmFyeS9hbmd1bGFyMi1leGFtcGxlcy9ibG9iL21hc3Rlci9hcHAvbW91c2VXaGVlbERpcmVjdGl2ZS9tb3VzZXdoZWVsLmRpcmVjdGl2ZS50c1xyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqL1xyXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbW91c2VXaGVlbF0nIH0pXHJcbmV4cG9ydCBjbGFzcyBNb3VzZVdoZWVsRGlyZWN0aXZlIHtcclxuICBAT3V0cHV0KClcclxuICBtb3VzZVdoZWVsVXAgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpXHJcbiAgbW91c2VXaGVlbERvd24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2VXaGVlbENocm9tZShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxGaXJlZm94KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignb25tb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxJRShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIG1vdXNlV2hlZWxGdW5jKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh3aW5kb3cuZXZlbnQpIHtcclxuICAgICAgZXZlbnQgPSB3aW5kb3cuZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVsdGEgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZXZlbnQud2hlZWxEZWx0YSB8fCAtZXZlbnQuZGV0YWlsKSk7XHJcbiAgICBpZiAoZGVsdGEgPiAwKSB7XHJcbiAgICAgIHRoaXMubW91c2VXaGVlbFVwLmVtaXQoZXZlbnQpO1xyXG4gICAgfSBlbHNlIGlmIChkZWx0YSA8IDApIHtcclxuICAgICAgdGhpcy5tb3VzZVdoZWVsRG93bi5lbWl0KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3IgSUVcclxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcblxyXG4gICAgLy8gZm9yIENocm9tZSBhbmQgRmlyZWZveFxyXG4gICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEdyYXBoQ29tcG9uZW50IH0gZnJvbSAnLi9ncmFwaC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDaGFydENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuaW1wb3J0IHsgTW91c2VXaGVlbERpcmVjdGl2ZSB9IGZyb20gJy4vbW91c2Utd2hlZWwuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4vbGF5b3V0cy9sYXlvdXQuc2VydmljZSc7XHJcbmV4cG9ydCB7IEdyYXBoQ29tcG9uZW50IH07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtDaGFydENvbW1vbk1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbR3JhcGhDb21wb25lbnQsIE1vdXNlV2hlZWxEaXJlY3RpdmVdLFxyXG4gIGV4cG9ydHM6IFtHcmFwaENvbXBvbmVudCwgTW91c2VXaGVlbERpcmVjdGl2ZV0sXHJcbiAgcHJvdmlkZXJzOiBbTGF5b3V0U2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdyYXBoTW9kdWxlIHt9XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEdyYXBoTW9kdWxlIH0gZnJvbSAnLi9ncmFwaC9ncmFwaC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBOZ3hDaGFydHNNb2R1bGUgfSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL21vZGVscy9pbmRleCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtOZ3hDaGFydHNNb2R1bGVdLFxyXG4gIGV4cG9ydHM6IFtHcmFwaE1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdyYXBoTW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6WyJkYWdyZS5sYXlvdXQiLCJkYWdyZS5ncmFwaGxpYiIsInRzbGliXzEuX192YWx1ZXMiLCJPcmllbnRhdGlvbiIsImZvcmNlU2ltdWxhdGlvbiIsImZvcmNlTWFueUJvZHkiLCJmb3JjZUNvbGxpZGUiLCJmb3JjZUxpbmsiLCJTdWJqZWN0IiwiSW5qZWN0YWJsZSIsIkVsZW1lbnRSZWYiLCJ0c2xpYl8xLl9fZXh0ZW5kcyIsIkV2ZW50RW1pdHRlciIsIlN1YnNjcmlwdGlvbiIsImlkZW50aXR5Iiwic2hhcGUuY3VydmVCdW5kbGUiLCJjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyIsIk9ic2VydmFibGUiLCJvZiIsImZpcnN0Iiwic2VsZWN0IiwidHNsaWJfMS5fX3NwcmVhZCIsInNoYXBlXHJcbiAgICAgICAgICAgICAgICAubGluZSIsInRyYW5zZm9ybSIsInRyYW5zbGF0ZSIsInNjYWxlIiwidG9TVkciLCJDb2xvckhlbHBlciIsIkNvbXBvbmVudCIsIlZpZXdFbmNhcHN1bGF0aW9uIiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJ0cmlnZ2VyIiwibmdUcmFuc2l0aW9uIiwiYW5pbWF0ZSIsInN0eWxlIiwiTmdab25lIiwiQ2hhbmdlRGV0ZWN0b3JSZWYiLCJJbnB1dCIsIk91dHB1dCIsIkNvbnRlbnRDaGlsZCIsIlZpZXdDaGlsZCIsIkNoYXJ0Q29tcG9uZW50IiwiVmlld0NoaWxkcmVuIiwiSG9zdExpc3RlbmVyIiwiQmFzZUNoYXJ0Q29tcG9uZW50IiwiRGlyZWN0aXZlIiwiTmdNb2R1bGUiLCJDaGFydENvbW1vbk1vZHVsZSIsIk5neENoYXJ0c01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0E7SUFFQSxJQUFJLGFBQWEsR0FBRyxVQUFTLENBQUMsRUFBRSxDQUFDO1FBQzdCLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYzthQUNoQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1RSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDL0UsT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMs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