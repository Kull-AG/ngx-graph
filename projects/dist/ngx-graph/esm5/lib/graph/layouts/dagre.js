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
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // update dagre
            for (var _e = tslib_1.__values(this.dagreEdges), _f = _e.next(); !_f.done; _f = _e.next()) {
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
export { DagreLayout };
if (false) {
    /** @type {?} */
    DagreLayout.prototype.defaultSettings;
    /** @type {?} */
    DagreLayout.prototype.settings;
    /** @type {?} */
    DagreLayout.prototype.dagreGraph;
    /** @type {?} */
    DagreLayout.prototype.dagreNodes;
    /** @type {?} */
    DagreLayout.prototype.dagreEdges;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFncmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvZGFncmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7OztJQUk3QixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJOzs7OztJQUdwQixRQUFTLEdBQUc7SUFDWixTQUFVLElBQUk7SUFDZCxVQUFXLElBQUk7SUFDZixXQUFZLElBQUk7SUFDaEIsWUFBYSxJQUFJOzs7Ozs7QUFHbkIsbUNBVUM7OztJQVRDLG9DQUEwQjs7SUFDMUIsZ0NBQWlCOztJQUNqQixnQ0FBaUI7O0lBQ2pCLG9DQUFxQjs7SUFDckIsb0NBQXFCOztJQUNyQixvQ0FBcUI7O0lBQ3JCLDhCQUFrQjs7SUFDbEIsa0NBQWlDOztJQUNqQywrQkFBMkQ7O0FBRzdEO0lBQUE7UUFDRSxvQkFBZSxHQUFrQjtZQUMvQixXQUFXLEVBQUUsV0FBVyxDQUFDLGFBQWE7WUFDdEMsT0FBTyxFQUFFLEVBQUU7WUFDWCxPQUFPLEVBQUUsRUFBRTtZQUNYLFdBQVcsRUFBRSxHQUFHO1lBQ2hCLFdBQVcsRUFBRSxHQUFHO1lBQ2hCLFdBQVcsRUFBRSxFQUFFO1NBQ2hCLENBQUM7UUFDRixhQUFRLEdBQWtCLEVBQUUsQ0FBQztJQTBHL0IsQ0FBQzs7Ozs7SUFwR0MseUJBQUc7Ozs7SUFBSCxVQUFJLEtBQVk7UUFDZCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUIsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdB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RTtvQkFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztpQkFDakI7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO2lCQUNsQjtnQkFFRCxlQUFlO2dCQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDeEM7Ozs7Ozs7Ozs7WUFFRCxlQUFlO1lBQ2YsS0FBbUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQS9CLElBQU0sSUFBSSxXQUFBO2dCQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25EOzs7Ozs7Ozs7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQW5IRCxJQW1IQzs7OztJQWxIQyxzQ0FPRTs7SUFDRiwrQkFBNkI7O0lBRTdCLGlDQUFnQjs7SUFDaEIsaUNBQWdCOztJQUNoQixpQ0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5cclxuZXhwb3J0IGVudW0gT3JpZW50YXRpb24ge1xyXG4gIExFRlRfVE9fUklHSFQgPSAnTFInLFxyXG4gIFJJR0hUX1RPX0xFRlQgPSAnUkwnLFxyXG4gIFRPUF9UT19CT1RUT00gPSAnVEInLFxyXG4gIEJPVFRPTV9UT19UT00gPSAnQlQnXHJcbn1cclxuZXhwb3J0IGVudW0gQWxpZ25tZW50IHtcclxuICBDRU5URVIgPSAnQycsXHJcbiAgVVBfTEVGVCA9ICdVTCcsXHJcbiAgVVBfUklHSFQgPSAnVVInLFxyXG4gIERPV05fTEVGVCA9ICdETCcsXHJcbiAgRE9XTl9SSUdIVCA9ICdEUidcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEYWdyZVNldHRpbmdzIHtcclxuICBvcmllbnRhdGlvbj86IE9yaWVudGF0aW9uO1xyXG4gIG1hcmdpblg/OiBudW1iZXI7XHJcbiAgbWFyZ2luWT86IG51bWJlcjtcclxuICBlZGdlUGFkZGluZz86IG51bWJlcjtcclxuICByYW5rUGFkZGluZz86IG51bWJlcjtcclxuICBub2RlUGFkZGluZz86IG51bWJlcjtcclxuICBhbGlnbj86IEFsaWdubWVudDtcclxuICBhY3ljbGljZXI/OiAnZ3JlZWR5JyB8IHVuZGVmaW5lZDtcclxuICByYW5rZXI/OiAnbmV0d29yay1zaW1wbGV4JyB8ICd0aWdodC10cmVlJyB8ICdsb25nZXN0LXBhdGgnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGFncmVMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHtcclxuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxyXG4gICAgbWFyZ2luWDogMjAsXHJcbiAgICBtYXJnaW5ZOiAyMCxcclxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXHJcbiAgICByYW5rUGFkZGluZzogMTAwLFxyXG4gICAgbm9kZVBhZGRpbmc6IDUwXHJcbiAgfTtcclxuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBkYWdyZUdyYXBoOiBhbnk7XHJcbiAgZGFncmVOb2RlczogYW55O1xyXG4gIGRhZ3JlRWRnZXM6IGFueTtcclxuXHJcbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcclxuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XHJcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcclxuXHJcbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xyXG5cclxuICAgIGZvciAoY29uc3QgZGFncmVOb2RlSWQgaW4gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlcykge1xyXG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW2RhZ3JlTm9kZUlkXTtcclxuICAgICAgY29uc3Qgbm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBkYWdyZU5vZGUuaWQpO1xyXG4gICAgICBub2RlLnBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IGRhZ3JlTm9kZS54LFxyXG4gICAgICAgIHk6IGRhZ3JlTm9kZS55XHJcbiAgICAgIH07XHJcbiAgICAgIG5vZGUuZGltZW5zaW9uID0ge1xyXG4gICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiBkYWdyZU5vZGUuaGVpZ2h0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG5cclxuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cclxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb24ueSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiBzb3VyY2VOb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHNvdXJjZU5vZGUucG9zaXRpb24ueSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiB0YXJnZXROb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXHJcbiAgICBlZGdlLnBvaW50cyA9IFtzdGFydGluZ1BvaW50LCBlbmRpbmdQb2ludF07XHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoKTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcclxuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXHJcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXHJcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXHJcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxyXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcclxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXHJcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcclxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXHJcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvKiBlbXB0eSAqL1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKG4gPT4ge1xyXG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcclxuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xyXG4gICAgICBub2RlLmhlaWdodCA9IG4uZGltZW5zaW9uLmhlaWdodDtcclxuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xyXG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XHJcbiAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICBjb25zdCBuZXdMaW5rOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XHJcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ld0xpbms7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XHJcbiAgICAgIGlmICghbm9kZS53aWR0aCkge1xyXG4gICAgICAgIG5vZGUud2lkdGggPSAyMDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIW5vZGUuaGVpZ2h0KSB7XHJcbiAgICAgICAgbm9kZS5oZWlnaHQgPSAzMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XHJcbiAgfVxyXG59XHJcbiJdfQ==