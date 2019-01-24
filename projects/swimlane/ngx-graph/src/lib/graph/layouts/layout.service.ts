import { Injectable } from '@angular/core';
import { Layout } from '../../models/layout.model';
import { DagreLayout } from './dagre';
import { DagreClusterLayout } from './dagreCluster';
import { DagreNodesOnlyLayout } from './dagreNodesOnly';
import { D3ForceDirectedLayout } from './d3ForceDirected';

const layouts = {
  dagre: DagreLayout,
  dagreCluster: DagreClusterLayout,
  dagreNodesOnly: DagreNodesOnlyLayout,
  d3: D3ForceDirectedLayout
};

@Injectable()
export class LayoutService {
  getLayout(name: string): Layout {
    if (layouts[name]) {
      return new layouts[name]();
    } else {
      throw new Error(`Unknown layout type '${name}'`);
    }
  }
}
