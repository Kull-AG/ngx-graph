/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { id } from '../../utils/id';
import * as dagre from 'dagre';
/** @enum {string} */
var Orientation = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
export { Orientation };
/** @enum {string} */
var Alignment = {
    CENTER: 'C',
    UP_LEFT: 'UL',
    UP_RIGHT: 'UR',
    DOWN_LEFT: 'DL',
    DOWN_RIGHT: 'DR',
};
export { Alignment };
/**
 * @record
 */
export function DagreSettings() { }
if (false) {
    /** @type {?|undefined} */
    DagreSettings.prototype.orientation;
    /** @type {?|undefined} */
    DagreSettings.prototype.marginX;
    /** @type {?|undefined} */
    DagreSettings.prototype.marginY;
    /** @type {?|undefined} */
    DagreSettings.prototype.edgePadding;
    /** @type {?|undefined} */
    DagreSettings.prototype.rankPadding;
    /** @type {?|undefined} */
    DagreSettings.prototype.nodePadding;
    /** @type {?|undefined} */
    DagreSettings.prototype.align;
    /** @type {?|undefined} */
    DagreSettings.prototype.acyclicer;
    /** @type {?|undefined} */
    DagreSettings.prototype.ranker;
}
/**
 * @record
 */
export function DagreNodesOnlySettings() { }
if (false) {
    /** @type {?|undefined} */
    DagreNodesOnlySettings.prototype.curveDistance;
}
/** @type {?} */
var DEFAULT_EDGE_NAME = '\x00';
/** @type {?} */
var GRAPH_NODE = '\x00';
/** @type {?} */
var EDGE_KEY_DELIM = '\x01';
var DagreNodesOnlyLayout = /** @class */ (function () {
    function DagreNodesOnlyLayout() {
        this.defaultSettings = {
            orientation: Orientation.LEFT_TO_RIGHT,
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
            for (var _b = tslib_1.__values(graph.edges), _c = _b.next(); !_c.done; _c = _b.next()) {
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
            for (var _c = tslib_1.__values(this.dagreNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
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
            for (var _e = tslib_1.__values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
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
export { DagreNodesOnlyLayout };
if (false) {
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.defaultSettings;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.settings;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.dagreGraph;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.dagreNodes;
    /** @type {?} */
    DagreNodesOnlyLayout.prototype.dagreEdges;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFncmVOb2Rlc09ubHkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7OztJQUk3QixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJOzs7OztJQUdwQixRQUFTLEdBQUc7SUFDWixTQUFVLElBQUk7SUFDZCxVQUFXLElBQUk7SUFDZixXQUFZLElBQUk7SUFDaEIsWUFBYSxJQUFJOzs7Ozs7QUFHbkIsbUNBVUM7OztJQVRDLG9DQUEwQjs7SUFDMUIsZ0NBQWlCOztJQUNqQixnQ0FBaUI7O0lBQ2pCLG9DQUFxQjs7SUFDckIsb0NBQXFCOztJQUNyQixvQ0FBcUI7O0lBQ3JCLDhCQUFrQjs7SUFDbEIsa0NBQWlDOztJQUNqQywrQkFBMkQ7Ozs7O0FBRzdELDRDQUVDOzs7SUFEQywrQ0FBdUI7OztJQUduQixpQkFBaUIsR0FBRyxNQUFNOztJQUMxQixVQUFVLEdBQUcsTUFBTTs7SUFDbkIsY0FBYyxHQUFHLE1BQU07QUFFN0I7SUFBQTtRQUNFLG9CQUFlLEdBQTJCO1lBQ3hDLFdBQVcsRUFBRSxXQUFXLENBQUMsYUFBYTtZQUN0QyxPQUFPLEVBQUUsRUFBRTtZQUNYLE9BQU8sRUFBRSxFQUFFO1lBQ1gsV0FBVyxFQUFFLEdBQUc7WUFDaEIsV0FBVyxFQUFFLEdBQUc7WUFDaEIsV0FBVyxFQUFFLEVBQUU7WUFDZixhQUFhLEVBQUUsRUFBRTtTQUNsQixDQUFDO1FBQ0YsYUFBUSxHQUEyQixFQUFFLENBQUM7SUFnSXhDLENBQUM7Ozs7O0lBMUhDLGtDQUFHOzs7O0lBQUgsVUFBSSxLQUFZOztRQUNk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QUU7Z0JBQ2YsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUNuQjtZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDOztZQUVILEtBQW1CLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsVUFBVSxDQUFBLGdCQUFBLDRCQUFFO2dCQUEvQixJQUFNLElBQUksV0FBQTtnQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztpQkFDakI7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO2lCQUNsQjtnQkFFRCxlQUFlO2dCQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDeEM7Ozs7Ozs7Ozs7WUFFRCxlQUFlO1lBQ2YsS0FBbUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQS9CLElBQU0sSUFBSSxXQUFBO2dCQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25EOzs7Ozs7Ozs7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQTFJRCxJQTBJQzs7OztJQXpJQywrQ0FRRTs7SUFDRix3Q0FBc0M7O0lBRXRDLDBDQUFnQjs7SUFDaEIsMENBQWdCOztJQUNoQiwwQ0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5cclxuZXhwb3J0IGVudW0gT3JpZW50YXRpb24ge1xyXG4gIExFRlRfVE9fUklHSFQgPSAnTFInLFxyXG4gIFJJR0hUX1RPX0xFRlQgPSAnUkwnLFxyXG4gIFRPUF9UT19CT1RUT00gPSAnVEInLFxyXG4gIEJPVFRPTV9UT19UT00gPSAnQlQnXHJcbn1cclxuZXhwb3J0IGVudW0gQWxpZ25tZW50IHtcclxuICBDRU5URVIgPSAnQycsXHJcbiAgVVBfTEVGVCA9ICdVTCcsXHJcbiAgVVBfUklHSFQgPSAnVVInLFxyXG4gIERPV05fTEVGVCA9ICdETCcsXHJcbiAgRE9XTl9SSUdIVCA9ICdEUidcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEYWdyZVNldHRpbmdzIHtcclxuICBvcmllbnRhdGlvbj86IE9yaWVudGF0aW9uO1xyXG4gIG1hcmdpblg/OiBudW1iZXI7XHJcbiAgbWFyZ2luWT86IG51bWJlcjtcclxuICBlZGdlUGFkZGluZz86IG51bWJlcjtcclxuICByYW5rUGFkZGluZz86IG51bWJlcjtcclxuICBub2RlUGFkZGluZz86IG51bWJlcjtcclxuICBhbGlnbj86IEFsaWdubWVudDtcclxuICBhY3ljbGljZXI/OiAnZ3JlZWR5JyB8IHVuZGVmaW5lZDtcclxuICByYW5rZXI/OiAnbmV0d29yay1zaW1wbGV4JyB8ICd0aWdodC10cmVlJyB8ICdsb25nZXN0LXBhdGgnO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgZXh0ZW5kcyBEYWdyZVNldHRpbmdzIHtcclxuICBjdXJ2ZURpc3RhbmNlPzogbnVtYmVyO1xyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX0VER0VfTkFNRSA9ICdcXHgwMCc7XHJcbmNvbnN0IEdSQVBIX05PREUgPSAnXFx4MDAnO1xyXG5jb25zdCBFREdFX0tFWV9ERUxJTSA9ICdcXHgwMSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGFncmVOb2Rlc09ubHlMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVOb2Rlc09ubHlTZXR0aW5ncyA9IHtcclxuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxyXG4gICAgbWFyZ2luWDogMjAsXHJcbiAgICBtYXJnaW5ZOiAyMCxcclxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXHJcbiAgICByYW5rUGFkZGluZzogMTAwLFxyXG4gICAgbm9kZVBhZGRpbmc6IDUwLFxyXG4gICAgY3VydmVEaXN0YW5jZTogMjBcclxuICB9O1xyXG4gIHNldHRpbmdzOiBEYWdyZU5vZGVzT25seVNldHRpbmdzID0ge307XHJcblxyXG4gIGRhZ3JlR3JhcGg6IGFueTtcclxuICBkYWdyZU5vZGVzOiBhbnk7XHJcbiAgZGFncmVFZGdlczogYW55O1xyXG5cclxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xyXG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcclxuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xyXG5cclxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XHJcblxyXG4gICAgZm9yIChjb25zdCBkYWdyZU5vZGVJZCBpbiB0aGlzLmRhZ3JlR3JhcGguX25vZGVzKSB7XHJcbiAgICAgIGNvbnN0IGRhZ3JlTm9kZSA9IHRoaXMuZGFncmVHcmFwaC5fbm9kZXNbZGFncmVOb2RlSWRdO1xyXG4gICAgICBjb25zdCBub2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGRhZ3JlTm9kZS5pZCk7XHJcbiAgICAgIG5vZGUucG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogZGFncmVOb2RlLngsXHJcbiAgICAgICAgeTogZGFncmVOb2RlLnlcclxuICAgICAgfTtcclxuICAgICAgbm9kZS5kaW1lbnNpb24gPSB7XHJcbiAgICAgICAgd2lkdGg6IGRhZ3JlTm9kZS53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGRhZ3JlTm9kZS5oZWlnaHRcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgZWRnZSBvZiBncmFwaC5lZGdlcykge1xyXG4gICAgICB0aGlzLnVwZGF0ZUVkZ2UoZ3JhcGgsIGVkZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xyXG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XHJcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcclxuICAgIGNvbnN0IHJhbmtBeGlzOiAneCcgfCAneScgPSB0aGlzLnNldHRpbmdzLm9yaWVudGF0aW9uID09PSAnQlQnIHx8IHRoaXMuc2V0dGluZ3Mub3JpZW50YXRpb24gPT09ICdUQicgPyAneScgOiAneCc7XHJcbiAgICBjb25zdCBvcmRlckF4aXM6ICd4JyB8ICd5JyA9IHJhbmtBeGlzID09PSAneScgPyAneCcgOiAneSc7XHJcbiAgICBjb25zdCByYW5rRGltZW5zaW9uID0gcmFua0F4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcclxuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cclxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb25bcmFua0F4aXNdIDw9IHRhcmdldE5vZGUucG9zaXRpb25bcmFua0F4aXNdID8gLTEgOiAxO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcclxuICAgICAgW29yZGVyQXhpc106IHNvdXJjZU5vZGUucG9zaXRpb25bb3JkZXJBeGlzXSxcclxuICAgICAgW3JhbmtBeGlzXTogc291cmNlTm9kZS5wb3NpdGlvbltyYW5rQXhpc10gLSBkaXIgKiAoc291cmNlTm9kZS5kaW1lbnNpb25bcmFua0RpbWVuc2lvbl0gLyAyKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xyXG4gICAgICBbb3JkZXJBeGlzXTogdGFyZ2V0Tm9kZS5wb3NpdGlvbltvcmRlckF4aXNdLFxyXG4gICAgICBbcmFua0F4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGN1cnZlRGlzdGFuY2UgPSB0aGlzLnNldHRpbmdzLmN1cnZlRGlzdGFuY2UgfHwgdGhpcy5kZWZhdWx0U2V0dGluZ3MuY3VydmVEaXN0YW5jZTtcclxuICAgIC8vIGdlbmVyYXRlIG5ldyBwb2ludHNcclxuICAgIGVkZ2UucG9pbnRzID0gW1xyXG4gICAgICBzdGFydGluZ1BvaW50LFxyXG4gICAgICB7XHJcbiAgICAgICAgW29yZGVyQXhpc106IHN0YXJ0aW5nUG9pbnRbb3JkZXJBeGlzXSxcclxuICAgICAgICBbcmFua0F4aXNdOiBzdGFydGluZ1BvaW50W3JhbmtBeGlzXSAtIGRpciAqIGN1cnZlRGlzdGFuY2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFtvcmRlckF4aXNdOiBlbmRpbmdQb2ludFtvcmRlckF4aXNdLFxyXG4gICAgICAgIFtyYW5rQXhpc106IGVuZGluZ1BvaW50W3JhbmtBeGlzXSArIGRpciAqIGN1cnZlRGlzdGFuY2VcclxuICAgICAgfSxcclxuICAgICAgZW5kaW5nUG9pbnRcclxuICAgIF07XHJcbiAgICBjb25zdCBlZGdlTGFiZWxJZCA9IGAke2VkZ2Uuc291cmNlfSR7RURHRV9LRVlfREVMSU19JHtlZGdlLnRhcmdldH0ke0VER0VfS0VZX0RFTElNfSR7REVGQVVMVF9FREdFX05BTUV9YDtcclxuICAgIGNvbnN0IG1hdGNoaW5nRWRnZUxhYmVsID0gZ3JhcGguZWRnZUxhYmVsc1tlZGdlTGFiZWxJZF07XHJcbiAgICBpZiAobWF0Y2hpbmdFZGdlTGFiZWwpIHtcclxuICAgICAgbWF0Y2hpbmdFZGdlTGFiZWwucG9pbnRzID0gZWRnZS5wb2ludHM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoKTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcclxuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXHJcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXHJcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXHJcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxyXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcclxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXHJcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcclxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXHJcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvKiBlbXB0eSAqL1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xyXG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcclxuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xyXG4gICAgICBub2RlLmhlaWdodCA9IG4uZGltZW5zaW9uLmhlaWdodDtcclxuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xyXG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XHJcbiAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICBjb25zdCBuZXdMaW5rOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XHJcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ld0xpbms7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XHJcbiAgICAgIGlmICghbm9kZS53aWR0aCkge1xyXG4gICAgICAgIG5vZGUud2lkdGggPSAyMDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIW5vZGUuaGVpZ2h0KSB7XHJcbiAgICAgICAgbm9kZS5oZWlnaHQgPSAzMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XHJcbiAgfVxyXG59XHJcbiJdfQ==