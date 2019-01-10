(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('dagre'), require('@angular/core'), require('@angular/animations'), require('@swimlane/ngx-charts'), require('d3-selection'), require('d3-shape'), require('d3-transition'), require('rxjs'), require('rxjs/operators'), require('transformation-matrix')) :
    typeof define === 'function' && define.amd ? define('@swimlane/ngx-graph', ['exports', 'dagre', '@angular/core', '@angular/animations', '@swimlane/ngx-charts', 'd3-selection', 'd3-shape', 'd3-transition', 'rxjs', 'rxjs/operators', 'transformation-matrix'], factory) :
    (factory((global.swimlane = global.swimlane || {}, global.swimlane['ngx-graph'] = {}),null,global.ng.core,global.ng.animations,null,null,null,null,global.rxjs,global.rxjs.operators,null));
}(this, (function (exports,dagre,core,animations,ngxCharts,d3Selection,shape,d3Transition,rxjs,operators,transformationMatrix) { 'use strict';

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
                result$.pipe(operators.first(function (graph) { return graph.nodes.length > 0; })).subscribe(function () { return _this.applyNodeDimensions(); });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWdyYXBoLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi91dGlscy9pZC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZUNsdXN0ZXIudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvbGF5b3V0LnNlcnZpY2UudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2dyYXBoLmNvbXBvbmVudC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbW91c2Utd2hlZWwuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9ncmFwaC5tb2R1bGUudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL25neC1ncmFwaC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJjb25zdCBjYWNoZSA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIHNob3J0IGlkLlxyXG4gKlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlkKCk6IHN0cmluZyB7XHJcbiAgbGV0IG5ld0lkID0gKCcwMDAwJyArICgoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDM2LCA0KSkgPDwgMCkudG9TdHJpbmcoMzYpKS5zbGljZSgtNCk7XHJcblxyXG4gIG5ld0lkID0gYGEke25ld0lkfWA7XHJcblxyXG4gIC8vIGVuc3VyZSBub3QgYWxyZWFkeSB1c2VkXHJcbiAgaWYgKCFjYWNoZVtuZXdJZF0pIHtcclxuICAgIGNhY2hlW25ld0lkXSA9IHRydWU7XHJcbiAgICByZXR1cm4gbmV3SWQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaWQoKTtcclxufVxyXG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5cclxuZXhwb3J0IGVudW0gT3JpZW50YXRpb24ge1xyXG4gIExFRlRfVE9fUklHSFQgPSAnTFInLFxyXG4gIFJJR0hUX1RPX0xFRlQgPSAnUkwnLFxyXG4gIFRPUF9UT19CT1RUT00gPSAnVEInLFxyXG4gIEJPVFRPTV9UT19UT00gPSAnQlQnXHJcbn1cclxuZXhwb3J0IGVudW0gQWxpZ25tZW50IHtcclxuICBDRU5URVIgPSAnQycsXHJcbiAgVVBfTEVGVCA9ICdVTCcsXHJcbiAgVVBfUklHSFQgPSAnVVInLFxyXG4gIERPV05fTEVGVCA9ICdETCcsXHJcbiAgRE9XTl9SSUdIVCA9ICdEUidcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEYWdyZVNldHRpbmdzIHtcclxuICBvcmllbnRhdGlvbj86IE9yaWVudGF0aW9uO1xyXG4gIG1hcmdpblg/OiBudW1iZXI7XHJcbiAgbWFyZ2luWT86IG51bWJlcjtcclxuICBlZGdlUGFkZGluZz86IG51bWJlcjtcclxuICByYW5rUGFkZGluZz86IG51bWJlcjtcclxuICBub2RlUGFkZGluZz86IG51bWJlcjtcclxuICBhbGlnbj86IEFsaWdubWVudDtcclxuICBhY3ljbGljZXI/OiAnZ3JlZWR5JyB8IHVuZGVmaW5lZDtcclxuICByYW5rZXI/OiAnbmV0d29yay1zaW1wbGV4JyB8ICd0aWdodC10cmVlJyB8ICdsb25nZXN0LXBhdGgnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGFncmVMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHtcclxuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxyXG4gICAgbWFyZ2luWDogMjAsXHJcbiAgICBtYXJnaW5ZOiAyMCxcclxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXHJcbiAgICByYW5rUGFkZGluZzogMTAwLFxyXG4gICAgbm9kZVBhZGRpbmc6IDUwXHJcbiAgfTtcclxuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBkYWdyZUdyYXBoOiBhbnk7XHJcbiAgZGFncmVOb2RlczogYW55O1xyXG4gIGRhZ3JlRWRnZXM6IGFueTtcclxuXHJcbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcclxuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XHJcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcclxuXHJcbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xyXG5cclxuICAgIGZvciAoY29uc3QgZGFncmVOb2RlSWQgaW4gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlcykge1xyXG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW2RhZ3JlTm9kZUlkXTtcclxuICAgICAgY29uc3Qgbm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBkYWdyZU5vZGUuaWQpO1xyXG4gICAgICBub2RlLnBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IGRhZ3JlTm9kZS54LFxyXG4gICAgICAgIHk6IGRhZ3JlTm9kZS55XHJcbiAgICAgIH07XHJcbiAgICAgIG5vZGUuZGltZW5zaW9uID0ge1xyXG4gICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG5cclxuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cclxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb24ueSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiBzb3VyY2VOb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHNvdXJjZU5vZGUucG9zaXRpb24ueSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiB0YXJnZXROb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXHJcbiAgICBlZGdlLnBvaW50cyA9IFtzdGFydGluZ1BvaW50LCBlbmRpbmdQb2ludF07XHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoKTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcclxuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXHJcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXHJcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXHJcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxyXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcclxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXHJcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcclxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXHJcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvKiBlbXB0eSAqL1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xyXG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcclxuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xyXG4gICAgICBub2RlLmhlaWdodCA9IG4uZGltZW5zaW9uLmhlaWdodDtcclxuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xyXG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XHJcbiAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICBjb25zdCBuZXdMaW5rOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XHJcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ld0xpbms7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XHJcbiAgICAgIGlmICghbm9kZS53aWR0aCkge1xyXG4gICAgICAgIG5vZGUud2lkdGggPSAyMDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIW5vZGUuaGVpZ2h0KSB7XHJcbiAgICAgICAgbm9kZS5oZWlnaHQgPSAzMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcbmltcG9ydCB7IE5vZGUsIENsdXN0ZXJOb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL25vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBEYWdyZVNldHRpbmdzLCBPcmllbnRhdGlvbiB9IGZyb20gJy4vZGFncmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ3JlQ2x1c3RlckxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XHJcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge1xyXG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXHJcbiAgICBtYXJnaW5YOiAyMCxcclxuICAgIG1hcmdpblk6IDIwLFxyXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcclxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXHJcbiAgICBub2RlUGFkZGluZzogNTBcclxuICB9O1xyXG4gIHNldHRpbmdzOiBEYWdyZVNldHRpbmdzID0ge307XHJcblxyXG4gIGRhZ3JlR3JhcGg6IGFueTtcclxuICBkYWdyZU5vZGVzOiBOb2RlW107XHJcbiAgZGFncmVDbHVzdGVyczogQ2x1c3Rlck5vZGVbXTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBjb25zdCBkYWdyZVRvT3V0cHV0ID0gbm9kZSA9PiB7XHJcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbbm9kZS5pZF07XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4ubm9kZSxcclxuICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgeDogZGFncmVOb2RlLngsXHJcbiAgICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGltZW5zaW9uOiB7XHJcbiAgICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICAgIGdyYXBoLmNsdXN0ZXJzID0gKGdyYXBoLmNsdXN0ZXJzIHx8IFtdKS5tYXAoZGFncmVUb091dHB1dCk7XHJcbiAgICBncmFwaC5ub2RlcyA9IGdyYXBoLm5vZGVzLm1hcChkYWdyZVRvT3V0cHV0KTtcclxuXHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcclxuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xyXG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxyXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbi55IDw9IHRhcmdldE5vZGUucG9zaXRpb24ueSA/IC0xIDogMTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nUG9pbnQgPSB7XHJcbiAgICAgIHg6IHNvdXJjZU5vZGUucG9zaXRpb24ueCxcclxuICAgICAgeTogc291cmNlTm9kZS5wb3NpdGlvbi55IC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XHJcbiAgICAgIHg6IHRhcmdldE5vZGUucG9zaXRpb24ueCxcclxuICAgICAgeTogdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDIpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGdlbmVyYXRlIG5ldyBwb2ludHNcclxuICAgIGVkZ2UucG9pbnRzID0gW3N0YXJ0aW5nUG9pbnQsIGVuZGluZ1BvaW50XTtcclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcclxuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCh7IGNvbXBvdW5kOiB0cnVlIH0pO1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xyXG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcclxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcclxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcclxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXHJcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxyXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcclxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxyXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcclxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXJcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8qIGVtcHR5ICovXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAoKG46IE5vZGUpID0+IHtcclxuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XHJcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcclxuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XHJcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcclxuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVDbHVzdGVycyA9IGdyYXBoLmNsdXN0ZXJzIHx8IFtdO1xyXG5cclxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xyXG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdMaW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGNsdXN0ZXIgb2YgdGhpcy5kYWdyZUNsdXN0ZXJzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKGNsdXN0ZXIuaWQsIGNsdXN0ZXIpO1xyXG4gICAgICBjbHVzdGVyLmNoaWxkTm9kZUlkcy5mb3JFYWNoKGNoaWxkTm9kZUlkID0+IHtcclxuICAgICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0UGFyZW50KGNoaWxkTm9kZUlkLCBjbHVzdGVyLmlkKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgdGhpcy5kYWdyZUVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XHJcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuXHJcbmV4cG9ydCBlbnVtIE9yaWVudGF0aW9uIHtcclxuICBMRUZUX1RPX1JJR0hUID0gJ0xSJyxcclxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcclxuICBUT1BfVE9fQk9UVE9NID0gJ1RCJyxcclxuICBCT1RUT01fVE9fVE9NID0gJ0JUJ1xyXG59XHJcbmV4cG9ydCBlbnVtIEFsaWdubWVudCB7XHJcbiAgQ0VOVEVSID0gJ0MnLFxyXG4gIFVQX0xFRlQgPSAnVUwnLFxyXG4gIFVQX1JJR0hUID0gJ1VSJyxcclxuICBET1dOX0xFRlQgPSAnREwnLFxyXG4gIERPV05fUklHSFQgPSAnRFInXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XHJcbiAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbjtcclxuICBtYXJnaW5YPzogbnVtYmVyO1xyXG4gIG1hcmdpblk/OiBudW1iZXI7XHJcbiAgZWRnZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgcmFua1BhZGRpbmc/OiBudW1iZXI7XHJcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgYWxpZ24/OiBBbGlnbm1lbnQ7XHJcbiAgYWN5Y2xpY2VyPzogJ2dyZWVkeScgfCB1bmRlZmluZWQ7XHJcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEYWdyZU5vZGVzT25seVNldHRpbmdzIGV4dGVuZHMgRGFncmVTZXR0aW5ncyB7XHJcbiAgY3VydmVEaXN0YW5jZT86IG51bWJlcjtcclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9FREdFX05BTUUgPSAnXFx4MDAnO1xyXG5jb25zdCBHUkFQSF9OT0RFID0gJ1xceDAwJztcclxuY29uc3QgRURHRV9LRVlfREVMSU0gPSAnXFx4MDEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ3JlTm9kZXNPbmx5TGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcclxuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7XHJcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcclxuICAgIG1hcmdpblg6IDIwLFxyXG4gICAgbWFyZ2luWTogMjAsXHJcbiAgICBlZGdlUGFkZGluZzogMTAwLFxyXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcclxuICAgIG5vZGVQYWRkaW5nOiA1MCxcclxuICAgIGN1cnZlRGlzdGFuY2U6IDIwXHJcbiAgfTtcclxuICBzZXR0aW5nczogRGFncmVOb2Rlc09ubHlTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBkYWdyZUdyYXBoOiBhbnk7XHJcbiAgZGFncmVOb2RlczogYW55O1xyXG4gIGRhZ3JlRWRnZXM6IGFueTtcclxuXHJcbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcclxuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XHJcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcclxuXHJcbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xyXG5cclxuICAgIGZvciAoY29uc3QgZGFncmVOb2RlSWQgaW4gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlcykge1xyXG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW2RhZ3JlTm9kZUlkXTtcclxuICAgICAgY29uc3Qgbm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBkYWdyZU5vZGUuaWQpO1xyXG4gICAgICBub2RlLnBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IGRhZ3JlTm9kZS54LFxyXG4gICAgICAgIHk6IGRhZ3JlTm9kZS55XHJcbiAgICAgIH07XHJcbiAgICAgIG5vZGUuZGltZW5zaW9uID0ge1xyXG4gICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgZ3JhcGguZWRnZXMpIHtcclxuICAgICAgdGhpcy51cGRhdGVFZGdlKGdyYXBoLCBlZGdlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IEdyYXBoIHtcclxuICAgIGNvbnN0IHNvdXJjZU5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS5zb3VyY2UpO1xyXG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnRhcmdldCk7XHJcbiAgICBjb25zdCByYW5rQXhpczogJ3gnIHwgJ3knID0gdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ0JUJyB8fCB0aGlzLnNldHRpbmdzLm9yaWVudGF0aW9uID09PSAnVEInID8gJ3knIDogJ3gnO1xyXG4gICAgY29uc3Qgb3JkZXJBeGlzOiAneCcgfCAneScgPSByYW5rQXhpcyA9PT0gJ3knID8gJ3gnIDogJ3knO1xyXG4gICAgY29uc3QgcmFua0RpbWVuc2lvbiA9IHJhbmtBeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXHJcbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSA/IC0xIDogMTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nUG9pbnQgPSB7XHJcbiAgICAgIFtvcmRlckF4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXHJcbiAgICAgIFtyYW5rQXhpc106IHNvdXJjZU5vZGUucG9zaXRpb25bcmFua0F4aXNdIC0gZGlyICogKHNvdXJjZU5vZGUuZGltZW5zaW9uW3JhbmtEaW1lbnNpb25dIC8gMilcclxuICAgIH07XHJcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcclxuICAgICAgW29yZGVyQXhpc106IHRhcmdldE5vZGUucG9zaXRpb25bb3JkZXJBeGlzXSxcclxuICAgICAgW3JhbmtBeGlzXTogdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb25bcmFua0RpbWVuc2lvbl0gLyAyKVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjdXJ2ZURpc3RhbmNlID0gdGhpcy5zZXR0aW5ncy5jdXJ2ZURpc3RhbmNlIHx8IHRoaXMuZGVmYXVsdFNldHRpbmdzLmN1cnZlRGlzdGFuY2U7XHJcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXHJcbiAgICBlZGdlLnBvaW50cyA9IFtcclxuICAgICAgc3RhcnRpbmdQb2ludCxcclxuICAgICAge1xyXG4gICAgICAgIFtvcmRlckF4aXNdOiBzdGFydGluZ1BvaW50W29yZGVyQXhpc10sXHJcbiAgICAgICAgW3JhbmtBeGlzXTogc3RhcnRpbmdQb2ludFtyYW5rQXhpc10gLSBkaXIgKiBjdXJ2ZURpc3RhbmNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBbb3JkZXJBeGlzXTogZW5kaW5nUG9pbnRbb3JkZXJBeGlzXSxcclxuICAgICAgICBbcmFua0F4aXNdOiBlbmRpbmdQb2ludFtyYW5rQXhpc10gKyBkaXIgKiBjdXJ2ZURpc3RhbmNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGVuZGluZ1BvaW50XHJcbiAgICBdO1xyXG4gICAgY29uc3QgZWRnZUxhYmVsSWQgPSBgJHtlZGdlLnNvdXJjZX0ke0VER0VfS0VZX0RFTElNfSR7ZWRnZS50YXJnZXR9JHtFREdFX0tFWV9ERUxJTX0ke0RFRkFVTFRfRURHRV9OQU1FfWA7XHJcbiAgICBjb25zdCBtYXRjaGluZ0VkZ2VMYWJlbCA9IGdyYXBoLmVkZ2VMYWJlbHNbZWRnZUxhYmVsSWRdO1xyXG4gICAgaWYgKG1hdGNoaW5nRWRnZUxhYmVsKSB7XHJcbiAgICAgIG1hdGNoaW5nRWRnZUxhYmVsLnBvaW50cyA9IGVkZ2UucG9pbnRzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKCk7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XHJcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxyXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxyXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxyXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcclxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXHJcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxyXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXHJcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxyXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlclxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLyogZW1wdHkgKi9cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XHJcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcclxuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XHJcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcclxuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xyXG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdMaW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xyXG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcclxuICAgICAgICBub2RlLndpZHRoID0gMjA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xyXG4gICAgICAgIG5vZGUuaGVpZ2h0ID0gMzA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBEYWdyZUxheW91dCB9IGZyb20gJy4vZGFncmUnO1xyXG5pbXBvcnQgeyBEYWdyZUNsdXN0ZXJMYXlvdXQgfSBmcm9tICcuL2RhZ3JlQ2x1c3Rlcic7XHJcbmltcG9ydCB7IERhZ3JlTm9kZXNPbmx5TGF5b3V0IH0gZnJvbSAnLi9kYWdyZU5vZGVzT25seSc7XHJcblxyXG5jb25zdCBsYXlvdXRzID0ge1xyXG4gIGRhZ3JlOiBEYWdyZUxheW91dCxcclxuICBkYWdyZUNsdXN0ZXI6IERhZ3JlQ2x1c3RlckxheW91dCxcclxuICBkYWdyZU5vZGVzT25seTogRGFncmVOb2Rlc09ubHlMYXlvdXQsXHJcbn07XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMYXlvdXRTZXJ2aWNlIHtcclxuICBnZXRMYXlvdXQobmFtZTogc3RyaW5nKTogTGF5b3V0IHtcclxuICAgIGlmIChsYXlvdXRzW25hbWVdKSB7XHJcbiAgICAgIHJldHVybiBuZXcgbGF5b3V0c1tuYW1lXSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGxheW91dCB0eXBlICcke25hbWV9J2ApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyByZW5hbWUgdHJhbnNpdGlvbiBkdWUgdG8gY29uZmxpY3Qgd2l0aCBkMyB0cmFuc2l0aW9uXHJcbmltcG9ydCB7IGFuaW1hdGUsIHN0eWxlLCB0cmFuc2l0aW9uIGFzIG5nVHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQge1xyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIENvbnRlbnRDaGlsZCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPdXRwdXQsXHJcbiAgUXVlcnlMaXN0LFxyXG4gIFRlbXBsYXRlUmVmLFxyXG4gIFZpZXdDaGlsZCxcclxuICBWaWV3Q2hpbGRyZW4sXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgTmdab25lLFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgQmFzZUNoYXJ0Q29tcG9uZW50LFxyXG4gIENoYXJ0Q29tcG9uZW50LFxyXG4gIENvbG9ySGVscGVyLFxyXG4gIFZpZXdEaW1lbnNpb25zLFxyXG4gIGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zXHJcbn0gZnJvbSAnQHN3aW1sYW5lL25neC1jaGFydHMnO1xyXG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBzaGFwZSBmcm9tICdkMy1zaGFwZSc7XHJcbmltcG9ydCAnZDMtdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGlkZW50aXR5LCBzY2FsZSwgdG9TVkcsIHRyYW5zZm9ybSwgdHJhbnNsYXRlIH0gZnJvbSAndHJhbnNmb3JtYXRpb24tbWF0cml4JztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL2xheW91dHMvbGF5b3V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uL21vZGVscy9ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcclxuXHJcbmNvbnNvbGUubG9nKCdFTCBSRUYnLCBFbGVtZW50UmVmKTtcclxuXHJcbi8qKlxyXG4gKiBNYXRyaXhcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWF0cml4IHtcclxuICBhOiBudW1iZXI7XHJcbiAgYjogbnVtYmVyO1xyXG4gIGM6IG51bWJlcjtcclxuICBkOiBudW1iZXI7XHJcbiAgZTogbnVtYmVyO1xyXG4gIGY6IG51bWJlcjtcclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZ3JhcGgnLFxyXG4gIHN0eWxlczogW2AuZ3JhcGh7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5ncmFwaCAuZWRnZXtzdHJva2U6IzY2NjtmaWxsOm5vbmV9LmdyYXBoIC5lZGdlIC5lZGdlLWxhYmVse3N0cm9rZTpub25lO2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzI1MWUxZX0uZ3JhcGggLnBhbm5pbmctcmVjdHtmaWxsOnRyYW5zcGFyZW50O2N1cnNvcjptb3ZlfS5ncmFwaCAubm9kZS1ncm91cCAubm9kZTpmb2N1c3tvdXRsaW5lOjB9LmdyYXBoIC5jbHVzdGVyIHJlY3R7b3BhY2l0eTouMn1gXSxcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxuZ3gtY2hhcnRzLWNoYXJ0IFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiIFtzaG93TGVnZW5kXT1cImxlZ2VuZFwiIFtsZWdlbmRPcHRpb25zXT1cImxlZ2VuZE9wdGlvbnNcIiAobGVnZW5kTGFiZWxDbGljayk9XCJvbkNsaWNrKCRldmVudCwgdW5kZWZpbmVkKVwiXHJcbiAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCIgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiIG1vdXNlV2hlZWwgKG1vdXNlV2hlZWxVcCk9XCJvblpvb20oJGV2ZW50LCAnaW4nKVwiXHJcbiAgKG1vdXNlV2hlZWxEb3duKT1cIm9uWm9vbSgkZXZlbnQsICdvdXQnKVwiPlxyXG4gIDxzdmc6ZyAqbmdJZj1cImluaXRpYWxpemVkICYmIGdyYXBoXCIgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQpXCIgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiXHJcbiAgICBjbGFzcz1cImdyYXBoIGNoYXJ0XCI+XHJcbiAgICA8ZGVmcz5cclxuICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwiZGVmc1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGVmc1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxzdmc6cGF0aCBjbGFzcz1cInRleHQtcGF0aFwiICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzXCIgW2F0dHIuZF09XCJsaW5rLnRleHRQYXRoXCIgW2F0dHIuaWRdPVwibGluay5pZFwiPlxyXG4gICAgICA8L3N2ZzpwYXRoPlxyXG4gICAgPC9kZWZzPlxyXG4gICAgPHN2ZzpyZWN0IGNsYXNzPVwicGFubmluZy1yZWN0XCIgW2F0dHIud2lkdGhdPVwiZGltcy53aWR0aCAqIDEwMFwiIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodCAqIDEwMFwiIFthdHRyLnRyYW5zZm9ybV09XCIndHJhbnNsYXRlKCcgKyAoKC1kaW1zLndpZHRoIHx8IDApICogNTApICsnLCcgKyAoKC1kaW1zLmhlaWdodCB8fCAwKSAqNTApICsgJyknIFwiXHJcbiAgICAgIChtb3VzZWRvd24pPVwiaXNQYW5uaW5nID0gdHJ1ZVwiIC8+XHJcbiAgICAgIDxzdmc6ZyBjbGFzcz1cImNsdXN0ZXJzXCI+XHJcbiAgICAgICAgPHN2ZzpnICNjbHVzdGVyRWxlbWVudCAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5jbHVzdGVyczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIiBjbGFzcz1cIm5vZGUtZ3JvdXBcIiBbaWRdPVwibm9kZS5pZFwiIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXHJcbiAgICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlLCRldmVudClcIj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImNsdXN0ZXJUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNsdXN0ZXJUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHN2ZzpnICpuZ0lmPVwiIWNsdXN0ZXJUZW1wbGF0ZVwiIGNsYXNzPVwibm9kZSBjbHVzdGVyXCI+XHJcbiAgICAgICAgICAgIDxzdmc6cmVjdCBbYXR0ci53aWR0aF09XCJub2RlLmRpbWVuc2lvbi53aWR0aFwiIFthdHRyLmhlaWdodF09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHRcIiBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIiAvPlxyXG4gICAgICAgICAgICA8c3ZnOnRleHQgYWxpZ25tZW50LWJhc2VsaW5lPVwiY2VudHJhbFwiIFthdHRyLnhdPVwiMTBcIiBbYXR0ci55XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIj57e25vZGUubGFiZWx9fTwvc3ZnOnRleHQ+XHJcbiAgICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDxzdmc6ZyBjbGFzcz1cImxpbmtzXCI+XHJcbiAgICAgIDxzdmc6ZyAjbGlua0VsZW1lbnQgKm5nRm9yPVwibGV0IGxpbmsgb2YgZ3JhcGguZWRnZXM7IHRyYWNrQnk6IHRyYWNrTGlua0J5XCIgY2xhc3M9XCJsaW5rLWdyb3VwXCIgW2lkXT1cImxpbmsuaWRcIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJsaW5rVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJsaW5rVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IGxpbmsgfVwiPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPHN2ZzpwYXRoICpuZ0lmPVwiIWxpbmtUZW1wbGF0ZVwiIGNsYXNzPVwiZWRnZVwiIFthdHRyLmRdPVwibGluay5saW5lXCIgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgICA8c3ZnOmcgY2xhc3M9XCJub2Rlc1wiPlxyXG4gICAgICA8c3ZnOmcgI25vZGVFbGVtZW50ICpuZ0Zvcj1cImxldCBub2RlIG9mIGdyYXBoLm5vZGVzOyB0cmFja0J5OiB0cmFja05vZGVCeVwiIGNsYXNzPVwibm9kZS1ncm91cFwiIFtpZF09XCJub2RlLmlkXCIgW2F0dHIudHJhbnNmb3JtXT1cIm5vZGUudHJhbnNmb3JtXCJcclxuICAgICAgICAoY2xpY2spPVwib25DbGljayhub2RlLCRldmVudClcIiAobW91c2Vkb3duKT1cIm9uTm9kZU1vdXNlRG93bigkZXZlbnQsIG5vZGUpXCIgKGRibGNsaWNrKT1cIm9uRG91YmxlQ2xpY2sobm9kZSwkZXZlbnQpXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwibm9kZVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibm9kZVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxzdmc6Y2lyY2xlICpuZ0lmPVwiIW5vZGVUZW1wbGF0ZVwiIHI9XCIxMFwiIFthdHRyLmN4XT1cIm5vZGUuZGltZW5zaW9uLndpZHRoIC8gMlwiIFthdHRyLmN5XT1cIm5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDJcIiBbYXR0ci5maWxsXT1cIm5vZGUuZGF0YT8uY29sb3JcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIDwvc3ZnOmc+XHJcbjwvbmd4LWNoYXJ0cy1jaGFydD5cclxuICBgLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ2xpbmsnLCBbbmdUcmFuc2l0aW9uKCcqID0+IConLCBbYW5pbWF0ZSg1MDAsIHN0eWxlKHsgdHJhbnNmb3JtOiAnKicgfSkpXSldKV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdyYXBoQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KClcclxuICBsZWdlbmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlczogTm9kZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY2x1c3RlcnM6IENsdXN0ZXJOb2RlW10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBsaW5rczogRWRnZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBjdXJ2ZTogYW55O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGRyYWdnaW5nRW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNYXhIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWluSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZVdpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1pbldpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1heFdpZHRoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGFubmluZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGVuYWJsZVpvb20gPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHpvb21TcGVlZCA9IDAuMTtcclxuXHJcbiAgQElucHV0KClcclxuICBtaW5ab29tTGV2ZWwgPSAwLjE7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWF4Wm9vbUxldmVsID0gNC4wO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGF1dG9ab29tID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGFuT25ab29tID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBhdXRvQ2VudGVyID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdXBkYXRlJDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNlbnRlciQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tVG9GaXQkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQ7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGF5b3V0U2V0dGluZ3M6IGFueTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnbGlua1RlbXBsYXRlJylcclxuICBsaW5rVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ25vZGVUZW1wbGF0ZScpXHJcbiAgbm9kZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdjbHVzdGVyVGVtcGxhdGUnKVxyXG4gIGNsdXN0ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnZGVmc1RlbXBsYXRlJylcclxuICBkZWZzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBWaWV3Q2hpbGQoQ2hhcnRDb21wb25lbnQsIHsgcmVhZDogRWxlbWVudFJlZiB9KVxyXG4gIGNoYXJ0OiBFbGVtZW50UmVmO1xyXG5cclxuICBAVmlld0NoaWxkcmVuKCdub2RlRWxlbWVudCcpXHJcbiAgbm9kZUVsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XHJcblxyXG4gIEBWaWV3Q2hpbGRyZW4oJ2xpbmtFbGVtZW50JylcclxuICBsaW5rRWxlbWVudHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcclxuXHJcbiAgZ3JhcGhTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuICBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xyXG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XHJcbiAgZGltczogVmlld0RpbWVuc2lvbnM7XHJcbiAgbWFyZ2luID0gWzAsIDAsIDAsIDBdO1xyXG4gIHJlc3VsdHMgPSBbXTtcclxuICBzZXJpZXNEb21haW46IGFueTtcclxuICB0cmFuc2Zvcm06IHN0cmluZztcclxuICBsZWdlbmRPcHRpb25zOiBhbnk7XHJcbiAgaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gIGRyYWdnaW5nTm9kZTogTm9kZTtcclxuICBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gIGdyYXBoOiBHcmFwaDtcclxuICBncmFwaERpbXM6IGFueSA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9O1xyXG4gIF9vbGRMaW5rczogRWRnZVtdID0gW107XHJcbiAgdHJhbnNmb3JtYXRpb25NYXRyaXg6IE1hdHJpeCA9IGlkZW50aXR5KCk7XHJcbiAgX3RvdWNoTGFzdFggPSBudWxsO1xyXG4gIF90b3VjaExhc3RZID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxyXG4gICAgcHVibGljIHpvbmU6IE5nWm9uZSxcclxuICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2VcclxuICApIHtcclxuICAgIHN1cGVyKGVsLCB6b25lLCBjZCk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIGdyb3VwUmVzdWx0c0J5OiAobm9kZTogYW55KSA9PiBzdHJpbmcgPSBub2RlID0+IG5vZGUubGFiZWw7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCB6b29tIGxldmVsXHJcbiAgICovXHJcbiAgZ2V0IHpvb21MZXZlbCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmE7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxyXG4gICAqL1xyXG4gIEBJbnB1dCgnem9vbUxldmVsJylcclxuICBzZXQgem9vbUxldmVsKGxldmVsKSB7XHJcbiAgICB0aGlzLnpvb21UbyhOdW1iZXIobGV2ZWwpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgZ2V0IHBhbk9mZnNldFgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IGB4YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBASW5wdXQoJ3Bhbk9mZnNldFgnKVxyXG4gIHNldCBwYW5PZmZzZXRYKHgpIHtcclxuICAgIHRoaXMucGFuVG8oTnVtYmVyKHgpLCBudWxsKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgZ2V0IHBhbk9mZnNldFkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IGB5YCBwb3NpdGlvbiBvZiB0aGUgZ3JhcGhcclxuICAgKi9cclxuICBASW5wdXQoJ3Bhbk9mZnNldFknKVxyXG4gIHNldCBwYW5PZmZzZXRZKHkpIHtcclxuICAgIHRoaXMucGFuVG8obnVsbCwgTnVtYmVyKHkpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudXBkYXRlJCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLnVwZGF0ZSQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jZW50ZXIkKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxyXG4gICAgICAgIHRoaXMuY2VudGVyJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jZW50ZXIoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuem9vbVRvRml0JCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLnpvb21Ub0ZpdCQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKGNoYW5nZXMpO1xyXG4gICAgY29uc3QgeyBsYXlvdXQsIGxheW91dFNldHRpbmdzLCBub2RlcywgY2x1c3RlcnMsIGxpbmtzIH0gPSBjaGFuZ2VzO1xyXG4gICAgdGhpcy5zZXRMYXlvdXQodGhpcy5sYXlvdXQpO1xyXG4gICAgaWYgKGxheW91dFNldHRpbmdzKSB7XHJcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICBpZiAobm9kZXMgfHwgY2x1c3RlcnMgfHwgbGlua3MpIHtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExheW91dChsYXlvdXQ6IHN0cmluZyB8IExheW91dCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgaWYgKCFsYXlvdXQpIHtcclxuICAgICAgbGF5b3V0ID0gJ2RhZ3JlJztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbGF5b3V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmxheW91dCA9IHRoaXMubGF5b3V0U2VydmljZS5nZXRMYXlvdXQobGF5b3V0KTtcclxuICAgICAgdGhpcy5zZXRMYXlvdXRTZXR0aW5ncyh0aGlzLmxheW91dFNldHRpbmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExheW91dFNldHRpbmdzKHNldHRpbmdzOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0LnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XHJcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQmFzZSBjbGFzcyB1cGRhdGUgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBkYWcgZ3JhcGhcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLnVwZGF0ZSgpO1xyXG5cclxuICAgIGlmICghdGhpcy5jdXJ2ZSkge1xyXG4gICAgICB0aGlzLmN1cnZlID0gc2hhcGUuY3VydmVCdW5kbGUuYmV0YSgxKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xyXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXHJcbiAgICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnNlcmllc0RvbWFpbiA9IHRoaXMuZ2V0U2VyaWVzRG9tYWluKCk7XHJcbiAgICAgIHRoaXMuc2V0Q29sb3JzKCk7XHJcbiAgICAgIHRoaXMubGVnZW5kT3B0aW9ucyA9IHRoaXMuZ2V0TGVnZW5kT3B0aW9ucygpO1xyXG5cclxuICAgICAgdGhpcy5jcmVhdGVHcmFwaCgpO1xyXG4gICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhd3MgdGhlIGdyYXBoIHVzaW5nIGRhZ3JlIGxheW91dHNcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZHJhdygpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5sYXlvdXQgfHwgdHlwZW9mIHRoaXMubGF5b3V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBDYWxjIHZpZXcgZGltcyBmb3IgdGhlIG5vZGVzXHJcbiAgICB0aGlzLmFwcGx5Tm9kZURpbWVuc2lvbnMoKTtcclxuXHJcbiAgICAvLyBSZWNhbGMgdGhlIGxheW91dFxyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQucnVuKHRoaXMuZ3JhcGgpO1xyXG4gICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgIHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcclxuICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XHJcbiAgICAgICAgdGhpcy50aWNrKCk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gICAgcmVzdWx0JC5waXBlKGZpcnN0KGdyYXBoID0+IGdyYXBoLm5vZGVzLmxlbmd0aCA+IDApKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCkpO1xyXG4gIH1cclxuXHJcbiAgdGljaygpIHtcclxuICAgIC8vIFRyYW5zcG9zZXMgdmlldyBvcHRpb25zIHRvIHRoZSBub2RlXHJcbiAgICB0aGlzLmdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7bi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHxcclxuICAgICAgICAwfSlgO1xyXG4gICAgICBpZiAoIW4uZGF0YSkge1xyXG4gICAgICAgIG4uZGF0YSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCFuLmRhdGEuY29sb3Ipe1xyXG4gICAgICAgIFxyXG4gICAgICAgIG4uZGF0YSA9IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgKHRoaXMuZ3JhcGguY2x1c3RlcnMgfHwgW10pLm1hcChuID0+IHtcclxuICAgICAgbi50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7bi5wb3NpdGlvbi54IC0gbi5kaW1lbnNpb24ud2lkdGggLyAyIHx8IDB9LCAke24ucG9zaXRpb24ueSAtIG4uZGltZW5zaW9uLmhlaWdodCAvIDIgfHxcclxuICAgICAgICAwfSlgO1xyXG4gICAgICBpZiAoIW4uZGF0YSkge1xyXG4gICAgICAgIG4uZGF0YSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCFuLmRhdGEuY29sb3Ipe1xyXG4gICAgICAgIFxyXG4gICAgICBuLmRhdGEgPSB7XHJcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZ3JvdXBSZXN1bHRzQnkobikpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdGhlIGxhYmVscyB0byB0aGUgbmV3IHBvc2l0aW9uc1xyXG4gICAgY29uc3QgbmV3TGlua3MgPSBbXTtcclxuICAgIGZvciAoY29uc3QgZWRnZUxhYmVsSWQgaW4gdGhpcy5ncmFwaC5lZGdlTGFiZWxzKSB7XHJcbiAgICAgIGNvbnN0IGVkZ2VMYWJlbCA9IHRoaXMuZ3JhcGguZWRnZUxhYmVsc1tlZGdlTGFiZWxJZF07XHJcblxyXG4gICAgICBjb25zdCBub3JtS2V5ID0gZWRnZUxhYmVsSWQucmVwbGFjZSgvW15cXHctXSovZywgJycpO1xyXG4gICAgICBsZXQgb2xkTGluayA9IHRoaXMuX29sZExpbmtzLmZpbmQob2wgPT4gYCR7b2wuc291cmNlfSR7b2wudGFyZ2V0fWAgPT09IG5vcm1LZXkpO1xyXG4gICAgICBpZiAoIW9sZExpbmspIHtcclxuICAgICAgICBvbGRMaW5rID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKG5sID0+IGAke25sLnNvdXJjZX0ke25sLnRhcmdldH1gID09PSBub3JtS2V5KSB8fCBlZGdlTGFiZWw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9sZExpbmsub2xkTGluZSA9IG9sZExpbmsubGluZTtcclxuXHJcbiAgICAgIGNvbnN0IHBvaW50cyA9IGVkZ2VMYWJlbC5wb2ludHM7XHJcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShwb2ludHMpO1xyXG5cclxuICAgICAgY29uc3QgbmV3TGluayA9IE9iamVjdC5hc3NpZ24oe30sIG9sZExpbmspO1xyXG4gICAgICBuZXdMaW5rLmxpbmUgPSBsaW5lO1xyXG4gICAgICBuZXdMaW5rLnBvaW50cyA9IHBvaW50cztcclxuXHJcbiAgICAgIGNvbnN0IHRleHRQb3MgPSBwb2ludHNbTWF0aC5mbG9vcihwb2ludHMubGVuZ3RoIC8gMildO1xyXG4gICAgICBpZiAodGV4dFBvcykge1xyXG4gICAgICAgIG5ld0xpbmsudGV4dFRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0ZXh0UG9zLnggfHwgMH0sJHt0ZXh0UG9zLnkgfHwgMH0pYDtcclxuICAgICAgfVxyXG5cclxuICAgICAgbmV3TGluay50ZXh0QW5nbGUgPSAwO1xyXG4gICAgICBpZiAoIW5ld0xpbmsub2xkTGluZSkge1xyXG4gICAgICAgIG5ld0xpbmsub2xkTGluZSA9IG5ld0xpbmsubGluZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jYWxjRG9taW5hbnRCYXNlbGluZShuZXdMaW5rKTtcclxuICAgICAgbmV3TGlua3MucHVzaChuZXdMaW5rKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdyYXBoLmVkZ2VzID0gbmV3TGlua3M7XHJcblxyXG4gICAgLy8gTWFwIHRoZSBvbGQgbGlua3MgZm9yIGFuaW1hdGlvbnNcclxuICAgIGlmICh0aGlzLmdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuX29sZExpbmtzID0gdGhpcy5ncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3TCA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICAgIG5ld0wub2xkTGluZSA9IGwubGluZTtcclxuICAgICAgICByZXR1cm4gbmV3TDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBoZWlnaHQvd2lkdGggdG90YWxcclxuICAgIHRoaXMuZ3JhcGhEaW1zLndpZHRoID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnggKyBuLmRpbWVuc2lvbi53aWR0aCkpO1xyXG4gICAgdGhpcy5ncmFwaERpbXMuaGVpZ2h0ID0gTWF0aC5tYXgoLi4udGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiBuLnBvc2l0aW9uLnkgKyBuLmRpbWVuc2lvbi5oZWlnaHQpKTtcclxuXHJcbiAgICBpZiAodGhpcy5hdXRvWm9vbSkge1xyXG4gICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmF1dG9DZW50ZXIpIHtcclxuICAgICAgLy8gQXV0by1jZW50ZXIgd2hlbiByZW5kZXJpbmdcclxuICAgICAgdGhpcy5jZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5yZWRyYXdMaW5lcygpKTtcclxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNZWFzdXJlcyB0aGUgbm9kZSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZSBkaW1lbnNpb25zXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBhcHBseU5vZGVEaW1lbnNpb25zKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubm9kZUVsZW1lbnRzICYmIHRoaXMubm9kZUVsZW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm5vZGVFbGVtZW50cy5tYXAoZWxlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IGVsZW0ubmF0aXZlRWxlbWVudDtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gbmF0aXZlRWxlbWVudC5pZCk7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0XHJcbiAgICAgICAgbGV0IGRpbXM7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGRpbXMgPSBuYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVIZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IHRoaXMubm9kZUhlaWdodDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gZGltcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4SGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1heEhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNaW5IZWlnaHQpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLmhlaWdodCwgdGhpcy5ub2RlTWluSGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVXaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSB0aGlzLm5vZGVXaWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSB3aWR0aFxyXG4gICAgICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGV0IHRleHREaW1zO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIHRleHREaW1zID0gbmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpWzBdLmdldEJCb3goKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAvLyBTa2lwIGRyYXdpbmcgaWYgZWxlbWVudCBpcyBub3QgZGlzcGxheWVkIC0gRmlyZWZveCB3b3VsZCB0aHJvdyBhbiBlcnJvciBoZXJlXHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gdGV4dERpbXMud2lkdGggKyAyMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gZGltcy53aWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGVNYXhXaWR0aCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24ud2lkdGggPSBNYXRoLm1heChub2RlLmRpbWVuc2lvbi53aWR0aCwgdGhpcy5ub2RlTWF4V2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWluV2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5taW4obm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1pbldpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVkcmF3cyB0aGUgbGluZXMgd2hlbiBkcmFnZ2VkIG9yIHZpZXdwb3J0IHVwZGF0ZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHJlZHJhd0xpbmVzKF9hbmltYXRlID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgdGhpcy5saW5rRWxlbWVudHMubWFwKGxpbmtFbCA9PiB7XHJcbiAgICAgIGNvbnN0IGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzLmZpbmQobGluID0+IGxpbi5pZCA9PT0gbGlua0VsLm5hdGl2ZUVsZW1lbnQuaWQpO1xyXG5cclxuICAgICAgaWYgKGVkZ2UpIHtcclxuICAgICAgICBjb25zdCBsaW5rU2VsZWN0aW9uID0gc2VsZWN0KGxpbmtFbC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoJy5saW5lJyk7XHJcbiAgICAgICAgbGlua1NlbGVjdGlvblxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLm9sZExpbmUpXHJcbiAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLmxpbmUpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0UGF0aFNlbGVjdGlvbiA9IHNlbGVjdCh0aGlzLmNoYXJ0RWxlbWVudC5uYXRpdmVFbGVtZW50KS5zZWxlY3QoYCMke2VkZ2UuaWR9YCk7XHJcbiAgICAgICAgdGV4dFBhdGhTZWxlY3Rpb25cclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRUZXh0UGF0aClcclxuICAgICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAgIC5kdXJhdGlvbihfYW5pbWF0ZSA/IDUwMCA6IDApXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2UudGV4dFBhdGgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGRhZ3JlIGdyYXBoIGVuZ2luZVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgY3JlYXRlR3JhcGgoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLmdyYXBoU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xyXG4gICAgY29uc3QgaW5pdGlhbGl6ZU5vZGUgPSBuID0+IHtcclxuICAgICAgaWYgKCFuLmlkKSB7XHJcbiAgICAgICAgbi5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgbi5kaW1lbnNpb24gPSB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIGhlaWdodDogMzBcclxuICAgICAgfTtcclxuICAgICAgbi5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgICAgfTtcclxuICAgICAgbi5kYXRhID0gbi5kYXRhID8gbi5kYXRhIDoge307XHJcbiAgICAgIHJldHVybiBuO1xyXG4gICAgfTtcclxuICAgIHRoaXMuZ3JhcGggPSB7XHJcbiAgICAgIG5vZGVzOiBbLi4udGhpcy5ub2Rlc10ubWFwKGluaXRpYWxpemVOb2RlKSxcclxuICAgICAgY2x1c3RlcnM6IFsuLi4odGhpcy5jbHVzdGVycyB8fCBbXSldLm1hcChpbml0aWFsaXplTm9kZSksXHJcbiAgICAgIGVkZ2VzOiBbLi4udGhpcy5saW5rc10ubWFwKGUgPT4ge1xyXG4gICAgICAgIGlmICghZS5pZCkge1xyXG4gICAgICAgICAgZS5pZCA9IGlkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlO1xyXG4gICAgICB9KVxyXG4gICAgfTtcclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3KCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlIHRoZSB0ZXh0IGRpcmVjdGlvbnMgLyBmbGlwcGluZ1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgY2FsY0RvbWluYW50QmFzZWxpbmUobGluayk6IHZvaWQge1xyXG4gICAgY29uc3QgZmlyc3RQb2ludCA9IGxpbmsucG9pbnRzWzBdO1xyXG4gICAgY29uc3QgbGFzdFBvaW50ID0gbGluay5wb2ludHNbbGluay5wb2ludHMubGVuZ3RoIC0gMV07XHJcbiAgICBsaW5rLm9sZFRleHRQYXRoID0gbGluay50ZXh0UGF0aDtcclxuXHJcbiAgICBpZiAobGFzdFBvaW50LnggPCBmaXJzdFBvaW50LngpIHtcclxuICAgICAgbGluay5kb21pbmFudEJhc2VsaW5lID0gJ3RleHQtYmVmb3JlLWVkZ2UnO1xyXG5cclxuICAgICAgLy8gcmV2ZXJzZSB0ZXh0IHBhdGggZm9yIHdoZW4gaXRzIGZsaXBwZWQgdXBzaWRlIGRvd25cclxuICAgICAgbGluay50ZXh0UGF0aCA9IHRoaXMuZ2VuZXJhdGVMaW5lKFsuLi5saW5rLnBvaW50c10ucmV2ZXJzZSgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWFmdGVyLWVkZ2UnO1xyXG4gICAgICBsaW5rLnRleHRQYXRoID0gbGluay5saW5lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2VuZXJhdGUgdGhlIG5ldyBsaW5lIHBhdGhcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdlbmVyYXRlTGluZShwb2ludHMpOiBhbnkge1xyXG4gICAgY29uc3QgbGluZUZ1bmN0aW9uID0gc2hhcGVcclxuICAgICAgLmxpbmU8YW55PigpXHJcbiAgICAgIC54KGQgPT4gZC54KVxyXG4gICAgICAueShkID0+IGQueSlcclxuICAgICAgLmN1cnZlKHRoaXMuY3VydmUpO1xyXG4gICAgcmV0dXJuIGxpbmVGdW5jdGlvbihwb2ludHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblpvb20oJGV2ZW50OiBNb3VzZUV2ZW50LCBkaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgIGNvbnN0IHpvb21GYWN0b3IgPSAxICsgKGRpcmVjdGlvbiA9PT0gJ2luJyA/IHRoaXMuem9vbVNwZWVkIDogLXRoaXMuem9vbVNwZWVkKTtcclxuXHJcbiAgICAvLyBDaGVjayB0aGF0IHpvb21pbmcgd291bGRuJ3QgcHV0IHVzIG91dCBvZiBib3VuZHNcclxuICAgIGNvbnN0IG5ld1pvb21MZXZlbCA9IHRoaXMuem9vbUxldmVsICogem9vbUZhY3RvcjtcclxuICAgIGlmIChuZXdab29tTGV2ZWwgPD0gdGhpcy5taW5ab29tTGV2ZWwgfHwgbmV3Wm9vbUxldmVsID49IHRoaXMubWF4Wm9vbUxldmVsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB6b29taW5nIGlzIGVuYWJsZWQgb3Igbm90XHJcbiAgICBpZiAoIXRoaXMuZW5hYmxlWm9vbSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucGFuT25ab29tID09PSB0cnVlICYmICRldmVudCkge1xyXG4gICAgICAvLyBBYnNvbHV0ZSBtb3VzZSBYL1kgb24gdGhlIHNjcmVlblxyXG4gICAgICBjb25zdCBtb3VzZVggPSAkZXZlbnQuY2xpZW50WDtcclxuICAgICAgY29uc3QgbW91c2VZID0gJGV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgICAvLyBUcmFuc2Zvcm0gdGhlIG1vdXNlIFgvWSBpbnRvIGEgU1ZHIFgvWVxyXG4gICAgICBjb25zdCBzdmcgPSB0aGlzLmNoYXJ0Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJyk7XHJcbiAgICAgIGNvbnN0IHN2Z0dyb3VwID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2cuY2hhcnQnKTtcclxuXHJcbiAgICAgIGNvbnN0IHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgIHBvaW50LnggPSBtb3VzZVg7XHJcbiAgICAgIHBvaW50LnkgPSBtb3VzZVk7XHJcbiAgICAgIGNvbnN0IHN2Z1BvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKHN2Z0dyb3VwLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XHJcblxyXG4gICAgICAvLyBQYW56b29tXHJcbiAgICAgIGNvbnN0IE5PX1pPT01fTEVWRUwgPSAxO1xyXG4gICAgICB0aGlzLnBhbihzdmdQb2ludC54LCBzdmdQb2ludC55LCBOT19aT09NX0xFVkVMKTtcclxuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xyXG4gICAgICB0aGlzLnBhbigtc3ZnUG9pbnQueCwgLXN2Z1BvaW50LnksIE5PX1pPT01fTEVWRUwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy56b29tKHpvb21GYWN0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGFuIGJ5IHgveVxyXG4gICAqXHJcbiAgICovXHJcbiAgcGFuKHg6IG51bWJlciwgeTogbnVtYmVyLCB6b29tTGV2ZWw6IG51bWJlciA9IHRoaXMuem9vbUxldmVsKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRyYW5zbGF0ZSh4IC8gem9vbUxldmVsLCB5IC8gem9vbUxldmVsKSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiB0byBhIGZpeGVkIHgveVxyXG4gICAqXHJcbiAgICovXHJcbiAgcGFuVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZSA9IHggPT09IG51bGwgfHwgeCA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHgpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5lIDogTnVtYmVyKHgpO1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mID0geSA9PT0gbnVsbCB8fCB5ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeSkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmYgOiBOdW1iZXIoeSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gYnkgYSBmYWN0b3JcclxuICAgKlxyXG4gICAqL1xyXG4gIHpvb20oZmFjdG9yOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgc2NhbGUoZmFjdG9yLCBmYWN0b3IpKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbSB0byBhIGZpeGVkIGxldmVsXHJcbiAgICpcclxuICAgKi9cclxuICB6b29tVG8obGV2ZWw6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hID0gaXNOYU4obGV2ZWwpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hIDogTnVtYmVyKGxldmVsKTtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZCA6IE51bWJlcihsZXZlbCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiB3YXMgaW52b2tlZCBmcm9tIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblBhbihldmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW4oZXZlbnQubW92ZW1lbnRYLCBldmVudC5tb3ZlbWVudFkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhZyB3YXMgaW52b2tlZCBmcm9tIGFuIGV2ZW50XHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkRyYWcoZXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5kcmFnZ2luZ0VuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZHJhZ2dpbmdOb2RlO1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZyhub2RlLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZS5wb3NpdGlvbi54ICs9IGV2ZW50Lm1vdmVtZW50WCAvIHRoaXMuem9vbUxldmVsO1xyXG4gICAgbm9kZS5wb3NpdGlvbi55ICs9IGV2ZW50Lm1vdmVtZW50WSAvIHRoaXMuem9vbUxldmVsO1xyXG5cclxuICAgIC8vIG1vdmUgdGhlIG5vZGVcclxuICAgIGNvbnN0IHggPSBub2RlLnBvc2l0aW9uLnggLSBub2RlLmRpbWVuc2lvbi53aWR0aCAvIDI7XHJcbiAgICBjb25zdCB5ID0gbm9kZS5wb3NpdGlvbi55IC0gbm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMjtcclxuICAgIG5vZGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3h9LCAke3l9KWA7XHJcblxyXG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHRoaXMuZ3JhcGguZWRnZXMpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGxpbmsudGFyZ2V0ID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgbGluay5zb3VyY2UgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICAobGluay50YXJnZXQgYXMgYW55KS5pZCA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIChsaW5rLnNvdXJjZSBhcyBhbnkpLmlkID09PSBub2RlLmlkXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmxheW91dC51cGRhdGVFZGdlKHRoaXMuZ3JhcGgsIGxpbmspO1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0JCA9IHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyByZXN1bHQgOiBvZihyZXN1bHQpO1xyXG4gICAgICAgICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgICAgICAgIHJlc3VsdCQuc3Vic2NyaWJlKGdyYXBoID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZWRyYXdFZGdlKGxpbmspO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZHJhd0xpbmVzKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHJlZHJhd0VkZ2UoZWRnZTogRWRnZSkge1xyXG4gICAgY29uc3QgbGluZSA9IHRoaXMuZ2VuZXJhdGVMaW5lKGVkZ2UucG9pbnRzKTtcclxuICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUoZWRnZSk7XHJcbiAgICBlZGdlLm9sZExpbmUgPSBlZGdlLmxpbmU7XHJcbiAgICBlZGdlLmxpbmUgPSBsaW5lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBlbnRpcmUgdmlldyBmb3IgdGhlIG5ldyBwYW4gcG9zaXRpb25cclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdXBkYXRlVHJhbnNmb3JtKCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSB0b1NWRyh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGNsaWNrZWRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25DbGljayhldmVudCwgb3JpZ2luYWxFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQub3JpZ0V2ZW50ID0gb3JpZ2luYWxFdmVudDtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgY2xpY2tlZFxyXG4gICAqXHJcbiAgICovXHJcbiAgb25Eb3VibGVDbGljayhldmVudCwgb3JpZ2luYWxFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQub3JpZ0V2ZW50ID0gb3JpZ2luYWxFdmVudDtcclxuICAgIGV2ZW50LmlzRG91YmxlQ2xpY2sgPSB0cnVlO1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBmb2N1c2VkXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uQWN0aXZhdGUoZXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCkgPiAtMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbZXZlbnQsIC4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGRlZm9jdXNlZFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25EZWFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuaW5kZXhPZihldmVudCk7XHJcblxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcblxyXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZXZlbnQsIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgZG9tYWluIHNlcmllcyBmb3IgdGhlIG5vZGVzXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRTZXJpZXNEb21haW4oKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZXNcclxuICAgICAgLm1hcChkID0+IHRoaXMuZ3JvdXBSZXN1bHRzQnkoZCkpXHJcbiAgICAgIC5yZWR1Y2UoKG5vZGVzOiBzdHJpbmdbXSwgbm9kZSk6IGFueVtdID0+IChub2Rlcy5pbmRleE9mKG5vZGUpICE9PSAtMSA/IG5vZGVzIDogbm9kZXMuY29uY2F0KFtub2RlXSkpLCBbXSlcclxuICAgICAgLnNvcnQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbGlua1xyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB0cmFja0xpbmtCeShpbmRleCwgbGluayk6IGFueSB7XHJcbiAgICByZXR1cm4gbGluay5pZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNraW5nIGZvciB0aGUgbm9kZVxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB0cmFja05vZGVCeShpbmRleCwgbm9kZSk6IGFueSB7XHJcbiAgICByZXR1cm4gbm9kZS5pZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGNvbG9ycyB0aGUgbm9kZXNcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgc2V0Q29sb3JzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsICdvcmRpbmFsJywgdGhpcy5zZXJpZXNEb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGxlZ2VuZCBvcHRpb25zXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRMZWdlbmRPcHRpb25zKCk6IGFueSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzY2FsZVR5cGU6ICdvcmRpbmFsJyxcclxuICAgICAgZG9tYWluOiB0aGlzLnNlcmllc0RvbWFpbixcclxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9yc1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG1vdXNlIG1vdmUgZXZlbnQsIHVzZWQgZm9yIHBhbm5pbmcgYW5kIGRyYWdnaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlTW92ZSgkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMub25QYW4oJGV2ZW50KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMub25EcmFnKCRldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBzdGFydCBldmVudCB0byBlbmFibGUgcGFubmluZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uVG91Y2hTdGFydChldmVudCkge1xyXG4gICAgdGhpcy5fdG91Y2hMYXN0WCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICB0aGlzLl90b3VjaExhc3RZID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcclxuXHJcbiAgICB0aGlzLmlzUGFubmluZyA9IHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2htb3ZlJywgWyckZXZlbnQnXSlcclxuICBvblRvdWNoTW92ZSgkZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzUGFubmluZyAmJiB0aGlzLnBhbm5pbmdFbmFibGVkKSB7XHJcbiAgICAgIGNvbnN0IGNsaWVudFggPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgY2xpZW50WSA9ICRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBjb25zdCBtb3ZlbWVudFggPSBjbGllbnRYIC0gdGhpcy5fdG91Y2hMYXN0WDtcclxuICAgICAgY29uc3QgbW92ZW1lbnRZID0gY2xpZW50WSAtIHRoaXMuX3RvdWNoTGFzdFk7XHJcbiAgICAgIHRoaXMuX3RvdWNoTGFzdFggPSBjbGllbnRYO1xyXG4gICAgICB0aGlzLl90b3VjaExhc3RZID0gY2xpZW50WTtcclxuXHJcbiAgICAgIHRoaXMucGFuKG1vdmVtZW50WCwgbW92ZW1lbnRZKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIHRvdWNoIGVuZCBldmVudCB0byBkaXNhYmxlIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblRvdWNoRW5kKGV2ZW50KSB7XHJcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbW91c2UgdXAgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nL2RyYWdnaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcpXHJcbiAgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNQYW5uaW5nID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJyAmJiB0aGlzLmxheW91dC5vbkRyYWdFbmQpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnRW5kKHRoaXMuZHJhZ2dpbmdOb2RlLCBldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBub2RlIG1vdXNlIGRvd24gdG8ga2ljayBvZmYgZHJhZ2dpbmdcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uTm9kZU1vdXNlRG93bihldmVudDogTW91c2VFdmVudCwgbm9kZTogYW55KTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICB0aGlzLmRyYWdnaW5nTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQpIHtcclxuICAgICAgdGhpcy5sYXlvdXQub25EcmFnU3RhcnQobm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2VudGVyIHRoZSBncmFwaCBpbiB0aGUgdmlld3BvcnRcclxuICAgKi9cclxuICBjZW50ZXIoKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhblRvKFxyXG4gICAgICB0aGlzLmRpbXMud2lkdGggLyAyIC0gKHRoaXMuZ3JhcGhEaW1zLndpZHRoICogdGhpcy56b29tTGV2ZWwpIC8gMixcclxuICAgICAgdGhpcy5kaW1zLmhlaWdodCAvIDIgLSAodGhpcy5ncmFwaERpbXMuaGVpZ2h0ICogdGhpcy56b29tTGV2ZWwpIC8gMlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb21zIHRvIGZpdCB0aGUgZW50aWVyIGdyYXBoXHJcbiAgICovXHJcbiAgem9vbVRvRml0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgaGVpZ2h0Wm9vbSA9IHRoaXMuZGltcy5oZWlnaHQgLyB0aGlzLmdyYXBoRGltcy5oZWlnaHQ7XHJcbiAgICBjb25zdCB3aWR0aFpvb20gPSB0aGlzLmRpbXMud2lkdGggLyB0aGlzLmdyYXBoRGltcy53aWR0aDtcclxuICAgIGNvbnN0IHpvb21MZXZlbCA9IE1hdGgubWluKGhlaWdodFpvb20sIHdpZHRoWm9vbSwgMSk7XHJcbiAgICBpZiAoem9vbUxldmVsICE9PSB0aGlzLnpvb21MZXZlbCkge1xyXG4gICAgICB0aGlzLnpvb21MZXZlbCA9IHpvb21MZXZlbDtcclxuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBPdXRwdXQsIEhvc3RMaXN0ZW5lciwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG4vKipcclxuICogTW91c2V3aGVlbCBkaXJlY3RpdmVcclxuICogaHR0cHM6Ly9naXRodWIuY29tL1NvZGhhbmFMaWJyYXJ5L2FuZ3VsYXIyLWV4YW1wbGVzL2Jsb2IvbWFzdGVyL2FwcC9tb3VzZVdoZWVsRGlyZWN0aXZlL21vdXNld2hlZWwuZGlyZWN0aXZlLnRzXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICovXHJcbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1ttb3VzZVdoZWVsXScgfSlcclxuZXhwb3J0IGNsYXNzIE1vdXNlV2hlZWxEaXJlY3RpdmUge1xyXG4gIEBPdXRwdXQoKVxyXG4gIG1vdXNlV2hlZWxVcCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KClcclxuICBtb3VzZVdoZWVsRG93biA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2V3aGVlbCcsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZVdoZWVsQ2hyb21lKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2VXaGVlbEZpcmVmb3goZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdvbm1vdXNld2hlZWwnLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2VXaGVlbElFKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgbW91c2VXaGVlbEZ1bmMoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHdpbmRvdy5ldmVudCkge1xyXG4gICAgICBldmVudCA9IHdpbmRvdy5ldmVudDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkZWx0YSA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBldmVudC53aGVlbERlbHRhIHx8IC1ldmVudC5kZXRhaWwpKTtcclxuICAgIGlmIChkZWx0YSA+IDApIHtcclxuICAgICAgdGhpcy5tb3VzZVdoZWVsVXAuZW1pdChldmVudCk7XHJcbiAgICB9IGVsc2UgaWYgKGRlbHRhIDwgMCkge1xyXG4gICAgICB0aGlzLm1vdXNlV2hlZWxEb3duLmVtaXQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZvciBJRVxyXG4gICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBmb3IgQ2hyb21lIGFuZCBGaXJlZm94XHJcbiAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgR3JhcGhDb21wb25lbnQgfSBmcm9tICcuL2dyYXBoLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENoYXJ0Q29tbW9uTW9kdWxlIH0gZnJvbSAnQHN3aW1sYW5lL25neC1jaGFydHMnO1xyXG5pbXBvcnQgeyBNb3VzZVdoZWVsRGlyZWN0aXZlIH0gZnJvbSAnLi9tb3VzZS13aGVlbC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcclxuZXhwb3J0IHsgR3JhcGhDb21wb25lbnQgfTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NoYXJ0Q29tbW9uTW9kdWxlXSxcclxuICBkZWNsYXJhdGlvbnM6IFtHcmFwaENvbXBvbmVudCwgTW91c2VXaGVlbERpcmVjdGl2ZV0sXHJcbiAgZXhwb3J0czogW0dyYXBoQ29tcG9uZW50LCBNb3VzZVdoZWVsRGlyZWN0aXZlXSxcclxuICBwcm92aWRlcnM6IFtMYXlvdXRTZXJ2aWNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgR3JhcGhNb2R1bGUge31cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgR3JhcGhNb2R1bGUgfSBmcm9tICcuL2dyYXBoL2dyYXBoLm1vZHVsZSc7XHJcbmltcG9ydCB7IE5neENoYXJ0c01vZHVsZSB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vbW9kZWxzL2luZGV4JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW05neENoYXJ0c01vZHVsZV0sXHJcbiAgZXhwb3J0czogW0dyYXBoTW9kdWxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4R3JhcGhNb2R1bGUge31cclxuIl0sIm5hbWVzIjpbImRhZ3JlLmxheW91dCIsImRhZ3JlLmdyYXBobGliIiwidHNsaWJfMS5fX3ZhbHVlcyIsIk9yaWVudGF0aW9uIiwiSW5qZWN0YWJsZSIsIkVsZW1lbnRSZWYiLCJ0c2xpYl8xLl9fZXh0ZW5kcyIsIkV2ZW50RW1pdHRlciIsIlN1YnNjcmlwdGlvbiIsImlkZW50aXR5Iiwic2hhcGUuY3VydmVCdW5kbGUiLCJjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyIsIk9ic2VydmFibGUiLCJvZiIsImZpcnN0Iiwic2VsZWN0IiwidHNsaWJfMS5fX3NwcmVhZCIsInNoYXBlXHJcbiAgICAgICAgICAgICAgICAubGluZSIsInRyYW5zZm9ybSIsInRyYW5zbGF0ZSIsInNjYWxlIiwidG9TVkciLCJDb2xvckhlbHBlciIsIkNvbXBvbmVudCIsIlZpZXdFbmNhcHN1bGF0aW9uIiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJ0cmlnZ2VyIiwibmdUcmFuc2l0aW9uIiwiYW5pbWF0ZSIsInN0eWxlIiwiTmdab25lIiwiQ2hhbmdlRGV0ZWN0b3JSZWYiLCJJbnB1dCIsIk91dHB1dCIsIkNvbnRlbnRDaGlsZCIsIlZpZXdDaGlsZCIsIkNoYXJ0Q29tcG9uZW50IiwiVmlld0NoaWxkcmVuIiwiSG9zdExpc3RlbmVyIiwiQmFzZUNoYXJ0Q29tcG9uZW50IiwiRGlyZWN0aXZlIiwiTmdNb2R1bGUiLCJDaGFydENvbW1vbk1vZHVsZSIsIk5neENoYXJ0c01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0E7SUFFQSxJQUFJLGFBQWEsR0FBRyxVQUFTLENBQUMsRUFBRSxDQUFDO1FBQzdCLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYzthQUNoQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1RSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDL0UsT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQztBQUVGLGFBQWdCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxQixhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLFNBQVMsRUFBRSxLQUFLLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDdkMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RixDQUFDO0FBRUQsSUFBTyxJQUFJLFFBQVEsR0FBRztRQUNsQixRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hGO1lBQ0QsT0FBTyxDQUFDLENBQUM7U0FDWixDQUFBO1FBQ0QsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUE7QUFFRCxhQWtFZ0IsUUFBUSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTztZQUNILElBQUksRUFBRTtnQkFDRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07b0JBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUMzQztTQUNKLENBQUM7SUFDTixDQUFDO0FBRUQsYUFBZ0IsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsSUFBSTtZQUNBLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUk7Z0JBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUFFO2dCQUMvQjtZQUNKLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRDtvQkFDTztnQkFBRSxJQUFJLENBQUM7b0JBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQUU7U0FDcEM7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7QUFFRCxhQUFnQixRQUFRO1FBQ3BCLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQzlDLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7OztRQzFJSyxLQUFLLEdBQUcsRUFBRTs7Ozs7O0FBTWhCLGFBQWdCLEVBQUU7O1lBQ1osS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEYsS0FBSyxHQUFHLE1BQUksS0FBTyxDQUFDOztRQUdwQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDcEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE9BQU8sRUFBRSxFQUFFLENBQUM7SUFDZCxDQUFDOzs7Ozs7OztRQ1hDLGVBQWdCLElBQUk7UUFDcEIsZUFBZ0IsSUFBSTtRQUNwQixlQUFnQixJQUFJO1FBQ3BCLGVBQWdCLElBQUk7O0lBc0J0QjtRQUFBO1lBQ0Usb0JBQWUsR0FBa0I7Z0JBQy9CLFdBQVcsRUFBRSxXQUFXLENBQUMsYUFBYTtnQkFDdEMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLEdBQUc7Z0JBQ2hCLFdBQVcsRUFBRSxHQUFHO2dCQUNoQixXQUFXLEVBQUUsRUFBRTthQUNoQixDQUFDO1lBQ0YsYUFBUSxHQUFrQixFQUFFLENBQUM7U0EwRzlCOzs7OztRQXBHQyx5QkFBRzs7OztZQUFILFVBQUksS0FBWTtnQkFDZCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdCQSxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUU5QixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO3dDQUVwQyxXQUFXOzt3QkFDZCxTQUFTLEdBQUcsT0FBSyxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzs7d0JBQy9DLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLEVBQUUsR0FBQSxDQUFDO29CQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHO3dCQUNkLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDZCxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7cUJBQ2YsQ0FBQztvQkFDRixJQUFJLENBQUMsU0FBUyxHQUFHO3dCQUNmLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSzt3QkFDdEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO3FCQUN6QixDQUFDO2lCQUNIOztnQkFYRCxLQUFLLElBQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTs0QkFBckMsV0FBVztpQkFXckI7Z0JBRUQsT0FBTyxLQUFLLENBQUM7YUFDZDs7Ozs7O1FBRUQsZ0NBQVU7Ozs7O1lBQVYsVUFBVyxLQUFZLEVBQUUsSUFBVTs7b0JBQzNCLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBQSxDQUFDOztvQkFDeEQsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFBLENBQUM7OztvQkFHeEQsR0FBRyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7O29CQUM3RCxhQUFhLEdBQUc7b0JBQ3BCLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3hCLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2lCQUNuRTs7b0JBQ0ssV0FBVyxHQUFHO29CQUNsQixDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4QixDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDbkU7O2dCQUdELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7Ozs7O1FBRUQsc0NBQWdCOzs7O1lBQWhCLFVBQWlCLEtBQVk7O2dCQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUlDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7b0JBQ3ZDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3ZFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO29CQUN2QixPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVc7b0JBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztvQkFDekIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO29CQUN6QixPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVc7b0JBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsV0FBVztvQkFDN0IsT0FBTyxFQUFFLFFBQVEsQ0FBQyxXQUFXO29CQUM3QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7b0JBQ3JCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztvQkFDN0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2lCQUN4QixDQUFDLENBQUM7O2dCQUdILElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7b0JBQ2xDLE9BQU87O3FCQUVOLENBQUM7aUJBQ0gsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDOzt3QkFDM0IsSUFBSSxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztvQkFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztvQkFDakMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsT0FBTyxJQUFJLENBQUM7aUJBQ2IsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDOzt3QkFDM0IsT0FBTyxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7d0JBQ2YsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztxQkFDbkI7b0JBQ0QsT0FBTyxPQUFPLENBQUM7aUJBQ2hCLENBQUMsQ0FBQzs7b0JBRUgsS0FBbUIsSUFBQSxLQUFBQyxTQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7d0JBQS9CLElBQU0sSUFBSSxXQUFBO3dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOzRCQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO3lCQUNqQjt3QkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs0QkFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7eUJBQ2xCOzt3QkFHRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN4Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR0QsS0FBbUIsSUFBQSxLQUFBQSxTQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7d0JBQS9CLElBQU0sSUFBSSxXQUFBO3dCQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNuRDs7Ozs7Ozs7Ozs7Ozs7O2dCQUVELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUN4QjtRQUNILGtCQUFDO0lBQUQsQ0FBQyxJQUFBOzs7Ozs7SUMzSUQ7UUFBQTtZQUNFLG9CQUFlLEdBQWtCO2dCQUMvQixXQUFXLEVBQUUsV0FBVyxDQUFDLGFBQWE7Z0JBQ3RDLE9BQU8sRUFBRSxFQUFFO2dCQUNYLE9BQU8sRUFBRSxFQUFFO2dCQUNYLFdBQVcsRUFBRSxHQUFHO2dCQUNoQixXQUFXLEVBQUUsR0FBRztnQkFDaEIsV0FBVyxFQUFFLEVBQUU7YUFDaEIsQ0FBQztZQUNGLGFBQVEsR0FBa0IsRUFBRSxDQUFDO1NBZ0g5Qjs7Ozs7UUF6R0MsZ0NBQUc7Ozs7WUFBSCxVQUFJLEtBQVk7Z0JBQWhCLGlCQXdCQztnQkF2QkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QkYsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFOUIsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQzs7b0JBRXpDLGFBQWEsR0FBRyxVQUFBLElBQUk7O3dCQUNsQixTQUFTLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDakQsb0JBQ0ssSUFBSSxJQUNQLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7NEJBQ2QsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3lCQUNmLEVBQ0QsU0FBUyxFQUFFOzRCQUNULEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSzs0QkFDdEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO3lCQUN6QixJQUNEO2lCQUNIO2dCQUNELEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzNELEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRTdDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7Ozs7OztRQUVELHVDQUFVOzs7OztZQUFWLFVBQVcsS0FBWSxFQUFFLElBQVU7O29CQUMzQixVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUEsQ0FBQzs7b0JBQ3hELFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBQSxDQUFDOzs7b0JBR3hELEdBQUcsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDOztvQkFDN0QsYUFBYSxHQUFHO29CQUNwQixDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4QixDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDbkU7O29CQUNLLFdBQVcsR0FBRztvQkFDbEIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDeEIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7aUJBQ25FOztnQkFHRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLEtBQUssQ0FBQzthQUNkOzs7OztRQUVELDZDQUFnQjs7OztZQUFoQixVQUFpQixLQUFZO2dCQUE3QixpQkEwREM7O2dCQXpEQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUlDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7b0JBQ3pELFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3ZFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO29CQUN2QixPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVc7b0JBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztvQkFDekIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO29CQUN6QixPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVc7b0JBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsV0FBVztvQkFDN0IsT0FBTyxFQUFFLFFBQVEsQ0FBQyxXQUFXO29CQUM3QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7b0JBQ3JCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztvQkFDN0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2lCQUN4QixDQUFDLENBQUM7O2dCQUdILElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7b0JBQ2xDLE9BQU87O3FCQUVOLENBQUM7aUJBQ0gsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFPOzt3QkFDbEMsSUFBSSxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztvQkFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztvQkFDakMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsT0FBTyxJQUFJLENBQUM7aUJBQ2IsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7Z0JBRTFDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDOzt3QkFDM0IsT0FBTyxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7d0JBQ2YsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztxQkFDbkI7b0JBQ0QsT0FBTyxPQUFPLENBQUM7aUJBQ2hCLENBQUMsQ0FBQzs7b0JBRUgsS0FBbUIsSUFBQSxLQUFBQyxTQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7d0JBQS9CLElBQU0sSUFBSSxXQUFBO3dCQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ3hDOzs7Ozs7Ozs7Ozs7Ozs7d0NBRVUsT0FBTztvQkFDaEIsT0FBSyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzdDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsV0FBVzt3QkFDdEMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDcEQsQ0FBQyxDQUFDO2lCQUNKOzs7b0JBTEQsS0FBc0IsSUFBQSxLQUFBQSxTQUFBLElBQUksQ0FBQyxhQUFhLENBQUEsZ0JBQUE7d0JBQW5DLElBQU0sT0FBTyxXQUFBO2dDQUFQLE9BQU87cUJBS2pCOzs7Ozs7Ozs7Ozs7Ozs7OztvQkFHRCxLQUFtQixJQUFBLEtBQUFBLFNBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQSxnQkFBQSw0QkFBRTt3QkFBL0IsSUFBTSxJQUFJLFdBQUE7d0JBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ25EOzs7Ozs7Ozs7Ozs7Ozs7Z0JBRUQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3hCO1FBQ0gseUJBQUM7SUFBRCxDQUFDLElBQUE7Ozs7Ozs7O1FDMUhDLGVBQWdCLElBQUk7UUFDcEIsZUFBZ0IsSUFBSTtRQUNwQixlQUFnQixJQUFJO1FBQ3BCLGVBQWdCLElBQUk7OztRQTBCaEIsaUJBQWlCLEdBQUcsTUFBTTs7UUFFMUIsY0FBYyxHQUFHLE1BQU07SUFFN0I7UUFBQTtZQUNFLG9CQUFlLEdBQTJCO2dCQUN4QyxXQUFXLEVBQUVDLGFBQVcsQ0FBQyxhQUFhO2dCQUN0QyxPQUFPLEVBQUUsRUFBRTtnQkFDWCxPQUFPLEVBQUUsRUFBRTtnQkFDWCxXQUFXLEVBQUUsR0FBRztnQkFDaEIsV0FBVyxFQUFFLEdBQUc7Z0JBQ2hCLFdBQVcsRUFBRSxFQUFFO2dCQUNmLGFBQWEsRUFBRSxFQUFFO2FBQ2xCLENBQUM7WUFDRixhQUFRLEdBQTJCLEVBQUUsQ0FBQztTQWdJdkM7Ozs7O1FBMUhDLGtDQUFHOzs7O1lBQUgsVUFBSSxLQUFZOztnQkFDZCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdCSCxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUU5QixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO3dDQUVwQyxXQUFXOzt3QkFDZCxTQUFTLEdBQUcsT0FBSyxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzs7d0JBQy9DLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLEVBQUUsR0FBQSxDQUFDO29CQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHO3dCQUNkLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDZCxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7cUJBQ2YsQ0FBQztvQkFDRixJQUFJLENBQUMsU0FBUyxHQUFHO3dCQUNmLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSzt3QkFDdEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO3FCQUN6QixDQUFDO2lCQUNIOztnQkFYRCxLQUFLLElBQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTs0QkFBckMsV0FBVztpQkFXckI7O29CQUNELEtBQW1CLElBQUEsS0FBQUUsU0FBQSxLQUFLLENBQUMsS0FBSyxDQUFBLGdCQUFBLDRCQUFFO3dCQUEzQixJQUFNLElBQUksV0FBQTt3QkFDYixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDOUI7Ozs7Ozs7Ozs7Ozs7OztnQkFFRCxPQUFPLEtBQUssQ0FBQzthQUNkOzs7Ozs7UUFFRCx5Q0FBVTs7Ozs7WUFBVixVQUFXLEtBQVksRUFBRSxJQUFVOzs7b0JBQzNCLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBQSxDQUFDOztvQkFDeEQsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFBLENBQUM7O29CQUN4RCxRQUFRLEdBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxLQUFLLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRzs7b0JBQzFHLFNBQVMsR0FBYyxRQUFRLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHOztvQkFDbkQsYUFBYSxHQUFHLFFBQVEsS0FBSyxHQUFHLEdBQUcsUUFBUSxHQUFHLE9BQU87OztvQkFFckQsR0FBRyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDOztvQkFDN0UsYUFBYTtvQkFDakIsR0FBQyxTQUFTLElBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7b0JBQzNDLEdBQUMsUUFBUSxJQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3VCQUM1Rjs7b0JBQ0ssV0FBVztvQkFDZixHQUFDLFNBQVMsSUFBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztvQkFDM0MsR0FBQyxRQUFRLElBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7dUJBQzVGOztvQkFFSyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhOztnQkFFdkYsSUFBSSxDQUFDLE1BQU0sR0FBRztvQkFDWixhQUFhOzt3QkFFWCxHQUFDLFNBQVMsSUFBRyxhQUFhLENBQUMsU0FBUyxDQUFDO3dCQUNyQyxHQUFDLFFBQVEsSUFBRyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLGFBQWE7Ozt3QkFHekQsR0FBQyxTQUFTLElBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQzt3QkFDbkMsR0FBQyxRQUFRLElBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxhQUFhOztvQkFFekQsV0FBVztpQkFDWixDQUFDOztvQkFDSSxXQUFXLEdBQUcsS0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxpQkFBbUI7O29CQUNsRyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztnQkFDdkQsSUFBSSxpQkFBaUIsRUFBRTtvQkFDckIsaUJBQWlCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQ3hDO2dCQUNELE9BQU8sS0FBSyxDQUFDO2FBQ2Q7Ozs7O1FBRUQsK0NBQWdCOzs7O1lBQWhCLFVBQWlCLEtBQVk7O2dCQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUlELGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7b0JBQ3ZDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3ZFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO29CQUN2QixPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVc7b0JBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztvQkFDekIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO29CQUN6QixPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVc7b0JBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsV0FBVztvQkFDN0IsT0FBTyxFQUFFLFFBQVEsQ0FBQyxXQUFXO29CQUM3QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7b0JBQ3JCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztvQkFDN0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2lCQUN4QixDQUFDLENBQUM7O2dCQUdILElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7b0JBQ2xDLE9BQU87O3FCQUVOLENBQUM7aUJBQ0gsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDOzt3QkFDM0IsSUFBSSxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztvQkFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztvQkFDakMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsT0FBTyxJQUFJLENBQUM7aUJBQ2IsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDOzt3QkFDM0IsT0FBTyxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7d0JBQ2YsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztxQkFDbkI7b0JBQ0QsT0FBTyxPQUFPLENBQUM7aUJBQ2hCLENBQUMsQ0FBQzs7b0JBRUgsS0FBbUIsSUFBQSxLQUFBQyxTQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7d0JBQS9CLElBQU0sSUFBSSxXQUFBO3dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOzRCQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO3lCQUNqQjt3QkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs0QkFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7eUJBQ2xCOzt3QkFHRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN4Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR0QsS0FBbUIsSUFBQSxLQUFBQSxTQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7d0JBQS9CLElBQU0sSUFBSSxXQUFBO3dCQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNuRDs7Ozs7Ozs7Ozs7Ozs7O2dCQUVELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUN4QjtRQUNILDJCQUFDO0lBQUQsQ0FBQyxJQUFBOzs7Ozs7QUNsTEQ7UUFNTSxPQUFPLEdBQUc7UUFDZCxLQUFLLEVBQUUsV0FBVztRQUNsQixZQUFZLEVBQUUsa0JBQWtCO1FBQ2hDLGNBQWMsRUFBRSxvQkFBb0I7S0FDckM7QUFFRDtRQUFBO1NBU0M7Ozs7O1FBUEMsaUNBQVM7Ozs7WUFBVCxVQUFVLElBQVk7Z0JBQ3BCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNqQixPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7aUJBQzVCO3FCQUFNO29CQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQXdCLElBQUksTUFBRyxDQUFDLENBQUM7aUJBQ2xEO2FBQ0Y7O29CQVJGRSxlQUFVOztRQVNYLG9CQUFDO0tBQUE7Ozs7OztJQ3VCRCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRUMsZUFBVSxDQUFDLENBQUM7O1FBaUVFQyxrQ0FBa0I7UUE4SHBELHdCQUNVLEVBQWMsRUFDZixJQUFZLEVBQ1osRUFBcUIsRUFDcEIsYUFBNEI7WUFKdEMsWUFNRSxrQkFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUNwQjtZQU5TLFFBQUUsR0FBRixFQUFFLENBQVk7WUFDZixVQUFJLEdBQUosSUFBSSxDQUFRO1lBQ1osUUFBRSxHQUFGLEVBQUUsQ0FBbUI7WUFDcEIsbUJBQWEsR0FBYixhQUFhLENBQWU7WUFoSXRDLFlBQU0sR0FBWSxLQUFLLENBQUM7WUFHeEIsV0FBSyxHQUFXLEVBQUUsQ0FBQztZQUduQixjQUFRLEdBQWtCLEVBQUUsQ0FBQztZQUc3QixXQUFLLEdBQVcsRUFBRSxDQUFDO1lBR25CLG1CQUFhLEdBQVUsRUFBRSxDQUFDO1lBTTFCLHFCQUFlLEdBQUcsSUFBSSxDQUFDO1lBcUJ2QixvQkFBYyxHQUFHLElBQUksQ0FBQztZQUd0QixnQkFBVSxHQUFHLElBQUksQ0FBQztZQUdsQixlQUFTLEdBQUcsR0FBRyxDQUFDO1lBR2hCLGtCQUFZLEdBQUcsR0FBRyxDQUFDO1lBR25CLGtCQUFZLEdBQUcsR0FBRyxDQUFDO1lBR25CLGNBQVEsR0FBRyxLQUFLLENBQUM7WUFHakIsZUFBUyxHQUFHLElBQUksQ0FBQztZQUdqQixnQkFBVSxHQUFHLEtBQUssQ0FBQztZQWtCbkIsY0FBUSxHQUFzQixJQUFJQyxpQkFBWSxFQUFFLENBQUM7WUFHakQsZ0JBQVUsR0FBc0IsSUFBSUEsaUJBQVksRUFBRSxDQUFDO1lBdUJuRCx1QkFBaUIsR0FBaUIsSUFBSUMsaUJBQVksRUFBRSxDQUFDO1lBQ3JELG1CQUFhLEdBQW1CLEVBQUUsQ0FBQztZQUduQyxZQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0QixhQUFPLEdBQUcsRUFBRSxDQUFDO1lBSWIsZUFBUyxHQUFHLEtBQUssQ0FBQztZQUNsQixnQkFBVSxHQUFHLEtBQUssQ0FBQztZQUVuQixpQkFBVyxHQUFHLEtBQUssQ0FBQztZQUVwQixlQUFTLEdBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN6QyxlQUFTLEdBQVcsRUFBRSxDQUFDO1lBQ3ZCLDBCQUFvQixHQUFXQyw2QkFBUSxFQUFFLENBQUM7WUFDMUMsaUJBQVcsR0FBRyxJQUFJLENBQUM7WUFDbkIsaUJBQVcsR0FBRyxJQUFJLENBQUM7WUFZbkIsb0JBQWMsR0FBMEIsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxHQUFBLENBQUM7O1NBSDFEO1FBUUQsc0JBQUkscUNBQVM7Ozs7Ozs7Z0JBQWI7Z0JBQ0UsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2FBQ3BDOzs7Ozs7OztnQkFLRCxVQUNjLEtBQUs7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDNUI7OztXQVJBO1FBYUQsc0JBQUksc0NBQVU7Ozs7Ozs7Z0JBQWQ7Z0JBQ0UsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2FBQ3BDOzs7Ozs7OztnQkFLRCxVQUNlLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDN0I7OztXQVJBO1FBYUQsc0JBQUksc0NBQVU7Ozs7Ozs7Z0JBQWQ7Z0JBQ0UsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2FBQ3BDOzs7Ozs7OztnQkFLRCxVQUNlLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0I7OztXQVJBOzs7Ozs7Ozs7Ozs7OztRQWdCRCxpQ0FBUTs7Ozs7OztZQUFSO2dCQUFBLGlCQXVCQztnQkF0QkMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7d0JBQ3JCLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDZixDQUFDLENBQ0gsQ0FBQztpQkFDSDtnQkFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzt3QkFDckIsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNmLENBQUMsQ0FDSCxDQUFDO2lCQUNIO2dCQUNELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO3dCQUN4QixLQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7cUJBQ2xCLENBQUMsQ0FDSCxDQUFDO2lCQUNIO2FBQ0Y7Ozs7O1FBRUQsb0NBQVc7Ozs7WUFBWCxVQUFZLE9BQXNCO2dCQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNiLElBQUEsdUJBQU0sRUFBRSx1Q0FBYyxFQUFFLHFCQUFLLEVBQUUsMkJBQVEsRUFBRSxxQkFBSztnQkFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzVCLElBQUksY0FBYyxFQUFFO29CQUNsQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUM3QztnQkFDRCxJQUFJLEtBQUssSUFBSSxRQUFRLElBQUksS0FBSyxFQUFFO29CQUM5QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2Y7YUFDRjs7Ozs7UUFFRCxrQ0FBUzs7OztZQUFULFVBQVUsTUFBdUI7Z0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2dCQUN6QixJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNYLE1BQU0sR0FBRyxPQUFPLENBQUM7aUJBQ2xCO2dCQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO29CQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNuRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUM3QzthQUNGOzs7OztRQUVELDBDQUFpQjs7OztZQUFqQixVQUFrQixRQUFhO2dCQUM3QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtvQkFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO29CQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2Y7YUFDRjs7Ozs7Ozs7Ozs7Ozs7UUFRRCxvQ0FBVzs7Ozs7OztZQUFYOztnQkFDRSxpQkFBTSxXQUFXLFdBQUUsQ0FBQzs7b0JBQ3BCLEtBQWtCLElBQUEsS0FBQVAsU0FBQSxJQUFJLENBQUMsYUFBYSxDQUFBLGdCQUFBLDRCQUFFO3dCQUFqQyxJQUFNLEdBQUcsV0FBQTt3QkFDWixHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7cUJBQ25COzs7Ozs7Ozs7Ozs7Ozs7Z0JBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7YUFDM0I7Ozs7Ozs7Ozs7Ozs7O1FBUUQsd0NBQWU7Ozs7Ozs7WUFBZjtnQkFBQSxpQkFHQztnQkFGQyxpQkFBTSxlQUFlLFdBQUUsQ0FBQztnQkFDeEIsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxFQUFFLEdBQUEsQ0FBQyxDQUFDO2FBQ2pDOzs7Ozs7Ozs7Ozs7UUFPRCwrQkFBTTs7Ozs7O1lBQU47Z0JBQUEsaUJBdUJDO2dCQXRCQyxpQkFBTSxNQUFNLFdBQUUsQ0FBQztnQkFFZixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDZixJQUFJLENBQUMsS0FBSyxHQUFHUSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3hDO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO29CQUNaLEtBQUksQ0FBQyxJQUFJLEdBQUdDLGlDQUF1QixDQUFDO3dCQUNsQyxLQUFLLEVBQUUsS0FBSSxDQUFDLEtBQUs7d0JBQ2pCLE1BQU0sRUFBRSxLQUFJLENBQUMsTUFBTTt3QkFDbkIsT0FBTyxFQUFFLEtBQUksQ0FBQyxNQUFNO3dCQUNwQixVQUFVLEVBQUUsS0FBSSxDQUFDLE1BQU07cUJBQ3hCLENBQUMsQ0FBQztvQkFFSCxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDM0MsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQixLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUU3QyxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25CLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDdkIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7aUJBQ3pCLENBQUMsQ0FBQzthQUNKOzs7Ozs7Ozs7Ozs7OztRQVFELDZCQUFJOzs7Ozs7O1lBQUo7Z0JBQUEsaUJBaUJDO2dCQWhCQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO29CQUNuRCxPQUFPO2lCQUNSOztnQkFFRCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7O29CQUdyQixNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzs7b0JBQ3BDLE9BQU8sR0FBRyxNQUFNLFlBQVlDLGVBQVUsR0FBRyxNQUFNLEdBQUdDLE9BQUUsQ0FBQyxNQUFNLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQ3hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLO29CQUNyQixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbkIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNiLENBQUMsQ0FDSCxDQUFDO2dCQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUNDLGVBQUssQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFBLENBQUMsQ0FBQzthQUNsRzs7OztRQUVELDZCQUFJOzs7WUFBSjtnQkFBQSxpQkF5RkM7O2dCQXZGQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO29CQUNwQixDQUFDLENBQUMsU0FBUyxHQUFHLGdCQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQzt3QkFDNUcsQ0FBQyxPQUFHLENBQUM7b0JBQ1AsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7d0JBQ1gsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsSUFBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDO3dCQUVmLENBQUMsQ0FBQyxJQUFJLEdBQUc7NEJBQ1AsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BELENBQUM7cUJBQ0g7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxVQUFBLENBQUM7b0JBQy9CLENBQUMsQ0FBQyxTQUFTLEdBQUcsZ0JBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO3dCQUM1RyxDQUFDLE9BQUcsQ0FBQztvQkFDUCxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTt3QkFDWCxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztxQkFDYjtvQkFDRCxJQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUM7d0JBRWpCLENBQUMsQ0FBQyxJQUFJLEdBQUc7NEJBQ1AsS0FBSyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BELENBQUM7cUJBQ0g7aUJBQ0EsQ0FBQyxDQUFDOzs7b0JBR0csUUFBUSxHQUFHLEVBQUU7d0NBQ1IsV0FBVzs7d0JBQ2QsU0FBUyxHQUFHLE9BQUssS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7O3dCQUU5QyxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDOzt3QkFDL0MsT0FBTyxHQUFHLE9BQUssU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEtBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBUSxLQUFLLE9BQU8sR0FBQSxDQUFDO29CQUMvRSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNaLE9BQU8sR0FBRyxPQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFRLEtBQUssT0FBTyxHQUFBLENBQUMsSUFBSSxTQUFTLENBQUM7cUJBQzVGO29CQUVELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzs7d0JBRXpCLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTTs7d0JBQ3pCLElBQUksR0FBRyxPQUFLLFlBQVksQ0FBQyxNQUFNLENBQUM7O3dCQUVoQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDO29CQUMxQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDcEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O3dCQUVsQixPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckQsSUFBSSxPQUFPLEVBQUU7d0JBQ1gsT0FBTyxDQUFDLGFBQWEsR0FBRyxnQkFBYSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBRyxDQUFDO3FCQUMxRTtvQkFFRCxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7d0JBQ3BCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztxQkFDaEM7b0JBRUQsT0FBSyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDeEI7O2dCQTlCRCxLQUFLLElBQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTs0QkFBcEMsV0FBVztpQkE4QnJCO2dCQUVELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7Z0JBRzVCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzs7NEJBQy9CLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDdEIsT0FBTyxJQUFJLENBQUM7cUJBQ2IsQ0FBQyxDQUFDO2lCQUNKOztnQkFHRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksV0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBQSxDQUFDLEVBQUMsQ0FBQztnQkFDaEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLFdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUEsQ0FBQyxFQUFDLENBQUM7Z0JBRWxHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDakIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lCQUNsQjtnQkFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7O29CQUVuQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2Y7Z0JBRUQscUJBQXFCLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLEVBQUUsR0FBQSxDQUFDLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDeEI7Ozs7Ozs7Ozs7OztRQU9ELDRDQUFtQjs7Ozs7O1lBQW5CO2dCQUFBLGlCQXFEQztnQkFwREMsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO29CQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7OzRCQUNsQixhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWE7OzRCQUNsQyxJQUFJLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxhQUFhLENBQUMsRUFBRSxHQUFBLENBQUM7Ozs0QkFHOUQsSUFBSTt3QkFDUixJQUFJOzRCQUNGLElBQUksR0FBRyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQzt5QkFDOUM7d0JBQUMsT0FBTyxFQUFFLEVBQUU7OzRCQUVYLE9BQU87eUJBQ1I7d0JBQ0QsSUFBSSxLQUFJLENBQUMsVUFBVSxFQUFFOzRCQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDO3lCQUN6Qzs2QkFBTTs0QkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO3lCQUNyQzt3QkFFRCxJQUFJLEtBQUksQ0FBQyxhQUFhLEVBQUU7NEJBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3lCQUM3RTt3QkFDRCxJQUFJLEtBQUksQ0FBQyxhQUFhLEVBQUU7NEJBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3lCQUM3RTt3QkFFRCxJQUFJLEtBQUksQ0FBQyxTQUFTLEVBQUU7NEJBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUM7eUJBQ3ZDOzZCQUFNOzs0QkFFTCxJQUFJLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7O29DQUNqRCxRQUFRLFNBQUE7Z0NBQ1osSUFBSTtvQ0FDRixRQUFRLEdBQUcsYUFBYSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2lDQUNwRTtnQ0FBQyxPQUFPLEVBQUUsRUFBRTs7b0NBRVgsT0FBTztpQ0FDUjtnQ0FDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs2QkFDNUM7aUNBQU07Z0NBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs2QkFDbkM7eUJBQ0Y7d0JBRUQsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFOzRCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt5QkFDMUU7d0JBQ0QsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFOzRCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt5QkFDMUU7cUJBQ0YsQ0FBQyxDQUFDO2lCQUNKO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7UUFPRCxvQ0FBVzs7Ozs7OztZQUFYLFVBQVksUUFBZTtnQkFBM0IsaUJBb0JDO2dCQXBCVyx5QkFBQTtvQkFBQSxlQUFlOztnQkFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNOzt3QkFDcEIsSUFBSSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEdBQUEsQ0FBQztvQkFFN0UsSUFBSSxJQUFJLEVBQUU7OzRCQUNGLGFBQWEsR0FBR0Msa0JBQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzt3QkFDbEUsYUFBYTs2QkFDVixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7NkJBQ3ZCLFVBQVUsRUFBRTs2QkFDWixRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7NkJBQzVCLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs0QkFFbEIsaUJBQWlCLEdBQUdBLGtCQUFNLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBSSxJQUFJLENBQUMsRUFBSSxDQUFDO3dCQUN2RixpQkFBaUI7NkJBQ2QsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDOzZCQUMzQixVQUFVLEVBQUU7NkJBQ1osUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDOzZCQUM1QixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztxQkFDN0I7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7Ozs7Ozs7Ozs7OztRQU9ELG9DQUFXOzs7Ozs7WUFBWDtnQkFBQSxpQkE4QkM7Z0JBN0JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUlQLGlCQUFZLEVBQUUsQ0FBQzs7b0JBQ3RDLGNBQWMsR0FBRyxVQUFBLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNULENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7cUJBQ2I7b0JBQ0QsQ0FBQyxDQUFDLFNBQVMsR0FBRzt3QkFDWixLQUFLLEVBQUUsRUFBRTt3QkFDVCxNQUFNLEVBQUUsRUFBRTtxQkFDWCxDQUFDO29CQUNGLENBQUMsQ0FBQyxRQUFRLEdBQUc7d0JBQ1gsQ0FBQyxFQUFFLENBQUM7d0JBQ0osQ0FBQyxFQUFFLENBQUM7cUJBQ0wsQ0FBQztvQkFDRixDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQzlCLE9BQU8sQ0FBQyxDQUFDO2lCQUNWO2dCQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7b0JBQ1gsS0FBSyxFQUFFUSxTQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQztvQkFDMUMsUUFBUSxFQUFFQSxVQUFLLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUM7b0JBQ3hELEtBQUssRUFBRUEsU0FBSSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFBLENBQUM7d0JBQzFCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUNULENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7eUJBQ2I7d0JBQ0QsT0FBTyxDQUFDLENBQUM7cUJBQ1YsQ0FBQztpQkFDSCxDQUFDO2dCQUVGLHFCQUFxQixDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxFQUFFLEdBQUEsQ0FBQyxDQUFDO2FBQzFDOzs7Ozs7Ozs7Ozs7O1FBT0QsNkNBQW9COzs7Ozs7O1lBQXBCLFVBQXFCLElBQUk7O29CQUNqQixVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O29CQUMzQixTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFFakMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQzs7b0JBRzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQ0EsU0FBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7aUJBQy9EO3FCQUFNO29CQUNMLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUMzQjthQUNGOzs7Ozs7Ozs7Ozs7O1FBT0QscUNBQVk7Ozs7Ozs7WUFBWixVQUFhLE1BQU07O29CQUNYLFlBQVksR0FBR0MsVUFDZCxFQUFPO3FCQUNYLENBQUMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEdBQUEsQ0FBQztxQkFDWCxDQUFDLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxHQUFBLENBQUM7cUJBQ1gsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLE9BQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzdCOzs7Ozs7Ozs7Ozs7OztRQU9ELCtCQUFNOzs7Ozs7OztZQUFOLFVBQU8sTUFBa0IsRUFBRSxTQUFTOztvQkFDNUIsVUFBVSxHQUFHLENBQUMsSUFBSSxTQUFTLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDOzs7b0JBR3hFLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVU7Z0JBQ2hELElBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQzFFLE9BQU87aUJBQ1I7O2dCQUdELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNwQixPQUFPO2lCQUNSO2dCQUVELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLElBQUksTUFBTSxFQUFFOzs7d0JBRS9CLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTzs7d0JBQ3ZCLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTzs7O3dCQUd2QixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQzs7d0JBQ25ELFFBQVEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQzs7d0JBRXZDLEtBQUssR0FBRyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUNsQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDakIsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7O3dCQUNYLFFBQVEsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7O3dCQUduRSxhQUFhLEdBQUcsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztpQkFDbkQ7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDdkI7YUFDRjs7Ozs7Ozs7Ozs7OztRQU1ELDRCQUFHOzs7Ozs7OztZQUFILFVBQUksQ0FBUyxFQUFFLENBQVMsRUFBRSxTQUFrQztnQkFBbEMsMEJBQUE7b0JBQUEsWUFBb0IsSUFBSSxDQUFDLFNBQVM7O2dCQUMxRCxJQUFJLENBQUMsb0JBQW9CLEdBQUdDLDhCQUFTLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFQyw4QkFBUyxDQUFDLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBRTFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN4Qjs7Ozs7Ozs7Ozs7O1FBTUQsOEJBQUs7Ozs7Ozs7WUFBTCxVQUFNLENBQVMsRUFBRSxDQUFTO2dCQUN4QixJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFbEgsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3hCOzs7Ozs7Ozs7OztRQU1ELDZCQUFJOzs7Ozs7WUFBSixVQUFLLE1BQWM7Z0JBQ2pCLElBQUksQ0FBQyxvQkFBb0IsR0FBR0QsOEJBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUVFLDBCQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBRXhGLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN4Qjs7Ozs7Ozs7Ozs7UUFNRCwrQkFBTTs7Ozs7O1lBQU4sVUFBTyxLQUFhO2dCQUNsQixJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRXpGLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN4Qjs7Ozs7Ozs7Ozs7OztRQU9ELDhCQUFLOzs7Ozs7O1lBQUwsVUFBTSxLQUFLO2dCQUNULElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDNUM7Ozs7Ozs7Ozs7Ozs7UUFPRCwrQkFBTTs7Ozs7OztZQUFOLFVBQU8sS0FBSztnQkFBWixpQkFzQ0M7O2dCQXJDQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDekIsT0FBTztpQkFDUjs7b0JBQ0ssSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZO2dCQUM5QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtvQkFDeEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNqQztnQkFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7O29CQUc5QyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQzs7b0JBQzlDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWEsQ0FBQyxVQUFLLENBQUMsTUFBRyxDQUFDO3dDQUU5QixJQUFJO29CQUNiLElBQ0UsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRTt3QkFDdkIsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRTt3QkFDdkIsb0JBQUMsSUFBSSxDQUFDLE1BQU0sSUFBUyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7d0JBQ25DLG9CQUFDLElBQUksQ0FBQyxNQUFNLElBQVMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQ25DO3dCQUNBLElBQUksT0FBSyxNQUFNLElBQUksT0FBTyxPQUFLLE1BQU0sS0FBSyxRQUFRLEVBQUU7O2dDQUM1QyxNQUFNLEdBQUcsT0FBSyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQUssS0FBSyxFQUFFLElBQUksQ0FBQzs7Z0NBQ2pELE9BQU8sR0FBRyxNQUFNLFlBQVlSLGVBQVUsR0FBRyxNQUFNLEdBQUdDLE9BQUUsQ0FBQyxNQUFNLENBQUM7NEJBQ2xFLE9BQUssaUJBQWlCLENBQUMsR0FBRyxDQUN4QixPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSztnQ0FDckIsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0NBQ25CLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7NkJBQ3ZCLENBQUMsQ0FDSCxDQUFDO3lCQUNIO3FCQUNGO2lCQUNGOzs7b0JBbEJELEtBQW1CLElBQUEsS0FBQVgsU0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQSxnQkFBQTt3QkFBOUIsSUFBTSxJQUFJLFdBQUE7Z0NBQUosSUFBSTtxQkFrQmQ7Ozs7Ozs7Ozs7Ozs7OztnQkFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pCOzs7OztRQUVELG1DQUFVOzs7O1lBQVYsVUFBVyxJQUFVOztvQkFDYixJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMzQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDbEI7Ozs7Ozs7Ozs7Ozs7O1FBUUQsd0NBQWU7Ozs7Ozs7WUFBZjtnQkFDRSxJQUFJLENBQUMsU0FBUyxHQUFHbUIsMEJBQUssQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQzthQUNuRDs7Ozs7Ozs7Ozs7Ozs7OztRQVFELGdDQUFPOzs7Ozs7Ozs7WUFBUCxVQUFRLEtBQUssRUFBRSxhQUFhO2dCQUMxQixLQUFLLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7Ozs7Ozs7Ozs7OztRQU1ELHNDQUFhOzs7Ozs7O1lBQWIsVUFBYyxLQUFLLEVBQUUsYUFBYTtnQkFDaEMsS0FBSyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7Z0JBQ2hDLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN6Qjs7Ozs7Ozs7Ozs7Ozs7O1FBUUQsbUNBQVU7Ozs7Ozs7O1lBQVYsVUFBVyxLQUFLO2dCQUNkLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQzFDLE9BQU87aUJBQ1I7Z0JBQ0QsSUFBSSxDQUFDLGFBQWEsYUFBSSxLQUFLLEdBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2FBQ25FOzs7Ozs7Ozs7Ozs7O1FBT0QscUNBQVk7Ozs7Ozs7WUFBWixVQUFhLEtBQUs7O29CQUNWLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBRTdDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLGFBQWEsWUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRTdDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7YUFDckU7Ozs7Ozs7Ozs7OztRQU9ELHdDQUFlOzs7Ozs7WUFBZjtnQkFBQSxpQkFLQztnQkFKQyxPQUFPLElBQUksQ0FBQyxLQUFLO3FCQUNkLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUEsQ0FBQztxQkFDaEMsTUFBTSxDQUFDLFVBQUMsS0FBZSxFQUFFLElBQUksSUFBWSxRQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFDLEVBQUUsRUFBRSxDQUFDO3FCQUN6RyxJQUFJLEVBQUUsQ0FBQzthQUNYOzs7Ozs7Ozs7Ozs7Ozs7O1FBUUQsb0NBQVc7Ozs7Ozs7OztZQUFYLFVBQVksS0FBSyxFQUFFLElBQUk7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUNoQjs7Ozs7Ozs7Ozs7Ozs7OztRQVFELG9DQUFXOzs7Ozs7Ozs7WUFBWCxVQUFZLEtBQUssRUFBRSxJQUFJO2dCQUNyQixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDaEI7Ozs7Ozs7Ozs7Ozs7O1FBUUQsa0NBQVM7Ozs7Ozs7WUFBVDtnQkFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUlDLHFCQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDN0Y7Ozs7Ozs7Ozs7OztRQU9ELHlDQUFnQjs7Ozs7O1lBQWhCO2dCQUNFLE9BQU87b0JBQ0wsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWTtvQkFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2lCQUNwQixDQUFDO2FBQ0g7Ozs7Ozs7Ozs7Ozs7UUFRRCxvQ0FBVzs7Ozs7OztZQURYLFVBQ1ksTUFBa0I7Z0JBQzVCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNwQjtxQkFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDckI7YUFDRjs7Ozs7Ozs7Ozs7OztRQU9ELHFDQUFZOzs7Ozs7O1lBQVosVUFBYSxLQUFLO2dCQUNoQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUVuRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzthQUN2Qjs7Ozs7Ozs7Ozs7UUFPRCxvQ0FBVzs7Ozs7O1lBRFgsVUFDWSxNQUFrQjtnQkFDNUIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7O3dCQUNuQyxPQUFPLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPOzt3QkFDMUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzs7d0JBQzFDLFNBQVMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVc7O3dCQUN0QyxTQUFTLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXO29CQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7b0JBRTNCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUNoQzthQUNGOzs7Ozs7Ozs7Ozs7O1FBT0QsbUNBQVU7Ozs7Ozs7WUFBVixVQUFXLEtBQUs7Z0JBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7YUFDeEI7Ozs7Ozs7Ozs7Ozs7UUFRRCxrQ0FBUzs7Ozs7OztZQURULFVBQ1UsS0FBaUI7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7b0JBQzNFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ2pEO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7O1FBT0Qsd0NBQWU7Ozs7Ozs7O1lBQWYsVUFBZ0IsS0FBaUIsRUFBRSxJQUFTO2dCQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDekIsT0FBTztpQkFDUjtnQkFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBRXpCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO29CQUM3RSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3RDO2FBQ0Y7Ozs7Ozs7O1FBS0QsK0JBQU07Ozs7WUFBTjtnQkFDRSxJQUFJLENBQUMsS0FBSyxDQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FDcEUsQ0FBQzthQUNIOzs7Ozs7OztRQUtELGtDQUFTOzs7O1lBQVQ7O29CQUNRLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07O29CQUNyRCxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLOztvQkFDbEQsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQ3BELElBQUksU0FBUyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO29CQUMzQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7aUJBQ3hCO2FBQ0Y7O29CQTk5QkZDLGNBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsV0FBVzt3QkFDckIsTUFBTSxFQUFFLENBQUMsNlRBQTZULENBQUM7d0JBQ3ZVLFFBQVEsRUFBRSxtN0ZBMkNUO3dCQUNELGFBQWEsRUFBRUMsc0JBQWlCLENBQUMsSUFBSTt3QkFDckMsZUFBZSxFQUFFQyw0QkFBdUIsQ0FBQyxNQUFNO3dCQUMvQyxVQUFVLEVBQUUsQ0FBQ0Msa0JBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQ0MscUJBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQ0Msa0JBQU8sQ0FBQyxHQUFHLEVBQUVDLGdCQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ25HOzs7Ozt3QkFyR0N4QixlQUFVO3dCQVlWeUIsV0FBTTt3QkFDTkMsc0JBQWlCO3dCQWtCVixhQUFhOzs7OzZCQXdFbkJDLFVBQUs7NEJBR0xBLFVBQUs7K0JBR0xBLFVBQUs7NEJBR0xBLFVBQUs7b0NBR0xBLFVBQUs7NEJBR0xBLFVBQUs7c0NBR0xBLFVBQUs7aUNBR0xBLFVBQUs7b0NBR0xBLFVBQUs7b0NBR0xBLFVBQUs7Z0NBR0xBLFVBQUs7bUNBR0xBLFVBQUs7bUNBR0xBLFVBQUs7cUNBR0xBLFVBQUs7aUNBR0xBLFVBQUs7Z0NBR0xBLFVBQUs7bUNBR0xBLFVBQUs7bUNBR0xBLFVBQUs7K0JBR0xBLFVBQUs7Z0NBR0xBLFVBQUs7aUNBR0xBLFVBQUs7OEJBR0xBLFVBQUs7OEJBR0xBLFVBQUs7aUNBR0xBLFVBQUs7NkJBR0xBLFVBQUs7cUNBR0xBLFVBQUs7K0JBR0xDLFdBQU07aUNBR05BLFdBQU07bUNBR05DLGlCQUFZLFNBQUMsY0FBYzttQ0FHM0JBLGlCQUFZLFNBQUMsY0FBYztzQ0FHM0JBLGlCQUFZLFNBQUMsaUJBQWlCO21DQUc5QkEsaUJBQVksU0FBQyxjQUFjOzRCQUczQkMsY0FBUyxTQUFDQyx3QkFBYyxFQUFFLEVBQUUsSUFBSSxFQUFFL0IsZUFBVSxFQUFFO21DQUc5Q2dDLGlCQUFZLFNBQUMsYUFBYTttQ0FHMUJBLGlCQUFZLFNBQUMsYUFBYTtxQ0FnQzFCTCxVQUFLO2dDQWFMQSxVQUFLLFNBQUMsV0FBVztpQ0FlakJBLFVBQUssU0FBQyxZQUFZO2lDQWVsQkEsVUFBSyxTQUFDLFlBQVk7a0NBcXBCbEJNLGlCQUFZLFNBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUM7a0NBeUI3Q0EsaUJBQVksU0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQ0E0QjdDQSxpQkFBWSxTQUFDLGtCQUFrQjs7UUFnRGxDLHFCQUFDO0tBQUEsQ0E1NkJtQ0MsNEJBQWtCOzs7Ozs7QUM3R3REOzs7Ozs7QUFRQTtRQUFBO1lBR0UsaUJBQVksR0FBRyxJQUFJaEMsaUJBQVksRUFBRSxDQUFDO1lBRWxDLG1CQUFjLEdBQUcsSUFBSUEsaUJBQVksRUFBRSxDQUFDO1NBcUNyQzs7Ozs7UUFsQ0MsZ0RBQWtCOzs7O1lBRGxCLFVBQ21CLEtBQVU7Z0JBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUI7Ozs7O1FBR0QsaURBQW1COzs7O1lBRG5CLFVBQ29CLEtBQVU7Z0JBQzVCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUI7Ozs7O1FBR0QsNENBQWM7Ozs7WUFEZCxVQUNlLEtBQVU7Z0JBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUI7Ozs7O1FBRUQsNENBQWM7Ozs7WUFBZCxVQUFlLEtBQVU7Z0JBQ3ZCLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtvQkFDaEIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7aUJBQ3RCOztvQkFFSyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQy9CO3FCQUFNLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2pDOztnQkFHRCxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzs7Z0JBRzFCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtvQkFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2lCQUN4QjthQUNGOztvQkF6Q0ZpQyxjQUFTLFNBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFOzs7bUNBRXBDUCxXQUFNO3FDQUVOQSxXQUFNO3lDQUdOSyxpQkFBWSxTQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQzswQ0FLckNBLGlCQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7cUNBS3pDQSxpQkFBWSxTQUFDLGNBQWMsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7UUF5QjFDLDBCQUFDO0tBQUE7Ozs7OztBQ2xERDtRQU9BO1NBTTJCOztvQkFOMUJHLGFBQVEsU0FBQzt3QkFDUixPQUFPLEVBQUUsQ0FBQ0MsMkJBQWlCLENBQUM7d0JBQzVCLFlBQVksRUFBRSxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQzt3QkFDbkQsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLG1CQUFtQixDQUFDO3dCQUM5QyxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7cUJBQzNCOztRQUN5QixrQkFBQztLQUFBOzs7Ozs7QUNiM0I7UUFNQTtTQUk4Qjs7b0JBSjdCRCxhQUFRLFNBQUM7d0JBQ1IsT0FBTyxFQUFFLENBQUNFLHlCQUFlLENBQUM7d0JBQzFCLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQztxQkFDdkI7O1FBQzRCLHFCQUFDO0tBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9