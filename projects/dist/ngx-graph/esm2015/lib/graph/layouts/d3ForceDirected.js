/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class D3ForceDirectedLayout {
    constructor() {
        this.defaultSettings = {
            force: forceSimulation()
                .force('charge', forceManyBody().strength(-150))
                .force('collide', forceCollide(5)),
            forceLink: forceLink()
                .id(node => node.id)
                .distance(() => 100)
        };
        this.settings = {};
        this.outputGraph$ = new Subject();
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    run(graph) {
        this.inputGraph = graph;
        this.d3Graph = {
            nodes: (/** @type {?} */ ([...this.inputGraph.nodes.map(n => (Object.assign({}, n)))])),
            edges: (/** @type {?} */ ([...this.inputGraph.edges.map(e => (Object.assign({}, e)))]))
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
                .on('tick', () => {
                this.outputGraph$.next(this.d3GraphToOutputGraph(this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
        if (settings.force) {
            settings.force
                .nodes(this.d3Graph.nodes)
                .force('link', settings.forceLink.links(this.d3Graph.edges))
                .alpha(0.5)
                .restart()
                .on('tick', () => {
                this.outputGraph$.next(this.d3GraphToOutputGraph(this.d3Graph));
            });
        }
        return this.outputGraph$.asObservable();
    }
    /**
     * @param {?} d3Graph
     * @return {?}
     */
    d3GraphToOutputGraph(d3Graph) {
        this.outputGraph.nodes = this.d3Graph.nodes.map((node) => (Object.assign({}, node, { id: node.id || id(), position: {
                x: node.x,
                y: node.y
            }, dimension: {
                width: (node.dimension && node.dimension.width) || 20,
                height: (node.dimension && node.dimension.height) || 20
            }, transform: `translate(${node.x - ((node.dimension && node.dimension.width) || 20) / 2 || 0}, ${node.y -
                ((node.dimension && node.dimension.height) || 20) / 2 || 0})` })));
        this.outputGraph.edges = this.d3Graph.edges.map(edge => (Object.assign({}, edge, { source: toD3Node(edge.source).id, target: toD3Node(edge.target).id, points: [
                {
                    x: toD3Node(edge.source).x,
                    y: toD3Node(edge.source).y
                },
                {
                    x: toD3Node(edge.target).x,
                    y: toD3Node(edge.target).y
                }
            ] })));
        this.outputGraph.edgeLabels = this.outputGraph.edges;
        return this.outputGraph;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDragStart(draggingNode, $event) {
        this.settings.force.alphaTarget(0.3).restart();
        /** @type {?} */
        const node = this.d3Graph.nodes.find(d3Node => d3Node.id === draggingNode.id);
        if (!node) {
            return;
        }
        this.draggingStart = { x: $event.x - node.x, y: $event.y - node.y };
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDrag(draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        const node = this.d3Graph.nodes.find(d3Node => d3Node.id === draggingNode.id);
        if (!node) {
            return;
        }
        node.fx = $event.x - this.draggingStart.x;
        node.fy = $event.y - this.draggingStart.y;
    }
    /**
     * @param {?} draggingNode
     * @param {?} $event
     * @return {?}
     */
    onDragEnd(draggingNode, $event) {
        if (!draggingNode) {
            return;
        }
        /** @type {?} */
        const node = this.d3Graph.nodes.find(d3Node => d3Node.id === draggingNode.id);
        if (!node) {
            return;
        }
        this.settings.force.alphaTarget(0);
        node.fx = undefined;
        node.fy = undefined;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDNGb3JjZURpcmVjdGVkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9sYXlvdXRzL2QzRm9yY2VEaXJlY3RlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbkYsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7OztBQUUzQyw2Q0FHQzs7O0lBRkMsd0NBQVk7O0lBQ1osNENBQWdCOzs7OztBQUVsQiw0QkFRQzs7O0lBUEMsb0JBQVk7O0lBQ1osbUJBQVU7O0lBQ1YsbUJBQVU7O0lBQ1YsdUJBQWU7O0lBQ2Ysd0JBQWdCOztJQUNoQixvQkFBWTs7SUFDWixvQkFBWTs7Ozs7QUFFZCw0QkFHQzs7O0lBRkMsd0JBQXdCOztJQUN4Qix3QkFBd0I7Ozs7O0FBRTFCLDZCQUdDOzs7SUFGQyx3QkFBZ0I7O0lBQ2hCLHdCQUFnQjs7Ozs7QUFFbEIsZ0NBRUM7OztJQURDLHdCQUFXOzs7Ozs7QUFHYixNQUFNLFVBQVUsUUFBUSxDQUFDLFNBQTBCO0lBQ2pELElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFO1FBQ2pDLE9BQU87WUFDTCxFQUFFLEVBQUUsU0FBUztZQUNiLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7U0FDTCxDQUFDO0tBQ0g7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxPQUFPLHFCQUFxQjtJQUFsQztRQUNFLG9CQUFlLEdBQTRCO1lBQ3pDLEtBQUssRUFBRSxlQUFlLEVBQU87aUJBQzFCLEtBQUssQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFD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QyxDQUFDO1FBQ25DLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQ3RCLENBQUM7Q0FDRjs7O0lBcElDLGdEQU9FOztJQUNGLHlDQUF1Qzs7SUFFdkMsMkNBQWtCOztJQUNsQiw0Q0FBbUI7O0lBQ25CLHdDQUFpQjs7SUFDakIsNkNBQTZDOztJQUU3Qyw4Q0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL25vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0IHsgZm9yY2VDb2xsaWRlLCBmb3JjZUxpbmssIGZvcmNlTWFueUJvZHksIGZvcmNlU2ltdWxhdGlvbiB9IGZyb20gJ2QzLWZvcmNlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEM0ZvcmNlRGlyZWN0ZWRTZXR0aW5ncyB7XHJcbiAgZm9yY2U/OiBhbnk7XHJcbiAgZm9yY2VMaW5rPzogYW55O1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgRDNOb2RlIHtcclxuICBpZD86IHN0cmluZztcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG4gIHdpZHRoPzogbnVtYmVyO1xyXG4gIGhlaWdodD86IG51bWJlcjtcclxuICBmeD86IG51bWJlcjtcclxuICBmeT86IG51bWJlcjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIEQzRWRnZSB7XHJcbiAgc291cmNlOiBzdHJpbmcgfCBEM05vZGU7XHJcbiAgdGFyZ2V0OiBzdHJpbmcgfCBEM05vZGU7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBEM0dyYXBoIHtcclxuICBub2RlczogRDNOb2RlW107XHJcbiAgZWRnZXM6IEQzRWRnZVtdO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVyZ2VkTm9kZSBleHRlbmRzIEQzTm9kZSwgTm9kZSB7XHJcbiAgaWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvRDNOb2RlKG1heWJlTm9kZTogc3RyaW5nIHwgRDNOb2RlKTogRDNOb2RlIHtcclxuICBpZiAodHlwZW9mIG1heWJlTm9kZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlkOiBtYXliZU5vZGUsXHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgfVxyXG4gIHJldHVybiBtYXliZU5vZGU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEM0ZvcmNlRGlyZWN0ZWRMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRDNGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7XHJcbiAgICBmb3JjZTogZm9yY2VTaW11bGF0aW9uPGFueT4oKVxyXG4gICAgICAuZm9yY2UoJ2NoYXJnZScsIGZvcmNlTWFueUJvZHkoKS5zdHJlbmd0aCgtMTUwKSlcclxuICAgICAgLmZvcmNlKCdjb2xsaWRlJywgZm9yY2VDb2xsaWRlKDUpKSxcclxuICAgIGZvcmNlTGluazogZm9yY2VMaW5rPGFueSwgYW55PigpXHJcbiAgICAgIC5pZChub2RlID0+IG5vZGUuaWQpXHJcbiAgICAgIC5kaXN0YW5jZSgoKSA9PiAxMDApXHJcbiAgfTtcclxuICBzZXR0aW5nczogRDNGb3JjZURpcmVjdGVkU2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgaW5wdXRHcmFwaDogR3JhcGg7XHJcbiAgb3V0cHV0R3JhcGg6IEdyYXBoO1xyXG4gIGQzR3JhcGg6IEQzR3JhcGg7XHJcbiAgb3V0cHV0R3JhcGgkOiBTdWJqZWN0PEdyYXBoPiA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG4gIGRyYWdnaW5nU3RhcnQ6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuXHJcbiAgcnVuKGdyYXBoOiBHcmFwaCk6IE9ic2VydmFibGU8R3JhcGg+IHtcclxuICAgIHRoaXMuaW5wdXRHcmFwaCA9IGdyYXBoO1xyXG4gICAgdGhpcy5kM0dyYXBoID0ge1xyXG4gICAgICBub2RlczogWy4uLnRoaXMuaW5wdXRHcmFwaC5ub2Rlcy5tYXAobiA9PiAoeyAuLi5uIH0pKV0gYXMgYW55LFxyXG4gICAgICBlZGdlczogWy4uLnRoaXMuaW5wdXRHcmFwaC5lZGdlcy5tYXAoZSA9PiAoeyAuLi5lIH0pKV0gYXMgYW55XHJcbiAgICB9O1xyXG4gICAgdGhpcy5vdXRwdXRHcmFwaCA9IHtcclxuICAgICAgbm9kZXM6IFtdLFxyXG4gICAgICBlZGdlczogW10sXHJcbiAgICAgIGVkZ2VMYWJlbHM6IFtdXHJcbiAgICB9O1xyXG4gICAgdGhpcy5vdXRwdXRHcmFwaCQubmV4dCh0aGlzLm91dHB1dEdyYXBoKTtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5mb3JjZSkge1xyXG4gICAgICB0aGlzLnNldHRpbmdzLmZvcmNlXHJcbiAgICAgICAgLm5vZGVzKHRoaXMuZDNHcmFwaC5ub2RlcylcclxuICAgICAgICAuZm9yY2UoJ2xpbmsnLCB0aGlzLnNldHRpbmdzLmZvcmNlTGluay5saW5rcyh0aGlzLmQzR3JhcGguZWRnZXMpKVxyXG4gICAgICAgIC5hbHBoYSgwLjUpXHJcbiAgICAgICAgLnJlc3RhcnQoKVxyXG4gICAgICAgIC5vbigndGljaycsICgpID0+IHtcclxuICAgICAgICAgIHRoaXMub3V0cHV0R3JhcGgkLm5leHQodGhpcy5kM0dyYXBoVG9PdXRwdXRHcmFwaCh0aGlzLmQzR3JhcGgpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vdXRwdXRHcmFwaCQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVFZGdlKGdyYXBoOiBHcmFwaCwgZWRnZTogRWRnZSk6IE9ic2VydmFibGU8R3JhcGg+IHtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgaWYgKHNldHRpbmdzLmZvcmNlKSB7XHJcbiAgICAgIHNldHRpbmdzLmZvcmNlXHJcbiAgICAgICAgLm5vZGVzKHRoaXMuZDNHcmFwaC5ub2RlcylcclxuICAgICAgICAuZm9yY2UoJ2xpbmsnLCBzZXR0aW5ncy5mb3JjZUxpbmsubGlua3ModGhpcy5kM0dyYXBoLmVkZ2VzKSlcclxuICAgICAgICAuYWxwaGEoMC41KVxyXG4gICAgICAgIC5yZXN0YXJ0KClcclxuICAgICAgICAub24oJ3RpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLm91dHB1dEdyYXBoJC5uZXh0KHRoaXMuZDNHcmFwaFRvT3V0cHV0R3JhcGgodGhpcy5kM0dyYXBoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0R3JhcGgkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgZDNHcmFwaFRvT3V0cHV0R3JhcGgoZDNHcmFwaDogRDNHcmFwaCk6IEdyYXBoIHtcclxuICAgIHRoaXMub3V0cHV0R3JhcGgubm9kZXMgPSB0aGlzLmQzR3JhcGgubm9kZXMubWFwKChub2RlOiBNZXJnZWROb2RlKSA9PiAoe1xyXG4gICAgICAuLi5ub2RlLFxyXG4gICAgICBpZDogbm9kZS5pZCB8fCBpZCgpLFxyXG4gICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgIHg6IG5vZGUueCxcclxuICAgICAgICB5OiBub2RlLnlcclxuICAgICAgfSxcclxuICAgICAgZGltZW5zaW9uOiB7XHJcbiAgICAgICAgd2lkdGg6IChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi53aWR0aCkgfHwgMjAsXHJcbiAgICAgICAgaGVpZ2h0OiAobm9kZS5kaW1lbnNpb24gJiYgbm9kZS5kaW1lbnNpb24uaGVpZ2h0KSB8fCAyMFxyXG4gICAgICB9LFxyXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtub2RlLnggLSAoKG5vZGUuZGltZW5zaW9uICYmIG5vZGUuZGltZW5zaW9uLndpZHRoKSB8fCAyMCkgLyAyIHx8IDB9LCAke25vZGUueSAtXHJcbiAgICAgICAgKChub2RlLmRpbWVuc2lvbiAmJiBub2RlLmRpbWVuc2lvbi5oZWlnaHQpIHx8IDIwKSAvIDIgfHwgMH0pYFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMub3V0cHV0R3JhcGguZWRnZXMgPSB0aGlzLmQzR3JhcGguZWRnZXMubWFwKGVkZ2UgPT4gKHtcclxuICAgICAgLi4uZWRnZSxcclxuICAgICAgc291cmNlOiB0b0QzTm9kZShlZGdlLnNvdXJjZSkuaWQsXHJcbiAgICAgIHRhcmdldDogdG9EM05vZGUoZWRnZS50YXJnZXQpLmlkLFxyXG4gICAgICBwb2ludHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB4OiB0b0QzTm9kZShlZGdlLnNvdXJjZSkueCxcclxuICAgICAgICAgIHk6IHRvRDNOb2RlKGVkZ2Uuc291cmNlKS55XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB4OiB0b0QzTm9kZShlZGdlLnRhcmdldCkueCxcclxuICAgICAgICAgIHk6IHRvRDNOb2RlKGVkZ2UudGFyZ2V0KS55XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9KSk7XHJcblxyXG4gICAgdGhpcy5vdXRwdXRHcmFwaC5lZGdlTGFiZWxzID0gdGhpcy5vdXRwdXRHcmFwaC5lZGdlcztcclxuICAgIHJldHVybiB0aGlzLm91dHB1dEdyYXBoO1xyXG4gIH1cclxuXHJcbiAgb25EcmFnU3RhcnQoZHJhZ2dpbmdOb2RlOiBOb2RlLCAkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UuYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5kM0dyYXBoLm5vZGVzLmZpbmQoZDNOb2RlID0+IGQzTm9kZS5pZCA9PT0gZHJhZ2dpbmdOb2RlLmlkKTtcclxuICAgIGlmICghbm9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmRyYWdnaW5nU3RhcnQgPSB7IHg6ICRldmVudC54IC0gbm9kZS54LCB5OiAkZXZlbnQueSAtIG5vZGUueSB9O1xyXG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XHJcbiAgICBub2RlLmZ5ID0gJGV2ZW50LnkgLSB0aGlzLmRyYWdnaW5nU3RhcnQueTtcclxuICB9XHJcblxyXG4gIG9uRHJhZyhkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XHJcbiAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbm9kZS5meCA9ICRldmVudC54IC0gdGhpcy5kcmFnZ2luZ1N0YXJ0Lng7XHJcbiAgICBub2RlLmZ5ID0gJGV2ZW50LnkgLSB0aGlzLmRyYWdnaW5nU3RhcnQueTtcclxuICB9XHJcblxyXG4gIG9uRHJhZ0VuZChkcmFnZ2luZ05vZGU6IE5vZGUsICRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKCFkcmFnZ2luZ05vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuZDNHcmFwaC5ub2Rlcy5maW5kKGQzTm9kZSA9PiBkM05vZGUuaWQgPT09IGRyYWdnaW5nTm9kZS5pZCk7XHJcbiAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0dGluZ3MuZm9yY2UuYWxwaGFUYXJnZXQoMCk7XHJcbiAgICBub2RlLmZ4ID0gdW5kZWZpbmVkO1xyXG4gICAgbm9kZS5meSA9IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuIl19