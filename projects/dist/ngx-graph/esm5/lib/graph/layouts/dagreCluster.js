/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { id } from '../../utils/id';
import * as dagre from 'dagre';
import { Orientation } from './dagre';
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
            return tslib_1.__assign({}, node, { position: {
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
            for (var _d = tslib_1.__values(this.dagreNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
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
            for (var _f = tslib_1.__values(this.dagreClusters), _g = _f.next(); !_g.done; _g = _f.next()) {
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
            for (var _h = tslib_1.__values(this.dagreEdges), _j = _h.next(); !_j.done; _j = _h.next()) {
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
export { DagreClusterLayout };
if (false) {
    /** @type {?} */
    DagreClusterLayout.prototype.defaultSettings;
    /** @type {?} */
    DagreClusterLayout.prototype.settings;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreGraph;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreNodes;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreClusters;
    /** @type {?} */
    DagreClusterLayout.prototype.dagreEdges;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFncmVDbHVzdGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9sYXlvdXRzL2RhZ3JlQ2x1c3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUcvQixPQUFPLEVBQWlCLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVyRDtJQUFBO1FBQ0Usb0JBQWUsR0FBa0I7WUFDL0IsV0FBVyxFQUFFLFdBQVcsQ0FBQyxhQUFhO1lBQ3RDLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFLEVBQUU7WUFDWCxXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsRUFBRTtTQUNoQixDQUFDO1FBQ0YsYUFBUSxHQUFrQixFQUFFLENBQUM7SUFnSC9CLENBQUM7Ozs7O0lBekdDLGdDQUFHOzs7O0lBQUgsVUFBSSxLQUFZO1FBQWhCLGlCQXdCQztRQXZCQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUIsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQzs7WUFFekMsYUFBYSxHQUFHLFVBQUEsSUFBSTs7Z0JBQ2xCLFNBQVMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2pELDRCQUNLLElBQUksSUFDUCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNkLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDZixFQUNELFNBQVMsRUFBRTtvQkFDVCxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUs7b0JBQ3RCLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtpQkFDekIsSUFDRDtRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0QsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU3QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7OztJQUVELHVDQUFVOzs7OztJQUFWLFVBQVcsS0FBWSxFQUFFLElBQVU7O1lBQzNCLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBcEIsQ0FBb0IsQ0FBQzs7WUFDeEQsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFwQixDQUFvQixDQUFDOzs7WUFHeEQsR0FBRyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDN0QsYUFBYSxHQUFHO1lBQ3BCLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUNuRTs7WUFDSyxXQUFXLEdBQUc7WUFDbEIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QixDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsc0JBQXNCO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDM0MsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7OztJQUVELDZDQUFnQjs7OztJQUFoQixVQUFpQixLQUFZO1FBQTdCLGlCQTBEQzs7UUF6REMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7O1lBQ3pELFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDdkIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxXQUFXO1lBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztZQUN6QixPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87WUFDekIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxXQUFXO1lBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsV0FBVztZQUM3QixPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVc7WUFDN0IsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO1lBQ3JCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztZQUM3QixNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07U0FDeEIsQ0FBQyxDQUFDO1FBRUgsa0VBQWtFO1FBQ2xFLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7WUFDbEMsT0FBTztZQUNMLFdBQVc7YUFDWixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBTzs7Z0JBQ2xDLElBQUksR0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0QixPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUUxQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzs7Z0JBQzNCLE9BQU8sR0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUNuQjtZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDOztZQUVILEtBQW1CLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsVUFBVSxDQUFBLGdCQUFBLDRCQUFFO2dCQUEvQixJQUFNLElBQUksV0FBQTtnQkFDYixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3hDOzs7Ozs7Ozs7Z0NBRVUsT0FBTztZQUNoQixPQUFLLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVc7Z0JBQ3RDLEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDOzs7WUFMRCxLQUFzQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQSxnQkFBQTtnQkFBbkMsSUFBTSxPQUFPLFdBQUE7d0JBQVAsT0FBTzthQUtqQjs7Ozs7Ozs7OztZQUVELGVBQWU7WUFDZixLQUFtQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQSxnQkFBQSw0QkFBRTtnQkFBL0IsSUFBTSxJQUFJLFdBQUE7Z0JBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbkQ7Ozs7Ozs7OztRQUVELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBekhELElBeUhDOzs7O0lBeEhDLDZDQU9FOztJQUNGLHNDQUE2Qjs7SUFFN0Isd0NBQWdCOztJQUNoQix3Q0FBbUI7O0lBQ25CLDJDQUE2Qjs7SUFDN0Isd0NBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XHJcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IERhZ3JlU2V0dGluZ3MsIE9yaWVudGF0aW9uIH0gZnJvbSAnLi9kYWdyZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGFncmVDbHVzdGVyTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcclxuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7XHJcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcclxuICAgIG1hcmdpblg6IDIwLFxyXG4gICAgbWFyZ2luWTogMjAsXHJcbiAgICBlZGdlUGFkZGluZzogMTAwLFxyXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcclxuICAgIG5vZGVQYWRkaW5nOiA1MFxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgZGFncmVHcmFwaDogYW55O1xyXG4gIGRhZ3JlTm9kZXM6IE5vZGVbXTtcclxuICBkYWdyZUNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdO1xyXG4gIGRhZ3JlRWRnZXM6IGFueTtcclxuXHJcbiAgcnVuKGdyYXBoOiBHcmFwaCk6IEdyYXBoIHtcclxuICAgIHRoaXMuY3JlYXRlRGFncmVHcmFwaChncmFwaCk7XHJcbiAgICBkYWdyZS5sYXlvdXQodGhpcy5kYWdyZUdyYXBoKTtcclxuXHJcbiAgICBncmFwaC5lZGdlTGFiZWxzID0gdGhpcy5kYWdyZUdyYXBoLl9lZGdlTGFiZWxzO1xyXG5cclxuICAgIGNvbnN0IGRhZ3JlVG9PdXRwdXQgPSBub2RlID0+IHtcclxuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tub2RlLmlkXTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5ub2RlLFxyXG4gICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICB4OiBkYWdyZU5vZGUueCxcclxuICAgICAgICAgIHk6IGRhZ3JlTm9kZS55XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkaW1lbnNpb246IHtcclxuICAgICAgICAgIHdpZHRoOiBkYWdyZU5vZGUud2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQ6IGRhZ3JlTm9kZS5oZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgZ3JhcGguY2x1c3RlcnMgPSAoZ3JhcGguY2x1c3RlcnMgfHwgW10pLm1hcChkYWdyZVRvT3V0cHV0KTtcclxuICAgIGdyYXBoLm5vZGVzID0gZ3JhcGgubm9kZXMubWFwKGRhZ3JlVG9PdXRwdXQpO1xyXG5cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xyXG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XHJcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXHJcbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ID8gLTEgOiAxO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcclxuICAgICAgeDogc291cmNlTm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgLSBkaXIgKiAoc291cmNlTm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcclxuICAgICAgeDogdGFyZ2V0Tm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiB0YXJnZXROb2RlLnBvc2l0aW9uLnkgKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcblxyXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xyXG4gICAgZWRnZS5wb2ludHMgPSBbc3RhcnRpbmdQb2ludCwgZW5kaW5nUG9pbnRdO1xyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKHsgY29tcG91bmQ6IHRydWUgfSk7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XHJcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxyXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxyXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxyXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcclxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXHJcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxyXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXHJcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxyXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlclxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLyogZW1wdHkgKi9cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcCgobjogTm9kZSkgPT4ge1xyXG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBuKTtcclxuICAgICAgbm9kZS53aWR0aCA9IG4uZGltZW5zaW9uLndpZHRoO1xyXG4gICAgICBub2RlLmhlaWdodCA9IG4uZGltZW5zaW9uLmhlaWdodDtcclxuICAgICAgbm9kZS54ID0gbi5wb3NpdGlvbi54O1xyXG4gICAgICBub2RlLnkgPSBuLnBvc2l0aW9uLnk7XHJcbiAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZUNsdXN0ZXJzID0gZ3JhcGguY2x1c3RlcnMgfHwgW107XHJcblxyXG4gICAgdGhpcy5kYWdyZUVkZ2VzID0gZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICBjb25zdCBuZXdMaW5rOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgaWYgKCFuZXdMaW5rLmlkKSB7XHJcbiAgICAgICAgbmV3TGluay5pZCA9IGlkKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ld0xpbms7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5kYWdyZU5vZGVzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXROb2RlKG5vZGUuaWQsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgY2x1c3RlciBvZiB0aGlzLmRhZ3JlQ2x1c3RlcnMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUoY2x1c3Rlci5pZCwgY2x1c3Rlcik7XHJcbiAgICAgIGNsdXN0ZXIuY2hpbGROb2RlSWRzLmZvckVhY2goY2hpbGROb2RlSWQgPT4ge1xyXG4gICAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRQYXJlbnQoY2hpbGROb2RlSWQsIGNsdXN0ZXIuaWQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xyXG4gIH1cclxufVxyXG4iXX0=