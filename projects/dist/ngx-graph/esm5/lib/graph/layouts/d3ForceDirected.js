/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { id } from '../../utils/id';
import { forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { Subject } from 'rxjs';
/**
 * @record
 */
export function D3ForceDirectedSettings() { }
if (false) {
    /** @type {?|undefined} */
    D3ForceDirectedSettings.prototype.force;
    /** @type {?|undefined} */
    D3ForceDirectedSettings.prototype.forceLink;
}
/**
 * @record
 */
export function D3Node() { }
if (false) {
    /** @type {?|undefined} */
    D3Node.prototype.id;
    /** @type {?} */
    D3Node.prototype.x;
    /** @type {?} */
    D3Node.prototype.y;
    /** @type {?|undefined} */
    D3Node.prototype.width;
    /** @type {?|undefined} */
    D3Node.prototype.height;
    /** @type {?|undefined} */
    D3Node.prototype.fx;
    /** @type {?|undefined} */
    D3Node.prototype.fy;
}
/**
 * @record
 */
export function D3Edge() { }
if (false) {
    /** @type {?} */
    D3Edge.prototype.source;
    /** @type {?} */
    D3Edge.prototype.target;
}
/**
 * @record
 */
export function D3Graph() { }
if (false) {
    /** @type {?} */
    D3Graph.prototype.nodes;
    /** @type {?} */
    D3Graph.prototype.edges;
}
/**
 * @record
 */
export function MergedNode() { }
if (false) {
    /** @type {?} */
    MergedNode.prototype.id;
}
/**
 * @param {?} maybeNode
 * @return {?}
 */
export function toD3Node(maybeNode) {
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
            nodes: (/** @type {?} */ (tslib_1.__spread(this.inputGraph.nodes.map(function (n) { return (tslib_1.__assign({}, n)); })))),
            edges: (/** @type {?} */ (tslib_1.__spread(this.inputGraph.edges.map(function (e) { return (tslib_1.__assign({}, e)); }))))
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
        this.outputGraph.nodes = this.d3Graph.nodes.map(function (node) { return (tslib_1.__assign({}, node, { id: node.id || id(), position: {
                x: node.x,
                y: node.y
            }, dimension: {
                width: (node.dimension && node.dimension.width) || 20,
                height: (node.dimension && node.dimension.height) || 20
            }, transform: "translate(" + (node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0) + ", " + (node.y -
                ((node.dimension && node.dimension.height) || 20) / 2 || 0) + ")" })); });
        this.outputGraph.edges = this.d3Graph.edges.map(function (edge) { return (tslib_1.__assign({}, edge, { source: toD3Node(edge.source).id, target: toD3Node(edge.target).id, points: [
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
export { D3ForceDirectedLayout };
if (false) {
    /** @type {?} */
    D3ForceDirectedLayout.prototype.defaultSettings;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.settings;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.inputGraph;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.outputGraph;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.d3Graph;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.outputGraph$;
    /** @type {?} */
    D3ForceDirectedLayout.prototype.draggingStart;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDNGb3JjZURpcmVjdGVkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9sYXlvdXRzL2QzRm9yY2VEaXJlY3RlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRW5GLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFFM0MsNkNBR0M7OztJQUZDLHdDQUFZOztJQUNaLDRDQUFnQjs7Ozs7QUFFbEIsNEJBUUM7OztJQVBDLG9CQUFZOztJQUNaLG1CQUFVOztJQUNWLG1CQUFVOztJQUNWLHVCQUFlOztJQUNmLHdCQUFnQjs7SUFDaEIsb0JBQVk7O0lBQ1osb0JBQVk7Ozs7O0FBRWQsNEJBR0M7OztJQUZDLHdCQUF3Qjs7SUFDeEIsd0JBQXdCOzs7OztBQUUxQiw2QkFHQzs7O0lBRkMsd0JBQWdCOztJQUNoQix3QkFBZ0I7Ozs7O0FBRWxCLGdDQUVDOzs7SUFEQyx3QkFBVzs7Ozs7O0FBR2IsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUEwQjtJQUNqRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtRQUNqQyxPQUFPO1lBQ0wsRUFBRSxFQUFFLFNBQVM7WUFDYixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztLQUNIO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVEO0lBQUE7UUFDRSxvQkFBZSxHQUE0QjtZQUN6QyxLQUFLLEVBQUUsZUFBZSxFQUFPO2lCQUMxQixLQUFLLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUMvQyxLQUFL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N0IsQ0FBNkIsQ0FBQztRQUM3RSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQ3RCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFySUQsSUFxSUM7Ozs7SUFwSUMsZ0RBT0U7O0lBQ0YseUNBQXVDOztJQUV2QywyQ0FBa0I7O0lBQ2xCLDRDQUFtQjs7SUFDbkIsd0NBQWlCOztJQUNqQiw2Q0FBNkM7O0lBRTdDLDhDQUF3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgeyBmb3JjZUNvbGxpZGUsIGZvcmNlTGluaywgZm9yY2VNYW55Qm9keSwgZm9yY2VTaW11bGF0aW9uIH0gZnJvbSAnZDMtZm9yY2UnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEQzRm9yY2VEaXJlY3RlZFNldHRpbmdzIHtcclxuICBmb3JjZT86IGFueTtcclxuICBmb3JjZUxpbms/OiBhbnk7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBEM05vZGUge1xyXG4gIGlkPzogc3RyaW5nO1xyXG4gIHg6IG51bWJlcjtcclxuICB5OiBudW1iZXI7XHJcbiAgd2lkdGg/OiBudW1iZXI7XHJcbiAgaGVpZ2h0PzogbnVtYmVyO1xyXG4gIGZ4PzogbnVtYmVyO1xyXG4gIGZ5PzogbnVtYmVyO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgRDNFZGdlIHtcclxuICBzb3VyY2U6IHN0cmluZyB8IEQzTm9kZTtcclxuICB0YXJnZXQ6IHN0cmluZyB8IEQzTm9kZTtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIEQzR3JhcGgge1xyXG4gIG5vZGVzOiBEM05vZGVbXTtcclxuICBlZGdlczogRDNFZGdlW107XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBNZXJnZWROb2RlIGV4dGVuZHMgRDNOb2RlLCBOb2RlIHtcclxuICBpZDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9EM05vZGUobWF5YmVOb2RlOiBzdHJpbmcgfCBEM05vZGUpOiBEM05vZGUge1xyXG4gIGlmICh0eXBlb2YgbWF5YmVOb2RlID09PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaWQ6IG1heWJlTm9kZSxcclxuICAgICAgeDogMCxcclxuICAgICAgeTogMFxyXG4gICAgfTtcclxuICB9XHJcbiAgcmV0dXJuIG1heWJlTm9kZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEQzRm9yY2VEaXJlY3RlZExheW91dCBpbXBsZW1lbnRzIExheW91dCB7XHJcbiAgZGVmYXVsdFNldHRpbmdzOiBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHtcclxuICAgIGZvcmNlOiBmb3JjZVNpbXVsYXRpb248YW55PigpXHJcbiAgICAgIC5mb3JjZSgnY2hhcmdlJywgZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKC0xNTApKVxyXG4gICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBmb3JjZUNvbGxpZGUoNSkpLFxyXG4gICAgZm9yY2VMaW5rOiBmb3JjZUxpbms8YW55LCBhbnk+KClcclxuICAgICAgLmlkKG5vZGUgPT4gbm9kZS5pZClcclxuICAgICAgLmRpc3RhbmNlKCgpID0+IDEwMClcclxuICB9O1xyXG4gIHNldHRpbmdzOiBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBpbnB1dEdyYXBoOiBHcmFwaDtcclxuICBvdXRwdXRHcmFwaDogR3JhcGg7XHJcbiAgZDNHcmFwaDogRDNHcmFwaDtcclxuICBvdXRwdXRHcmFwaCQ6IFN1YmplY3Q8R3JhcGg+ID0gbmV3IFN1YmplY3QoKTtcclxuXHJcbiAgZHJhZ2dpbmdTdGFydDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xyXG5cclxuICBydW4oZ3JhcGg6IEdyYXBoKTogT2JzZXJ2YWJsZTxHcmFwaD4ge1xyXG4gICAgdGhpcy5pbnB1dEdyYXBoID0gZ3JhcGg7XHJcbiAgICB0aGlzLmQzR3JhcGggPSB7XHJcbiAgICAgIG5vZGVzOiBbLi4udGhpcy5pbnB1dEdyYXBoLm5vZGVzLm1hcChuID0+ICh7IC4uLm4gfSkpXSBhcyBhbnksXHJcbiAgICAgIGVkZ2VzOiBbLi4udGhpcy5pbnB1dEdyYXBoLmVkZ2VzLm1hcChlID0+ICh7IC4uLmUgfSkpXSBhcyBhbnlcclxuICAgIH07XHJcbiAgICB0aGlzLm91dHB1dEdyYXBoID0ge1xyXG4gICAgICBub2RlczogW10sXHJcbiAgICAgIGVkZ2VzOiBbXSxcclxuICAgICAgZWRnZUxhYmVsczogW11cclxuICAgIH07XHJcbiAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMub3V0cHV0R3JhcGgpO1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvcmNlKSB7XHJcbiAgICAgIHRoaXMuc2V0dGluZ3MuZm9yY2VcclxuICAgICAgICAubm9kZXModGhpcy5kM0dyYXBoLm5vZGVzKVxyXG4gICAgICAgIC5mb3JjZSgnbGluaycsIHRoaXMuc2V0dGluZ3MuZm9yY2VMaW5rLmxpbmtzKHRoaXMuZDNHcmFwaC5lZGdlcykpXHJcbiAgICAgICAgLmFscGhhKDAuNSlcclxuICAgICAgICAucmVzdGFydCgpXHJcbiAgICAgICAgLm9uKCd0aWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLmQzR3JhcGhUb091dHB1dEdyYXBoKHRoaXMuZDNHcmFwaCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoJC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogT2JzZXJ2YWJsZTxHcmFwaD4ge1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICBpZiAoc2V0dGluZ3MuZm9yY2UpIHtcclxuICAgICAgc2V0dGluZ3MuZm9yY2VcclxuICAgICAgICAubm9kZXModGhpcy5kM0dyYXBoLm5vZGVzKVxyXG4gICAgICAgIC5mb3JjZSgnbGluaycsIHNldHRpbmdzLmZvcmNlTGluay5saW5rcyh0aGlzLmQzR3JhcGguZWRnZXMpKVxyXG4gICAgICAgIC5hbHBoYSgwLjUpXHJcbiAgICAgICAgLnJlc3RhcnQoKVxyXG4gICAgICAgIC5vbigndGljaycsICgpID0+IHtcclxuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5kM0dyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmQzR3JhcGgpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBkM0dyYXBoVG9PdXRwdXRHcmFwaChkM0dyYXBoOiBEM0dyYXBoKTogR3JhcGgge1xyXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5ub2RlcyA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5tYXAoKG5vZGU6IE1lcmdlZE5vZGUpID0+ICh7XHJcbiAgICAgIC4uLm5vZGUsXHJcbiAgICAgIGlkOiBub2RlLmlkIHx8IGlkKCksXHJcbiAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgeDogbm9kZS54LFxyXG4gICAgICAgIHk6IG5vZGUueVxyXG4gICAgICB9LFxyXG4gICAgICBkaW1lbnNpb246IHtcclxuICAgICAgICB3aWR0aDogKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCxcclxuICAgICAgICBoZWlnaHQ6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwXHJcbiAgICAgIH0sXHJcbiAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke25vZGUueCAtICgobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24ud2lkdGgpIHx8IDIwKSAvIDIgfHwgMH0sICR7bm9kZS55IC1cclxuICAgICAgICAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLmhlaWdodCkgfHwgMjApIC8gMiB8fCAwfSlgXHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlcyA9IHRoaXMuZDNHcmFwaC5lZGdlcy5tYXAoZWRnZSA9PiAoe1xyXG4gICAgICAuLi5lZGdlLFxyXG4gICAgICBzb3VyY2U6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS5pZCxcclxuICAgICAgdGFyZ2V0OiB0b0QzTm9kZShlZGdlLnRhcmdldCkuaWQsXHJcbiAgICAgIHBvaW50czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHg6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS54LFxyXG4gICAgICAgICAgeTogdG9EM05vZGUoZWRnZS5zb3VyY2UpLnlcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHg6IHRvRDNOb2RlKGVkZ2UudGFyZ2V0KS54LFxyXG4gICAgICAgICAgeTogdG9EM05vZGUoZWRnZS50YXJnZXQpLnlcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0pKTtcclxuXHJcbiAgICB0aGlzLm91dHB1dEdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLm91dHB1dEdyYXBoLmVkZ2VzO1xyXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGg7XHJcbiAgfVxyXG5cclxuICBvbkRyYWdTdGFydChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZXR0aW5ncy5mb3JjZS5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmQzR3JhcGgubm9kZXMuZmluZChkM05vZGUgPT4gZDNOb2RlLmlkID09PSBkcmFnZ2luZ05vZGUuaWQpO1xyXG4gICAgaWYgKCFub2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuZHJhZ2dpbmdTdGFydCA9IHsgeDogJGV2ZW50LnggLSBub2RlLngsIHk6ICRldmVudC55IC0gbm9kZS55IH07XHJcbiAgICBub2RlLmZ4ID0gJGV2ZW50LnggLSB0aGlzLmRyYWdnaW5nU3RhcnQueDtcclxuICAgIG5vZGUuZnkgPSAkZXZlbnQueSAtIHRoaXMuZHJhZ2dpbmdTdGFydC55O1xyXG4gIH1cclxuXHJcbiAgb25EcmFnKGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcclxuICAgIGlmICghbm9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBub2RlLmZ4ID0gJGV2ZW50LnggLSB0aGlzLmRyYWdnaW5nU3RhcnQueDtcclxuICAgIG5vZGUuZnkgPSAkZXZlbnQueSAtIHRoaXMuZHJhZ2dpbmdTdGFydC55O1xyXG4gIH1cclxuXHJcbiAgb25EcmFnRW5kKGRyYWdnaW5nTm9kZTogTm9kZSwgJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWRyYWdnaW5nTm9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcclxuICAgIGlmICghbm9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXR0aW5ncy5mb3JjZS5hbHBoYVRhcmdldCgwKTtcclxuICAgIG5vZGUuZnggPSB1bmRlZmluZWQ7XHJcbiAgICBub2RlLmZ5ID0gdW5kZWZpbmVkO1xyXG4gIH1cclxufVxyXG4iXX0=