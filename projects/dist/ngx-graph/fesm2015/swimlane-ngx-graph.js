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
const cache = {};
/**
 * Generates a short id.
 *
 * @return {?}
 */
function id() {
    /** @type {?} */
    let newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    newId = `a${newId}`;
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
const Orientation = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
class DagreLayout {
    constructor() {
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
    run(graph) {
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        for (const dagreNodeId in this.dagreGraph._nodes) {
            /** @type {?} */
            const dagreNode = this.dagreGraph._nodes[dagreNodeId];
            /** @type {?} */
            const node = graph.nodes.find(n => n.id === dagreNode.id);
            node.position = {
                x: dagreNode.x,
                y: dagreNode.y
            };
            node.dimension = {
                width: dagreNode.width,
                height: dagreNode.height
            };
        }
        return graph;
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        /** @type {?} */
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        // determine new arrow position
        /** @type {?} */
        const dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        /** @type {?} */
        const startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
        };
        /** @type {?} */
        const endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
        };
        // generate new points
        edge.points = [startingPoint, endingPoint];
        return graph;
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    createDagreGraph(graph) {
        this.dagreGraph = new graphlib.Graph();
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
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
        this.dagreGraph.setDefaultEdgeLabel(() => {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map(n => {
            /** @type {?} */
            const node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreEdges = graph.edges.map(l => {
            /** @type {?} */
            const newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        for (const node of this.dagreNodes) {
            if (!node.width) {
                node.width = 20;
            }
            if (!node.height) {
                node.height = 30;
            }
            // update dagre
            this.dagreGraph.setNode(node.id, node);
        }
        // update dagre
        for (const edge of this.dagreEdges) {
            this.dagreGraph.setEdge(edge.source, edge.target);
        }
        return this.dagreGraph;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class DagreClusterLayout {
    constructor() {
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
    run(graph) {
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        /** @type {?} */
        const dagreToOutput = node => {
            /** @type {?} */
            const dagreNode = this.dagreGraph._nodes[node.id];
            return Object.assign({}, node, { position: {
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
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        /** @type {?} */
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        // determine new arrow position
        /** @type {?} */
        const dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        /** @type {?} */
        const startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.height / 2)
        };
        /** @type {?} */
        const endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.height / 2)
        };
        // generate new points
        edge.points = [startingPoint, endingPoint];
        return graph;
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    createDagreGraph(graph) {
        this.dagreGraph = new graphlib.Graph({ compound: true });
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
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
        this.dagreGraph.setDefaultEdgeLabel(() => {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map((n) => {
            /** @type {?} */
            const node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreClusters = graph.clusters || [];
        this.dagreEdges = graph.edges.map(l => {
            /** @type {?} */
            const newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        for (const node of this.dagreNodes) {
            this.dagreGraph.setNode(node.id, node);
        }
        for (const cluster of this.dagreClusters) {
            this.dagreGraph.setNode(cluster.id, cluster);
            cluster.childNodeIds.forEach(childNodeId => {
                this.dagreGraph.setParent(childNodeId, cluster.id);
            });
        }
        // update dagre
        for (const edge of this.dagreEdges) {
            this.dagreGraph.setEdge(edge.source, edge.target);
        }
        return this.dagreGraph;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const Orientation$1 = {
    LEFT_TO_RIGHT: 'LR',
    RIGHT_TO_LEFT: 'RL',
    TOP_TO_BOTTOM: 'TB',
    BOTTOM_TO_TOM: 'BT',
};
/** @type {?} */
const DEFAULT_EDGE_NAME = '\x00';
/** @type {?} */
const EDGE_KEY_DELIM = '\x01';
class DagreNodesOnlyLayout {
    constructor() {
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
    run(graph) {
        this.createDagreGraph(graph);
        layout(this.dagreGraph);
        graph.edgeLabels = this.dagreGraph._edgeLabels;
        for (const dagreNodeId in this.dagreGraph._nodes) {
            /** @type {?} */
            const dagreNode = this.dagreGraph._nodes[dagreNodeId];
            /** @type {?} */
            const node = graph.nodes.find(n => n.id === dagreNode.id);
            node.position = {
                x: dagreNode.x,
                y: dagreNode.y
            };
            node.dimension = {
                width: dagreNode.width,
                height: dagreNode.height
            };
        }
        for (const edge of graph.edges) {
            this.updateEdge(graph, edge);
        }
        return graph;
    }
    /**
     * @param {?} graph
     * @param {?} edge
     * @return {?}
     */
    updateEdge(graph, edge) {
        /** @type {?} */
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        /** @type {?} */
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        /** @type {?} */
        const rankAxis = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x';
        /** @type {?} */
        const orderAxis = rankAxis === 'y' ? 'x' : 'y';
        /** @type {?} */
        const rankDimension = rankAxis === 'y' ? 'height' : 'width';
        // determine new arrow position
        /** @type {?} */
        const dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
        /** @type {?} */
        const startingPoint = {
            [orderAxis]: sourceNode.position[orderAxis],
            [rankAxis]: sourceNode.position[rankAxis] - dir * (sourceNode.dimension[rankDimension] / 2)
        };
        /** @type {?} */
        const endingPoint = {
            [orderAxis]: targetNode.position[orderAxis],
            [rankAxis]: targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2)
        };
        /** @type {?} */
        const curveDistance = this.settings.curveDistance || this.defaultSettings.curveDistance;
        // generate new points
        edge.points = [
            startingPoint,
            {
                [orderAxis]: startingPoint[orderAxis],
                [rankAxis]: startingPoint[rankAxis] - dir * curveDistance
            },
            {
                [orderAxis]: endingPoint[orderAxis],
                [rankAxis]: endingPoint[rankAxis] + dir * curveDistance
            },
            endingPoint
        ];
        /** @type {?} */
        const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;
        /** @type {?} */
        const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
        if (matchingEdgeLabel) {
            matchingEdgeLabel.points = edge.points;
        }
        return graph;
    }
    /**
     * @param {?} graph
     * @return {?}
     */
    createDagreGraph(graph) {
        this.dagreGraph = new graphlib.Graph();
        /** @type {?} */
        const settings = Object.assign({}, this.defaultSettings, this.settings);
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
        this.dagreGraph.setDefaultEdgeLabel(() => {
            return {
            /* empty */
            };
        });
        this.dagreNodes = graph.nodes.map(n => {
            /** @type {?} */
            const node = Object.assign({}, n);
            node.width = n.dimension.width;
            node.height = n.dimension.height;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreEdges = graph.edges.map(l => {
            /** @type {?} */
            const newLink = Object.assign({}, l);
            if (!newLink.id) {
                newLink.id = id();
            }
            return newLink;
        });
        for (const node of this.dagreNodes) {
            if (!node.width) {
                node.width = 20;
            }
            if (!node.height) {
                node.height = 30;
            }
            // update dagre
            this.dagreGraph.setNode(node.id, node);
        }
        // update dagre
        for (const edge of this.dagreEdges) {
            this.dagreGraph.setEdge(edge.source, edge.target);
        }
        return this.dagreGraph;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const layouts = {
    dagre: DagreLayout,
    dagreCluster: DagreClusterLayout,
    dagreNodesOnly: DagreNodesOnlyLayout,
};
class LayoutService {
    /**
     * @param {?} name
     * @return {?}
     */
    getLayout(name) {
        if (layouts[name]) {
            return new layouts[name]();
        }
        else {
            throw new Error(`Unknown layout type '${name}'`);
        }
    }
}
LayoutService.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
console.log('EL REF', ElementRef);
class GraphComponent extends BaseChartComponent {
    /**
     * @param {?} el
     * @param {?} zone
     * @param {?} cd
     * @param {?} layoutService
     */
    constructor(el, zone, cd, layoutService) {
        super(el, zone, cd);
        this.el = el;
        this.zone = zone;
        this.cd = cd;
        this.layoutService = layoutService;
        this.legend = false;
        this.nodes = [];
        this.clusters = [];
        this.links = [];
        this.activeEntries = [];
        this.draggingEnabled = true;
        this.panningEnabled = true;
        this.enableZoom = true;
        this.zoomSpeed = 0.1;
        this.minZoomLevel = 0.1;
        this.maxZoomLevel = 4.0;
        this.autoZoom = false;
        this.panOnZoom = true;
        this.autoCenter = false;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.graphSubscription = new Subscription();
        this.subscriptions = [];
        this.margin = [0, 0, 0, 0];
        this.results = [];
        this.isPanning = false;
        this.isDragging = false;
        this.initialized = false;
        this.graphDims = { width: 0, height: 0 };
        this._oldLinks = [];
        this.transformationMatrix = identity();
        this._touchLastX = null;
        this._touchLastY = null;
        this.groupResultsBy = node => node.label;
    }
    /**
     * Get the current zoom level
     * @return {?}
     */
    get zoomLevel() {
        return this.transformationMatrix.a;
    }
    /**
     * Set the current zoom level
     * @param {?} level
     * @return {?}
     */
    set zoomLevel(level) {
        this.zoomTo(Number(level));
    }
    /**
     * Get the current `x` position of the graph
     * @return {?}
     */
    get panOffsetX() {
        return this.transformationMatrix.e;
    }
    /**
     * Set the current `x` position of the graph
     * @param {?} x
     * @return {?}
     */
    set panOffsetX(x) {
        this.panTo(Number(x), null);
    }
    /**
     * Get the current `y` position of the graph
     * @return {?}
     */
    get panOffsetY() {
        return this.transformationMatrix.f;
    }
    /**
     * Set the current `y` position of the graph
     * @param {?} y
     * @return {?}
     */
    set panOffsetY(y) {
        this.panTo(null, Number(y));
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngOnInit() {
        if (this.update$) {
            this.subscriptions.push(this.update$.subscribe(() => {
                this.update();
            }));
        }
        if (this.center$) {
            this.subscriptions.push(this.center$.subscribe(() => {
                this.center();
            }));
        }
        if (this.zoomToFit$) {
            this.subscriptions.push(this.zoomToFit$.subscribe(() => {
                this.zoomToFit();
            }));
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        console.log(changes);
        const { layout: layout$$1, layoutSettings, nodes, clusters, links } = changes;
        this.setLayout(this.layout);
        if (layoutSettings) {
            this.setLayoutSettings(this.layoutSettings);
        }
        if (nodes || clusters || links) {
            this.update();
        }
    }
    /**
     * @param {?} layout
     * @return {?}
     */
    setLayout(layout$$1) {
        this.initialized = false;
        if (!layout$$1) {
            layout$$1 = 'dagre';
        }
        if (typeof layout$$1 === 'string') {
            this.layout = this.layoutService.getLayout(layout$$1);
            this.setLayoutSettings(this.layoutSettings);
        }
    }
    /**
     * @param {?} settings
     * @return {?}
     */
    setLayoutSettings(settings) {
        if (this.layout && typeof this.layout !== 'string') {
            this.layout.settings = settings;
            this.update();
        }
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
        this.subscriptions = null;
    }
    /**
     * Angular lifecycle event
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        setTimeout(() => this.update());
    }
    /**
     * Base class update implementation for the dag graph
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    update() {
        super.update();
        if (!this.curve) {
            this.curve = curveBundle.beta(1);
        }
        this.zone.run(() => {
            this.dims = calculateViewDimensions({
                width: this.width,
                height: this.height,
                margins: this.margin,
                showLegend: this.legend
            });
            this.seriesDomain = this.getSeriesDomain();
            this.setColors();
            this.legendOptions = this.getLegendOptions();
            this.createGraph();
            this.updateTransform();
            this.initialized = true;
        });
    }
    /**
     * Draws the graph using dagre layouts
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    draw() {
        if (!this.layout || typeof this.layout === 'string') {
            return;
        }
        // Calc view dims for the nodes
        this.applyNodeDimensions();
        // Recalc the layout
        /** @type {?} */
        const result = this.layout.run(this.graph);
        /** @type {?} */
        const result$ = result instanceof Observable ? result : of(result);
        this.graphSubscription.add(result$.subscribe(graph => {
            this.graph = graph;
            this.tick();
        }));
        result$.pipe(first(graph => graph.nodes.length > 0)).subscribe(() => this.applyNodeDimensions());
    }
    /**
     * @return {?}
     */
    tick() {
        // Transposes view options to the node
        this.graph.nodes.map(n => {
            n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n.position.y - n.dimension.height / 2 ||
                0})`;
            if (!n.data) {
                n.data = {};
            }
            if (!n.data.color) {
                n.data = {
                    color: this.colors.getColor(this.groupResultsBy(n))
                };
            }
        });
        (this.graph.clusters || []).map(n => {
            n.transform = `translate(${n.position.x - n.dimension.width / 2 || 0}, ${n.position.y - n.dimension.height / 2 ||
                0})`;
            if (!n.data) {
                n.data = {};
            }
            if (!n.data.color) {
                n.data = {
                    color: this.colors.getColor(this.groupResultsBy(n))
                };
            }
        });
        // Update the labels to the new positions
        /** @type {?} */
        const newLinks = [];
        for (const edgeLabelId in this.graph.edgeLabels) {
            /** @type {?} */
            const edgeLabel = this.graph.edgeLabels[edgeLabelId];
            /** @type {?} */
            const normKey = edgeLabelId.replace(/[^\w-]*/g, '');
            /** @type {?} */
            let oldLink = this._oldLinks.find(ol => `${ol.source}${ol.target}` === normKey);
            if (!oldLink) {
                oldLink = this.graph.edges.find(nl => `${nl.source}${nl.target}` === normKey) || edgeLabel;
            }
            oldLink.oldLine = oldLink.line;
            /** @type {?} */
            const points = edgeLabel.points;
            /** @type {?} */
            const line$$1 = this.generateLine(points);
            /** @type {?} */
            const newLink = Object.assign({}, oldLink);
            newLink.line = line$$1;
            newLink.points = points;
            /** @type {?} */
            const textPos = points[Math.floor(points.length / 2)];
            if (textPos) {
                newLink.textTransform = `translate(${textPos.x || 0},${textPos.y || 0})`;
            }
            newLink.textAngle = 0;
            if (!newLink.oldLine) {
                newLink.oldLine = newLink.line;
            }
            this.calcDominantBaseline(newLink);
            newLinks.push(newLink);
        }
        this.graph.edges = newLinks;
        // Map the old links for animations
        if (this.graph.edges) {
            this._oldLinks = this.graph.edges.map(l => {
                /** @type {?} */
                const newL = Object.assign({}, l);
                newL.oldLine = l.line;
                return newL;
            });
        }
        // Calculate the height/width total
        this.graphDims.width = Math.max(...this.graph.nodes.map(n => n.position.x + n.dimension.width));
        this.graphDims.height = Math.max(...this.graph.nodes.map(n => n.position.y + n.dimension.height));
        if (this.autoZoom) {
            this.zoomToFit();
        }
        if (this.autoCenter) {
            // Auto-center when rendering
            this.center();
        }
        requestAnimationFrame(() => this.redrawLines());
        this.cd.markForCheck();
    }
    /**
     * Measures the node element and applies the dimensions
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    applyNodeDimensions() {
        if (this.nodeElements && this.nodeElements.length) {
            this.nodeElements.map(elem => {
                /** @type {?} */
                const nativeElement = elem.nativeElement;
                /** @type {?} */
                const node = this.graph.nodes.find(n => n.id === nativeElement.id);
                // calculate the height
                /** @type {?} */
                let dims;
                try {
                    dims = nativeElement.getBoundingClientRect();
                }
                catch (ex) {
                    // Skip drawing if element is not displayed - Firefox would throw an error here
                    return;
                }
                if (this.nodeHeight) {
                    node.dimension.height = this.nodeHeight;
                }
                else {
                    node.dimension.height = dims.height;
                }
                if (this.nodeMaxHeight) {
                    node.dimension.height = Math.max(node.dimension.height, this.nodeMaxHeight);
                }
                if (this.nodeMinHeight) {
                    node.dimension.height = Math.min(node.dimension.height, this.nodeMinHeight);
                }
                if (this.nodeWidth) {
                    node.dimension.width = this.nodeWidth;
                }
                else {
                    // calculate the width
                    if (nativeElement.getElementsByTagName('text').length) {
                        /** @type {?} */
                        let textDims;
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
                if (this.nodeMaxWidth) {
                    node.dimension.width = Math.max(node.dimension.width, this.nodeMaxWidth);
                }
                if (this.nodeMinWidth) {
                    node.dimension.width = Math.min(node.dimension.width, this.nodeMinWidth);
                }
            });
        }
    }
    /**
     * Redraws the lines when dragged or viewport updated
     *
     * \@memberOf GraphComponent
     * @param {?=} _animate
     * @return {?}
     */
    redrawLines(_animate = true) {
        this.linkElements.map(linkEl => {
            /** @type {?} */
            const edge = this.graph.edges.find(lin => lin.id === linkEl.nativeElement.id);
            if (edge) {
                /** @type {?} */
                const linkSelection = select(linkEl.nativeElement).select('.line');
                linkSelection
                    .attr('d', edge.oldLine)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.line);
                /** @type {?} */
                const textPathSelection = select(this.chartElement.nativeElement).select(`#${edge.id}`);
                textPathSelection
                    .attr('d', edge.oldTextPath)
                    .transition()
                    .duration(_animate ? 500 : 0)
                    .attr('d', edge.textPath);
            }
        });
    }
    /**
     * Creates the dagre graph engine
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    createGraph() {
        this.graphSubscription.unsubscribe();
        this.graphSubscription = new Subscription();
        /** @type {?} */
        const initializeNode = n => {
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
            nodes: [...this.nodes].map(initializeNode),
            clusters: [...(this.clusters || [])].map(initializeNode),
            edges: [...this.links].map(e => {
                if (!e.id) {
                    e.id = id();
                }
                return e;
            })
        };
        requestAnimationFrame(() => this.draw());
    }
    /**
     * Calculate the text directions / flipping
     *
     * \@memberOf GraphComponent
     * @param {?} link
     * @return {?}
     */
    calcDominantBaseline(link) {
        /** @type {?} */
        const firstPoint = link.points[0];
        /** @type {?} */
        const lastPoint = link.points[link.points.length - 1];
        link.oldTextPath = link.textPath;
        if (lastPoint.x < firstPoint.x) {
            link.dominantBaseline = 'text-before-edge';
            // reverse text path for when its flipped upside down
            link.textPath = this.generateLine([...link.points].reverse());
        }
        else {
            link.dominantBaseline = 'text-after-edge';
            link.textPath = link.line;
        }
    }
    /**
     * Generate the new line path
     *
     * \@memberOf GraphComponent
     * @param {?} points
     * @return {?}
     */
    generateLine(points) {
        /** @type {?} */
        const lineFunction = line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(this.curve);
        return lineFunction(points);
    }
    /**
     * Zoom was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @param {?} direction
     * @return {?}
     */
    onZoom($event, direction) {
        /** @type {?} */
        const zoomFactor = 1 + (direction === 'in' ? this.zoomSpeed : -this.zoomSpeed);
        // Check that zooming wouldn't put us out of bounds
        /** @type {?} */
        const newZoomLevel = this.zoomLevel * zoomFactor;
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
            const mouseX = $event.clientX;
            /** @type {?} */
            const mouseY = $event.clientY;
            // Transform the mouse X/Y into a SVG X/Y
            /** @type {?} */
            const svg = this.chart.nativeElement.querySelector('svg');
            /** @type {?} */
            const svgGroup = svg.querySelector('g.chart');
            /** @type {?} */
            const point = svg.createSVGPoint();
            point.x = mouseX;
            point.y = mouseY;
            /** @type {?} */
            const svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());
            // Panzoom
            /** @type {?} */
            const NO_ZOOM_LEVEL = 1;
            this.pan(svgPoint.x, svgPoint.y, NO_ZOOM_LEVEL);
            this.zoom(zoomFactor);
            this.pan(-svgPoint.x, -svgPoint.y, NO_ZOOM_LEVEL);
        }
        else {
            this.zoom(zoomFactor);
        }
    }
    /**
     * Pan by x/y
     *
     * @param {?} x
     * @param {?} y
     * @param {?=} zoomLevel
     * @return {?}
     */
    pan(x, y, zoomLevel = this.zoomLevel) {
        this.transformationMatrix = transform(this.transformationMatrix, translate(x / zoomLevel, y / zoomLevel));
        this.updateTransform();
    }
    /**
     * Pan to a fixed x/y
     *
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    panTo(x, y) {
        this.transformationMatrix.e = x === null || x === undefined || isNaN(x) ? this.transformationMatrix.e : Number(x);
        this.transformationMatrix.f = y === null || y === undefined || isNaN(y) ? this.transformationMatrix.f : Number(y);
        this.updateTransform();
    }
    /**
     * Zoom by a factor
     *
     * @param {?} factor
     * @return {?}
     */
    zoom(factor) {
        this.transformationMatrix = transform(this.transformationMatrix, scale(factor, factor));
        this.updateTransform();
    }
    /**
     * Zoom to a fixed level
     *
     * @param {?} level
     * @return {?}
     */
    zoomTo(level) {
        this.transformationMatrix.a = isNaN(level) ? this.transformationMatrix.a : Number(level);
        this.transformationMatrix.d = isNaN(level) ? this.transformationMatrix.d : Number(level);
        this.updateTransform();
    }
    /**
     * Pan was invoked from event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onPan(event) {
        this.pan(event.movementX, event.movementY);
    }
    /**
     * Drag was invoked from an event
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onDrag(event) {
        if (!this.draggingEnabled) {
            return;
        }
        /** @type {?} */
        const node = this.draggingNode;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDrag) {
            this.layout.onDrag(node, event);
        }
        node.position.x += event.movementX / this.zoomLevel;
        node.position.y += event.movementY / this.zoomLevel;
        // move the node
        /** @type {?} */
        const x = node.position.x - node.dimension.width / 2;
        /** @type {?} */
        const y = node.position.y - node.dimension.height / 2;
        node.transform = `translate(${x}, ${y})`;
        for (const link of this.graph.edges) {
            if (link.target === node.id ||
                link.source === node.id ||
                ((/** @type {?} */ (link.target))).id === node.id ||
                ((/** @type {?} */ (link.source))).id === node.id) {
                if (this.layout && typeof this.layout !== 'string') {
                    /** @type {?} */
                    const result = this.layout.updateEdge(this.graph, link);
                    /** @type {?} */
                    const result$ = result instanceof Observable ? result : of(result);
                    this.graphSubscription.add(result$.subscribe(graph => {
                        this.graph = graph;
                        this.redrawEdge(link);
                    }));
                }
            }
        }
        this.redrawLines(false);
    }
    /**
     * @param {?} edge
     * @return {?}
     */
    redrawEdge(edge) {
        /** @type {?} */
        const line$$1 = this.generateLine(edge.points);
        this.calcDominantBaseline(edge);
        edge.oldLine = edge.line;
        edge.line = line$$1;
    }
    /**
     * Update the entire view for the new pan position
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    updateTransform() {
        this.transform = toSVG(this.transformationMatrix);
    }
    /**
     * Node was clicked
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    onClick(event, originalEvent) {
        event.origEvent = originalEvent;
        this.select.emit(event);
    }
    /**
     * Node was clicked
     *
     * @param {?} event
     * @param {?} originalEvent
     * @return {?}
     */
    onDoubleClick(event, originalEvent) {
        event.origEvent = originalEvent;
        event.isDoubleClick = true;
        this.select.emit(event);
    }
    /**
     * Node was focused
     *
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onActivate(event) {
        if (this.activeEntries.indexOf(event) > -1) {
            return;
        }
        this.activeEntries = [event, ...this.activeEntries];
        this.activate.emit({ value: event, entries: this.activeEntries });
    }
    /**
     * Node was defocused
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onDeactivate(event) {
        /** @type {?} */
        const idx = this.activeEntries.indexOf(event);
        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];
        this.deactivate.emit({ value: event, entries: this.activeEntries });
    }
    /**
     * Get the domain series for the nodes
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    getSeriesDomain() {
        return this.nodes
            .map(d => this.groupResultsBy(d))
            .reduce((nodes, node) => (nodes.indexOf(node) !== -1 ? nodes : nodes.concat([node])), [])
            .sort();
    }
    /**
     * Tracking for the link
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} link
     * @return {?}
     */
    trackLinkBy(index, link) {
        return link.id;
    }
    /**
     * Tracking for the node
     *
     *
     * \@memberOf GraphComponent
     * @param {?} index
     * @param {?} node
     * @return {?}
     */
    trackNodeBy(index, node) {
        return node.id;
    }
    /**
     * Sets the colors the nodes
     *
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    setColors() {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.seriesDomain, this.customColors);
    }
    /**
     * Gets the legend options
     *
     * \@memberOf GraphComponent
     * @return {?}
     */
    getLegendOptions() {
        return {
            scaleType: 'ordinal',
            domain: this.seriesDomain,
            colors: this.colors
        };
    }
    /**
     * On mouse move event, used for panning and dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} $event
     * @return {?}
     */
    onMouseMove($event) {
        if (this.isPanning && this.panningEnabled) {
            this.onPan($event);
        }
        else if (this.isDragging && this.draggingEnabled) {
            this.onDrag($event);
        }
    }
    /**
     * On touch start event to enable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onTouchStart(event) {
        this._touchLastX = event.changedTouches[0].clientX;
        this._touchLastY = event.changedTouches[0].clientY;
        this.isPanning = true;
    }
    /**
     * On touch move event, used for panning.
     *
     * @param {?} $event
     * @return {?}
     */
    onTouchMove($event) {
        if (this.isPanning && this.panningEnabled) {
            /** @type {?} */
            const clientX = $event.changedTouches[0].clientX;
            /** @type {?} */
            const clientY = $event.changedTouches[0].clientY;
            /** @type {?} */
            const movementX = clientX - this._touchLastX;
            /** @type {?} */
            const movementY = clientY - this._touchLastY;
            this._touchLastX = clientX;
            this._touchLastY = clientY;
            this.pan(movementX, movementY);
        }
    }
    /**
     * On touch end event to disable panning.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onTouchEnd(event) {
        this.isPanning = false;
    }
    /**
     * On mouse up event to disable panning/dragging.
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        this.isDragging = false;
        this.isPanning = false;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragEnd) {
            this.layout.onDragEnd(this.draggingNode, event);
        }
    }
    /**
     * On node mouse down to kick off dragging
     *
     * \@memberOf GraphComponent
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    onNodeMouseDown(event, node) {
        if (!this.draggingEnabled) {
            return;
        }
        this.isDragging = true;
        this.draggingNode = node;
        if (this.layout && typeof this.layout !== 'string' && this.layout.onDragStart) {
            this.layout.onDragStart(node, event);
        }
    }
    /**
     * Center the graph in the viewport
     * @return {?}
     */
    center() {
        this.panTo(this.dims.width / 2 - (this.graphDims.width * this.zoomLevel) / 2, this.dims.height / 2 - (this.graphDims.height * this.zoomLevel) / 2);
    }
    /**
     * Zooms to fit the entier graph
     * @return {?}
     */
    zoomToFit() {
        /** @type {?} */
        const heightZoom = this.dims.height / this.graphDims.height;
        /** @type {?} */
        const widthZoom = this.dims.width / this.graphDims.width;
        /** @type {?} */
        const zoomLevel = Math.min(heightZoom, widthZoom, 1);
        if (zoomLevel !== this.zoomLevel) {
            this.zoomLevel = zoomLevel;
            this.updateTransform();
        }
    }
}
GraphComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-graph',
                styles: [`.graph{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.graph .edge{stroke:#666;fill:none}.graph .edge .edge-label{stroke:none;font-size:12px;fill:#251e1e}.graph .panning-rect{fill:transparent;cursor:move}.graph .node-group .node:focus{outline:0}.graph .cluster rect{opacity:.2}`],
                template: `
  <ngx-charts-chart [view]="[width, height]" [showLegend]="legend" [legendOptions]="legendOptions" (legendLabelClick)="onClick($event, undefined)"
  (legendLabelActivate)="onActivate($event)" (legendLabelDeactivate)="onDeactivate($event)" mouseWheel (mouseWheelUp)="onZoom($event, 'in')"
  (mouseWheelDown)="onZoom($event, 'out')">
  <svg:g *ngIf="initialized && graph" [attr.transform]="transform" (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)"
    class="graph chart">
    <defs>
      <ng-template *ngIf="defsTemplate" [ngTemplateOutlet]="defsTemplate">
      </ng-template>
      <svg:path class="text-path" *ngFor="let link of graph.edges" [attr.d]="link.textPath" [attr.id]="link.id">
      </svg:path>
    </defs>
    <svg:rect class="panning-rect" [attr.width]="dims.width * 100" [attr.height]="dims.height * 100" [attr.transform]="'translate(' + ((-dims.width || 0) * 50) +',' + ((-dims.height || 0) *50) + ')' "
      (mousedown)="isPanning = true" />
      <svg:g class="clusters">
        <svg:g #clusterElement *ngFor="let node of graph.clusters; trackBy: trackNodeBy" class="node-group" [id]="node.id" [attr.transform]="node.transform"
          (click)="onClick(node,$event)">
          <ng-template *ngIf="clusterTemplate" [ngTemplateOutlet]="clusterTemplate" [ngTemplateOutletContext]="{ $implicit: node }">
          </ng-template>
          <svg:g *ngIf="!clusterTemplate" class="node cluster">
            <svg:rect [attr.width]="node.dimension.width" [attr.height]="node.dimension.height" [attr.fill]="node.data?.color" />
            <svg:text alignment-baseline="central" [attr.x]="10" [attr.y]="node.dimension.height / 2">{{node.label}}</svg:text>
          </svg:g>
        </svg:g>
      </svg:g>
      <svg:g class="links">
      <svg:g #linkElement *ngFor="let link of graph.edges; trackBy: trackLinkBy" class="link-group" [id]="link.id">
        <ng-template *ngIf="linkTemplate" [ngTemplateOutlet]="linkTemplate" [ngTemplateOutletContext]="{ $implicit: link }">
        </ng-template>
        <svg:path *ngIf="!linkTemplate" class="edge" [attr.d]="link.line" />
      </svg:g>
    </svg:g>
    <svg:g class="nodes">
      <svg:g #nodeElement *ngFor="let node of graph.nodes; trackBy: trackNodeBy" class="node-group" [id]="node.id" [attr.transform]="node.transform"
        (click)="onClick(node,$event)" (mousedown)="onNodeMouseDown($event, node)" (dblclick)="onDoubleClick(node,$event)">
        <ng-template *ngIf="nodeTemplate" [ngTemplateOutlet]="nodeTemplate" [ngTemplateOutletContext]="{ $implicit: node }">
        </ng-template>
        <svg:circle *ngIf="!nodeTemplate" r="10" [attr.cx]="node.dimension.width / 2" [attr.cy]="node.dimension.height / 2" [attr.fill]="node.data?.color"
        />
      </svg:g>
    </svg:g>
  </svg:g>
</ngx-charts-chart>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [trigger('link', [transition('* => *', [animate(500, style({ transform: '*' }))])])]
            },] },
];
/** @nocollapse */
GraphComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: LayoutService }
];
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
class MouseWheelDirective {
    constructor() {
        this.mouseWheelUp = new EventEmitter();
        this.mouseWheelDown = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelChrome(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelFirefox(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelIE(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    mouseWheelFunc(event) {
        if (window.event) {
            event = window.event;
        }
        /** @type {?} */
        const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
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
    }
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GraphModule {
}
GraphModule.decorators = [
    { type: NgModule, args: [{
                imports: [ChartCommonModule],
                declarations: [GraphComponent, MouseWheelDirective],
                exports: [GraphComponent, MouseWheelDirective],
                providers: [LayoutService]
            },] },
];

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
class NgxGraphModule {
}
NgxGraphModule.decorators = [
    { type: NgModule, args: [{
                imports: [NgxChartsModule],
                exports: [GraphModule]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxGraphModule, GraphComponent as ɵa, GraphModule as ɵb, LayoutService as ɵc, MouseWheelDirective as ɵd };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWdyYXBoLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi91dGlscy9pZC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbGF5b3V0cy9kYWdyZUNsdXN0ZXIudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvZGFncmVOb2Rlc09ubHkudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2xheW91dHMvbGF5b3V0LnNlcnZpY2UudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL2dyYXBoL2dyYXBoLmNvbXBvbmVudC50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC9saWIvZ3JhcGgvbW91c2Utd2hlZWwuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoL2xpYi9ncmFwaC9ncmFwaC5tb2R1bGUudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZ3JhcGgvbGliL25neC1ncmFwaC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY2FjaGUgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBzaG9ydCBpZC5cclxuICpcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpZCgpOiBzdHJpbmcge1xyXG4gIGxldCBuZXdJZCA9ICgnMDAwMCcgKyAoKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygzNiwgNCkpIDw8IDApLnRvU3RyaW5nKDM2KSkuc2xpY2UoLTQpO1xyXG5cclxuICBuZXdJZCA9IGBhJHtuZXdJZH1gO1xyXG5cclxuICAvLyBlbnN1cmUgbm90IGFscmVhZHkgdXNlZFxyXG4gIGlmICghY2FjaGVbbmV3SWRdKSB7XHJcbiAgICBjYWNoZVtuZXdJZF0gPSB0cnVlO1xyXG4gICAgcmV0dXJuIG5ld0lkO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlkKCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheW91dC5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi91dGlscy9pZCc7XHJcbmltcG9ydCAqIGFzIGRhZ3JlIGZyb20gJ2RhZ3JlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuXHJcbmV4cG9ydCBlbnVtIE9yaWVudGF0aW9uIHtcclxuICBMRUZUX1RPX1JJR0hUID0gJ0xSJyxcclxuICBSSUdIVF9UT19MRUZUID0gJ1JMJyxcclxuICBUT1BfVE9fQk9UVE9NID0gJ1RCJyxcclxuICBCT1RUT01fVE9fVE9NID0gJ0JUJ1xyXG59XHJcbmV4cG9ydCBlbnVtIEFsaWdubWVudCB7XHJcbiAgQ0VOVEVSID0gJ0MnLFxyXG4gIFVQX0xFRlQgPSAnVUwnLFxyXG4gIFVQX1JJR0hUID0gJ1VSJyxcclxuICBET1dOX0xFRlQgPSAnREwnLFxyXG4gIERPV05fUklHSFQgPSAnRFInXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVTZXR0aW5ncyB7XHJcbiAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbjtcclxuICBtYXJnaW5YPzogbnVtYmVyO1xyXG4gIG1hcmdpblk/OiBudW1iZXI7XHJcbiAgZWRnZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgcmFua1BhZGRpbmc/OiBudW1iZXI7XHJcbiAgbm9kZVBhZGRpbmc/OiBudW1iZXI7XHJcbiAgYWxpZ24/OiBBbGlnbm1lbnQ7XHJcbiAgYWN5Y2xpY2VyPzogJ2dyZWVkeScgfCB1bmRlZmluZWQ7XHJcbiAgcmFua2VyPzogJ25ldHdvcmstc2ltcGxleCcgfCAndGlnaHQtdHJlZScgfCAnbG9uZ2VzdC1wYXRoJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERhZ3JlTGF5b3V0IGltcGxlbWVudHMgTGF5b3V0IHtcclxuICBkZWZhdWx0U2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7XHJcbiAgICBvcmllbnRhdGlvbjogT3JpZW50YXRpb24uTEVGVF9UT19SSUdIVCxcclxuICAgIG1hcmdpblg6IDIwLFxyXG4gICAgbWFyZ2luWTogMjAsXHJcbiAgICBlZGdlUGFkZGluZzogMTAwLFxyXG4gICAgcmFua1BhZGRpbmc6IDEwMCxcclxuICAgIG5vZGVQYWRkaW5nOiA1MFxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IERhZ3JlU2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgZGFncmVHcmFwaDogYW55O1xyXG4gIGRhZ3JlTm9kZXM6IGFueTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcclxuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcclxuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiBkYWdyZU5vZGUueCxcclxuICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICB9O1xyXG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUVkZ2UoZ3JhcGg6IEdyYXBoLCBlZGdlOiBFZGdlKTogR3JhcGgge1xyXG4gICAgY29uc3Qgc291cmNlTm9kZSA9IGdyYXBoLm5vZGVzLmZpbmQobiA9PiBuLmlkID09PSBlZGdlLnNvdXJjZSk7XHJcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2UudGFyZ2V0KTtcclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgbmV3IGFycm93IHBvc2l0aW9uXHJcbiAgICBjb25zdCBkaXIgPSBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbi55ID8gLTEgOiAxO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdQb2ludCA9IHtcclxuICAgICAgeDogc291cmNlTm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiBzb3VyY2VOb2RlLnBvc2l0aW9uLnkgLSBkaXIgKiAoc291cmNlTm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcbiAgICBjb25zdCBlbmRpbmdQb2ludCA9IHtcclxuICAgICAgeDogdGFyZ2V0Tm9kZS5wb3NpdGlvbi54LFxyXG4gICAgICB5OiB0YXJnZXROb2RlLnBvc2l0aW9uLnkgKyBkaXIgKiAodGFyZ2V0Tm9kZS5kaW1lbnNpb24uaGVpZ2h0IC8gMilcclxuICAgIH07XHJcblxyXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xyXG4gICAgZWRnZS5wb2ludHMgPSBbc3RhcnRpbmdQb2ludCwgZW5kaW5nUG9pbnRdO1xyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlRGFncmVHcmFwaChncmFwaDogR3JhcGgpOiBhbnkge1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoID0gbmV3IGRhZ3JlLmdyYXBobGliLkdyYXBoKCk7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXRHcmFwaCh7XHJcbiAgICAgIHJhbmtkaXI6IHNldHRpbmdzLm9yaWVudGF0aW9uLFxyXG4gICAgICBtYXJnaW54OiBzZXR0aW5ncy5tYXJnaW5YLFxyXG4gICAgICBtYXJnaW55OiBzZXR0aW5ncy5tYXJnaW5ZLFxyXG4gICAgICBlZGdlc2VwOiBzZXR0aW5ncy5lZGdlUGFkZGluZyxcclxuICAgICAgcmFua3NlcDogc2V0dGluZ3MucmFua1BhZGRpbmcsXHJcbiAgICAgIG5vZGVzZXA6IHNldHRpbmdzLm5vZGVQYWRkaW5nLFxyXG4gICAgICBhbGlnbjogc2V0dGluZ3MuYWxpZ24sXHJcbiAgICAgIGFjeWNsaWNlcjogc2V0dGluZ3MuYWN5Y2xpY2VyLFxyXG4gICAgICByYW5rZXI6IHNldHRpbmdzLnJhbmtlclxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVmYXVsdCB0byBhc3NpZ25pbmcgYSBuZXcgb2JqZWN0IGFzIGEgbGFiZWwgZm9yIGVhY2ggbmV3IGVkZ2UuXHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RGVmYXVsdEVkZ2VMYWJlbCgoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLyogZW1wdHkgKi9cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVOb2RlcyA9IGdyYXBoLm5vZGVzLm1hcChuID0+IHtcclxuICAgICAgY29uc3Qgbm9kZTogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbik7XHJcbiAgICAgIG5vZGUud2lkdGggPSBuLmRpbWVuc2lvbi53aWR0aDtcclxuICAgICAgbm9kZS5oZWlnaHQgPSBuLmRpbWVuc2lvbi5oZWlnaHQ7XHJcbiAgICAgIG5vZGUueCA9IG4ucG9zaXRpb24ueDtcclxuICAgICAgbm9kZS55ID0gbi5wb3NpdGlvbi55O1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGFncmVFZGdlcyA9IGdyYXBoLmVkZ2VzLm1hcChsID0+IHtcclxuICAgICAgY29uc3QgbmV3TGluazogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgbCk7XHJcbiAgICAgIGlmICghbmV3TGluay5pZCkge1xyXG4gICAgICAgIG5ld0xpbmsuaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuZXdMaW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZGFncmVOb2Rlcykge1xyXG4gICAgICBpZiAoIW5vZGUud2lkdGgpIHtcclxuICAgICAgICBub2RlLndpZHRoID0gMjA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFub2RlLmhlaWdodCkge1xyXG4gICAgICAgIG5vZGUuaGVpZ2h0ID0gMzA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShub2RlLmlkLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgIGZvciAoY29uc3QgZWRnZSBvZiB0aGlzLmRhZ3JlRWRnZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldEVkZ2UoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kYWdyZUdyYXBoO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgR3JhcGggfSBmcm9tICcuLi8uLi9tb2RlbHMvZ3JhcGgubW9kZWwnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uLy4uL3V0aWxzL2lkJztcclxuaW1wb3J0ICogYXMgZGFncmUgZnJvbSAnZGFncmUnO1xyXG5pbXBvcnQgeyBFZGdlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOb2RlLCBDbHVzdGVyTm9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9ub2RlLm1vZGVsJztcclxuaW1wb3J0IHsgRGFncmVTZXR0aW5ncywgT3JpZW50YXRpb24gfSBmcm9tICcuL2RhZ3JlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdyZUNsdXN0ZXJMYXlvdXQgaW1wbGVtZW50cyBMYXlvdXQge1xyXG4gIGRlZmF1bHRTZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHtcclxuICAgIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbi5MRUZUX1RPX1JJR0hULFxyXG4gICAgbWFyZ2luWDogMjAsXHJcbiAgICBtYXJnaW5ZOiAyMCxcclxuICAgIGVkZ2VQYWRkaW5nOiAxMDAsXHJcbiAgICByYW5rUGFkZGluZzogMTAwLFxyXG4gICAgbm9kZVBhZGRpbmc6IDUwXHJcbiAgfTtcclxuICBzZXR0aW5nczogRGFncmVTZXR0aW5ncyA9IHt9O1xyXG5cclxuICBkYWdyZUdyYXBoOiBhbnk7XHJcbiAgZGFncmVOb2RlczogTm9kZVtdO1xyXG4gIGRhZ3JlQ2x1c3RlcnM6IENsdXN0ZXJOb2RlW107XHJcbiAgZGFncmVFZGdlczogYW55O1xyXG5cclxuICBydW4oZ3JhcGg6IEdyYXBoKTogR3JhcGgge1xyXG4gICAgdGhpcy5jcmVhdGVEYWdyZUdyYXBoKGdyYXBoKTtcclxuICAgIGRhZ3JlLmxheW91dCh0aGlzLmRhZ3JlR3JhcGgpO1xyXG5cclxuICAgIGdyYXBoLmVkZ2VMYWJlbHMgPSB0aGlzLmRhZ3JlR3JhcGguX2VkZ2VMYWJlbHM7XHJcblxyXG4gICAgY29uc3QgZGFncmVUb091dHB1dCA9IG5vZGUgPT4ge1xyXG4gICAgICBjb25zdCBkYWdyZU5vZGUgPSB0aGlzLmRhZ3JlR3JhcGguX25vZGVzW25vZGUuaWRdO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLm5vZGUsXHJcbiAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgIHg6IGRhZ3JlTm9kZS54LFxyXG4gICAgICAgICAgeTogZGFncmVOb2RlLnlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpbWVuc2lvbjoge1xyXG4gICAgICAgICAgd2lkdGg6IGRhZ3JlTm9kZS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgICBncmFwaC5jbHVzdGVycyA9IChncmFwaC5jbHVzdGVycyB8fCBbXSkubWFwKGRhZ3JlVG9PdXRwdXQpO1xyXG4gICAgZ3JhcGgubm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAoZGFncmVUb091dHB1dCk7XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG5cclxuICAgIC8vIGRldGVybWluZSBuZXcgYXJyb3cgcG9zaXRpb25cclxuICAgIGNvbnN0IGRpciA9IHNvdXJjZU5vZGUucG9zaXRpb24ueSA8PSB0YXJnZXROb2RlLnBvc2l0aW9uLnkgPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiBzb3VyY2VOb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHNvdXJjZU5vZGUucG9zaXRpb24ueSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVuZGluZ1BvaW50ID0ge1xyXG4gICAgICB4OiB0YXJnZXROb2RlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRhcmdldE5vZGUucG9zaXRpb24ueSArIGRpciAqICh0YXJnZXROb2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyKVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBuZXcgcG9pbnRzXHJcbiAgICBlZGdlLnBvaW50cyA9IFtzdGFydGluZ1BvaW50LCBlbmRpbmdQb2ludF07XHJcbiAgICByZXR1cm4gZ3JhcGg7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVEYWdyZUdyYXBoKGdyYXBoOiBHcmFwaCk6IGFueSB7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGggPSBuZXcgZGFncmUuZ3JhcGhsaWIuR3JhcGgoeyBjb21wb3VuZDogdHJ1ZSB9KTtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldEdyYXBoKHtcclxuICAgICAgcmFua2Rpcjogc2V0dGluZ3Mub3JpZW50YXRpb24sXHJcbiAgICAgIG1hcmdpbng6IHNldHRpbmdzLm1hcmdpblgsXHJcbiAgICAgIG1hcmdpbnk6IHNldHRpbmdzLm1hcmdpblksXHJcbiAgICAgIGVkZ2VzZXA6IHNldHRpbmdzLmVkZ2VQYWRkaW5nLFxyXG4gICAgICByYW5rc2VwOiBzZXR0aW5ncy5yYW5rUGFkZGluZyxcclxuICAgICAgbm9kZXNlcDogc2V0dGluZ3Mubm9kZVBhZGRpbmcsXHJcbiAgICAgIGFsaWduOiBzZXR0aW5ncy5hbGlnbixcclxuICAgICAgYWN5Y2xpY2VyOiBzZXR0aW5ncy5hY3ljbGljZXIsXHJcbiAgICAgIHJhbmtlcjogc2V0dGluZ3MucmFua2VyXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IHRvIGFzc2lnbmluZyBhIG5ldyBvYmplY3QgYXMgYSBsYWJlbCBmb3IgZWFjaCBuZXcgZWRnZS5cclxuICAgIHRoaXMuZGFncmVHcmFwaC5zZXREZWZhdWx0RWRnZUxhYmVsKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvKiBlbXB0eSAqL1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kYWdyZU5vZGVzID0gZ3JhcGgubm9kZXMubWFwKChuOiBOb2RlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xyXG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XHJcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xyXG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XHJcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlQ2x1c3RlcnMgPSBncmFwaC5jbHVzdGVycyB8fCBbXTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcclxuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3TGluaztcclxuICAgIH0pO1xyXG5cclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBjbHVzdGVyIG9mIHRoaXMuZGFncmVDbHVzdGVycykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0Tm9kZShjbHVzdGVyLmlkLCBjbHVzdGVyKTtcclxuICAgICAgY2x1c3Rlci5jaGlsZE5vZGVJZHMuZm9yRWFjaChjaGlsZE5vZGVJZCA9PiB7XHJcbiAgICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldFBhcmVudChjaGlsZE5vZGVJZCwgY2x1c3Rlci5pZCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYWdyZVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIHRoaXMuZGFncmVFZGdlcykge1xyXG4gICAgICB0aGlzLmRhZ3JlR3JhcGguc2V0RWRnZShlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRhZ3JlR3JhcGg7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBHcmFwaCB9IGZyb20gJy4uLy4uL21vZGVscy9ncmFwaC5tb2RlbCc7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgKiBhcyBkYWdyZSBmcm9tICdkYWdyZSc7XHJcbmltcG9ydCB7IEVkZ2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRnZS5tb2RlbCc7XHJcblxyXG5leHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XHJcbiAgTEVGVF9UT19SSUdIVCA9ICdMUicsXHJcbiAgUklHSFRfVE9fTEVGVCA9ICdSTCcsXHJcbiAgVE9QX1RPX0JPVFRPTSA9ICdUQicsXHJcbiAgQk9UVE9NX1RPX1RPTSA9ICdCVCdcclxufVxyXG5leHBvcnQgZW51bSBBbGlnbm1lbnQge1xyXG4gIENFTlRFUiA9ICdDJyxcclxuICBVUF9MRUZUID0gJ1VMJyxcclxuICBVUF9SSUdIVCA9ICdVUicsXHJcbiAgRE9XTl9MRUZUID0gJ0RMJyxcclxuICBET1dOX1JJR0hUID0gJ0RSJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERhZ3JlU2V0dGluZ3Mge1xyXG4gIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb247XHJcbiAgbWFyZ2luWD86IG51bWJlcjtcclxuICBtYXJnaW5ZPzogbnVtYmVyO1xyXG4gIGVkZ2VQYWRkaW5nPzogbnVtYmVyO1xyXG4gIHJhbmtQYWRkaW5nPzogbnVtYmVyO1xyXG4gIG5vZGVQYWRkaW5nPzogbnVtYmVyO1xyXG4gIGFsaWduPzogQWxpZ25tZW50O1xyXG4gIGFjeWNsaWNlcj86ICdncmVlZHknIHwgdW5kZWZpbmVkO1xyXG4gIHJhbmtlcj86ICduZXR3b3JrLXNpbXBsZXgnIHwgJ3RpZ2h0LXRyZWUnIHwgJ2xvbmdlc3QtcGF0aCc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFncmVOb2Rlc09ubHlTZXR0aW5ncyBleHRlbmRzIERhZ3JlU2V0dGluZ3Mge1xyXG4gIGN1cnZlRGlzdGFuY2U/OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfRURHRV9OQU1FID0gJ1xceDAwJztcclxuY29uc3QgR1JBUEhfTk9ERSA9ICdcXHgwMCc7XHJcbmNvbnN0IEVER0VfS0VZX0RFTElNID0gJ1xceDAxJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdyZU5vZGVzT25seUxheW91dCBpbXBsZW1lbnRzIExheW91dCB7XHJcbiAgZGVmYXVsdFNldHRpbmdzOiBEYWdyZU5vZGVzT25seVNldHRpbmdzID0ge1xyXG4gICAgb3JpZW50YXRpb246IE9yaWVudGF0aW9uLkxFRlRfVE9fUklHSFQsXHJcbiAgICBtYXJnaW5YOiAyMCxcclxuICAgIG1hcmdpblk6IDIwLFxyXG4gICAgZWRnZVBhZGRpbmc6IDEwMCxcclxuICAgIHJhbmtQYWRkaW5nOiAxMDAsXHJcbiAgICBub2RlUGFkZGluZzogNTAsXHJcbiAgICBjdXJ2ZURpc3RhbmNlOiAyMFxyXG4gIH07XHJcbiAgc2V0dGluZ3M6IERhZ3JlTm9kZXNPbmx5U2V0dGluZ3MgPSB7fTtcclxuXHJcbiAgZGFncmVHcmFwaDogYW55O1xyXG4gIGRhZ3JlTm9kZXM6IGFueTtcclxuICBkYWdyZUVkZ2VzOiBhbnk7XHJcblxyXG4gIHJ1bihncmFwaDogR3JhcGgpOiBHcmFwaCB7XHJcbiAgICB0aGlzLmNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGgpO1xyXG4gICAgZGFncmUubGF5b3V0KHRoaXMuZGFncmVHcmFwaCk7XHJcblxyXG4gICAgZ3JhcGguZWRnZUxhYmVscyA9IHRoaXMuZGFncmVHcmFwaC5fZWRnZUxhYmVscztcclxuXHJcbiAgICBmb3IgKGNvbnN0IGRhZ3JlTm9kZUlkIGluIHRoaXMuZGFncmVHcmFwaC5fbm9kZXMpIHtcclxuICAgICAgY29uc3QgZGFncmVOb2RlID0gdGhpcy5kYWdyZUdyYXBoLl9ub2Rlc1tkYWdyZU5vZGVJZF07XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZGFncmVOb2RlLmlkKTtcclxuICAgICAgbm9kZS5wb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiBkYWdyZU5vZGUueCxcclxuICAgICAgICB5OiBkYWdyZU5vZGUueVxyXG4gICAgICB9O1xyXG4gICAgICBub2RlLmRpbWVuc2lvbiA9IHtcclxuICAgICAgICB3aWR0aDogZGFncmVOb2RlLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogZGFncmVOb2RlLmhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBlZGdlIG9mIGdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRWRnZShncmFwaCwgZWRnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdyYXBoO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRWRnZShncmFwaDogR3JhcGgsIGVkZ2U6IEVkZ2UpOiBHcmFwaCB7XHJcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IGVkZ2Uuc291cmNlKTtcclxuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBncmFwaC5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gZWRnZS50YXJnZXQpO1xyXG4gICAgY29uc3QgcmFua0F4aXM6ICd4JyB8ICd5JyA9IHRoaXMuc2V0dGluZ3Mub3JpZW50YXRpb24gPT09ICdCVCcgfHwgdGhpcy5zZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ1RCJyA/ICd5JyA6ICd4JztcclxuICAgIGNvbnN0IG9yZGVyQXhpczogJ3gnIHwgJ3knID0gcmFua0F4aXMgPT09ICd5JyA/ICd4JyA6ICd5JztcclxuICAgIGNvbnN0IHJhbmtEaW1lbnNpb24gPSByYW5rQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gICAgLy8gZGV0ZXJtaW5lIG5ldyBhcnJvdyBwb3NpdGlvblxyXG4gICAgY29uc3QgZGlyID0gc291cmNlTm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPD0gdGFyZ2V0Tm9kZS5wb3NpdGlvbltyYW5rQXhpc10gPyAtMSA6IDE7XHJcbiAgICBjb25zdCBzdGFydGluZ1BvaW50ID0ge1xyXG4gICAgICBbb3JkZXJBeGlzXTogc291cmNlTm9kZS5wb3NpdGlvbltvcmRlckF4aXNdLFxyXG4gICAgICBbcmFua0F4aXNdOiBzb3VyY2VOb2RlLnBvc2l0aW9uW3JhbmtBeGlzXSAtIGRpciAqIChzb3VyY2VOb2RlLmRpbWVuc2lvbltyYW5rRGltZW5zaW9uXSAvIDIpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW5kaW5nUG9pbnQgPSB7XHJcbiAgICAgIFtvcmRlckF4aXNdOiB0YXJnZXROb2RlLnBvc2l0aW9uW29yZGVyQXhpc10sXHJcbiAgICAgIFtyYW5rQXhpc106IHRhcmdldE5vZGUucG9zaXRpb25bcmFua0F4aXNdICsgZGlyICogKHRhcmdldE5vZGUuZGltZW5zaW9uW3JhbmtEaW1lbnNpb25dIC8gMilcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgY3VydmVEaXN0YW5jZSA9IHRoaXMuc2V0dGluZ3MuY3VydmVEaXN0YW5jZSB8fCB0aGlzLmRlZmF1bHRTZXR0aW5ncy5jdXJ2ZURpc3RhbmNlO1xyXG4gICAgLy8gZ2VuZXJhdGUgbmV3IHBvaW50c1xyXG4gICAgZWRnZS5wb2ludHMgPSBbXHJcbiAgICAgIHN0YXJ0aW5nUG9pbnQsXHJcbiAgICAgIHtcclxuICAgICAgICBbb3JkZXJBeGlzXTogc3RhcnRpbmdQb2ludFtvcmRlckF4aXNdLFxyXG4gICAgICAgIFtyYW5rQXhpc106IHN0YXJ0aW5nUG9pbnRbcmFua0F4aXNdIC0gZGlyICogY3VydmVEaXN0YW5jZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgW29yZGVyQXhpc106IGVuZGluZ1BvaW50W29yZGVyQXhpc10sXHJcbiAgICAgICAgW3JhbmtBeGlzXTogZW5kaW5nUG9pbnRbcmFua0F4aXNdICsgZGlyICogY3VydmVEaXN0YW5jZVxyXG4gICAgICB9LFxyXG4gICAgICBlbmRpbmdQb2ludFxyXG4gICAgXTtcclxuICAgIGNvbnN0IGVkZ2VMYWJlbElkID0gYCR7ZWRnZS5zb3VyY2V9JHtFREdFX0tFWV9ERUxJTX0ke2VkZ2UudGFyZ2V0fSR7RURHRV9LRVlfREVMSU19JHtERUZBVUxUX0VER0VfTkFNRX1gO1xyXG4gICAgY29uc3QgbWF0Y2hpbmdFZGdlTGFiZWwgPSBncmFwaC5lZGdlTGFiZWxzW2VkZ2VMYWJlbElkXTtcclxuICAgIGlmIChtYXRjaGluZ0VkZ2VMYWJlbCkge1xyXG4gICAgICBtYXRjaGluZ0VkZ2VMYWJlbC5wb2ludHMgPSBlZGdlLnBvaW50cztcclxuICAgIH1cclxuICAgIHJldHVybiBncmFwaDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZURhZ3JlR3JhcGgoZ3JhcGg6IEdyYXBoKTogYW55IHtcclxuICAgIHRoaXMuZGFncmVHcmFwaCA9IG5ldyBkYWdyZS5ncmFwaGxpYi5HcmFwaCgpO1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICB0aGlzLmRhZ3JlR3JhcGguc2V0R3JhcGgoe1xyXG4gICAgICByYW5rZGlyOiBzZXR0aW5ncy5vcmllbnRhdGlvbixcclxuICAgICAgbWFyZ2lueDogc2V0dGluZ3MubWFyZ2luWCxcclxuICAgICAgbWFyZ2lueTogc2V0dGluZ3MubWFyZ2luWSxcclxuICAgICAgZWRnZXNlcDogc2V0dGluZ3MuZWRnZVBhZGRpbmcsXHJcbiAgICAgIHJhbmtzZXA6IHNldHRpbmdzLnJhbmtQYWRkaW5nLFxyXG4gICAgICBub2Rlc2VwOiBzZXR0aW5ncy5ub2RlUGFkZGluZyxcclxuICAgICAgYWxpZ246IHNldHRpbmdzLmFsaWduLFxyXG4gICAgICBhY3ljbGljZXI6IHNldHRpbmdzLmFjeWNsaWNlcixcclxuICAgICAgcmFua2VyOiBzZXR0aW5ncy5yYW5rZXJcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIERlZmF1bHQgdG8gYXNzaWduaW5nIGEgbmV3IG9iamVjdCBhcyBhIGxhYmVsIGZvciBlYWNoIG5ldyBlZGdlLlxyXG4gICAgdGhpcy5kYWdyZUdyYXBoLnNldERlZmF1bHRFZGdlTGFiZWwoKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8qIGVtcHR5ICovXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlTm9kZXMgPSBncmFwaC5ub2Rlcy5tYXAobiA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIG4pO1xyXG4gICAgICBub2RlLndpZHRoID0gbi5kaW1lbnNpb24ud2lkdGg7XHJcbiAgICAgIG5vZGUuaGVpZ2h0ID0gbi5kaW1lbnNpb24uaGVpZ2h0O1xyXG4gICAgICBub2RlLnggPSBuLnBvc2l0aW9uLng7XHJcbiAgICAgIG5vZGUueSA9IG4ucG9zaXRpb24ueTtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhZ3JlRWRnZXMgPSBncmFwaC5lZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbms6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGwpO1xyXG4gICAgICBpZiAoIW5ld0xpbmsuaWQpIHtcclxuICAgICAgICBuZXdMaW5rLmlkID0gaWQoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3TGluaztcclxuICAgIH0pO1xyXG5cclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmRhZ3JlTm9kZXMpIHtcclxuICAgICAgaWYgKCFub2RlLndpZHRoKSB7XHJcbiAgICAgICAgbm9kZS53aWR0aCA9IDIwO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbm9kZS5oZWlnaHQpIHtcclxuICAgICAgICBub2RlLmhlaWdodCA9IDMwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB1cGRhdGUgZGFncmVcclxuICAgICAgdGhpcy5kYWdyZUdyYXBoLnNldE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGRhZ3JlXHJcbiAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgdGhpcy5kYWdyZUVkZ2VzKSB7XHJcbiAgICAgIHRoaXMuZGFncmVHcmFwaC5zZXRFZGdlKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGFncmVHcmFwaDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5b3V0Lm1vZGVsJztcclxuaW1wb3J0IHsgRGFncmVMYXlvdXQgfSBmcm9tICcuL2RhZ3JlJztcclxuaW1wb3J0IHsgRGFncmVDbHVzdGVyTGF5b3V0IH0gZnJvbSAnLi9kYWdyZUNsdXN0ZXInO1xyXG5pbXBvcnQgeyBEYWdyZU5vZGVzT25seUxheW91dCB9IGZyb20gJy4vZGFncmVOb2Rlc09ubHknO1xyXG5cclxuY29uc3QgbGF5b3V0cyA9IHtcclxuICBkYWdyZTogRGFncmVMYXlvdXQsXHJcbiAgZGFncmVDbHVzdGVyOiBEYWdyZUNsdXN0ZXJMYXlvdXQsXHJcbiAgZGFncmVOb2Rlc09ubHk6IERhZ3JlTm9kZXNPbmx5TGF5b3V0LFxyXG59O1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTGF5b3V0U2VydmljZSB7XHJcbiAgZ2V0TGF5b3V0KG5hbWU6IHN0cmluZyk6IExheW91dCB7XHJcbiAgICBpZiAobGF5b3V0c1tuYW1lXSkge1xyXG4gICAgICByZXR1cm4gbmV3IGxheW91dHNbbmFtZV0oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBsYXlvdXQgdHlwZSAnJHtuYW1lfSdgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gcmVuYW1lIHRyYW5zaXRpb24gZHVlIHRvIGNvbmZsaWN0IHdpdGggZDMgdHJhbnNpdGlvblxyXG5pbXBvcnQgeyBhbmltYXRlLCBzdHlsZSwgdHJhbnNpdGlvbiBhcyBuZ1RyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBDb250ZW50Q2hpbGQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsXHJcbiAgT3V0cHV0LFxyXG4gIFF1ZXJ5TGlzdCxcclxuICBUZW1wbGF0ZVJlZixcclxuICBWaWV3Q2hpbGQsXHJcbiAgVmlld0NoaWxkcmVuLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG4gIE5nWm9uZSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBPbkNoYW5nZXMsXHJcbiAgU2ltcGxlQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEJhc2VDaGFydENvbXBvbmVudCxcclxuICBDaGFydENvbXBvbmVudCxcclxuICBDb2xvckhlbHBlcixcclxuICBWaWV3RGltZW5zaW9ucyxcclxuICBjYWxjdWxhdGVWaWV3RGltZW5zaW9uc1xyXG59IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0ICogYXMgc2hhcGUgZnJvbSAnZDMtc2hhcGUnO1xyXG5pbXBvcnQgJ2QzLXRyYW5zaXRpb24nO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBpZGVudGl0eSwgc2NhbGUsIHRvU1ZHLCB0cmFuc2Zvcm0sIHRyYW5zbGF0ZSB9IGZyb20gJ3RyYW5zZm9ybWF0aW9uLW1hdHJpeCc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9sYXlvdXRzL2xheW91dC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRnZSB9IGZyb20gJy4uL21vZGVscy9lZGdlLm1vZGVsJztcclxuaW1wb3J0IHsgTm9kZSwgQ2x1c3Rlck5vZGUgfSBmcm9tICcuLi9tb2RlbHMvbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IEdyYXBoIH0gZnJvbSAnLi4vbW9kZWxzL2dyYXBoLm1vZGVsJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcblxyXG5jb25zb2xlLmxvZygnRUwgUkVGJywgRWxlbWVudFJlZik7XHJcblxyXG4vKipcclxuICogTWF0cml4XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE1hdHJpeCB7XHJcbiAgYTogbnVtYmVyO1xyXG4gIGI6IG51bWJlcjtcclxuICBjOiBudW1iZXI7XHJcbiAgZDogbnVtYmVyO1xyXG4gIGU6IG51bWJlcjtcclxuICBmOiBudW1iZXI7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdyYXBoJyxcclxuICBzdHlsZXM6IFtgLmdyYXBoey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZ3JhcGggLmVkZ2V7c3Ryb2tlOiM2NjY7ZmlsbDpub25lfS5ncmFwaCAuZWRnZSAuZWRnZS1sYWJlbHtzdHJva2U6bm9uZTtmb250LXNpemU6MTJweDtmaWxsOiMyNTFlMWV9LmdyYXBoIC5wYW5uaW5nLXJlY3R7ZmlsbDp0cmFuc3BhcmVudDtjdXJzb3I6bW92ZX0uZ3JhcGggLm5vZGUtZ3JvdXAgLm5vZGU6Zm9jdXN7b3V0bGluZTowfS5ncmFwaCAuY2x1c3RlciByZWN0e29wYWNpdHk6LjJ9YF0sXHJcbiAgdGVtcGxhdGU6IGBcclxuICA8bmd4LWNoYXJ0cy1jaGFydCBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIiBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIiBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCIgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQsIHVuZGVmaW5lZClcIlxyXG4gIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiIChsZWdlbmRMYWJlbERlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIiBtb3VzZVdoZWVsIChtb3VzZVdoZWVsVXApPVwib25ab29tKCRldmVudCwgJ2luJylcIlxyXG4gIChtb3VzZVdoZWVsRG93bik9XCJvblpvb20oJGV2ZW50LCAnb3V0JylcIj5cclxuICA8c3ZnOmcgKm5nSWY9XCJpbml0aWFsaXplZCAmJiBncmFwaFwiIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxyXG4gICAgY2xhc3M9XCJncmFwaCBjaGFydFwiPlxyXG4gICAgPGRlZnM+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImRlZnNUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRlZnNUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8c3ZnOnBhdGggY2xhc3M9XCJ0ZXh0LXBhdGhcIiAqbmdGb3I9XCJsZXQgbGluayBvZiBncmFwaC5lZGdlc1wiIFthdHRyLmRdPVwibGluay50ZXh0UGF0aFwiIFthdHRyLmlkXT1cImxpbmsuaWRcIj5cclxuICAgICAgPC9zdmc6cGF0aD5cclxuICAgIDwvZGVmcz5cclxuICAgIDxzdmc6cmVjdCBjbGFzcz1cInBhbm5pbmctcmVjdFwiIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKiAxMDBcIiBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKiAxMDBcIiBbYXR0ci50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZSgnICsgKCgtZGltcy53aWR0aCB8fCAwKSAqIDUwKSArJywnICsgKCgtZGltcy5oZWlnaHQgfHwgMCkgKjUwKSArICcpJyBcIlxyXG4gICAgICAobW91c2Vkb3duKT1cImlzUGFubmluZyA9IHRydWVcIiAvPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJjbHVzdGVyc1wiPlxyXG4gICAgICAgIDxzdmc6ZyAjY2x1c3RlckVsZW1lbnQgKm5nRm9yPVwibGV0IG5vZGUgb2YgZ3JhcGguY2x1c3RlcnM7IHRyYWNrQnk6IHRyYWNrTm9kZUJ5XCIgY2xhc3M9XCJub2RlLWdyb3VwXCIgW2lkXT1cIm5vZGUuaWRcIiBbYXR0ci50cmFuc2Zvcm1dPVwibm9kZS50cmFuc2Zvcm1cIlxyXG4gICAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJjbHVzdGVyVGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IG5vZGUgfVwiPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDxzdmc6ZyAqbmdJZj1cIiFjbHVzdGVyVGVtcGxhdGVcIiBjbGFzcz1cIm5vZGUgY2x1c3RlclwiPlxyXG4gICAgICAgICAgICA8c3ZnOnJlY3QgW2F0dHIud2lkdGhdPVwibm9kZS5kaW1lbnNpb24ud2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwibm9kZS5kaW1lbnNpb24uaGVpZ2h0XCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCIgLz5cclxuICAgICAgICAgICAgPHN2Zzp0ZXh0IGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIiBbYXR0ci54XT1cIjEwXCIgW2F0dHIueV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCI+e3tub2RlLmxhYmVsfX08L3N2Zzp0ZXh0PlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJsaW5rc1wiPlxyXG4gICAgICA8c3ZnOmcgI2xpbmtFbGVtZW50ICpuZ0Zvcj1cImxldCBsaW5rIG9mIGdyYXBoLmVkZ2VzOyB0cmFja0J5OiB0cmFja0xpbmtCeVwiIGNsYXNzPVwibGluay1ncm91cFwiIFtpZF09XCJsaW5rLmlkXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlua1RlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBsaW5rIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDxzdmc6cGF0aCAqbmdJZj1cIiFsaW5rVGVtcGxhdGVcIiBjbGFzcz1cImVkZ2VcIiBbYXR0ci5kXT1cImxpbmsubGluZVwiIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gICAgPHN2ZzpnIGNsYXNzPVwibm9kZXNcIj5cclxuICAgICAgPHN2ZzpnICNub2RlRWxlbWVudCAqbmdGb3I9XCJsZXQgbm9kZSBvZiBncmFwaC5ub2RlczsgdHJhY2tCeTogdHJhY2tOb2RlQnlcIiBjbGFzcz1cIm5vZGUtZ3JvdXBcIiBbaWRdPVwibm9kZS5pZFwiIFthdHRyLnRyYW5zZm9ybV09XCJub2RlLnRyYW5zZm9ybVwiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2sobm9kZSwkZXZlbnQpXCIgKG1vdXNlZG93bik9XCJvbk5vZGVNb3VzZURvd24oJGV2ZW50LCBub2RlKVwiIChkYmxjbGljayk9XCJvbkRvdWJsZUNsaWNrKG5vZGUsJGV2ZW50KVwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5vZGVUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8c3ZnOmNpcmNsZSAqbmdJZj1cIiFub2RlVGVtcGxhdGVcIiByPVwiMTBcIiBbYXR0ci5jeF09XCJub2RlLmRpbWVuc2lvbi53aWR0aCAvIDJcIiBbYXR0ci5jeV09XCJub2RlLmRpbWVuc2lvbi5oZWlnaHQgLyAyXCIgW2F0dHIuZmlsbF09XCJub2RlLmRhdGE/LmNvbG9yXCJcclxuICAgICAgICAvPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICA8L3N2ZzpnPlxyXG48L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdsaW5rJywgW25nVHJhbnNpdGlvbignKiA9PiAqJywgW2FuaW1hdGUoNTAwLCBzdHlsZSh7IHRyYW5zZm9ybTogJyonIH0pKV0pXSldXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcmFwaENvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpXHJcbiAgbGVnZW5kOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZXM6IE5vZGVbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNsdXN0ZXJzOiBDbHVzdGVyTm9kZVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbGlua3M6IEVkZ2VbXSA9IFtdO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY3VydmU6IGFueTtcclxuXHJcbiAgQElucHV0KClcclxuICBkcmFnZ2luZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KClcclxuICBub2RlTWF4SGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbm9kZU1pbkhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNaW5XaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG5vZGVNYXhXaWR0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbm5pbmdFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICBlbmFibGVab29tID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tU3BlZWQgPSAwLjE7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbWluWm9vbUxldmVsID0gMC4xO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG1heFpvb21MZXZlbCA9IDQuMDtcclxuXHJcbiAgQElucHV0KClcclxuICBhdXRvWm9vbSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBhbk9uWm9vbSA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgYXV0b0NlbnRlciA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHVwZGF0ZSQ6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICBjZW50ZXIkOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgem9vbVRvRml0JDogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dDogc3RyaW5nIHwgTGF5b3V0O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGxheW91dFNldHRpbmdzOiBhbnk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2xpbmtUZW1wbGF0ZScpXHJcbiAgbGlua1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAQ29udGVudENoaWxkKCdub2RlVGVtcGxhdGUnKVxyXG4gIG5vZGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgnY2x1c3RlclRlbXBsYXRlJylcclxuICBjbHVzdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ2RlZnNUZW1wbGF0ZScpXHJcbiAgZGVmc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAVmlld0NoaWxkKENoYXJ0Q29tcG9uZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcclxuICBjaGFydDogRWxlbWVudFJlZjtcclxuXHJcbiAgQFZpZXdDaGlsZHJlbignbm9kZUVsZW1lbnQnKVxyXG4gIG5vZGVFbGVtZW50czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xyXG5cclxuICBAVmlld0NoaWxkcmVuKCdsaW5rRWxlbWVudCcpXHJcbiAgbGlua0VsZW1lbnRzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XHJcblxyXG4gIGdyYXBoU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XHJcbiAgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcclxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xyXG4gIG1hcmdpbiA9IFswLCAwLCAwLCAwXTtcclxuICByZXN1bHRzID0gW107XHJcbiAgc2VyaWVzRG9tYWluOiBhbnk7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgbGVnZW5kT3B0aW9uczogYW55O1xyXG4gIGlzUGFubmluZyA9IGZhbHNlO1xyXG4gIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICBkcmFnZ2luZ05vZGU6IE5vZGU7XHJcbiAgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICBncmFwaDogR3JhcGg7XHJcbiAgZ3JhcGhEaW1zOiBhbnkgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcclxuICBfb2xkTGlua3M6IEVkZ2VbXSA9IFtdO1xyXG4gIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBNYXRyaXggPSBpZGVudGl0eSgpO1xyXG4gIF90b3VjaExhc3RYID0gbnVsbDtcclxuICBfdG91Y2hMYXN0WSA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcclxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXHJcbiAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgcHJpdmF0ZSBsYXlvdXRTZXJ2aWNlOiBMYXlvdXRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICBzdXBlcihlbCwgem9uZSwgY2QpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBncm91cFJlc3VsdHNCeTogKG5vZGU6IGFueSkgPT4gc3RyaW5nID0gbm9kZSA9PiBub2RlLmxhYmVsO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgem9vbSBsZXZlbFxyXG4gICAqL1xyXG4gIGdldCB6b29tTGV2ZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5hO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBjdXJyZW50IHpvb20gbGV2ZWxcclxuICAgKi9cclxuICBASW5wdXQoJ3pvb21MZXZlbCcpXHJcbiAgc2V0IHpvb21MZXZlbChsZXZlbCkge1xyXG4gICAgdGhpcy56b29tVG8oTnVtYmVyKGxldmVsKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHhgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIGdldCBwYW5PZmZzZXRYKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCBgeGAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgQElucHV0KCdwYW5PZmZzZXRYJylcclxuICBzZXQgcGFuT2Zmc2V0WCh4KSB7XHJcbiAgICB0aGlzLnBhblRvKE51bWJlcih4KSwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYHlgIHBvc2l0aW9uIG9mIHRoZSBncmFwaFxyXG4gICAqL1xyXG4gIGdldCBwYW5PZmZzZXRZKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCBgeWAgcG9zaXRpb24gb2YgdGhlIGdyYXBoXHJcbiAgICovXHJcbiAgQElucHV0KCdwYW5PZmZzZXRZJylcclxuICBzZXQgcGFuT2Zmc2V0WSh5KSB7XHJcbiAgICB0aGlzLnBhblRvKG51bGwsIE51bWJlcih5KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBldmVudFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnVwZGF0ZSQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy51cGRhdGUkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY2VudGVyJCkge1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcclxuICAgICAgICB0aGlzLmNlbnRlciQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2VudGVyKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnpvb21Ub0ZpdCQpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXHJcbiAgICAgICAgdGhpcy56b29tVG9GaXQkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZyhjaGFuZ2VzKTtcclxuICAgIGNvbnN0IHsgbGF5b3V0LCBsYXlvdXRTZXR0aW5ncywgbm9kZXMsIGNsdXN0ZXJzLCBsaW5rcyB9ID0gY2hhbmdlcztcclxuICAgIHRoaXMuc2V0TGF5b3V0KHRoaXMubGF5b3V0KTtcclxuICAgIGlmIChsYXlvdXRTZXR0aW5ncykge1xyXG4gICAgICB0aGlzLnNldExheW91dFNldHRpbmdzKHRoaXMubGF5b3V0U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgaWYgKG5vZGVzIHx8IGNsdXN0ZXJzIHx8IGxpbmtzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMYXlvdXQobGF5b3V0OiBzdHJpbmcgfCBMYXlvdXQpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgIGlmICghbGF5b3V0KSB7XHJcbiAgICAgIGxheW91dCA9ICdkYWdyZSc7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGxheW91dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5sYXlvdXQgPSB0aGlzLmxheW91dFNlcnZpY2UuZ2V0TGF5b3V0KGxheW91dCk7XHJcbiAgICAgIHRoaXMuc2V0TGF5b3V0U2V0dGluZ3ModGhpcy5sYXlvdXRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMYXlvdXRTZXR0aW5ncyhzZXR0aW5nczogYW55KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmxheW91dC5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQW5ndWxhciBsaWZlY3ljbGUgZXZlbnRcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xyXG4gICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGV2ZW50XHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhc2UgY2xhc3MgdXBkYXRlIGltcGxlbWVudGF0aW9uIGZvciB0aGUgZGFnIGdyYXBoXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBzdXBlci51cGRhdGUoKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuY3VydmUpIHtcclxuICAgICAgdGhpcy5jdXJ2ZSA9IHNoYXBlLmN1cnZlQnVuZGxlLmJldGEoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcclxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luLFxyXG4gICAgICAgIHNob3dMZWdlbmQ6IHRoaXMubGVnZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zZXJpZXNEb21haW4gPSB0aGlzLmdldFNlcmllc0RvbWFpbigpO1xyXG4gICAgICB0aGlzLnNldENvbG9ycygpO1xyXG4gICAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcclxuXHJcbiAgICAgIHRoaXMuY3JlYXRlR3JhcGgoKTtcclxuICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYXdzIHRoZSBncmFwaCB1c2luZyBkYWdyZSBsYXlvdXRzXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGRyYXcoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMubGF5b3V0IHx8IHR5cGVvZiB0aGlzLmxheW91dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gQ2FsYyB2aWV3IGRpbXMgZm9yIHRoZSBub2Rlc1xyXG4gICAgdGhpcy5hcHBseU5vZGVEaW1lbnNpb25zKCk7XHJcblxyXG4gICAgLy8gUmVjYWxjIHRoZSBsYXlvdXRcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGF5b3V0LnJ1bih0aGlzLmdyYXBoKTtcclxuICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcclxuICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxyXG4gICAgICByZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xyXG4gICAgICAgIHRoaXMudGljaygpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICAgIHJlc3VsdCQucGlwZShmaXJzdChncmFwaCA9PiBncmFwaC5ub2Rlcy5sZW5ndGggPiAwKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuYXBwbHlOb2RlRGltZW5zaW9ucygpKTtcclxuICB9XHJcblxyXG4gIHRpY2soKSB7XHJcbiAgICAvLyBUcmFuc3Bvc2VzIHZpZXcgb3B0aW9ucyB0byB0aGUgbm9kZVxyXG4gICAgdGhpcy5ncmFwaC5ub2Rlcy5tYXAobiA9PiB7XHJcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke24ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8XHJcbiAgICAgICAgMH0pYDtcclxuICAgICAgaWYgKCFuLmRhdGEpIHtcclxuICAgICAgICBuLmRhdGEgPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBpZighbi5kYXRhLmNvbG9yKXtcclxuICAgICAgICBcclxuICAgICAgICBuLmRhdGEgPSB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnMuZ2V0Q29sb3IodGhpcy5ncm91cFJlc3VsdHNCeShuKSlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICh0aGlzLmdyYXBoLmNsdXN0ZXJzIHx8IFtdKS5tYXAobiA9PiB7XHJcbiAgICAgIG4udHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke24ucG9zaXRpb24ueCAtIG4uZGltZW5zaW9uLndpZHRoIC8gMiB8fCAwfSwgJHtuLnBvc2l0aW9uLnkgLSBuLmRpbWVuc2lvbi5oZWlnaHQgLyAyIHx8XHJcbiAgICAgICAgMH0pYDtcclxuICAgICAgaWYgKCFuLmRhdGEpIHtcclxuICAgICAgICBuLmRhdGEgPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBpZighbi5kYXRhLmNvbG9yKXtcclxuICAgICAgICBcclxuICAgICAgbi5kYXRhID0ge1xyXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9ycy5nZXRDb2xvcih0aGlzLmdyb3VwUmVzdWx0c0J5KG4pKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVXBkYXRlIHRoZSBsYWJlbHMgdG8gdGhlIG5ldyBwb3NpdGlvbnNcclxuICAgIGNvbnN0IG5ld0xpbmtzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGVkZ2VMYWJlbElkIGluIHRoaXMuZ3JhcGguZWRnZUxhYmVscykge1xyXG4gICAgICBjb25zdCBlZGdlTGFiZWwgPSB0aGlzLmdyYXBoLmVkZ2VMYWJlbHNbZWRnZUxhYmVsSWRdO1xyXG5cclxuICAgICAgY29uc3Qgbm9ybUtleSA9IGVkZ2VMYWJlbElkLnJlcGxhY2UoL1teXFx3LV0qL2csICcnKTtcclxuICAgICAgbGV0IG9sZExpbmsgPSB0aGlzLl9vbGRMaW5rcy5maW5kKG9sID0+IGAke29sLnNvdXJjZX0ke29sLnRhcmdldH1gID09PSBub3JtS2V5KTtcclxuICAgICAgaWYgKCFvbGRMaW5rKSB7XHJcbiAgICAgICAgb2xkTGluayA9IHRoaXMuZ3JhcGguZWRnZXMuZmluZChubCA9PiBgJHtubC5zb3VyY2V9JHtubC50YXJnZXR9YCA9PT0gbm9ybUtleSkgfHwgZWRnZUxhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvbGRMaW5rLm9sZExpbmUgPSBvbGRMaW5rLmxpbmU7XHJcblxyXG4gICAgICBjb25zdCBwb2ludHMgPSBlZGdlTGFiZWwucG9pbnRzO1xyXG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5nZW5lcmF0ZUxpbmUocG9pbnRzKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld0xpbmsgPSBPYmplY3QuYXNzaWduKHt9LCBvbGRMaW5rKTtcclxuICAgICAgbmV3TGluay5saW5lID0gbGluZTtcclxuICAgICAgbmV3TGluay5wb2ludHMgPSBwb2ludHM7XHJcblxyXG4gICAgICBjb25zdCB0ZXh0UG9zID0gcG9pbnRzW01hdGguZmxvb3IocG9pbnRzLmxlbmd0aCAvIDIpXTtcclxuICAgICAgaWYgKHRleHRQb3MpIHtcclxuICAgICAgICBuZXdMaW5rLnRleHRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGV4dFBvcy54IHx8IDB9LCR7dGV4dFBvcy55IHx8IDB9KWA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5ld0xpbmsudGV4dEFuZ2xlID0gMDtcclxuICAgICAgaWYgKCFuZXdMaW5rLm9sZExpbmUpIHtcclxuICAgICAgICBuZXdMaW5rLm9sZExpbmUgPSBuZXdMaW5rLmxpbmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2FsY0RvbWluYW50QmFzZWxpbmUobmV3TGluayk7XHJcbiAgICAgIG5ld0xpbmtzLnB1c2gobmV3TGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ncmFwaC5lZGdlcyA9IG5ld0xpbmtzO1xyXG5cclxuICAgIC8vIE1hcCB0aGUgb2xkIGxpbmtzIGZvciBhbmltYXRpb25zXHJcbiAgICBpZiAodGhpcy5ncmFwaC5lZGdlcykge1xyXG4gICAgICB0aGlzLl9vbGRMaW5rcyA9IHRoaXMuZ3JhcGguZWRnZXMubWFwKGwgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld0wgPSBPYmplY3QuYXNzaWduKHt9LCBsKTtcclxuICAgICAgICBuZXdMLm9sZExpbmUgPSBsLmxpbmU7XHJcbiAgICAgICAgcmV0dXJuIG5ld0w7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSB0aGUgaGVpZ2h0L3dpZHRoIHRvdGFsXHJcbiAgICB0aGlzLmdyYXBoRGltcy53aWR0aCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi54ICsgbi5kaW1lbnNpb24ud2lkdGgpKTtcclxuICAgIHRoaXMuZ3JhcGhEaW1zLmhlaWdodCA9IE1hdGgubWF4KC4uLnRoaXMuZ3JhcGgubm9kZXMubWFwKG4gPT4gbi5wb3NpdGlvbi55ICsgbi5kaW1lbnNpb24uaGVpZ2h0KSk7XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b1pvb20pIHtcclxuICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hdXRvQ2VudGVyKSB7XHJcbiAgICAgIC8vIEF1dG8tY2VudGVyIHdoZW4gcmVuZGVyaW5nXHJcbiAgICAgIHRoaXMuY2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMucmVkcmF3TGluZXMoKSk7XHJcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWVhc3VyZXMgdGhlIG5vZGUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGUgZGltZW5zaW9uc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgYXBwbHlOb2RlRGltZW5zaW9ucygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm5vZGVFbGVtZW50cyAmJiB0aGlzLm5vZGVFbGVtZW50cy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5ub2RlRWxlbWVudHMubWFwKGVsZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBlbGVtLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ3JhcGgubm9kZXMuZmluZChuID0+IG4uaWQgPT09IG5hdGl2ZUVsZW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGhlaWdodFxyXG4gICAgICAgIGxldCBkaW1zO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBkaW1zID0gbmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlSGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSB0aGlzLm5vZGVIZWlnaHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLmhlaWdodCA9IGRpbXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1heEhlaWdodCkge1xyXG4gICAgICAgICAgbm9kZS5kaW1lbnNpb24uaGVpZ2h0ID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24uaGVpZ2h0LCB0aGlzLm5vZGVNYXhIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWluSGVpZ2h0KSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi5oZWlnaHQgPSBNYXRoLm1pbihub2RlLmRpbWVuc2lvbi5oZWlnaHQsIHRoaXMubm9kZU1pbkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlV2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gdGhpcy5ub2RlV2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGhcclxuICAgICAgICAgIGlmIChuYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0RGltcztcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICB0ZXh0RGltcyA9IG5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKVswXS5nZXRCQm94KCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgLy8gU2tpcCBkcmF3aW5nIGlmIGVsZW1lbnQgaXMgbm90IGRpc3BsYXllZCAtIEZpcmVmb3ggd291bGQgdGhyb3cgYW4gZXJyb3IgaGVyZVxyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IHRleHREaW1zLndpZHRoICsgMjA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IGRpbXMud2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlTWF4V2lkdGgpIHtcclxuICAgICAgICAgIG5vZGUuZGltZW5zaW9uLndpZHRoID0gTWF0aC5tYXgobm9kZS5kaW1lbnNpb24ud2lkdGgsIHRoaXMubm9kZU1heFdpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZU1pbldpZHRoKSB7XHJcbiAgICAgICAgICBub2RlLmRpbWVuc2lvbi53aWR0aCA9IE1hdGgubWluKG5vZGUuZGltZW5zaW9uLndpZHRoLCB0aGlzLm5vZGVNaW5XaWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZHJhd3MgdGhlIGxpbmVzIHdoZW4gZHJhZ2dlZCBvciB2aWV3cG9ydCB1cGRhdGVkXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICByZWRyYXdMaW5lcyhfYW5pbWF0ZSA9IHRydWUpOiB2b2lkIHtcclxuICAgIHRoaXMubGlua0VsZW1lbnRzLm1hcChsaW5rRWwgPT4ge1xyXG4gICAgICBjb25zdCBlZGdlID0gdGhpcy5ncmFwaC5lZGdlcy5maW5kKGxpbiA9PiBsaW4uaWQgPT09IGxpbmtFbC5uYXRpdmVFbGVtZW50LmlkKTtcclxuXHJcbiAgICAgIGlmIChlZGdlKSB7XHJcbiAgICAgICAgY29uc3QgbGlua1NlbGVjdGlvbiA9IHNlbGVjdChsaW5rRWwubmF0aXZlRWxlbWVudCkuc2VsZWN0KCcubGluZScpO1xyXG4gICAgICAgIGxpbmtTZWxlY3Rpb25cclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5vbGRMaW5lKVxyXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgLmR1cmF0aW9uKF9hbmltYXRlID8gNTAwIDogMClcclxuICAgICAgICAgIC5hdHRyKCdkJywgZWRnZS5saW5lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dFBhdGhTZWxlY3Rpb24gPSBzZWxlY3QodGhpcy5jaGFydEVsZW1lbnQubmF0aXZlRWxlbWVudCkuc2VsZWN0KGAjJHtlZGdlLmlkfWApO1xyXG4gICAgICAgIHRleHRQYXRoU2VsZWN0aW9uXHJcbiAgICAgICAgICAuYXR0cignZCcsIGVkZ2Uub2xkVGV4dFBhdGgpXHJcbiAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAuZHVyYXRpb24oX2FuaW1hdGUgPyA1MDAgOiAwKVxyXG4gICAgICAgICAgLmF0dHIoJ2QnLCBlZGdlLnRleHRQYXRoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBkYWdyZSBncmFwaCBlbmdpbmVcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNyZWF0ZUdyYXBoKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5ncmFwaFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuICAgIGNvbnN0IGluaXRpYWxpemVOb2RlID0gbiA9PiB7XHJcbiAgICAgIGlmICghbi5pZCkge1xyXG4gICAgICAgIG4uaWQgPSBpZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIG4uZGltZW5zaW9uID0ge1xyXG4gICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICBoZWlnaHQ6IDMwXHJcbiAgICAgIH07XHJcbiAgICAgIG4ucG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICAgIH07XHJcbiAgICAgIG4uZGF0YSA9IG4uZGF0YSA/IG4uZGF0YSA6IHt9O1xyXG4gICAgICByZXR1cm4gbjtcclxuICAgIH07XHJcbiAgICB0aGlzLmdyYXBoID0ge1xyXG4gICAgICBub2RlczogWy4uLnRoaXMubm9kZXNdLm1hcChpbml0aWFsaXplTm9kZSksXHJcbiAgICAgIGNsdXN0ZXJzOiBbLi4uKHRoaXMuY2x1c3RlcnMgfHwgW10pXS5tYXAoaW5pdGlhbGl6ZU5vZGUpLFxyXG4gICAgICBlZGdlczogWy4uLnRoaXMubGlua3NdLm1hcChlID0+IHtcclxuICAgICAgICBpZiAoIWUuaWQpIHtcclxuICAgICAgICAgIGUuaWQgPSBpZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZTtcclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhdygpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZSB0aGUgdGV4dCBkaXJlY3Rpb25zIC8gZmxpcHBpbmdcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNhbGNEb21pbmFudEJhc2VsaW5lKGxpbmspOiB2b2lkIHtcclxuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBsaW5rLnBvaW50c1swXTtcclxuICAgIGNvbnN0IGxhc3RQb2ludCA9IGxpbmsucG9pbnRzW2xpbmsucG9pbnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgbGluay5vbGRUZXh0UGF0aCA9IGxpbmsudGV4dFBhdGg7XHJcblxyXG4gICAgaWYgKGxhc3RQb2ludC54IDwgZmlyc3RQb2ludC54KSB7XHJcbiAgICAgIGxpbmsuZG9taW5hbnRCYXNlbGluZSA9ICd0ZXh0LWJlZm9yZS1lZGdlJztcclxuXHJcbiAgICAgIC8vIHJldmVyc2UgdGV4dCBwYXRoIGZvciB3aGVuIGl0cyBmbGlwcGVkIHVwc2lkZSBkb3duXHJcbiAgICAgIGxpbmsudGV4dFBhdGggPSB0aGlzLmdlbmVyYXRlTGluZShbLi4ubGluay5wb2ludHNdLnJldmVyc2UoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsaW5rLmRvbWluYW50QmFzZWxpbmUgPSAndGV4dC1hZnRlci1lZGdlJztcclxuICAgICAgbGluay50ZXh0UGF0aCA9IGxpbmsubGluZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIHRoZSBuZXcgbGluZSBwYXRoXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBnZW5lcmF0ZUxpbmUocG9pbnRzKTogYW55IHtcclxuICAgIGNvbnN0IGxpbmVGdW5jdGlvbiA9IHNoYXBlXHJcbiAgICAgIC5saW5lPGFueT4oKVxyXG4gICAgICAueChkID0+IGQueClcclxuICAgICAgLnkoZCA9PiBkLnkpXHJcbiAgICAgIC5jdXJ2ZSh0aGlzLmN1cnZlKTtcclxuICAgIHJldHVybiBsaW5lRnVuY3Rpb24ocG9pbnRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gd2FzIGludm9rZWQgZnJvbSBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25ab29tKCRldmVudDogTW91c2VFdmVudCwgZGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICBjb25zdCB6b29tRmFjdG9yID0gMSArIChkaXJlY3Rpb24gPT09ICdpbicgPyB0aGlzLnpvb21TcGVlZCA6IC10aGlzLnpvb21TcGVlZCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgdGhhdCB6b29taW5nIHdvdWxkbid0IHB1dCB1cyBvdXQgb2YgYm91bmRzXHJcbiAgICBjb25zdCBuZXdab29tTGV2ZWwgPSB0aGlzLnpvb21MZXZlbCAqIHpvb21GYWN0b3I7XHJcbiAgICBpZiAobmV3Wm9vbUxldmVsIDw9IHRoaXMubWluWm9vbUxldmVsIHx8IG5ld1pvb21MZXZlbCA+PSB0aGlzLm1heFpvb21MZXZlbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgem9vbWluZyBpcyBlbmFibGVkIG9yIG5vdFxyXG4gICAgaWYgKCF0aGlzLmVuYWJsZVpvb20pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnBhbk9uWm9vbSA9PT0gdHJ1ZSAmJiAkZXZlbnQpIHtcclxuICAgICAgLy8gQWJzb2x1dGUgbW91c2UgWC9ZIG9uIHRoZSBzY3JlZW5cclxuICAgICAgY29uc3QgbW91c2VYID0gJGV2ZW50LmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG1vdXNlWSA9ICRldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgLy8gVHJhbnNmb3JtIHRoZSBtb3VzZSBYL1kgaW50byBhIFNWRyBYL1lcclxuICAgICAgY29uc3Qgc3ZnID0gdGhpcy5jaGFydC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xyXG4gICAgICBjb25zdCBzdmdHcm91cCA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdnLmNoYXJ0Jyk7XHJcblxyXG4gICAgICBjb25zdCBwb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICBwb2ludC54ID0gbW91c2VYO1xyXG4gICAgICBwb2ludC55ID0gbW91c2VZO1xyXG4gICAgICBjb25zdCBzdmdQb2ludCA9IHBvaW50Lm1hdHJpeFRyYW5zZm9ybShzdmdHcm91cC5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xyXG5cclxuICAgICAgLy8gUGFuem9vbVxyXG4gICAgICBjb25zdCBOT19aT09NX0xFVkVMID0gMTtcclxuICAgICAgdGhpcy5wYW4oc3ZnUG9pbnQueCwgc3ZnUG9pbnQueSwgTk9fWk9PTV9MRVZFTCk7XHJcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcclxuICAgICAgdGhpcy5wYW4oLXN2Z1BvaW50LngsIC1zdmdQb2ludC55LCBOT19aT09NX0xFVkVMKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuem9vbSh6b29tRmFjdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhbiBieSB4L3lcclxuICAgKlxyXG4gICAqL1xyXG4gIHBhbih4OiBudW1iZXIsIHk6IG51bWJlciwgem9vbUxldmVsOiBudW1iZXIgPSB0aGlzLnpvb21MZXZlbCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0cmFuc2xhdGUoeCAvIHpvb21MZXZlbCwgeSAvIHpvb21MZXZlbCkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gdG8gYSBmaXhlZCB4L3lcclxuICAgKlxyXG4gICAqL1xyXG4gIHBhblRvKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmUgPSB4ID09PSBudWxsIHx8IHggPT09IHVuZGVmaW5lZCB8fCBpc05hTih4KSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZSA6IE51bWJlcih4KTtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguZiA9IHkgPT09IG51bGwgfHwgeSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHkpID8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5mIDogTnVtYmVyKHkpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIGJ5IGEgZmFjdG9yXHJcbiAgICpcclxuICAgKi9cclxuICB6b29tKGZhY3RvcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHNjYWxlKGZhY3RvciwgZmFjdG9yKSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFpvb20gdG8gYSBmaXhlZCBsZXZlbFxyXG4gICAqXHJcbiAgICovXHJcbiAgem9vbVRvKGxldmVsOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA9IGlzTmFOKGxldmVsKSA/IHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguYSA6IE51bWJlcihsZXZlbCk7XHJcbiAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgPSBpc05hTihsZXZlbCkgPyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmQgOiBOdW1iZXIobGV2ZWwpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYW4gd2FzIGludm9rZWQgZnJvbSBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25QYW4oZXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMucGFuKGV2ZW50Lm1vdmVtZW50WCwgZXZlbnQubW92ZW1lbnRZKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYWcgd2FzIGludm9rZWQgZnJvbSBhbiBldmVudFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25EcmFnKGV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmdFbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmRyYWdnaW5nTm9kZTtcclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZykge1xyXG4gICAgICB0aGlzLmxheW91dC5vbkRyYWcobm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGUucG9zaXRpb24ueCArPSBldmVudC5tb3ZlbWVudFggLyB0aGlzLnpvb21MZXZlbDtcclxuICAgIG5vZGUucG9zaXRpb24ueSArPSBldmVudC5tb3ZlbWVudFkgLyB0aGlzLnpvb21MZXZlbDtcclxuXHJcbiAgICAvLyBtb3ZlIHRoZSBub2RlXHJcbiAgICBjb25zdCB4ID0gbm9kZS5wb3NpdGlvbi54IC0gbm9kZS5kaW1lbnNpb24ud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeSA9IG5vZGUucG9zaXRpb24ueSAtIG5vZGUuZGltZW5zaW9uLmhlaWdodCAvIDI7XHJcbiAgICBub2RlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgO1xyXG5cclxuICAgIGZvciAoY29uc3QgbGluayBvZiB0aGlzLmdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBsaW5rLnRhcmdldCA9PT0gbm9kZS5pZCB8fFxyXG4gICAgICAgIGxpbmsuc291cmNlID09PSBub2RlLmlkIHx8XHJcbiAgICAgICAgKGxpbmsudGFyZ2V0IGFzIGFueSkuaWQgPT09IG5vZGUuaWQgfHxcclxuICAgICAgICAobGluay5zb3VyY2UgYXMgYW55KS5pZCA9PT0gbm9kZS5pZFxyXG4gICAgICApIHtcclxuICAgICAgICBpZiAodGhpcy5sYXlvdXQgJiYgdHlwZW9mIHRoaXMubGF5b3V0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sYXlvdXQudXBkYXRlRWRnZSh0aGlzLmdyYXBoLCBsaW5rKTtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdCQgPSByZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gcmVzdWx0IDogb2YocmVzdWx0KTtcclxuICAgICAgICAgIHRoaXMuZ3JhcGhTdWJzY3JpcHRpb24uYWRkKFxyXG4gICAgICAgICAgICByZXN1bHQkLnN1YnNjcmliZShncmFwaCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVkcmF3RWRnZShsaW5rKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWRyYXdMaW5lcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICByZWRyYXdFZGdlKGVkZ2U6IEVkZ2UpIHtcclxuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdlbmVyYXRlTGluZShlZGdlLnBvaW50cyk7XHJcbiAgICB0aGlzLmNhbGNEb21pbmFudEJhc2VsaW5lKGVkZ2UpO1xyXG4gICAgZWRnZS5vbGRMaW5lID0gZWRnZS5saW5lO1xyXG4gICAgZWRnZS5saW5lID0gbGluZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgZW50aXJlIHZpZXcgZm9yIHRoZSBuZXcgcGFuIHBvc2l0aW9uXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHVwZGF0ZVRyYW5zZm9ybSgpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtID0gdG9TVkcodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBjbGlja2VkXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uQ2xpY2soZXZlbnQsIG9yaWdpbmFsRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2ZW50Lm9yaWdFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vZGUgd2FzIGNsaWNrZWRcclxuICAgKlxyXG4gICAqL1xyXG4gIG9uRG91YmxlQ2xpY2soZXZlbnQsIG9yaWdpbmFsRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2ZW50Lm9yaWdFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XHJcbiAgICBldmVudC5pc0RvdWJsZUNsaWNrID0gdHJ1ZTtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm9kZSB3YXMgZm9jdXNlZFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbkFjdGl2YXRlKGV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2V2ZW50LCAuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xyXG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb2RlIHdhcyBkZWZvY3VzZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIG9uRGVhY3RpdmF0ZShldmVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmluZGV4T2YoZXZlbnQpO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xyXG5cclxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGV2ZW50LCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGRvbWFpbiBzZXJpZXMgZm9yIHRoZSBub2Rlc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U2VyaWVzRG9tYWluKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGVzXHJcbiAgICAgIC5tYXAoZCA9PiB0aGlzLmdyb3VwUmVzdWx0c0J5KGQpKVxyXG4gICAgICAucmVkdWNlKChub2Rlczogc3RyaW5nW10sIG5vZGUpOiBhbnlbXSA9PiAobm9kZXMuaW5kZXhPZihub2RlKSAhPT0gLTEgPyBub2RlcyA6IG5vZGVzLmNvbmNhdChbbm9kZV0pKSwgW10pXHJcbiAgICAgIC5zb3J0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFja2luZyBmb3IgdGhlIGxpbmtcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdHJhY2tMaW5rQnkoaW5kZXgsIGxpbmspOiBhbnkge1xyXG4gICAgcmV0dXJuIGxpbmsuaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFja2luZyBmb3IgdGhlIG5vZGVcclxuICAgKlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgdHJhY2tOb2RlQnkoaW5kZXgsIG5vZGUpOiBhbnkge1xyXG4gICAgcmV0dXJuIG5vZGUuaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjb2xvcnMgdGhlIG5vZGVzXHJcbiAgICpcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIHNldENvbG9ycygpOiB2b2lkIHtcclxuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCAnb3JkaW5hbCcsIHRoaXMuc2VyaWVzRG9tYWluLCB0aGlzLmN1c3RvbUNvbG9ycyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBsZWdlbmQgb3B0aW9uc1xyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0TGVnZW5kT3B0aW9ucygpOiBhbnkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2NhbGVUeXBlOiAnb3JkaW5hbCcsXHJcbiAgICAgIGRvbWFpbjogdGhpcy5zZXJpZXNEb21haW4sXHJcbiAgICAgIGNvbG9yczogdGhpcy5jb2xvcnNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiBtb3VzZSBtb3ZlIGV2ZW50LCB1c2VkIGZvciBwYW5uaW5nIGFuZCBkcmFnZ2luZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZU1vdmUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xyXG4gICAgICB0aGlzLm9uUGFuKCRldmVudCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICB0aGlzLm9uRHJhZygkZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggc3RhcnQgZXZlbnQgdG8gZW5hYmxlIHBhbm5pbmcuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvblRvdWNoU3RhcnQoZXZlbnQpIHtcclxuICAgIHRoaXMuX3RvdWNoTGFzdFggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgdGhpcy5fdG91Y2hMYXN0WSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XHJcblxyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gdG91Y2ggbW92ZSBldmVudCwgdXNlZCBmb3IgcGFubmluZy5cclxuICAgKlxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNobW92ZScsIFsnJGV2ZW50J10pXHJcbiAgb25Ub3VjaE1vdmUoJGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc1Bhbm5pbmcgJiYgdGhpcy5wYW5uaW5nRW5hYmxlZCkge1xyXG4gICAgICBjb25zdCBjbGllbnRYID0gJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IGNsaWVudFkgPSAkZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgY29uc3QgbW92ZW1lbnRYID0gY2xpZW50WCAtIHRoaXMuX3RvdWNoTGFzdFg7XHJcbiAgICAgIGNvbnN0IG1vdmVtZW50WSA9IGNsaWVudFkgLSB0aGlzLl90b3VjaExhc3RZO1xyXG4gICAgICB0aGlzLl90b3VjaExhc3RYID0gY2xpZW50WDtcclxuICAgICAgdGhpcy5fdG91Y2hMYXN0WSA9IGNsaWVudFk7XHJcblxyXG4gICAgICB0aGlzLnBhbihtb3ZlbWVudFgsIG1vdmVtZW50WSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbiB0b3VjaCBlbmQgZXZlbnQgdG8gZGlzYWJsZSBwYW5uaW5nLlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEdyYXBoQ29tcG9uZW50XHJcbiAgICovXHJcbiAgb25Ub3VjaEVuZChldmVudCkge1xyXG4gICAgdGhpcy5pc1Bhbm5pbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uIG1vdXNlIHVwIGV2ZW50IHRvIGRpc2FibGUgcGFubmluZy9kcmFnZ2luZy5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBHcmFwaENvbXBvbmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnKVxyXG4gIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzUGFubmluZyA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMubGF5b3V0ICYmIHR5cGVvZiB0aGlzLmxheW91dCAhPT0gJ3N0cmluZycgJiYgdGhpcy5sYXlvdXQub25EcmFnRW5kKSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ0VuZCh0aGlzLmRyYWdnaW5nTm9kZSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT24gbm9kZSBtb3VzZSBkb3duIHRvIGtpY2sgb2ZmIGRyYWdnaW5nXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgR3JhcGhDb21wb25lbnRcclxuICAgKi9cclxuICBvbk5vZGVNb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQsIG5vZGU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5kcmFnZ2luZ05vZGUgPSBub2RlO1xyXG5cclxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0eXBlb2YgdGhpcy5sYXlvdXQgIT09ICdzdHJpbmcnICYmIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgIHRoaXMubGF5b3V0Lm9uRHJhZ1N0YXJ0KG5vZGUsIGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENlbnRlciB0aGUgZ3JhcGggaW4gdGhlIHZpZXdwb3J0XHJcbiAgICovXHJcbiAgY2VudGVyKCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5UbyhcclxuICAgICAgdGhpcy5kaW1zLndpZHRoIC8gMiAtICh0aGlzLmdyYXBoRGltcy53aWR0aCAqIHRoaXMuem9vbUxldmVsKSAvIDIsXHJcbiAgICAgIHRoaXMuZGltcy5oZWlnaHQgLyAyIC0gKHRoaXMuZ3JhcGhEaW1zLmhlaWdodCAqIHRoaXMuem9vbUxldmVsKSAvIDJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tcyB0byBmaXQgdGhlIGVudGllciBncmFwaFxyXG4gICAqL1xyXG4gIHpvb21Ub0ZpdCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGhlaWdodFpvb20gPSB0aGlzLmRpbXMuaGVpZ2h0IC8gdGhpcy5ncmFwaERpbXMuaGVpZ2h0O1xyXG4gICAgY29uc3Qgd2lkdGhab29tID0gdGhpcy5kaW1zLndpZHRoIC8gdGhpcy5ncmFwaERpbXMud2lkdGg7XHJcbiAgICBjb25zdCB6b29tTGV2ZWwgPSBNYXRoLm1pbihoZWlnaHRab29tLCB3aWR0aFpvb20sIDEpO1xyXG4gICAgaWYgKHpvb21MZXZlbCAhPT0gdGhpcy56b29tTGV2ZWwpIHtcclxuICAgICAgdGhpcy56b29tTGV2ZWwgPSB6b29tTGV2ZWw7XHJcbiAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgT3V0cHV0LCBIb3N0TGlzdGVuZXIsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLyoqXHJcbiAqIE1vdXNld2hlZWwgZGlyZWN0aXZlXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Tb2RoYW5hTGlicmFyeS9hbmd1bGFyMi1leGFtcGxlcy9ibG9iL21hc3Rlci9hcHAvbW91c2VXaGVlbERpcmVjdGl2ZS9tb3VzZXdoZWVsLmRpcmVjdGl2ZS50c1xyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqL1xyXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbW91c2VXaGVlbF0nIH0pXHJcbmV4cG9ydCBjbGFzcyBNb3VzZVdoZWVsRGlyZWN0aXZlIHtcclxuICBAT3V0cHV0KClcclxuICBtb3VzZVdoZWVsVXAgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpXHJcbiAgbW91c2VXaGVlbERvd24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2VXaGVlbENocm9tZShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxGaXJlZm94KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMubW91c2VXaGVlbEZ1bmMoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignb25tb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxJRShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIG1vdXNlV2hlZWxGdW5jKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh3aW5kb3cuZXZlbnQpIHtcclxuICAgICAgZXZlbnQgPSB3aW5kb3cuZXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVsdGEgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZXZlbnQud2hlZWxEZWx0YSB8fCAtZXZlbnQuZGV0YWlsKSk7XHJcbiAgICBpZiAoZGVsdGEgPiAwKSB7XHJcbiAgICAgIHRoaXMubW91c2VXaGVlbFVwLmVtaXQoZXZlbnQpO1xyXG4gICAgfSBlbHNlIGlmIChkZWx0YSA8IDApIHtcclxuICAgICAgdGhpcy5tb3VzZVdoZWVsRG93bi5lbWl0KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3IgSUVcclxuICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcblxyXG4gICAgLy8gZm9yIENocm9tZSBhbmQgRmlyZWZveFxyXG4gICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEdyYXBoQ29tcG9uZW50IH0gZnJvbSAnLi9ncmFwaC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDaGFydENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bzd2ltbGFuZS9uZ3gtY2hhcnRzJztcclxuaW1wb3J0IHsgTW91c2VXaGVlbERpcmVjdGl2ZSB9IGZyb20gJy4vbW91c2Utd2hlZWwuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4vbGF5b3V0cy9sYXlvdXQuc2VydmljZSc7XHJcbmV4cG9ydCB7IEdyYXBoQ29tcG9uZW50IH07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtDaGFydENvbW1vbk1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbR3JhcGhDb21wb25lbnQsIE1vdXNlV2hlZWxEaXJlY3RpdmVdLFxyXG4gIGV4cG9ydHM6IFtHcmFwaENvbXBvbmVudCwgTW91c2VXaGVlbERpcmVjdGl2ZV0sXHJcbiAgcHJvdmlkZXJzOiBbTGF5b3V0U2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdyYXBoTW9kdWxlIHt9XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEdyYXBoTW9kdWxlIH0gZnJvbSAnLi9ncmFwaC9ncmFwaC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBOZ3hDaGFydHNNb2R1bGUgfSBmcm9tICdAc3dpbWxhbmUvbmd4LWNoYXJ0cyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL21vZGVscy9pbmRleCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtOZ3hDaGFydHNNb2R1bGVdLFxyXG4gIGV4cG9ydHM6IFtHcmFwaE1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdyYXBoTW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6WyJkYWdyZS5sYXlvdXQiLCJkYWdyZS5ncmFwaGxpYiIsIk9yaWVudGF0aW9uIiwibGF5b3V0Iiwic2hhcGUuY3VydmVCdW5kbGUiLCJsaW5lIiwic2hhcGVcclxuICAgICAgICAgICAgLmxpbmUiLCJuZ1RyYW5zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7TUFBTSxLQUFLLEdBQUcsRUFBRTs7Ozs7O0FBTWhCLFNBQWdCLEVBQUU7O1FBQ1osS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7O0lBR3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDakIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxFQUFFLEVBQUUsQ0FBQztDQUNiOzs7Ozs7QUNoQkQ7O0lBS0UsZUFBZ0IsSUFBSTtJQUNwQixlQUFnQixJQUFJO0lBQ3BCLGVBQWdCLElBQUk7SUFDcEIsZUFBZ0IsSUFBSTs7TUFzQlQsV0FB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